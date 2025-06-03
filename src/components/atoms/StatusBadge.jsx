import React from 'react'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'

const StatusBadge = ({ status, variant = 'default', className, children }) => {
  const statusVariants = {
    open: 'bg-green-100 text-green-800 hover:bg-green-100',
    closed: 'bg-red-100 text-red-800 hover:bg-red-100',
    busy: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    popular: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    new: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  }

  return (
    <Badge 
      variant={variant}
      className={cn(
        statusVariants[status],
        'text-xs font-medium',
        className
      )}
    >
      {children}
    </Badge>
  )
}

export default StatusBadge