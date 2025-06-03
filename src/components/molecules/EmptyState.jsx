import React from 'react'
import ApperIcon from '../ApperIcon'

const EmptyState = ({ 
  icon = 'Package', 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {action && action}
    </div>
  )
}

export default EmptyState