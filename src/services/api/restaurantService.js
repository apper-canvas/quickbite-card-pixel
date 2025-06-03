import restaurantsData from '../mockData/restaurants.json'

const DELAY = 300

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, DELAY))

export const restaurantService = {
  async getAllRestaurants() {
    await simulateDelay()
    try {
      return {
        success: true,
        data: restaurantsData
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch restaurants'
      }
    }
  },

  async getRestaurantById(id) {
    await simulateDelay()
    try {
      const restaurant = restaurantsData.find(r => r.id === id)
      if (!restaurant) {
        return {
          success: false,
          error: 'Restaurant not found'
        }
      }
      return {
        success: true,
        data: restaurant
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch restaurant'
      }
    }
  },

async searchRestaurants(query) {
    await simulateDelay()
    try {
      const filtered = restaurantsData.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
      )
      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search restaurants'
      }
    }
  },

  async filterRestaurants(filters) {
    await simulateDelay()
    try {
      let filtered = [...restaurantsData]

      if (filters.cuisine && filters.cuisine.length > 0) {
        filtered = filtered.filter(restaurant =>
          restaurant.cuisine.some(c => filters.cuisine.includes(c))
        )
      }

      if (filters.rating) {
        filtered = filtered.filter(restaurant => restaurant.rating >= filters.rating)
      }

      if (filters.maxDeliveryTime) {
        filtered = filtered.filter(restaurant => restaurant.deliveryTime <= filters.maxDeliveryTime)
      }

      if (filters.isOpen !== undefined) {
        filtered = filtered.filter(restaurant => restaurant.isOpen === filters.isOpen)
      }

      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to filter restaurants'
      }
    }
  },

  async getRestaurantReviews(restaurantId) {
    await simulateDelay()
    try {
      const reviews = JSON.parse(localStorage.getItem(`reviews_${restaurantId}`) || '[]')
      return {
        success: true,
        data: reviews
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch restaurant reviews'
      }
    }
  },

  async updateRestaurantRating(restaurantId, newRating) {
    await simulateDelay()
    try {
      // In a real app, this would update the backend
      return {
        success: true,
        data: { rating: newRating }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update restaurant rating'
      }
    }
  }
}