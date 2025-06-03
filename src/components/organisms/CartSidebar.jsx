import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import ApperIcon from '../ApperIcon'
import CartItem from '../molecules/CartItem'
import EmptyState from '../molecules/EmptyState'
import PriceDisplay from '../atoms/PriceDisplay'

const CartSidebar = ({ 
  cartItems, 
  cartTotal, 
  cartItemCount, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  const deliveryFee = 2.99
  const serviceFee = 1.50
  const finalTotal = cartTotal + deliveryFee + serviceFee

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 gradient-orange border-0 text-white h-14 w-14 rounded-full shadow-lg hover:opacity-90 z-40">
          <div className="relative">
            <ApperIcon name="ShoppingCart" className="h-6 w-6" />
            {cartItemCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-white text-primary"
              >
                {cartItemCount}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Your Order
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <EmptyState
              icon="ShoppingCart"
              title="Your cart is empty"
              description="Add some delicious items from the menu to get started"
            />
          ) : (
            <>
<div className="space-y-1">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                  />
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <PriceDisplay price={cartTotal} size="sm" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <PriceDisplay price={deliveryFee} size="sm" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <PriceDisplay price={serviceFee} size="sm" />
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <PriceDisplay price={finalTotal} size="lg" />
                </div>
              </div>

              <Button 
                className="w-full mt-6 gradient-orange border-0 text-white hover:opacity-90"
                size="lg"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout • <PriceDisplay price={finalTotal} />
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartSidebar