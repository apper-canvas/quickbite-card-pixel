import React from 'react'
import { Button } from '../ui/button'
import ApperIcon from '../ApperIcon'
import PriceDisplay from '../atoms/PriceDisplay'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrease = () => {
    onUpdateQuantity(item.id, item.quantity - 1)
  }

  const handleRemove = () => {
    onRemove(item.id)
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
        {item.customizations.length > 0 && (
          <p className="text-sm text-gray-600">
            {item.customizations.map(c => c.name).join(', ')}
          </p>
        )}
        <PriceDisplay price={item.totalPrice} size="sm" />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecrease}
            className="h-8 w-8 p-0"
          >
            <ApperIcon name="Minus" className="h-3 w-3" />
          </Button>
          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleIncrease}
            className="h-8 w-8 p-0"
          >
            <ApperIcon name="Plus" className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <ApperIcon name="Trash2" className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export default CartItem