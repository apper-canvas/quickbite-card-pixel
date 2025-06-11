import { toast } from 'sonner'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const restaurantService = {
  async getAllRestaurants() {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'cuisine', 'address_street', 'address_city', 'address_zip_code', 
          'rating', 'delivery_time', 'minimum_order', 'is_open', 'image', 'delivery_fee',
          'Tags', 'CreatedOn', 'ModifiedOn'
        ],
        orderBy: [{ fieldName: 'Name', SortType: 'ASC' }]
      }

      const response = await apperClient.fetchRecords('restaurant', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const restaurants = response.data?.map(restaurant => ({
        id: restaurant.Id,
        name: restaurant.Name,
        cuisine: restaurant.cuisine ? restaurant.cuisine.split(',') : [],
        address: {
          street: restaurant.address_street || '',
          city: restaurant.address_city || '',
          zipCode: restaurant.address_zip_code || ''
        },
        rating: restaurant.rating || 0,
        deliveryTime: restaurant.delivery_time || 30,
        minimumOrder: restaurant.minimum_order || 0,
        isOpen: restaurant.is_open || false,
        image: restaurant.image || '',
        deliveryFee: restaurant.delivery_fee || 0,
        tags: restaurant.Tags ? restaurant.Tags.split(',') : []
      })) || []

      return { success: true, data: restaurants }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      return { success: false, error: 'Failed to fetch restaurants' }
    }
  },

  async getRestaurantById(id) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'cuisine', 'address_street', 'address_city', 'address_zip_code',
          'rating', 'delivery_time', 'minimum_order', 'is_open', 'image', 'delivery_fee',
          'Tags'
        ]
      }

      const response = await apperClient.getRecordById('restaurant', parseInt(id), params)
      
      if (!response.success) {
        return { success: false, error: response.message || 'Restaurant not found' }
      }

      if (!response.data) {
        return { success: false, error: 'Restaurant not found' }
      }

      const restaurant = {
        id: response.data.Id,
        name: response.data.Name,
        cuisine: response.data.cuisine ? response.data.cuisine.split(',') : [],
        address: {
          street: response.data.address_street || '',
          city: response.data.address_city || '',
          zipCode: response.data.address_zip_code || ''
        },
        rating: response.data.rating || 0,
        deliveryTime: response.data.delivery_time || 30,
        minimumOrder: response.data.minimum_order || 0,
        isOpen: response.data.is_open || false,
        image: response.data.image || '',
        deliveryFee: response.data.delivery_fee || 0,
        tags: response.data.Tags ? response.data.Tags.split(',') : []
      }

      return { success: true, data: restaurant }
    } catch (error) {
      console.error('Error fetching restaurant:', error)
      return { success: false, error: 'Failed to fetch restaurant' }
    }
  },

  async searchRestaurants(query) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'cuisine', 'address_street', 'address_city', 'address_zip_code',
          'rating', 'delivery_time', 'minimum_order', 'is_open', 'image', 'delivery_fee',
          'Tags'
        ],
        where: [
          {
            fieldName: 'Name',
            operator: 'Contains',
            values: [query]
          }
        ],
        whereGroups: [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'cuisine',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      }

      const response = await apperClient.fetchRecords('restaurant', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const restaurants = response.data?.map(restaurant => ({
        id: restaurant.Id,
        name: restaurant.Name,
        cuisine: restaurant.cuisine ? restaurant.cuisine.split(',') : [],
        address: {
          street: restaurant.address_street || '',
          city: restaurant.address_city || '',
          zipCode: restaurant.address_zip_code || ''
        },
        rating: restaurant.rating || 0,
        deliveryTime: restaurant.delivery_time || 30,
        minimumOrder: restaurant.minimum_order || 0,
        isOpen: restaurant.is_open || false,
        image: restaurant.image || '',
        deliveryFee: restaurant.delivery_fee || 0,
        tags: restaurant.Tags ? restaurant.Tags.split(',') : []
      })) || []

      return { success: true, data: restaurants }
    } catch (error) {
      console.error('Error searching restaurants:', error)
      return { success: false, error: 'Failed to search restaurants' }
    }
  },

  async filterRestaurants(filters) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'cuisine', 'address_street', 'address_city', 'address_zip_code',
          'rating', 'delivery_time', 'minimum_order', 'is_open', 'image', 'delivery_fee',
          'Tags'
        ],
        where: []
      }

      // Add filter conditions
      if (filters.cuisine && filters.cuisine.length > 0) {
        params.where.push({
          fieldName: 'cuisine',
          operator: 'Contains',
          values: filters.cuisine
        })
      }

      if (filters.rating) {
        params.where.push({
          fieldName: 'rating',
          operator: 'GreaterThanOrEqualTo',
          values: [filters.rating]
        })
      }

      if (filters.maxDeliveryTime) {
        params.where.push({
          fieldName: 'delivery_time',
          operator: 'LessThanOrEqualTo',
          values: [filters.maxDeliveryTime]
        })
      }

      if (filters.isOpen !== undefined) {
        params.where.push({
          fieldName: 'is_open',
          operator: 'ExactMatch',
          values: [filters.isOpen]
        })
      }

      const response = await apperClient.fetchRecords('restaurant', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const restaurants = response.data?.map(restaurant => ({
        id: restaurant.Id,
        name: restaurant.Name,
        cuisine: restaurant.cuisine ? restaurant.cuisine.split(',') : [],
        address: {
          street: restaurant.address_street || '',
          city: restaurant.address_city || '',
          zipCode: restaurant.address_zip_code || ''
        },
        rating: restaurant.rating || 0,
        deliveryTime: restaurant.delivery_time || 30,
        minimumOrder: restaurant.minimum_order || 0,
        isOpen: restaurant.is_open || false,
        image: restaurant.image || '',
        deliveryFee: restaurant.delivery_fee || 0,
        tags: restaurant.Tags ? restaurant.Tags.split(',') : []
      })) || []

      return { success: true, data: restaurants }
    } catch (error) {
      console.error('Error filtering restaurants:', error)
      return { success: false, error: 'Failed to filter restaurants' }
    }
  },

  async createRestaurant(restaurantData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: restaurantData.name,
          cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine.join(',') : restaurantData.cuisine,
          address_street: restaurantData.address?.street || '',
          address_city: restaurantData.address?.city || '',
          address_zip_code: restaurantData.address?.zipCode || '',
          rating: parseFloat(restaurantData.rating) || 0,
          delivery_time: parseInt(restaurantData.deliveryTime) || 30,
          minimum_order: parseFloat(restaurantData.minimumOrder) || 0,
          is_open: Boolean(restaurantData.isOpen),
          image: restaurantData.image || '',
          delivery_fee: parseFloat(restaurantData.deliveryFee) || 0,
          Tags: Array.isArray(restaurantData.tags) ? restaurantData.tags.join(',') : restaurantData.tags
        }]
      }

      const response = await apperClient.createRecord('restaurant', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create restaurant:${failedRecords}`)
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

      return { success: false, error: 'Failed to create restaurant' }
    } catch (error) {
      console.error('Error creating restaurant:', error)
      return { success: false, error: 'Failed to create restaurant' }
    }
  },

  async updateRestaurant(id, restaurantData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: restaurantData.name,
          cuisine: Array.isArray(restaurantData.cuisine) ? restaurantData.cuisine.join(',') : restaurantData.cuisine,
          address_street: restaurantData.address?.street || '',
          address_city: restaurantData.address?.city || '',
          address_zip_code: restaurantData.address?.zipCode || '',
          rating: parseFloat(restaurantData.rating) || 0,
          delivery_time: parseInt(restaurantData.deliveryTime) || 30,
          minimum_order: parseFloat(restaurantData.minimumOrder) || 0,
          is_open: Boolean(restaurantData.isOpen),
          image: restaurantData.image || '',
          delivery_fee: parseFloat(restaurantData.deliveryFee) || 0,
          Tags: Array.isArray(restaurantData.tags) ? restaurantData.tags.join(',') : restaurantData.tags
        }]
      }

      const response = await apperClient.updateRecord('restaurant', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update restaurant:${failedUpdates}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          return { success: true, data: successfulUpdates[0].data }
        }
      }

      return { success: false, error: 'Failed to update restaurant' }
    } catch (error) {
      console.error('Error updating restaurant:', error)
      return { success: false, error: 'Failed to update restaurant' }
    }
  },

  async deleteRestaurant(id) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('restaurant', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete restaurant:${failedDeletions}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return { success: successfulDeletions.length > 0 }
      }

      return { success: false, error: 'Failed to delete restaurant' }
    } catch (error) {
      console.error('Error deleting restaurant:', error)
      return { success: false, error: 'Failed to delete restaurant' }
    }
  }
}