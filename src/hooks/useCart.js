import { useState } from 'react'

export const useCart = () => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (item, customizations = [], quantity = 1) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      customizations,
      quantity,
      totalPrice: calculateItemPrice(item, customizations, quantity)
    }

    setCartItems(prev => [...prev, cartItem])
  }

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId))
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: calculateItemPrice(item.menuItem, item.customizations, newQuantity)
        }
      }
      return item
    }))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const calculateItemPrice = (menuItem, customizations, quantity) => {
    let basePrice = menuItem.price
    let customizationPrice = 0

    customizations.forEach(customization => {
      customizationPrice += customization.price || 0
    })

    return (basePrice + customizationPrice) * quantity
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  }
}