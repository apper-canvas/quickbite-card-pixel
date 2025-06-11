import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Default user data structure for demo purposes
const getDefaultUser = () => ({
  id: 'user_1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, City, State 12345',
  dateOfBirth: '1990-01-15',
  joinDate: '2024-01-01',
  profilePhoto: null,
  favoriteRestaurants: [],
  reviewsCount: 0
})

// Default settings
const getDefaultSettings = () => ({
  emailNotifications: true,
  pushNotifications: true,
  orderUpdates: true,
  promotions: false,
  darkMode: false,
  language: 'en'
})

export const userService = {
  // Get current user data from Redux or create default
  async getCurrentUser() {
    try {
      // In a real implementation, this would come from authenticated user data
      // For now, return default user data
      await delay(200)
      return getDefaultUser()
    } catch (error) {
      console.error('Error getting user data:', error)
      return getDefaultUser()
    }
  },

  // Update user profile - in real app this would update via ApperClient
  async updateProfile(profileData) {
    await delay(300)
    try {
      // In a real app with user management table, this would use ApperClient
      // For now, simulate profile update
      const updatedUser = {
        ...getDefaultUser(),
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      return updatedUser
    } catch (error) {
      console.error('Error updating profile:', error)
      throw new Error('Failed to update profile')
    }
  },

  // Get user settings from database
  async getUserSettings() {
    await delay(200)
    try {
      // Get current user ID from authenticated session
      const userId = 1 // In real app, get from auth context
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          'Name', 'email_notifications', 'push_notifications', 'order_updates',
          'promotions', 'dark_mode', 'language', 'user'
        ],
        where: [
          {
            fieldName: 'user',
            operator: 'EqualTo',
            values: [userId]
          }
        ]
      }

      const response = await apperClient.fetchRecords('user_settings', params)
      
      if (!response.success) {
        console.error(response.message)
        // Return default settings if no user settings found
        return getDefaultSettings()
      }

      if (!response.data || response.data.length === 0) {
        // Create default settings if none exist
        await this.createDefaultSettings(userId)
        return getDefaultSettings()
      }

      const settings = response.data[0]
      return {
        emailNotifications: settings.email_notifications || false,
        pushNotifications: settings.push_notifications || false,
        orderUpdates: settings.order_updates || false,
        promotions: settings.promotions || false,
        darkMode: settings.dark_mode || false,
        language: settings.language || 'en'
      }
    } catch (error) {
      console.error('Error getting user settings:', error)
      return getDefaultSettings()
    }
  },

  // Create default settings for user
  async createDefaultSettings(userId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: `Settings for User ${userId}`,
          email_notifications: true,
          push_notifications: true,
          order_updates: true,
          promotions: false,
          dark_mode: false,
          language: 'en',
          user: userId
        }]
      }

      const response = await apperClient.createRecord('user_settings', params)
      
      if (!response.success) {
        console.error(response.message)
      }
    } catch (error) {
      console.error('Error creating default settings:', error)
    }
  },

  // Update user settings
  async updateSettings(settingsData) {
    await delay(300)
    try {
      const userId = 1 // In real app, get from auth context
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // First, try to get existing settings
      const getParams = {
        fields: ['Name'],
        where: [
          {
            fieldName: 'user',
            operator: 'EqualTo',
            values: [userId]
          }
        ]
      }

      const getResponse = await apperClient.fetchRecords('user_settings', getParams)
      
      if (!getResponse.success || !getResponse.data || getResponse.data.length === 0) {
        // Create new settings record
        const createParams = {
          records: [{
            Name: `Settings for User ${userId}`,
            email_notifications: Boolean(settingsData.emailNotifications),
            push_notifications: Boolean(settingsData.pushNotifications),
            order_updates: Boolean(settingsData.orderUpdates),
            promotions: Boolean(settingsData.promotions),
            dark_mode: Boolean(settingsData.darkMode),
            language: settingsData.language || 'en',
            user: userId
          }]
        }

        const response = await apperClient.createRecord('user_settings', createParams)
        
        if (!response.success) {
          console.error(response.message)
          toast.error(response.message)
          throw new Error(response.message)
        }
      } else {
        // Update existing settings
        const settingsId = getResponse.data[0].Id
        
        const updateParams = {
          records: [{
            Id: settingsId,
            email_notifications: Boolean(settingsData.emailNotifications),
            push_notifications: Boolean(settingsData.pushNotifications),
            order_updates: Boolean(settingsData.orderUpdates),
            promotions: Boolean(settingsData.promotions),
            dark_mode: Boolean(settingsData.darkMode),
            language: settingsData.language || 'en',
            user: userId
          }]
        }

        const response = await apperClient.updateRecord('user_settings', updateParams)
        
        if (!response.success) {
          console.error(response.message)
          toast.error(response.message)
          throw new Error(response.message)
        }
      }

      return {
        ...settingsData,
        updatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      throw new Error('Failed to update settings')
    }
  },

  // Change password - in real app this would go through authentication service
  async changePassword(currentPassword, newPassword) {
    await delay(300)
    try {
      // In a real app, this would be handled by the authentication system
      // For demo purposes, just simulate the password change
      
      if (currentPassword === 'wrongpassword') {
        throw new Error('Current password is incorrect')
      }
      
      // Simulate password update success
      return { success: true }
    } catch (error) {
      console.error('Error changing password:', error)
      throw new Error('Failed to change password')
    }
  },

  // Upload profile photo - in real app this would upload to cloud storage
  async uploadProfilePhoto(file) {
    await delay(500)
    try {
      if (!file) {
        throw new Error('No file provided')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size too large. Maximum 5MB allowed.')
      }
      
      // In a real app, this would upload to cloud storage and return URL
      // For demo purposes, create a local URL
      const photoUrl = URL.createObjectURL(file)
      
      return photoUrl
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw new Error('Failed to upload photo')
    }
  },

  // Get user statistics - would be calculated from actual order/review data
  async getUserStats() {
    await delay(100)
    try {
      // In a real app, these would be calculated from actual order and review data
      // For demo purposes, return sample statistics
      return {
        totalOrders: 23,
        totalSpent: 487.50,
        favoriteRestaurants: 5,
        reviewsCount: 12,
        memberSince: '2024-01-01'
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      return {
        totalOrders: 0,
        totalSpent: 0,
        favoriteRestaurants: 0,
        reviewsCount: 0,
        memberSince: new Date().toISOString()
      }
    }
  },

  // Delete user account - would require careful cleanup in real app
  async deleteAccount() {
    await delay(300)
    try {
      // In a real app, this would:
      // 1. Delete user settings
      // 2. Anonymize user reviews
      // 3. Delete user orders (if policy allows)
      // 4. Remove user from authentication system
      
      // For demo purposes, just simulate success
      return { success: true }
    } catch (error) {
      console.error('Error deleting account:', error)
      throw new Error('Failed to delete account')
    }
  }
}

export default userService