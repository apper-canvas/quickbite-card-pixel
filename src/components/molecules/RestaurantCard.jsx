import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import ApperIcon from '../ApperIcon'
import RatingDisplay from '../atoms/RatingDisplay'
import StatusBadge from '../atoms/StatusBadge'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'

const RestaurantCard = ({ restaurant, showReviews = false, reviews = [] }) => {
  const navigate = useNavigate()
const { toggleFavorite, isFavorite } = useFavorites()

  const handleViewMenu = () => {
    navigate(`/restaurant/${restaurant.id}`)
  }
  const handleFavoriteClick = () => {
    toggleFavorite(restaurant)
  }

  const handleViewReviews = () => {
    navigate(`/restaurant/${restaurant.id}/reviews`)
  }
  return (
    <Card className="food-card-hover overflow-hidden">
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-48 object-cover"
/>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant={isFavorite(restaurant.id) ? "default" : "secondary"}
            className={`h-8 w-8 p-0 ${
              isFavorite(restaurant.id) 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-600'
            }`}
            onClick={handleFavoriteClick}
          >
            <ApperIcon 
              name="Heart" 
              className={`h-4 w-4 ${isFavorite(restaurant.id) ? 'fill-current' : ''}`} 
            />
          </Button>
          <StatusBadge status={restaurant.isOpen ? 'open' : 'closed'}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </StatusBadge>
        </div>
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90">
              {restaurant.tags[0]}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{restaurant.name}</h3>
          <RatingDisplay rating={restaurant.rating} />
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {restaurant.cuisine.join(', ')}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="DollarSign" className="h-4 w-4" />
            <span>${restaurant.deliveryFee}</span>
          </div>
<div className="flex items-center gap-1">
            <ApperIcon name="ShoppingBag" className="h-4 w-4" />
            <span>Min ${restaurant.minimumOrder}</span>
          </div>
        </div>

        {showReviews && reviews.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              <button 
                onClick={handleViewReviews}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                View All
              </button>
            </div>
            {reviews[0] && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                "{reviews[0].comment}"
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleViewMenu}
            disabled={!restaurant.isOpen}
            className="flex-1 gradient-orange border-0 text-white hover:opacity-90"
          >
            {restaurant.isOpen ? 'View Menu' : 'Closed'}
          </Button>
          {showReviews && (
            <Button 
              variant="outline"
              size="sm"
              onClick={handleViewReviews}
              className="px-3"
            >
              <ApperIcon name="Star" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RestaurantCard