import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  const cart = useCart()

  return (
    <ThemeProvider>
      <Router>
        <MainLayout 
          cartItems={cart.cartItems}
          cartTotal={cart.getCartTotal()}
          cartItemCount={cart.getCartItemCount()}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.removeFromCart}
          clearCart={cart.clearCart}
          addToCart={cart.addToCart}
        >
<Routes>
            <Route path="/" element={<RestaurantsPage />} />
            <Route path="/restaurant/:restaurantId" element={<MenuPage addToCart={cart.addToCart} />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/account" element={<AccountsPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  )
}

export default App