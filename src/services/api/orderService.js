import { toast } from 'sonner'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const orderService = {
  async createOrder(orderData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: `Order ${Date.now()}`,
          restaurant_name: orderData.restaurantName,
          order_date: new Date().toISOString(),
          status: 'pending',
          subtotal: parseFloat(orderData.subtotal) || 0,
          delivery_fee: parseFloat(orderData.deliveryFee) || 0,
          service_fee: parseFloat(orderData.serviceFee) || 0,
          total: parseFloat(orderData.total) || 0,
          items: JSON.stringify(orderData.items || []),
          restaurant: parseInt(orderData.restaurantId),
          customer: parseInt(orderData.customerId) || 1
        }]
      }

      const response = await apperClient.createRecord('order', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create order:${failedRecords}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }

      throw new Error('Failed to create order')
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async getOrders() {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'restaurant_name', 'order_date', 'status', 'subtotal',
          'delivery_fee', 'service_fee', 'total', 'items', 'restaurant', 'customer',
          'CreatedOn', 'ModifiedOn'
        ],
        orderBy: [{ fieldName: 'order_date', SortType: 'DESC' }]
      }

      const response = await apperClient.fetchRecords('order', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      const orders = response.data?.map(order => ({
        id: order.Id,
        restaurantId: order.restaurant,
        restaurantName: order.restaurant_name,
        status: order.status,
        subtotal: order.subtotal || 0,
        deliveryFee: order.delivery_fee || 0,
        serviceFee: order.service_fee || 0,
        total: order.total || 0,
        items: order.items ? JSON.parse(order.items) : [],
        createdAt: order.order_date || order.CreatedOn,
        updatedAt: order.ModifiedOn
      })) || []

      return orders
    } catch (error) {
      console.error('Error getting orders:', error)
      throw error
    }
  },

  async getOrderById(orderId) {
    await delay(150)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'restaurant_name', 'order_date', 'status', 'subtotal',
          'delivery_fee', 'service_fee', 'total', 'items', 'restaurant', 'customer'
        ]
      }

      const response = await apperClient.getRecordById('order', parseInt(orderId), params)
      
      if (!response.success) {
        throw new Error(response.message || 'Order not found')
      }

      if (!response.data) {
        throw new Error('Order not found')
      }

      const order = {
        id: response.data.Id,
        restaurantId: response.data.restaurant,
        restaurantName: response.data.restaurant_name,
        status: response.data.status,
        subtotal: response.data.subtotal || 0,
        deliveryFee: response.data.delivery_fee || 0,
        serviceFee: response.data.service_fee || 0,
        total: response.data.total || 0,
        items: response.data.items ? JSON.parse(response.data.items) : [],
        createdAt: response.data.order_date
      }

      return order
    } catch (error) {
      console.error('Error getting order:', error)
      throw error
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(orderId),
          status: newStatus
        }]
      }

      const response = await apperClient.updateRecord('order', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update order status:${failedUpdates}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }

      throw new Error('Failed to update order status')
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  },

  async cancelOrder(orderId) {
    try {
      const order = await this.getOrderById(orderId)
      
      // Check if order can be cancelled
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled')
      }
      
      return await this.updateOrderStatus(orderId, 'cancelled')
    } catch (error) {
      console.error('Error cancelling order:', error)
      throw error
    }
  },

  async getOrderHistory() {
    try {
      const orders = await this.getOrders()
      return orders.filter(order => order.status === 'delivered')
    } catch (error) {
      console.error('Error getting order history:', error)
      return []
    }
  },

  async getOrderStats() {
    await delay(100)
    try {
      const orders = await this.getOrders()
      
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
      throw error
    }
  },

  getFavoriteRestaurant(orders) {
    if (orders.length === 0) return null
    
    const restaurantCounts = {}
    orders.forEach(order => {
      restaurantCounts[order.restaurantName] = (restaurantCounts[order.restaurantName] || 0) + 1
    })
    
    return Object.entries(restaurantCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null
  },

  async filterOrders(filters = {}) {
    await delay(100)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'restaurant_name', 'order_date', 'status', 'subtotal',
          'delivery_fee', 'service_fee', 'total', 'items', 'restaurant', 'customer'
        ],
        where: []
      }

      // Add filter conditions
      if (filters.status && filters.status !== 'all') {
        params.where.push({
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [filters.status]
        })
      }

      if (filters.restaurantId) {
        params.where.push({
          fieldName: 'restaurant',
          operator: 'EqualTo',
          values: [parseInt(filters.restaurantId)]
        })
      }

      if (filters.startDate) {
        params.where.push({
          fieldName: 'order_date',
          operator: 'GreaterThanOrEqualTo',
          values: [filters.startDate]
        })
      }

      if (filters.endDate) {
        params.where.push({
          fieldName: 'order_date',
          operator: 'LessThanOrEqualTo',
          values: [filters.endDate]
        })
      }

      if (filters.minTotal) {
        params.where.push({
          fieldName: 'total',
          operator: 'GreaterThanOrEqualTo',
          values: [filters.minTotal]
        })
      }

      if (filters.maxTotal) {
        params.where.push({
          fieldName: 'total',
          operator: 'LessThanOrEqualTo',
          values: [filters.maxTotal]
        })
      }

      // Add sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            params.orderBy = [{ fieldName: 'order_date', SortType: 'DESC' }]
            break
          case 'oldest':
            params.orderBy = [{ fieldName: 'order_date', SortType: 'ASC' }]
            break
          case 'total-high':
            params.orderBy = [{ fieldName: 'total', SortType: 'DESC' }]
            break
          case 'total-low':
            params.orderBy = [{ fieldName: 'total', SortType: 'ASC' }]
            break
          default:
            params.orderBy = [{ fieldName: 'order_date', SortType: 'DESC' }]
        }
      }

      const response = await apperClient.fetchRecords('order', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      const orders = response.data?.map(order => ({
        id: order.Id,
        restaurantId: order.restaurant,
        restaurantName: order.restaurant_name,
        status: order.status,
        subtotal: order.subtotal || 0,
        deliveryFee: order.delivery_fee || 0,
        serviceFee: order.service_fee || 0,
        total: order.total || 0,
        items: order.items ? JSON.parse(order.items) : [],
        createdAt: order.order_date
      })) || []

      return orders
    } catch (error) {
      console.error('Error filtering orders:', error)
      throw error
    }
  },

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
      throw error
    }
  }
}

export default orderService