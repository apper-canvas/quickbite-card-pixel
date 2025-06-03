import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { Separator } from '../components/ui/separator'
import ApperIcon from '../components/ApperIcon'
import EmptyState from '../components/molecules/EmptyState'
import PriceDisplay from '../components/atoms/PriceDisplay'
import StatusBadge from '../components/atoms/StatusBadge'
import LoadingSpinner from '../components/atoms/LoadingSpinner'
import { orderService } from '../services/api/orderService'
import { useCart } from '../hooks/useCart'
import { toast } from 'sonner'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const { addToCart } = useCart()

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterAndSortOrders()
  }, [orders, statusFilter, sortBy])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const orderData = await orderService.getOrders()
      setOrders(orderData)
    } catch (error) {
      toast.error('Failed to load orders')
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortOrders = () => {
    let filtered = [...orders]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'total-high':
          return b.total - a.total
        case 'total-low':
          return a.total - b.total
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }

  const handleReorder = async (order) => {
    try {
      // Add all items from the order to cart
      order.items.forEach(item => {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          restaurantId: order.restaurantId,
          restaurantName: order.restaurantName
        }, item.quantity)
      })
      
      toast.success(`${order.items.length} items added to cart`)
    } catch (error) {
      toast.error('Failed to add items to cart')
      console.error('Error reordering:', error)
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'cancelled')
      await loadOrders()
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel order')
      console.error('Error cancelling order:', error)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'confirmed':
        return 'default'
      case 'preparing':
        return 'secondary'
      case 'out-for-delivery':
        return 'default'
      case 'delivered':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'
      case 'confirmed':
        return 'text-blue-600'
      case 'preparing':
        return 'text-orange-600'
      case 'out-for-delivery':
        return 'text-purple-600'
      case 'delivered':
        return 'text-green-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status)
  }

  const canReorder = (order) => {
    return ['delivered', 'cancelled'].includes(order.status)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track your order history and current orders</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="total-high">Highest Total</SelectItem>
              <SelectItem value="total-low">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="ShoppingBag" className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter(order => ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(order.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {orders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="DollarSign" className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  <PriceDisplay 
                    price={orders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + order.total, 0)} 
                  />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon="ShoppingBag"
          title="No orders found"
          description={statusFilter === 'all' 
            ? "You haven't placed any orders yet. Start browsing restaurants to place your first order!"
            : `No orders found with status "${statusFilter}". Try adjusting your filters.`
          }
          actionLabel="Browse Restaurants"
          onAction={() => window.location.href = '/restaurants'}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                        {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.restaurantName} • {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      <PriceDisplay price={order.total} />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <div className="flex-1">
                        <span className="text-sm font-medium">{item.quantity}x {item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        <PriceDisplay price={item.price * item.quantity} />
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* Order Summary */}
                <div className="space-y-1 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <PriceDisplay price={order.subtotal} />
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <PriceDisplay price={order.deliveryFee} />
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <PriceDisplay price={order.serviceFee} />
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <PriceDisplay price={order.total} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {canReorder(order) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="RotateCcw" className="h-4 w-4" />
                      Reorder
                    </Button>
                  )}

                  {canCancelOrder(order) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <ApperIcon name="X" className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Order</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Cancel Order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ApperIcon name="MessageCircle" className="h-4 w-4" />
                    Contact Support
                  </Button>

                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ApperIcon name="FileText" className="h-4 w-4" />
                    View Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage