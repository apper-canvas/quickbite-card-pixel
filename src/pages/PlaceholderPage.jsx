import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import ApperIcon from '../components/ApperIcon'
import { Link } from 'react-router-dom'

const PlaceholderPage = ({ featureName }) => {
  const getFeatureIcon = (feature) => {
    const iconMap = {
      'Orders': 'ShoppingBag',
      'Favorites': 'Heart',
      'Promotions': 'Tag',
      'Account': 'User',
      'Analytics': 'BarChart3',
      'Settings': 'Settings'
    }
    return iconMap[feature] || 'Smile'
  }

  const getFeatureDescription = (feature) => {
    const descriptions = {
      'Orders': 'Track your current and past orders with real-time delivery updates',
      'Favorites': 'Save your favorite restaurants and dishes for quick ordering',
      'Promotions': 'Discover exclusive deals, coupons, and special offers',
      'Account': 'Manage your profile, payment methods, and delivery addresses',
      'Analytics': 'View detailed insights about your ordering patterns',
      'Settings': 'Customize your app preferences and notification settings'
    }
    return descriptions[feature] || 'This exciting feature is in development'
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mx-auto w-20 h-20 gradient-orange rounded-full flex items-center justify-center mb-6"
            >
              <ApperIcon 
                name={getFeatureIcon(featureName)} 
                className="h-10 w-10 text-white" 
              />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {featureName}
            </h1>
            
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
              Coming Soon
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {getFeatureDescription(featureName)}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Ask AI to implement this feature and bring it to life!
            </p>

            <div className="space-y-3">
              <Link to="/restaurants" className="w-full">
                <Button className="w-full gradient-orange border-0 text-white hover:opacity-90">
                  Browse Restaurants
                </Button>
              </Link>
              
              <Link to="/" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default PlaceholderPage