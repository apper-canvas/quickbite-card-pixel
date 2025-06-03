import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import PriceDisplay from '../atoms/PriceDisplay'

const MenuItemCard = ({ item, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(item)
  }

  return (
    <Card className="food-card-hover overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <PriceDisplay price={item.price} size="lg" />
            <Button 
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              size="sm"
              className="gradient-orange border-0 text-white hover:opacity-90"
            >
              {item.isAvailable ? 'Add' : 'Unavailable'}
            </Button>
          </div>
        </div>
        {item.image && (
          <div className="w-24 h-24 m-4">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default MenuItemCard