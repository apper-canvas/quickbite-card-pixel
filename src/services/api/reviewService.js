import { toast } from 'sonner'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reviewService = {
  async getAllReviews() {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'user_name', 'rating', 'comment', 'photos', 'date', 'helpful',
          'restaurant', 'user', 'CreatedOn', 'ModifiedOn'
        ],
        orderBy: [{ fieldName: 'date', SortType: 'DESC' }]
      }

      const response = await apperClient.fetchRecords('review', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const reviews = response.data?.map(review => ({
        id: review.Id,
        restaurantId: review.restaurant,
        userName: review.user_name || 'Anonymous User',
        rating: review.rating || 0,
        comment: review.comment || '',
        photos: review.photos ? review.photos.split(',') : [],
        date: review.date || review.CreatedOn,
        helpful: review.helpful || 0
      })) || []

      return { success: true, data: reviews }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return { success: false, error: 'Failed to fetch reviews' }
    }
  },

  async getRestaurantReviews(restaurantId) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'user_name', 'rating', 'comment', 'photos', 'date', 'helpful',
          'restaurant', 'user'
        ],
        where: [
          {
            fieldName: 'restaurant',
            operator: 'EqualTo',
            values: [parseInt(restaurantId)]
          }
        ],
        orderBy: [{ fieldName: 'date', SortType: 'DESC' }]
      }

      const response = await apperClient.fetchRecords('review', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const reviews = response.data?.map(review => ({
        id: review.Id,
        restaurantId: review.restaurant,
        userName: review.user_name || 'Anonymous User',
        rating: review.rating || 0,
        comment: review.comment || '',
        photos: review.photos ? review.photos.split(',') : [],
        date: review.date,
        helpful: review.helpful || 0
      })) || []

      return { success: true, data: reviews }
    } catch (error) {
      console.error('Error fetching restaurant reviews:', error)
      return { success: false, error: 'Failed to fetch restaurant reviews' }
    }
  },

  async addReview(reviewData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: `Review by ${reviewData.userName}`,
          user_name: reviewData.userName || 'Anonymous User',
          rating: parseInt(reviewData.rating) || 5,
          comment: reviewData.comment || '',
          photos: Array.isArray(reviewData.photos) ? reviewData.photos.join(',') : '',
          date: new Date().toISOString(),
          helpful: 0,
          restaurant: parseInt(reviewData.restaurantId),
          user: parseInt(reviewData.userId) || 1
        }]
      }

      const response = await apperClient.createRecord('review', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create review:${failedRecords}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          return { success: true, data: successfulRecords[0].data }
        }
      }

      return { success: false, error: 'Failed to add review' }
    } catch (error) {
      console.error('Error adding review:', error)
      return { success: false, error: 'Failed to add review' }
    }
  },

  async deleteReview(reviewId, restaurantId) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(reviewId)]
      }

      const response = await apperClient.deleteRecord('review', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete review:${failedDeletions}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return { success: successfulDeletions.length > 0, data: { deleted: true } }
      }

      return { success: false, error: 'Failed to delete review' }
    } catch (error) {
      console.error('Error deleting review:', error)
      return { success: false, error: 'Failed to delete review' }
    }
  },

  async updateReviewHelpful(reviewId, restaurantId) {
    await delay(200)
    try {
      // First get current helpful count
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const getParams = {
        fields: ['helpful']
      }

      const getResponse = await apperClient.getRecordById('review', parseInt(reviewId), getParams)
      
      if (!getResponse.success) {
        return { success: false, error: 'Failed to get review' }
      }

      const currentHelpful = getResponse.data.helpful || 0

      const updateParams = {
        records: [{
          Id: parseInt(reviewId),
          helpful: currentHelpful + 1
        }]
      }

      const response = await apperClient.updateRecord('review', updateParams)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      return { success: true, data: { updated: true } }
    } catch (error) {
      console.error('Error updating review helpful:', error)
      return { success: false, error: 'Failed to update review' }
    }
  },

  async searchReviews(query) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'user_name', 'rating', 'comment', 'photos', 'date', 'helpful',
          'restaurant', 'user'
        ],
        whereGroups: [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'comment',
                    operator: 'Contains',
                    values: [query]
                  },
                  {
                    fieldName: 'user_name',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [{ fieldName: 'date', SortType: 'DESC' }]
      }

      const response = await apperClient.fetchRecords('review', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const reviews = response.data?.map(review => ({
        id: review.Id,
        restaurantId: review.restaurant,
        userName: review.user_name || 'Anonymous User',
        rating: review.rating || 0,
        comment: review.comment || '',
        photos: review.photos ? review.photos.split(',') : [],
        date: review.date,
        helpful: review.helpful || 0
      })) || []

      return { success: true, data: reviews }
    } catch (error) {
      console.error('Error searching reviews:', error)
      return { success: false, error: 'Failed to search reviews' }
    }
  },

  async filterReviews(filters) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'user_name', 'rating', 'comment', 'photos', 'date', 'helpful',
          'restaurant', 'user'
        ],
        where: [],
        orderBy: [{ fieldName: 'date', SortType: 'DESC' }]
      }

      // Add filter conditions
      if (filters.rating) {
        params.where.push({
          fieldName: 'rating',
          operator: 'GreaterThanOrEqualTo',
          values: [parseInt(filters.rating)]
        })
      }

      if (filters.hasPhotos) {
        params.where.push({
          fieldName: 'photos',
          operator: 'HasValue',
          values: []
        })
      }

      if (filters.restaurantId) {
        params.where.push({
          fieldName: 'restaurant',
          operator: 'EqualTo',
          values: [parseInt(filters.restaurantId)]
        })
      }

      if (filters.dateRange) {
        const { start, end } = filters.dateRange
        params.where.push({
          fieldName: 'date',
          operator: 'GreaterThanOrEqualTo',
          values: [start.toISOString()]
        })
        params.where.push({
          fieldName: 'date',
          operator: 'LessThanOrEqualTo',
          values: [end.toISOString()]
        })
      }

      const response = await apperClient.fetchRecords('review', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const reviews = response.data?.map(review => ({
        id: review.Id,
        restaurantId: review.restaurant,
        userName: review.user_name || 'Anonymous User',
        rating: review.rating || 0,
        comment: review.comment || '',
        photos: review.photos ? review.photos.split(',') : [],
        date: review.date,
        helpful: review.helpful || 0
      })) || []

      return { success: true, data: reviews }
    } catch (error) {
      console.error('Error filtering reviews:', error)
      return { success: false, error: 'Failed to filter reviews' }
    }
  }
}