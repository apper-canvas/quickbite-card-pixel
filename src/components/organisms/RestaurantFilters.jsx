import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import ApperIcon from '../ApperIcon'

const RestaurantFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    cuisine: [],
    rating: [0],
    maxDeliveryTime: [60],
    isOpen: true
  })

  const cuisineOptions = [
    'Italian', 'Indian', 'American', 'Japanese', 'Mexican', 
    'Chinese', 'Thai', 'Mediterranean', 'Fast Food'
  ]

  const handleCuisineToggle = (cuisine) => {
    const newCuisines = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter(c => c !== cuisine)
      : [...filters.cuisine, cuisine]
    
    const newFilters = { ...filters, cuisine: newCuisines }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleRatingChange = (value) => {
    const newFilters = { ...filters, rating: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDeliveryTimeChange = (value) => {
    const newFilters = { ...filters, maxDeliveryTime: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleOpenToggle = (checked) => {
    const newFilters = { ...filters, isOpen: checked }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      cuisine: [],
      rating: [0],
      maxDeliveryTime: [60],
      isOpen: true
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Filters</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          <ApperIcon name="X" className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Open/Closed Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="open-toggle" className="text-sm font-medium">
            Open restaurants only
          </Label>
          <Switch
            id="open-toggle"
            checked={filters.isOpen}
            onCheckedChange={handleOpenToggle}
          />
        </div>

        {/* Cuisine Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Cuisine Type</Label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <Badge
                key={cuisine}
                variant={filters.cuisine.includes(cuisine) ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors ${
                  filters.cuisine.includes(cuisine)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCuisineToggle(cuisine)}
              >
                {cuisine}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Minimum Rating: {filters.rating[0]}+
          </Label>
          <Slider
            value={filters.rating}
            onValueChange={handleRatingChange}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Delivery Time Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Max Delivery Time: {filters.maxDeliveryTime[0]} min
          </Label>
          <Slider
            value={filters.maxDeliveryTime}
            onValueChange={handleDeliveryTimeChange}
            max={60}
            min={15}
            step={5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default RestaurantFilters