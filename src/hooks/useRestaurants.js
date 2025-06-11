import { useState, useEffect } from 'react'
import { restaurantService } from '../services'
import { toast } from 'sonner'

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await restaurantService.getAllRestaurants()
      
      if (result.success) {
        setRestaurants(result.data || [])
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch restaurants'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const searchRestaurants = async (query) => {
    if (!query.trim()) {
      await fetchRestaurants()
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await restaurantService.searchRestaurants(query)
      
      if (result.success) {
        setRestaurants(result.data || [])
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err) {
      const errorMessage = 'Failed to search restaurants'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filterRestaurants = async (filters) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await restaurantService.filterRestaurants(filters)
      
      if (result.success) {
        setRestaurants(result.data || [])
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err) {
      const errorMessage = 'Failed to filter restaurants'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateRestaurantRating = (restaurantId, newRating) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === restaurantId 
        ? { ...restaurant, rating: newRating }
        : restaurant
    ))
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    searchRestaurants,
    filterRestaurants,
    updateRestaurantRating
  }
}