import { useState, useEffect } from 'react'
import { restaurantService, orderService } from '../services'
import { toast } from 'sonner'

const FAVORITES_STORAGE_KEY = 'quickbite_favorites'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load favorites from localStorage and fetch restaurant data
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true)
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : []
        
        if (favoriteIds.length > 0) {
          const favoritesData = await Promise.all(
            favoriteIds.map(async (id) => {
              const result = await restaurantService.getRestaurantById(id)
              return result.success ? result.data : null
            })
          )
          setFavorites(favoritesData.filter(Boolean))
        } else {
          setFavorites([])
        }
      } catch (err) {
        setError('Failed to load favorites')
        console.error('Error loading favorites:', err)
        toast.error('Failed to load favorites')
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  // Save favorites to localStorage
  const saveFavoritesToStorage = (favoritesList) => {
    try {
      const favoriteIds = favoritesList.map(restaurant => restaurant.id)
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
    } catch (err) {
      console.error('Error saving favorites:', err)
    }
  }

  // Add restaurant to favorites
  const addToFavorites = async (restaurant) => {
    try {
      const isAlreadyFavorite = favorites.some(fav => fav.id === restaurant.id)
      if (isAlreadyFavorite) {
        toast.info(`${restaurant.name} is already in your favorites`)
        return
      }

      const updatedFavorites = [...favorites, restaurant]
      setFavorites(updatedFavorites)
      saveFavoritesToStorage(updatedFavorites)
      toast.success(`${restaurant.name} added to favorites`)
    } catch (err) {
      toast.error('Failed to add to favorites')
      console.error('Error adding to favorites:', err)
    }
  }

  // Remove restaurant from favorites
  const removeFromFavorites = (restaurantId) => {
    try {
      const restaurant = favorites.find(fav => fav.id === restaurantId)
      const updatedFavorites = favorites.filter(fav => fav.id !== restaurantId)
      setFavorites(updatedFavorites)
      saveFavoritesToStorage(updatedFavorites)
      
      if (restaurant) {
        toast.success(`${restaurant.name} removed from favorites`)
      }
    } catch (err) {
      toast.error('Failed to remove from favorites')
      console.error('Error removing from favorites:', err)
    }
  }

  // Toggle favorite status
  const toggleFavorite = (restaurant) => {
    const isFavorite = favorites.some(fav => fav.id === restaurant.id)
    if (isFavorite) {
      removeFromFavorites(restaurant.id)
    } else {
      addToFavorites(restaurant)
    }
  }

  // Check if restaurant is favorite
  const isFavorite = (restaurantId) => {
    return favorites.some(fav => fav.id === restaurantId)
  }

  // Search favorites
  const searchFavorites = (query) => {
    if (!query.trim()) return favorites
    
    return favorites.filter(restaurant =>
      restaurant.name?.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisine?.some(c => c.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Order history management using orderService
  const getOrderHistory = async () => {
    try {
      const orders = await orderService.getOrderHistory()
      return orders || []
    } catch (err) {
      console.error('Error loading order history:', err)
      return []
    }
  }

  const addToOrderHistory = async (order) => {
    try {
      // In a real app, this would be handled when creating an order
      // For now, just log that order was added
      console.log('Order added to history:', order)
    } catch (err) {
      console.error('Error saving order history:', err)
    }
  }

  const getRestaurantOrders = async (restaurantId) => {
    try {
      const allOrders = await orderService.getOrders()
      return allOrders.filter(order => order.restaurantId === restaurantId)
    } catch (err) {
      console.error('Error getting restaurant orders:', err)
      return []
    }
  }

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    searchFavorites,
    getOrderHistory,
    addToOrderHistory,
    getRestaurantOrders
  }
}