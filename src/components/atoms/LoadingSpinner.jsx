import React from 'react'
import ApperIcon from '../ApperIcon'
import { cn } from '../../lib/utils'

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <ApperIcon 
      name="Loader2" 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  )
}

export default LoadingSpinner