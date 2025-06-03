// User service for managing user data and preferences
const STORAGE_KEYS = {
  USER: 'quickbite_user',
  SETTINGS: 'quickbite_user_settings'
}

// Default user data
const defaultUser = {
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
}

// Default settings
const defaultSettings = {
  emailNotifications: true,
  pushNotifications: true,
  orderUpdates: true,
  promotions: false,
  darkMode: false,
  language: 'en'
}

export const userService = {
  // Get current user data
  async getCurrentUser() {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER)
      if (userData) {
        return JSON.parse(userData)
      }
      
      // Initialize with default user data
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser))
      return defaultUser
    } catch (error) {
      console.error('Error getting user data:', error)
      return defaultUser
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const currentUser = await this.getCurrentUser()
      const updatedUser = {
        ...currentUser,
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      console.error('Error updating profile:', error)
      throw new Error('Failed to update profile')
    }
  },

  // Get user settings
  async getUserSettings() {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (settings) {
        return JSON.parse(settings)
      }
      
      // Initialize with default settings
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings))
      return defaultSettings
    } catch (error) {
      console.error('Error getting user settings:', error)
      return defaultSettings
    }
  },

  // Update user settings
  async updateSettings(settingsData) {
    try {
      const currentSettings = await this.getUserSettings()
      const updatedSettings = {
        ...currentSettings,
        ...settingsData,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings))
      return updatedSettings
    } catch (error) {
      console.error('Error updating settings:', error)
      throw new Error('Failed to update settings')
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // In a real app, this would validate the current password against the server
      // For now, we'll simulate the password change
      
      if (currentPassword === 'wrongpassword') {
        throw new Error('Current password is incorrect')
      }
      
      // Simulate password update
      const user = await this.getCurrentUser()
      const updatedUser = {
        ...user,
        passwordLastChanged: new Date().toISOString()
      }
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      return { success: true }
    } catch (error) {
      console.error('Error changing password:', error)
      throw new Error('Failed to change password')
    }
  },

  // Upload profile photo
  async uploadProfilePhoto(file) {
    try {
      // In a real app, this would upload to a server or cloud storage
      // For demo purposes, we'll create a local URL
      
      if (!file) {
        throw new Error('No file provided')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size too large. Maximum 5MB allowed.')
      }
      
      // Create a local URL for the uploaded file
      const photoUrl = URL.createObjectURL(file)
      
      // Update user profile with new photo
      const user = await this.getCurrentUser()
      const updatedUser = {
        ...user,
        profilePhoto: photoUrl,
        photoUpdatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      return photoUrl
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw new Error('Failed to upload photo')
    }
  },

  // Add restaurant to favorites
  async addToFavorites(restaurantId) {
    try {
      const user = await this.getCurrentUser()
      const favoriteRestaurants = user.favoriteRestaurants || []
      
      if (!favoriteRestaurants.includes(restaurantId)) {
        favoriteRestaurants.push(restaurantId)
        
        const updatedUser = {
          ...user,
          favoriteRestaurants
        }
        
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      }
      
      return favoriteRestaurants
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw new Error('Failed to add to favorites')
    }
  },

  // Remove restaurant from favorites
  async removeFromFavorites(restaurantId) {
    try {
      const user = await this.getCurrentUser()
      const favoriteRestaurants = (user.favoriteRestaurants || []).filter(id => id !== restaurantId)
      
      const updatedUser = {
        ...user,
        favoriteRestaurants
      }
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
      return favoriteRestaurants
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw new Error('Failed to remove from favorites')
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const user = await this.getCurrentUser()
      
      // In a real app, these would be calculated from actual data
      return {
        totalOrders: 23,
        totalSpent: 487.50,
        favoriteRestaurants: user.favoriteRestaurants?.length || 0,
        reviewsCount: user.reviewsCount || 0,
        memberSince: user.joinDate || '2024-01-01'
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

  // Delete user account
  async deleteAccount() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.SETTINGS)
      
      // In a real app, this would also clear other user-related data
      localStorage.removeItem('quickbite_cart')
      localStorage.removeItem('quickbite_favorites')
      localStorage.removeItem('quickbite_orders')
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting account:', error)
      throw new Error('Failed to delete account')
    }
  }
}

export default userService