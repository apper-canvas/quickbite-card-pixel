import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import ApperIcon from '../ApperIcon'
import { NAVIGATION_ITEMS } from '../../constants/navigation'
import { useTheme } from '../../context/ThemeContext'

const Navigation = ({ cartItemCount = 0 }) => {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActivePath = (path) => {
    if (path === '/restaurants') {
      return location.pathname === '/' || location.pathname === '/restaurants'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 gradient-orange rounded-lg flex items-center justify-center">
              <ApperIcon name="Utensils" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">QuickBite</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Link key={item.id} to={item.path}>
                <Button
                  variant={isActivePath(item.path) ? 'default' : 'ghost'}
                  className={`flex items-center gap-2 ${
                    isActivePath(item.path) 
                      ? 'gradient-orange border-0 text-white' 
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
                  {item.id === 'orders' && cartItemCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              <ApperIcon 
                name={theme === 'light' ? 'Moon' : 'Sun'} 
                className="h-4 w-4" 
              />
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
            >
              <ApperIcon name="Menu" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden border-t bg-white/90 backdrop-blur-md">
          <div className="flex justify-around py-2">
            {NAVIGATION_ITEMS.slice(0, 4).map((item) => (
              <Link key={item.id} to={item.path} className="flex-1">
                <Button
                  variant="ghost"
                  className={`w-full flex flex-col items-center gap-1 h-auto py-2 ${
                    isActivePath(item.path) ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  <div className="relative">
                    <ApperIcon name={item.icon} className="h-5 w-5" />
                    {item.id === 'orders' && cartItemCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navigation