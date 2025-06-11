import { toast } from 'sonner'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const menuService = {
  async getMenuByRestaurantId(restaurantId) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'description', 'price', 'category', 'customizations', 
          'is_available', 'image', 'restaurant'
        ],
        where: [
          {
            fieldName: 'restaurant',
            operator: 'EqualTo',
            values: [parseInt(restaurantId)]
          }
        ],
        orderBy: [{ fieldName: 'category', SortType: 'ASC' }]
      }

      const response = await apperClient.fetchRecords('menu_item', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const menuItems = response.data?.map(item => ({
        id: item.Id,
        restaurantId: restaurantId,
        name: item.Name,
        description: item.description || '',
        price: item.price || 0,
        category: item.category || 'Other',
        customizations: item.customizations ? JSON.parse(item.customizations) : [],
        isAvailable: item.is_available || false,
        image: item.image || ''
      })) || []

      return { success: true, data: menuItems }
    } catch (error) {
      console.error('Error fetching menu:', error)
      return { success: false, error: 'Failed to fetch menu' }
    }
  },

  async getMenuItem(itemId) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'description', 'price', 'category', 'customizations',
          'is_available', 'image', 'restaurant'
        ]
      }

      const response = await apperClient.getRecordById('menu_item', parseInt(itemId), params)
      
      if (!response.success) {
        return { success: false, error: response.message || 'Menu item not found' }
      }

      if (!response.data) {
        return { success: false, error: 'Menu item not found' }
      }

      const item = {
        id: response.data.Id,
        restaurantId: response.data.restaurant,
        name: response.data.Name,
        description: response.data.description || '',
        price: response.data.price || 0,
        category: response.data.category || 'Other',
        customizations: response.data.customizations ? JSON.parse(response.data.customizations) : [],
        isAvailable: response.data.is_available || false,
        image: response.data.image || ''
      }

      return { success: true, data: item }
    } catch (error) {
      console.error('Error fetching menu item:', error)
      return { success: false, error: 'Failed to fetch menu item' }
    }
  },

  async searchMenuItems(restaurantId, query) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'description', 'price', 'category', 'customizations',
          'is_available', 'image', 'restaurant'
        ],
        where: [
          {
            fieldName: 'restaurant',
            operator: 'EqualTo',
            values: [parseInt(restaurantId)]
          }
        ],
        whereGroups: [
          {
            operator: 'AND',
            subGroups: [
              {
                operator: 'OR',
                conditions: [
                  {
                    fieldName: 'Name',
                    operator: 'Contains',
                    values: [query]
                  },
                  {
                    fieldName: 'description',
                    operator: 'Contains',
                    values: [query]
                  },
                  {
                    fieldName: 'category',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      }

      const response = await apperClient.fetchRecords('menu_item', params)
      
      if (!response.success) {
        console.error(response.message)
        return { success: false, error: response.message }
      }

      const menuItems = response.data?.map(item => ({
        id: item.Id,
        restaurantId: restaurantId,
        name: item.Name,
        description: item.description || '',
        price: item.price || 0,
        category: item.category || 'Other',
        customizations: item.customizations ? JSON.parse(item.customizations) : [],
        isAvailable: item.is_available || false,
        image: item.image || ''
      })) || []

      return { success: true, data: menuItems }
    } catch (error) {
      console.error('Error searching menu items:', error)
      return { success: false, error: 'Failed to search menu items' }
    }
  },

  async createMenuItem(menuItemData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: menuItemData.name,
          description: menuItemData.description || '',
          price: parseFloat(menuItemData.price) || 0,
          category: menuItemData.category || 'Other',
          customizations: menuItemData.customizations ? JSON.stringify(menuItemData.customizations) : '',
          is_available: Boolean(menuItemData.isAvailable),
          image: menuItemData.image || '',
          restaurant: parseInt(menuItemData.restaurantId)
        }]
      }

      const response = await apperClient.createRecord('menu_item', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create menu item:${failedRecords}`)
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

      return { success: false, error: 'Failed to create menu item' }
    } catch (error) {
      console.error('Error creating menu item:', error)
      return { success: false, error: 'Failed to create menu item' }
    }
  },

  async updateMenuItem(id, menuItemData) {
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
          Name: menuItemData.name,
          description: menuItemData.description || '',
          price: parseFloat(menuItemData.price) || 0,
          category: menuItemData.category || 'Other',
          customizations: menuItemData.customizations ? JSON.stringify(menuItemData.customizations) : '',
          is_available: Boolean(menuItemData.isAvailable),
          image: menuItemData.image || '',
          restaurant: parseInt(menuItemData.restaurantId)
        }]
      }

      const response = await apperClient.updateRecord('menu_item', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update menu item:${failedUpdates}`)
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

      return { success: false, error: 'Failed to update menu item' }
    } catch (error) {
      console.error('Error updating menu item:', error)
      return { success: false, error: 'Failed to update menu item' }
    }
  },

  async deleteMenuItem(id) {
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

      const response = await apperClient.deleteRecord('menu_item', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return { success: false, error: response.message }
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete menu item:${failedDeletions}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return { success: successfulDeletions.length > 0 }
      }

      return { success: false, error: 'Failed to delete menu item' }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      return { success: false, error: 'Failed to delete menu item' }
    }
  }
}