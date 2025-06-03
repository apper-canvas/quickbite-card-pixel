import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import ApperIcon from '../ApperIcon'
import RatingDisplay from '../atoms/RatingDisplay'
import { toast } from 'sonner'

const ReviewCard = ({ review, onDelete, showRestaurant = false, restaurantName = '' }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleHelpful = async () => {
    try {
      // In a real app, this would call an API
      toast.success('Thank you for your feedback!')
    } catch (error) {
      toast.error('Failed to update helpful count')
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDelete(review.id)
      toast.success('Review deleted successfully')
    }
  }

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="review-card">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                {getUserInitials(review.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-gray-900">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <RatingDisplay rating={review.rating} />
                <span className="text-sm text-gray-500">
                  {formatDate(review.date)}
                </span>
              </div>
              {showRestaurant && restaurantName && (
                <p className="text-sm text-gray-600 mt-1">
                  <ApperIcon name="Store" className="h-3 w-3 inline mr-1" />
                  {restaurantName}
                </p>
              )}
            </div>
          </div>
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Review Content */}
        <div className="space-y-4">
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900">
                Photos ({review.photos.length})
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {review.photos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={photo.preview || photo.url || photo}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onClick={() => {
                        // In a real app, this would open a lightbox
                        window.open(photo.preview || photo.url || photo, '_blank')
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="ThumbsUp" className="h-4 w-4 mr-1" />
            Helpful {review.helpful > 0 && `(${review.helpful})`}
          </Button>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ApperIcon name="MessageSquare" className="h-3 w-3" />
            <span>Review #{review.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewCard