import { useState, useEffect } from 'react'
import { restaurantService } from '../services'
import { toast } from 'sonner'

const FAVORITES_STORAGE_KEY = 'quickbite_favorites'
const ORDER_HISTORY_STORAGE_KEY = 'quickbite_order_history'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
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
        }
      } catch (err) {
        setError('Failed to load favorites')
        console.error('Error loading favorites:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  // Save favorites to localStorage
  const saveFavoritesToStorage = (favoritesList) => {
    const favoriteIds = favoritesList.map(restaurant => restaurant.id)
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
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
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Order history management
  const getOrderHistory = () => {
    try {
      const saved = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (err) {
      console.error('Error loading order history:', err)
      return []
    }
  }

  const addToOrderHistory = (order) => {
    try {
      const history = getOrderHistory()
      const newOrder = {
        ...order,
        id: Date.now(),
        timestamp: new Date().toISOString()
      }
      
      const updatedHistory = [newOrder, ...history].slice(0, 50) // Keep last 50 orders
      localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
    } catch (err) {
      console.error('Error saving order history:', err)
    }
  }

  const getRestaurantOrders = (restaurantId) => {
    const history = getOrderHistory()
    return history.filter(order => order.restaurantId === restaurantId)
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