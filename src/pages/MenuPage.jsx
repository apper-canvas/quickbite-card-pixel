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
import { Card, CardContent } from '../components/ui/card'
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
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
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
        
        console.log('Categorized menu:', categorizedMenu)
        setMenu(categorizedMenu)
        setFilteredMenu(categorizedMenu)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load restaurant data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [restaurantId])

const handleSearch = async (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredMenu(menu)
      setActiveCategory('')
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
        setActiveCategory('')
      }
    } catch (err) {
      toast.error('Failed to search menu items')
    }
  }

  const showAllCategories = () => {
    setFilteredMenu(menu)
    setActiveCategory('')
    setSearchQuery('')
  }

  const filterByCategory = (category) => {
    const filtered = { [category]: menu[category] }
    setFilteredMenu(filtered)
    setActiveCategory(category)
    setSearchQuery('')
  }

  const handleCategoryClick = (category) => {
    const element = document.getElementById(`category-${category}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

  const handleAddToCart = (item) => {
    if (addToCart) {
      addToCart(item)
      toast.success(`${item.name} added to cart!`)
    } else {
      toast.error('Cart functionality not available')
      console.warn('addToCart function not provided to MenuPage')
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
  const allCategories = Object.keys(menu)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-4">
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-1" />
          Back to Restaurants
        </Link>

        <Card className="shadow-menu">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search menu items..."
            className="max-w-md flex-1"
          />
          
          <div className="flex gap-2">
            <Button
              variant={activeCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={showAllCategories}
            >
              All Categories
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? 'default' : 'secondary'}
                className="cursor-pointer px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => filterByCategory(category)}
              >
                {category}
                {menu[category] && (
                  <span className="ml-1 text-xs opacity-70">
                    ({menu[category].length})
                  </span>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Menu Content */}
      {categories.length === 0 ? (
        <EmptyState
          icon="Utensils"
          title="No menu items found"
          description={searchQuery ? "Try adjusting your search to find items" : "This restaurant doesn't have any menu items yet"}
          action={searchQuery && (
            <Button onClick={showAllCategories}>
              Clear Search
            </Button>
          )}
        />
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} id={`category-${category}`} className="scroll-mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  {category}
                  <Badge variant="secondary" className="text-xs">
                    {filteredMenu[category].length} item{filteredMenu[category].length !== 1 ? 's' : ''}
                  </Badge>
                </h2>
                
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredMenu[category].map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    className="shadow-category hover:shadow-menu transition-shadow duration-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Navigation */}
      {categories.length > 1 && (
        <div className="fixed bottom-6 right-6 z-10">
          <Card className="backdrop-blur-sm bg-white/90 shadow-lg">
            <CardContent className="p-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 mb-1">Quick Nav</span>
                {categories.slice(0, 4).map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Button>
                ))}
                {categories.length > 4 && (
                  <span className="text-xs text-gray-400">+{categories.length - 4} more</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MenuPage