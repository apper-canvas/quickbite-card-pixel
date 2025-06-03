import { toast } from 'sonner'

const ORDER_STORAGE_KEY = 'quickbite_orders'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to generate unique order ID
const generateOrderId = () => {
  return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Helper function to get orders from localStorage
const getStoredOrders = () => {
  try {
    const orders = localStorage.getItem(ORDER_STORAGE_KEY)
    return orders ? JSON.parse(orders) : []
  } catch (error) {
    console.error('Error reading orders from localStorage:', error)
    return []
  }
}

// Helper function to save orders to localStorage
const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    console.error('Error saving orders to localStorage:', error)
    throw new Error('Failed to save orders')
  }
}

export const orderService = {
  // Create a new order from cart items
  async createOrder(orderData) {
    await delay(300)
    
    try {
      const orders = getStoredOrders()
      
      const newOrder = {
        id: generateOrderId(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      }
      
      orders.unshift(newOrder) // Add to beginning of array (newest first)
      saveOrders(orders)
      
      // Simulate order status progression
      setTimeout(() => {
        this.updateOrderStatus(newOrder.id, 'confirmed')
      }, 2000)
      
      return newOrder
    } catch (error) {
      console.error('Error creating order:', error)
      throw new Error('Failed to create order')
    }
  },

  // Get all orders for the user
  async getOrders() {
    await delay(200)
    
    try {
      return getStoredOrders()
    } catch (error) {
      console.error('Error getting orders:', error)
      throw new Error('Failed to load orders')
    }
  },

  // Get a specific order by ID
  async getOrderById(orderId) {
    await delay(150)
    
    try {
      const orders = getStoredOrders()
      const order = orders.find(order => order.id === orderId)
      
      if (!order) {
        throw new Error('Order not found')
      }
      
      return order
    } catch (error) {
      console.error('Error getting order:', error)
      throw new Error('Failed to load order')
    }
  },

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    await delay(200)
    
    try {
      const orders = getStoredOrders()
      const orderIndex = orders.findIndex(order => order.id === orderId)
      
      if (orderIndex === -1) {
        throw new Error('Order not found')
      }
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        status: newStatus,
        updatedAt: new Date().toISOString()
      }
      
      saveOrders(orders)
      
      // Simulate further status progression for active orders
      if (newStatus === 'confirmed') {
        setTimeout(() => {
          this.updateOrderStatus(orderId, 'preparing')
        }, 5000)
      } else if (newStatus === 'preparing') {
        setTimeout(() => {
          this.updateOrderStatus(orderId, 'out-for-delivery')
        }, 10000)
      } else if (newStatus === 'out-for-delivery') {
        setTimeout(() => {
          this.updateOrderStatus(orderId, 'delivered')
        }, 15000)
      }
      
      return orders[orderIndex]
    } catch (error) {
      console.error('Error updating order status:', error)
      throw new Error('Failed to update order status')
    }
  },

  // Cancel an order
  async cancelOrder(orderId) {
    await delay(200)
    
    try {
      const order = await this.getOrderById(orderId)
      
      // Check if order can be cancelled
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled')
      }
      
      return await this.updateOrderStatus(orderId, 'cancelled')
    } catch (error) {
      console.error('Error cancelling order:', error)
      throw new Error('Failed to cancel order')
    }
  },

  // Get order statistics
  async getOrderStats() {
    await delay(100)
    
    try {
      const orders = getStoredOrders()
      
      const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter(order => order.status === 'delivered').length,
        activeOrders: orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(order.status)
        ).length,
        cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
        totalSpent: orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.length > 0 
          ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
          : 0,
        favoriteRestaurant: this.getFavoriteRestaurant(orders)
      }
      
      return stats
    } catch (error) {
      console.error('Error getting order stats:', error)
      throw new Error('Failed to load order statistics')
    }
  },

  // Get user's favorite restaurant based on order frequency
  getFavoriteRestaurant(orders) {
    if (orders.length === 0) return null
    
    const restaurantCounts = {}
    orders.forEach(order => {
      restaurantCounts[order.restaurantName] = (restaurantCounts[order.restaurantName] || 0) + 1
    })
    
    return Object.entries(restaurantCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null
  },

  // Filter orders by various criteria
  async filterOrders(filters = {}) {
    await delay(100)
    
    try {
      let orders = getStoredOrders()
      
      // Filter by status
      if (filters.status && filters.status !== 'all') {
        orders = orders.filter(order => order.status === filters.status)
      }
      
      // Filter by restaurant
      if (filters.restaurantId) {
        orders = orders.filter(order => order.restaurantId === filters.restaurantId)
      }
      
      // Filter by date range
      if (filters.startDate) {
        orders = orders.filter(order => 
          new Date(order.createdAt) >= new Date(filters.startDate)
        )
      }
      
      if (filters.endDate) {
        orders = orders.filter(order => 
          new Date(order.createdAt) <= new Date(filters.endDate)
        )
      }
      
      // Filter by price range
      if (filters.minTotal) {
        orders = orders.filter(order => order.total >= filters.minTotal)
      }
      
      if (filters.maxTotal) {
        orders = orders.filter(order => order.total <= filters.maxTotal)
      }
      
      // Sort orders
      if (filters.sortBy) {
        orders.sort((a, b) => {
          switch (filters.sortBy) {
            case 'newest':
              return new Date(b.createdAt) - new Date(a.createdAt)
            case 'oldest':
              return new Date(a.createdAt) - new Date(b.createdAt)
            case 'total-high':
              return b.total - a.total
            case 'total-low':
              return a.total - b.total
            default:
              return 0
          }
        })
      }
      
      return orders
    } catch (error) {
      console.error('Error filtering orders:', error)
      throw new Error('Failed to filter orders')
    }
  },

  // Reorder items from a previous order
  async reorderItems(orderId) {
    await delay(200)
    
    try {
      const order = await this.getOrderById(orderId)
      
      // Return the items that can be added to cart
      return order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        restaurantId: order.restaurantId,
        restaurantName: order.restaurantName
      }))
    } catch (error) {
      console.error('Error reordering items:', error)
      throw new Error('Failed to reorder items')
    }
  },

  // Clear all orders (for development/testing)
  async clearAllOrders() {
    try {
      localStorage.removeItem(ORDER_STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing orders:', error)
      throw new Error('Failed to clear orders')
    }
  }
}

export default orderService