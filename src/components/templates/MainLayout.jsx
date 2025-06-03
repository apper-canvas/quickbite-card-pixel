import React from 'react'
import Navigation from '../organisms/Navigation'
import { useCart } from '../../hooks/useCart'
import CartSidebar from '../organisms/CartSidebar'

const MainLayout = ({ children }) => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation cartItemCount={getCartItemCount()} />
      
      <main className="pb-20">
        {React.cloneElement(children, { addToCart })}
      </main>

      <CartSidebar
        cartItems={cartItems}
        cartTotal={getCartTotal()}
        cartItemCount={getCartItemCount()}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </div>
  )
}

export default MainLayout