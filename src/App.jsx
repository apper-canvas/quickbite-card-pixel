import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import { useCart } from './hooks/useCart'
import MainLayout from './components/templates/MainLayout'
import RestaurantsPage from './pages/RestaurantsPage'
import MenuPage from './pages/MenuPage'
import FavoritesPage from './pages/FavoritesPage'
import OrdersPage from './pages/OrdersPage'
import ReviewsPage from './pages/ReviewsPage'
import PromotionsPage from './pages/PromotionsPage'
import AccountsPage from './pages/AccountsPage'
import PlaceholderPage from './components/common/PlaceholderPage'

function App() {
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

  return (
    <ThemeProvider>
      <Router>
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
            <Route path="/restaurant/:restaurantId" element={<MenuPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/account" element={<AccountsPage />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
          </Routes>
        </MainLayout>
        <Toaster 
          position="top-right"
richColors 
          closeButton
          duration={3000}
        />
      </Router>
    </ThemeProvider>
  )
}

export default App