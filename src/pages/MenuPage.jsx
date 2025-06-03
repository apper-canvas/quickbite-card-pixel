import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { menuService, restaurantService } from '../services'
import MenuItemCard from '../components/molecules/MenuItemCard'
import EmptyState from '../components/molecules/EmptyState'
import LoadingSpinner from '../components/atoms/LoadingSpinner'
import RatingDisplay from '../components/atoms/RatingDisplay'
import SearchBar from '../components/molecules/SearchBar'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import ApperIcon from '../components/ApperIcon'
import { toast } from 'sonner'

const MenuPage = ({ addToCart }) => {
  const { restaurantId } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState({})
  const [filteredMenu, setFilteredMenu] = useState({})
const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [restaurantResult, menuResult] = await Promise.all([
          restaurantService.getRestaurantById(restaurantId),
          menuService.getMenuByRestaurantId(restaurantId)
        ])

        if (!restaurantResult.success) {
          setError(restaurantResult.error)
          return
        }

        if (!menuResult.success) {
          setError(menuResult.error)
          return
        }

        setRestaurant(restaurantResult.data)
        
        // Group menu items by category
        const categorizedMenu = menuResult.data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = []
          }
          acc[item.category].push(item)
          return acc
        }, {})
        
        setMenu(categorizedMenu)
        setFilteredMenu(categorizedMenu)
      } catch (err) {
        setError('Failed to load restaurant data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [restaurantId])

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredMenu(menu)
      return
    }

    try {
      const result = await menuService.searchMenuItems(restaurantId, query)
      if (result.success) {
        // Group filtered items by category
        const categorizedFiltered = result.data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = []
          }
          acc[item.category].push(item)
          return acc
        }, {})
        setFilteredMenu(categorizedFiltered)
      }
    } catch (err) {
      toast.error('Failed to search menu items')
    }
}

  const handleAddToCart = (item) => {
    if (addToCart) {
      addToCart(item)
      toast.success(`${item.name} added to cart!`)
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon="AlertCircle"
          title="Restaurant not found"
          description={error || "The restaurant you're looking for doesn't exist"}
          action={
            <Link to="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const categories = Object.keys(filteredMenu)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="mb-8">
        <Link to="/restaurants" className="inline-flex items-center text-primary hover:underline mb-4">
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-1" />
          Back to Restaurants
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img 
              src={restaurant.image} 
              alt={restaurant.name}
              className="w-full md:w-32 h-32 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                <Badge variant={restaurant.isOpen ? 'default' : 'destructive'}>
                  {restaurant.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-3">{restaurant.cuisine.join(', ')}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <RatingDisplay rating={restaurant.rating} />
                <div className="flex items-center gap-1">
                  <ApperIcon name="Clock" className="h-4 w-4" />
                  <span>{restaurant.deliveryTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="DollarSign" className="h-4 w-4" />
                  <span>${restaurant.deliveryFee} delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="ShoppingBag" className="h-4 w-4" />
                  <span>Min ${restaurant.minimumOrder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search menu items..."
          className="max-w-md"
        />
      </div>

      {/* Menu */}
      {categories.length === 0 ? (
        <EmptyState
          icon="Utensils"
          title="No menu items found"
          description="Try adjusting your search to find items"
        />
      ) : (
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            {categories.slice(0, 3).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{category}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredMenu[category].map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}

          {/* Show remaining categories if more than 3 */}
          {categories.slice(3).map((category) => (
            <div key={category} className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredMenu[category].map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </Tabs>
      )}
    </div>
  )
}

export default MenuPage