import React from 'react'
import { cn } from '../../lib/utils'

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  size = 'md', 
  className,
  showCurrency = true 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const formatPrice = (price) => {
    return showCurrency ? `$${price.toFixed(2)}` : price.toFixed(2)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-semibold text-gray-900', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={cn('line-through text-gray-500', sizeClasses[size])}>
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  )
}

export default PriceDisplay