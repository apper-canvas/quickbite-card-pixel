import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import ApperIcon from '../components/ApperIcon'
import SearchBar from '../components/molecules/SearchBar'
import EmptyState from '../components/molecules/EmptyState'
import LoadingSpinner from '../components/atoms/LoadingSpinner'
import { promotionService } from '../services/api/promotionService'
import { toast } from 'sonner'

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([])
  const [filteredPromotions, setFilteredPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPromotion, setSelectedPromotion] = useState(null)

  useEffect(() => {
    loadPromotions()
  }, [])

  useEffect(() => {
    filterPromotions()
  }, [promotions, searchQuery, selectedRestaurant, selectedType])

  const loadPromotions = async () => {
    try {
      setLoading(true)
      const data = await promotionService.getPromotions()
      setPromotions(data)
    } catch (error) {
      console.error('Failed to load promotions:', error)
      toast.error('Failed to load promotions')
    } finally {
      setLoading(false)
    }
  }

  const filterPromotions = () => {
    let filtered = promotions

    if (searchQuery) {
      filtered = filtered.filter(promotion =>
        promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promotion.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedRestaurant !== 'all') {
      filtered = filtered.filter(promotion => promotion.restaurantId === selectedRestaurant)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(promotion => promotion.type === selectedType)
    }

    setFilteredPromotions(filtered)
  }

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Promotion code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy promotion code')
    }
  }

  const handleViewDetails = (promotion) => {
    setSelectedPromotion(promotion)
  }

  const getPromotionTypeColor = (type) => {
    switch (type) {
      case 'percentage':
        return 'bg-green-100 text-green-800'
      case 'fixed_amount':
        return 'bg-blue-100 text-blue-800'
      case 'free_delivery':
        return 'bg-purple-100 text-purple-800'
      case 'buy_one_get_one':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPromotionTypeLabel = (type) => {
    switch (type) {
      case 'percentage':
        return 'Percentage Off'
      case 'fixed_amount':
        return 'Fixed Discount'
      case 'free_delivery':
        return 'Free Delivery'
      case 'buy_one_get_one':
        return 'BOGO'
      default:
        return type
    }
  }

  const formatDiscountValue = (promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.discountValue}% OFF`
      case 'fixed_amount':
        return `$${promotion.discountValue} OFF`
      case 'free_delivery':
        return 'FREE DELIVERY'
      case 'buy_one_get_one':
        return 'BUY 1 GET 1'
      default:
        return 'DISCOUNT'
    }
  }

  const isPromotionExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  const isPromotionExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000))
    return expiry <= threeDaysFromNow && expiry > today
  }

  const getUniqueRestaurants = () => {
    const restaurants = promotions.reduce((acc, promotion) => {
      if (!acc.find(r => r.id === promotion.restaurantId)) {
        acc.push({
          id: promotion.restaurantId,
          name: promotion.restaurantName
        })
      }
      return acc
    }, [])
    return restaurants.sort((a, b) => a.name.localeCompare(b.name))
  }

  const getUniqueTypes = () => {
    const types = [...new Set(promotions.map(p => p.type))]
    return types.sort()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Promotions & Deals</h1>
        <p className="text-muted-foreground">
          Discover amazing deals and save on your favorite restaurants
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search promotions, restaurants..."
          className="max-w-md"
        />

        <div className="flex flex-wrap gap-4">
          <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Restaurants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
              {getUniqueRestaurants().map(restaurant => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {getUniqueTypes().map(type => (
                <SelectItem key={type} value={type}>
                  {getPromotionTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Promotions Grid */}
      {filteredPromotions.length === 0 ? (
        <EmptyState
          icon="Tag"
          title="No promotions found"
          description={searchQuery || selectedRestaurant !== 'all' || selectedType !== 'all' 
            ? "Try adjusting your search or filters" 
            : "Check back later for new deals and promotions"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map(promotion => (
            <Card 
              key={promotion.id} 
              className={`relative overflow-hidden ${isPromotionExpired(promotion.expiryDate) ? 'opacity-50' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPromotionTypeColor(promotion.type)}>
                        {getPromotionTypeLabel(promotion.type)}
                      </Badge>
                      {isPromotionExpiringSoon(promotion.expiryDate) && !isPromotionExpired(promotion.expiryDate) && (
                        <Badge variant="destructive">Expires Soon</Badge>
                      )}
                      {isPromotionExpired(promotion.expiryDate) && (
                        <Badge variant="outline">Expired</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mb-1">{promotion.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{promotion.restaurantName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatDiscountValue(promotion)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {promotion.description}
                </p>

                <div className="space-y-2 text-xs text-muted-foreground">
                  {promotion.minimumOrder > 0 && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="DollarSign" size={12} />
                      <span>Min. order: ${promotion.minimumOrder}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Calendar" size={12} />
                    <span>Expires: {new Date(promotion.expiryDate).toLocaleDateString()}</span>
                  </div>
                  {promotion.usageLimit > 0 && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Users" size={12} />
                      <span>Limited to {promotion.usageLimit} uses</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(promotion)}
                  >
                    <ApperIcon name="Eye" size={16} className="mr-1" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyCode(promotion.code)}
                    disabled={isPromotionExpired(promotion.expiryDate)}
                  >
                    <ApperIcon name="Copy" size={16} className="mr-1" />
                    Copy Code
                  </Button>
                </div>

                <div className="bg-muted p-2 rounded text-center">
                  <span className="text-sm font-mono font-medium">{promotion.code}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Promotion Details Modal */}
      {selectedPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedPromotion.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPromotion(null)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Restaurant</h3>
                  <p className="text-muted-foreground">{selectedPromotion.restaurantName}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedPromotion.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Discount</h3>
                  <p className="text-lg font-bold text-primary">
                    {formatDiscountValue(selectedPromotion)}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Terms & Conditions</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedPromotion.minimumOrder > 0 && (
                      <li>• Minimum order amount: ${selectedPromotion.minimumOrder}</li>
                    )}
                    <li>• Valid until: {new Date(selectedPromotion.expiryDate).toLocaleDateString()}</li>
                    {selectedPromotion.usageLimit > 0 && (
                      <li>• Limited to {selectedPromotion.usageLimit} uses per customer</li>
                    )}
                    <li>• Cannot be combined with other promotions</li>
                    <li>• Valid for delivery and pickup orders</li>
                  </ul>
                </div>

                <div className="bg-muted p-3 rounded text-center">
                  <p className="text-sm font-medium mb-2">Promotion Code</p>
                  <p className="text-lg font-mono font-bold">{selectedPromotion.code}</p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleCopyCode(selectedPromotion.code)}
                  disabled={isPromotionExpired(selectedPromotion.expiryDate)}
                >
                  <ApperIcon name="Copy" size={16} className="mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromotionsPage