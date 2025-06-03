import menuItemsData from '../mockData/menuItems.json'

const DELAY = 300

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, DELAY))

export const menuService = {
  async getMenuByRestaurantId(restaurantId) {
    await simulateDelay()
    try {
      const menuItems = menuItemsData.filter(item => item.restaurantId === restaurantId)
      
      // Group items by category
      const categorizedMenu = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      }, {})

      return {
        success: true,
        data: categorizedMenu
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch menu'
      }
    }
  },

  async getMenuItem(itemId) {
    await simulateDelay()
    try {
      const item = menuItemsData.find(item => item.id === itemId)
      if (!item) {
        return {
          success: false,
          error: 'Menu item not found'
        }
      }
      return {
        success: true,
        data: item
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch menu item'
      }
    }
  },

  async searchMenuItems(restaurantId, query) {
    await simulateDelay()
    try {
      const restaurantItems = menuItemsData.filter(item => item.restaurantId === restaurantId)
      const filtered = restaurantItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search menu items'
      }
    }
  }
}