import React from 'react'
import Navigation from '../organisms/Navigation'
import CartSidebar from '../organisms/CartSidebar'

const MainLayout = ({ children, cartItems, cartTotal, cartItemCount, addToCart, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  // Clone children and pass cart functions to MenuPage specifically
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type?.name === 'MenuPage') {
      return React.cloneElement(child, { addToCart })
    }
    return child
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemCount={cartItemCount} />
      
      <main className="container mx-auto px-4 py-8">
        {childrenWithProps || children}
      </main>
      
      <CartSidebar
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartItemCount={cartItemCount}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
      />
</div>
  )
}

export default MainLayout