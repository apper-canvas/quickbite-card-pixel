import React from 'react'
import ApperIcon from '../ApperIcon'

const RatingDisplay = ({ rating, showNumber = true, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex items-center gap-1">
      <ApperIcon 
        name="Star" 
        className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} 
      />
      {showNumber && (
        <span className={`font-medium text-gray-700 ${textSizes[size]}`}>
          {rating}
        </span>
      )}
    </div>
  )
}

export default RatingDisplay