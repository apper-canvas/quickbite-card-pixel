import React, { useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useCart } from '../hooks/useCart'
import SearchBar from '../components/molecules/SearchBar'
import RestaurantCard from '../components/molecules/RestaurantCard'
import EmptyState from '../components/molecules/EmptyState'
import LoadingSpinner from '../components/atoms/LoadingSpinner'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import ApperIcon from '../components/ApperIcon'
import { toast } from 'sonner'

const FavoritesPage = () => {
  const { favorites, loading, error, searchFavorites, getRestaurantOrders } = useFavorites()
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFavorites, setFilteredFavorites] = useState([])

  React.useEffect(() => {
    setFilteredFavorites(searchFavorites(searchQuery))
  }, [favorites, searchQuery, searchFavorites])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query) {
      toast.success(`Found ${searchFavorites(query).length} favorite restaurants`)
    }
  }

  const handleReorder = (restaurantId) => {
    const orders = getRestaurantOrders(restaurantId)
    if (orders.length === 0) {
      toast.info('No previous orders found for this restaurant')
      return
    }

    const lastOrder = orders[0] // Most recent order
    if (lastOrder.items && lastOrder.items.length > 0) {
      let itemsAdded = 0
      lastOrder.items.forEach(item => {
        addToCart(item, item.quantity || 1)
        itemsAdded += item.quantity || 1
      })
      toast.success(`${itemsAdded} item${itemsAdded !== 1 ? 's' : ''} added to cart from previous order`)
    } else {
      toast.info('Previous order had no items to reorder')
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon="AlertCircle"
          title="Something went wrong"
          description={error}
          action={
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          }
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Favorite Restaurants
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Quick access to your saved restaurants and easy reordering
        </p>
        
        {favorites.length > 0 && (
          <div className="max-w-md mx-auto mb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search your favorites..."
              className="w-full"
            />
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon="Heart"
          title="No favorite restaurants yet"
          description="Start exploring restaurants and save your favorites for quick access"
          action={
            <Button onClick={() => window.location.href = '/restaurants'}>
              Browse Restaurants
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredFavorites.length} Favorite{filteredFavorites.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </h2>
          </div>

          {filteredFavorites.length === 0 && searchQuery ? (
            <EmptyState
              icon="Search"
              title="No favorites found"
              description={`No favorite restaurants match "${searchQuery}"`}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((restaurant) => {
                const orders = getRestaurantOrders(restaurant.id)
                return (
                  <div key={restaurant.id} className="space-y-3">
                    <RestaurantCard restaurant={restaurant} />
                    
                    {/* Reorder Section */}
                    {orders.length > 0 && (
                      <Card className="border-orange-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <ApperIcon name="RotateCcw" className="h-4 w-4" />
                            Previous Orders
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {orders.length} order{orders.length !== 1 ? 's' : ''} available
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorder(restaurant.id)}
                              className="text-orange-600 border-orange-200 hover:bg-orange-50"
                            >
                              <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                              Reorder Last
                            </Button>
                          </div>
                          
                          {orders[0] && (
                            <div className="mt-2 text-xs text-gray-500">
                              Last order: {new Date(orders[0].timestamp).toLocaleDateString()}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FavoritesPage