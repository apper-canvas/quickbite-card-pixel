import React, { useState } from 'react'
import { useRestaurants } from '../hooks/useRestaurants'
import SearchBar from '../components/molecules/SearchBar'
import RestaurantCard from '../components/molecules/RestaurantCard'
import RestaurantFilters from '../components/organisms/RestaurantFilters'
import EmptyState from '../components/molecules/EmptyState'
import LoadingSpinner from '../components/atoms/LoadingSpinner'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'

const RestaurantsPage = () => {
  const { restaurants, loading, error, searchRestaurants, filterRestaurants } = useRestaurants()
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async (query) => {
    try {
      await searchRestaurants(query)
      if (query) {
        toast.success(`Found ${restaurants.length} restaurants`)
      }
    } catch (err) {
      toast.error('Failed to search restaurants')
    }
  }

  const handleFiltersChange = async (filters) => {
    try {
      await filterRestaurants(filters)
    } catch (err) {
      toast.error('Failed to apply filters')
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Food Near You
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Order from your favorite restaurants and get it delivered fresh to your door
        </p>
        
        <div className="max-w-md mx-auto mb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search restaurants or cuisines..."
            className="w-full"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-6"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <RestaurantFilters onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Restaurant Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : restaurants.length === 0 ? (
            <EmptyState
              icon="Store"
              title="No restaurants found"
              description="Try adjusting your search or filters to find more restaurants"
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} Available
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantsPage