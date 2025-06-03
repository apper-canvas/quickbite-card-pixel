import { useState, useEffect } from 'react'
import { restaurantService } from '../services'

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)
    
    const result = await restaurantService.getAllRestaurants()
    
    if (result.success) {
      setRestaurants(result.data)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const searchRestaurants = async (query) => {
    if (!query.trim()) {
      await fetchRestaurants()
      return
    }

    setLoading(true)
    setError(null)
    
    const result = await restaurantService.searchRestaurants(query)
    
    if (result.success) {
      setRestaurants(result.data)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const filterRestaurants = async (filters) => {
    setLoading(true)
    setError(null)
    
    const result = await restaurantService.filterRestaurants(filters)
    
    if (result.success) {
      setRestaurants(result.data)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
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
    filterRestaurants
  }
}