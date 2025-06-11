import React, { createContext, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, BrowserRouter as Router } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import { useCart } from './hooks/useCart'
import { setUser, clearUser } from './store/userSlice'
import { store } from './store'
import MainLayout from './components/templates/MainLayout'
import RestaurantsPage from './pages/RestaurantsPage'
import MenuPage from './pages/MenuPage'
import FavoritesPage from './pages/FavoritesPage'
import OrdersPage from './pages/OrdersPage'
import ReviewsPage from './pages/ReviewsPage'
import Signup from './pages/Signup'
import PromotionsPage from './pages/PromotionsPage'
import AccountsPage from './pages/AccountsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import Login from './pages/Login'
import Callback from './pages/Callback'
import ErrorPage from './pages/ErrorPage'

// Create auth context
export const AuthContext = createContext(null)

function AppContent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false
  
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  } = useCart()

  const cartTotal = getCartTotal()
  const cartItemCount = getCartItemCount()
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true)
// CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search
        let redirectPath = (typeof URLSearchParams !== 'undefined' ? new URLSearchParams(window.location.search) : new URL(window.location).searchParams).get('redirect')
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error')
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath)
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath)
            } else {
              navigate('/')
            }
          } else {
            navigate('/')
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))))
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            )
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`)
            } else {
              navigate(currentPath)
            }
          } else if (isAuthPage) {
            navigate(currentPath)
          } else {
            navigate('/login')
          }
          dispatch(clearUser())
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
        setIsInitialized(true)
      }
    })
  }, [navigate, dispatch])
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center min-h-screen">Initializing application...</div>
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          {isAuthenticated ? (
            <Route path="/*" element={
              <MainLayout
                cartItems={cartItems}
                cartTotal={cartTotal}
                cartItemCount={cartItemCount}
                addToCart={addToCart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
              >
                <Routes>
                  <Route path="/" element={<RestaurantsPage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurant/:restaurantId" element={<MenuPage addToCart={addToCart} />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/promotions" element={<PromotionsPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/account" element={<AccountsPage />} />
                  <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
                </Routes>
              </MainLayout>
            } />
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
        <Toaster 
          position="top-right"
          richColors 
          closeButton
          duration={3000}
        />
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

export default App