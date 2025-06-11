import { toast } from 'sonner'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock promotion data for demo purposes since promotions table not defined
const mockPromotions = [
  {
    id: 1,
    title: '20% Off First Order',
    description: 'Get 20% off your first order when you spend $25 or more',
    discount: 20,
    discountType: 'percentage',
    code: 'FIRST20',
    minOrderValue: 25,
    maxDiscount: 10,
    validUntil: '2024-12-31',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop'
  },
  {
    id: 2,
    title: 'Free Delivery Weekend',
    description: 'Free delivery on all orders this weekend',
    discount: 0,
    discountType: 'free_delivery',
    code: 'FREEDEL',
    minOrderValue: 15,
    maxDiscount: 5,
    validUntil: '2024-12-15',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop'
  },
  {
    id: 3,
    title: '$5 Off Italian Food',
    description: 'Save $5 on orders from Italian restaurants',
    discount: 5,
    discountType: 'fixed',
    code: 'ITALIAN5',
    minOrderValue: 20,
    maxDiscount: 5,
    validUntil: '2024-12-20',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=200&fit=crop'
  }
]

export const promotionService = {
  async getAllPromotions() {
    await delay(300)
    try {
      // Since promotions table is not defined in the database schema,
      // using mock data for demo purposes
      const activePromotions = mockPromotions.filter(promo => 
        promo.isActive && new Date(promo.validUntil) > new Date()
      )
      
      return {
        success: true,
        data: activePromotions
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
      return {
        success: false,
        error: 'Failed to fetch promotions'
      }
    }
  },

  async getPromotionById(id) {
    await delay(200)
    try {
      const promotion = mockPromotions.find(promo => promo.id === parseInt(id))
      
      if (!promotion) {
        return {
          success: false,
          error: 'Promotion not found'
        }
      }
      
      return {
        success: true,
        data: promotion
      }
    } catch (error) {
      console.error('Error fetching promotion:', error)
      return {
        success: false,
        error: 'Failed to fetch promotion'
      }
    }
  },

  async validatePromoCode(code, orderValue) {
    await delay(200)
    try {
      const promotion = mockPromotions.find(promo => 
        promo.code.toLowerCase() === code.toLowerCase() && 
        promo.isActive &&
        new Date(promo.validUntil) > new Date()
      )
      
      if (!promotion) {
        return {
          success: false,
          error: 'Invalid or expired promo code'
        }
      }
      
      if (orderValue < promotion.minOrderValue) {
        return {
          success: false,
          error: `Minimum order value of $${promotion.minOrderValue} required`
        }
      }
      
      let discountAmount = 0
      
      switch (promotion.discountType) {
        case 'percentage':
          discountAmount = Math.min(
            (orderValue * promotion.discount) / 100,
            promotion.maxDiscount
          )
          break
        case 'fixed':
          discountAmount = promotion.discount
          break
        case 'free_delivery':
          discountAmount = promotion.maxDiscount // Delivery fee amount
          break
        default:
          discountAmount = 0
      }
      
      return {
        success: true,
        data: {
          promotion,
          discountAmount,
          finalAmount: orderValue - discountAmount
        }
      }
    } catch (error) {
      console.error('Error validating promo code:', error)
      return {
        success: false,
        error: 'Failed to validate promo code'
      }
    }
  },

  async applyPromotion(code, orderData) {
    await delay(200)
    try {
      const validation = await this.validatePromoCode(code, orderData.subtotal)
      
      if (!validation.success) {
        return validation
      }
      
      const { promotion, discountAmount } = validation.data
      
      const updatedOrder = {
        ...orderData,
        promoCode: code,
        promoDiscount: discountAmount,
        promoType: promotion.discountType,
        total: orderData.subtotal + orderData.deliveryFee + orderData.serviceFee - discountAmount
      }
      
      return {
        success: true,
        data: updatedOrder
      }
    } catch (error) {
      console.error('Error applying promotion:', error)
      return {
        success: false,
        error: 'Failed to apply promotion'
      }
    }
  },

  async getRestaurantPromotions(restaurantId) {
    await delay(200)
    try {
      // In a real app, this would filter promotions by restaurant
      // For demo purposes, return all active promotions
      const activePromotions = mockPromotions.filter(promo => 
        promo.isActive && new Date(promo.validUntil) > new Date()
      )
      
      return {
        success: true,
        data: activePromotions
      }
    } catch (error) {
      console.error('Error fetching restaurant promotions:', error)
      return {
        success: false,
        error: 'Failed to fetch restaurant promotions'
      }
    }
  },

  async getFeaturedPromotions() {
    await delay(200)
    try {
      // Return the most valuable promotions as featured
      const featuredPromotions = mockPromotions
        .filter(promo => promo.isActive && new Date(promo.validUntil) > new Date())
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 3)
      
      return {
        success: true,
        data: featuredPromotions
      }
    } catch (error) {
      console.error('Error fetching featured promotions:', error)
      return {
        success: false,
        error: 'Failed to fetch featured promotions'
      }
    }
  }
}

export default promotionService