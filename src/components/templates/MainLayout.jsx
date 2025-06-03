import React from 'react'
import Navigation from '../organisms/Navigation'
import CartSidebar from '../organisms/CartSidebar'

const MainLayout = ({ 
  children, 
  cartItems, 
  cartTotal, 
  cartItemCount, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  addToCart 
}) => {
  // Clone children and pass addToCart prop to pages that need it
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.name === 'MenuPage') {
      return React.cloneElement(child, { addToCart })
    }
    return child
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {childrenWithProps || children}
      </main>
      <CartSidebar 
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartItemCount={cartItemCount}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </div>
  )
}

export default MainLayout