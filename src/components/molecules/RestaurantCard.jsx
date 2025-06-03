import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import ApperIcon from '../ApperIcon'
import RatingDisplay from '../atoms/RatingDisplay'
import StatusBadge from '../atoms/StatusBadge'
import { useNavigate } from 'react-router-dom'

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate()
  const [isRestaurantFavorite, setIsRestaurantFavorite] = useState(false)

  const handleViewMenu = () => {
    navigate(`/menu/${restaurant.id}`)
  }

  const handleFavoriteClick = () => {
    setIsRestaurantFavorite(!isRestaurantFavorite)
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
            variant={isRestaurantFavorite ? "default" : "secondary"}
            className={`h-8 w-8 p-0 ${
              isRestaurantFavorite 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-600'
            }`}
            onClick={handleFavoriteClick}
          >
            <ApperIcon 
              name="Heart" 
              className={`h-4 w-4 ${isRestaurantFavorite ? 'fill-current' : ''}`} 
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
        
        <Button 
          onClick={handleViewMenu}
          disabled={!restaurant.isOpen}
          className="w-full gradient-orange border-0 text-white hover:opacity-90"
        >
          {restaurant.isOpen ? 'View Menu' : 'Closed'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default RestaurantCard