import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import ApperIcon from '../components/ApperIcon'
import SearchBar from '../components/molecules/SearchBar'
import ReviewCard from '../components/molecules/ReviewCard'
import PhotoUpload from '../components/molecules/PhotoUpload'
import EmptyState from '../components/molecules/EmptyState'
import LoadingSpinner from '../components/atoms/LoadingSpinner'
import { reviewService } from '../services/api/reviewService'
import { restaurantService } from '../services/api/restaurantService'
import { toast } from 'sonner'

const ReviewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reviews, setReviews] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [restaurantFilter, setRestaurantFilter] = useState(searchParams.get('restaurant') || '')
  const [photosFilter, setPhotosFilter] = useState(false)

  // Review form
  const [reviewForm, setReviewForm] = useState({
    restaurantId: searchParams.get('restaurant') || '',
    rating: 5,
    comment: '',
    userName: 'Current User',
    photos: []
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchParams.get('restaurant')) {
      setActiveTab('add')
      setReviewForm(prev => ({ ...prev, restaurantId: searchParams.get('restaurant') }))
    }
  }, [searchParams])

  const loadData = async () => {
    setLoading(true)
    try {
      const [reviewsResult, restaurantsResult] = await Promise.all([
        reviewService.getAllReviews(),
        restaurantService.getAllRestaurants()
      ])

      if (reviewsResult.success) {
        setReviews(reviewsResult.data)
      }

      if (restaurantsResult.success) {
        setRestaurants(restaurantsResult.data)
      }
    } catch (error) {
      toast.error('Failed to load data')
    }
    setLoading(false)
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      loadData()
      return
    }

    try {
      const result = await reviewService.searchReviews(query)
      if (result.success) {
        setReviews(result.data)
      }
    } catch (error) {
      toast.error('Failed to search reviews')
    }
  }

  const applyFilters = async () => {
    const filters = {}
    
    if (ratingFilter) filters.rating = parseInt(ratingFilter)
    if (restaurantFilter) filters.restaurantId = restaurantFilter
    if (photosFilter) filters.hasPhotos = true

    try {
      const result = await reviewService.filterReviews(filters)
      if (result.success) {
        setReviews(result.data)
        toast.success('Filters applied')
      }
    } catch (error) {
      toast.error('Failed to apply filters')
    }
  }

  const clearFilters = () => {
    setRatingFilter('')
    setRestaurantFilter('')
    setPhotosFilter(false)
    setSearchQuery('')
    loadData()
    toast.success('Filters cleared')
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!reviewForm.restaurantId) {
      toast.error('Please select a restaurant')
      return
    }

    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment')
      return
    }

    setSubmitting(true)

    try {
      const result = await reviewService.addReview(reviewForm)
      
      if (result.success) {
        toast.success('Review submitted successfully!')
        setReviewForm({
          restaurantId: '',
          rating: 5,
          comment: '',
          userName: 'Current User',
          photos: []
        })
        setActiveTab('all')
        loadData()
      } else {
        toast.error(result.error || 'Failed to submit review')
      }
    } catch (error) {
      toast.error('Failed to submit review')
    }

    setSubmitting(false)
  }

  const handleDeleteReview = async (reviewId) => {
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return

    try {
      const result = await reviewService.deleteReview(reviewId, review.restaurantId)
      if (result.success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId))
        toast.success('Review deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId)
    return restaurant?.name || 'Unknown Restaurant'
  }

  const filteredReviews = reviews.filter(review => {
    if (searchQuery && !review.comment.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Restaurant Reviews
        </h1>
        <p className="text-lg text-gray-600">
          Share your dining experiences and discover what others are saying
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <ApperIcon name="MessageSquare" className="h-4 w-4" />
            All Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            Write Review
          </TabsTrigger>
        </TabsList>

        {/* All Reviews Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Filter" className="h-5 w-5" />
                Search & Filter Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search reviews..."
                    className="w-full"
                  />
                </div>
                <Button onClick={applyFilters} className="md:w-auto">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="md:w-auto">
                  Clear
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Minimum Rating</Label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                      <SelectItem value="1">1+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Restaurant</Label>
                  <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All restaurants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All restaurants</SelectItem>
                      {restaurants.map(restaurant => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={photosFilter}
                      onChange={(e) => setPhotosFilter(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">With photos only</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <EmptyState
              icon="MessageSquare"
              title="No reviews found"
              description="Be the first to write a review or adjust your search filters"
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {filteredReviews.length} Review{filteredReviews.length !== 1 ? 's' : ''}
              </h2>
              {filteredReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onDelete={handleDeleteReview}
                  showRestaurant={true}
                  restaurantName={getRestaurantName(review.restaurantId)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Add Review Tab */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Star" className="h-5 w-5" />
                Write a Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <Label htmlFor="restaurant">Restaurant *</Label>
                  <Select 
                    value={reviewForm.restaurantId} 
                    onValueChange={(value) => setReviewForm(prev => ({ ...prev, restaurantId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map(restaurant => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          <div className="flex items-center gap-2">
                            <span>{restaurant.name}</span>
                            <span className="text-sm text-gray-500">
                              ({restaurant.cuisine.join(', ')})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rating *</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className={`p-1 hover:scale-110 transition-transform ${
                          star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <ApperIcon 
                          name="Star" 
                          className={`h-6 w-6 ${star <= reviewForm.rating ? 'fill-current' : ''}`} 
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this restaurant..."
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>

                <div>
                  <Label>Add Photos (Optional)</Label>
                  <div className="mt-2">
                    <PhotoUpload
                      onPhotosChange={(photos) => setReviewForm(prev => ({ ...prev, photos }))}
                      maxFiles={5}
                      existingPhotos={reviewForm.photos}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 gradient-orange border-0 text-white"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setReviewForm({
                        restaurantId: '',
                        rating: 5,
                        comment: '',
                        userName: 'Current User',
                        photos: []
                      })
                      toast.success('Form cleared')
                    }}
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReviewsPage