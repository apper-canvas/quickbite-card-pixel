const DELAY = 300

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, DELAY))

export const reviewService = {
  async getAllReviews() {
    await simulateDelay()
    try {
      const allReviews = []
      const keys = Object.keys(localStorage).filter(key => key.startsWith('reviews_'))
      
      keys.forEach(key => {
        const restaurantReviews = JSON.parse(localStorage.getItem(key) || '[]')
        allReviews.push(...restaurantReviews)
      })
      
      // Sort by date (newest first)
      allReviews.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      return {
        success: true,
        data: allReviews
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch reviews'
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

  async addReview(reviewData) {
    await simulateDelay()
    try {
      const { restaurantId, rating, comment, photos, userName } = reviewData
      
      const newReview = {
        id: Date.now().toString(),
        restaurantId,
        userName: userName || 'Anonymous User',
        rating,
        comment,
        photos: photos || [],
        date: new Date().toISOString(),
        helpful: 0
      }

      // Get existing reviews for this restaurant
      const existingReviews = JSON.parse(localStorage.getItem(`reviews_${restaurantId}`) || '[]')
      existingReviews.unshift(newReview)
      
      // Save updated reviews
      localStorage.setItem(`reviews_${restaurantId}`, JSON.stringify(existingReviews))

      return {
        success: true,
        data: newReview
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add review'
      }
    }
  },

  async deleteReview(reviewId, restaurantId) {
    await simulateDelay()
    try {
      const reviews = JSON.parse(localStorage.getItem(`reviews_${restaurantId}`) || '[]')
      const updatedReviews = reviews.filter(review => review.id !== reviewId)
      
      localStorage.setItem(`reviews_${restaurantId}`, JSON.stringify(updatedReviews))

      return {
        success: true,
        data: { deleted: true }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete review'
      }
    }
  },

  async updateReviewHelpful(reviewId, restaurantId) {
    await simulateDelay()
    try {
      const reviews = JSON.parse(localStorage.getItem(`reviews_${restaurantId}`) || '[]')
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
      
      localStorage.setItem(`reviews_${restaurantId}`, JSON.stringify(updatedReviews))

      return {
        success: true,
        data: { updated: true }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update review'
      }
    }
  },

  async searchReviews(query) {
    await simulateDelay()
    try {
      const allReviews = []
      const keys = Object.keys(localStorage).filter(key => key.startsWith('reviews_'))
      
      keys.forEach(key => {
        const restaurantReviews = JSON.parse(localStorage.getItem(key) || '[]')
        allReviews.push(...restaurantReviews)
      })
      
      const filtered = allReviews.filter(review =>
        review.comment.toLowerCase().includes(query.toLowerCase()) ||
        review.userName.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search reviews'
      }
    }
  },

  async filterReviews(filters) {
    await simulateDelay()
    try {
      const allReviews = []
      const keys = Object.keys(localStorage).filter(key => key.startsWith('reviews_'))
      
      keys.forEach(key => {
        const restaurantReviews = JSON.parse(localStorage.getItem(key) || '[]')
        allReviews.push(...restaurantReviews)
      })
      
      let filtered = [...allReviews]

      if (filters.rating) {
        filtered = filtered.filter(review => review.rating >= filters.rating)
      }

      if (filters.hasPhotos) {
        filtered = filtered.filter(review => review.photos && review.photos.length > 0)
      }

      if (filters.restaurantId) {
        filtered = filtered.filter(review => review.restaurantId === filters.restaurantId)
      }

      if (filters.dateRange) {
        const { start, end } = filters.dateRange
        filtered = filtered.filter(review => {
          const reviewDate = new Date(review.date)
          return reviewDate >= start && reviewDate <= end
        })
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to filter reviews'
      }
    }
  }
}