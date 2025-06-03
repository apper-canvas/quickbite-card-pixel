// Mock promotion data
const mockPromotions = [
  {
    id: '1',
    title: '20% Off Your First Order',
    description: 'Get 20% off when you order from Burger Palace for the first time. Valid on orders over $25.',
    code: 'FIRST20',
    type: 'percentage',
    discountValue: 20,
    restaurantId: '1',
    restaurantName: 'Burger Palace',
    minimumOrder: 25,
    maximumDiscount: 50,
    usageLimit: 1,
    expiryDate: '2024-12-31',
    isActive: true
  },
  {
    id: '2',
    title: 'Free Delivery Weekend',
    description: 'Enjoy free delivery on all orders from Pizza Corner during weekends.',
    code: 'FREEDEL',
    type: 'free_delivery',
    discountValue: 0,
    restaurantId: '2',
    restaurantName: 'Pizza Corner',
    minimumOrder: 15,
    maximumDiscount: 0,
    usageLimit: 0,
    expiryDate: '2024-12-25',
    isActive: true
  },
  {
    id: '3',
    title: '$10 Off Large Orders',
    description: 'Save $10 on orders over $50 from Taco Fiesta. Perfect for group orders!',
    code: 'SAVE10',
    type: 'fixed_amount',
    discountValue: 10,
    restaurantId: '3',
    restaurantName: 'Taco Fiesta',
    minimumOrder: 50,
    maximumDiscount: 0,
    usageLimit: 3,
    expiryDate: '2024-12-20',
    isActive: true
  },
  {
    id: '4',
    title: 'Buy One Get One Sushi',
    description: 'Order any sushi roll and get another one of equal or lesser value for free.',
    code: 'BOGOSUSHI',
    type: 'buy_one_get_one',
    discountValue: 50,
    restaurantId: '4',
    restaurantName: 'Sushi Express',
    minimumOrder: 20,
    maximumDiscount: 25,
    usageLimit: 2,
    expiryDate: '2024-12-30',
    isActive: true
  },
  {
    id: '5',
    title: '15% Off Asian Cuisine',
    description: 'Enjoy 15% off all orders from Asian Delight. Valid on all menu items.',
    code: 'ASIAN15',
    type: 'percentage',
    discountValue: 15,
    restaurantId: '5',
    restaurantName: 'Asian Delight',
    minimumOrder: 20,
    maximumDiscount: 30,
    usageLimit: 0,
    expiryDate: '2024-12-28',
    isActive: true
  },
  {
    id: '6',
    title: 'Free Delivery on Breakfast',
    description: 'Start your day right with free delivery on all breakfast orders before 11 AM.',
    code: 'BREAKFREE',
    type: 'free_delivery',
    discountValue: 0,
    restaurantId: '6',
    restaurantName: 'Morning Cafe',
    minimumOrder: 10,
    maximumDiscount: 0,
    usageLimit: 0,
    expiryDate: '2024-12-22',
    isActive: true
  },
  {
    id: '7',
    title: 'Happy Hour 25% Off',
    description: 'Get 25% off during happy hour (3-6 PM) at The Grill House.',
    code: 'HAPPY25',
    type: 'percentage',
    discountValue: 25,
    restaurantId: '7',
    restaurantName: 'The Grill House',
    minimumOrder: 30,
    maximumDiscount: 40,
    usageLimit: 1,
    expiryDate: '2024-12-24',
    isActive: true
  },
  {
    id: '8',
    title: '$5 Off Student Special',
    description: 'Students save $5 on orders from Campus Eats. Show your student ID!',
    code: 'STUDENT5',
    type: 'fixed_amount',
    discountValue: 5,
    restaurantId: '8',
    restaurantName: 'Campus Eats',
    minimumOrder: 15,
    maximumDiscount: 0,
    usageLimit: 5,
    expiryDate: '2024-12-31',
    isActive: true
  }
]

const STORAGE_KEY = 'quickbite_promotions'
const USED_PROMOTIONS_KEY = 'quickbite_used_promotions'

class PromotionService {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPromotions))
    }

    const usedPromotions = localStorage.getItem(USED_PROMOTIONS_KEY)
    if (!usedPromotions) {
      localStorage.setItem(USED_PROMOTIONS_KEY, JSON.stringify({}))
    }
  }

  async getPromotions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const promotions = stored ? JSON.parse(stored) : mockPromotions
      
      // Filter out expired and inactive promotions
      const activePromotions = promotions.filter(promotion => {
        const isNotExpired = new Date(promotion.expiryDate) >= new Date()
        return promotion.isActive && isNotExpired
      })

      // Sort by expiry date (soonest first)
      return activePromotions.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    } catch (error) {
      console.error('Error loading promotions:', error)
      return []
    }
  }

  async getPromotionByCode(code) {
    try {
      const promotions = await this.getPromotions()
      return promotions.find(promotion => 
        promotion.code.toLowerCase() === code.toLowerCase()
      )
    } catch (error) {
      console.error('Error finding promotion by code:', error)
      return null
    }
  }

  async validatePromotion(code, orderTotal, restaurantId = null) {
    try {
      const promotion = await this.getPromotionByCode(code)
      
      if (!promotion) {
        return {
          valid: false,
          error: 'Invalid promotion code'
        }
      }

      // Check if promotion is active
      if (!promotion.isActive) {
        return {
          valid: false,
          error: 'This promotion is no longer active'
        }
      }

      // Check expiry date
      if (new Date(promotion.expiryDate) < new Date()) {
        return {
          valid: false,
          error: 'This promotion has expired'
        }
      }

      // Check restaurant restriction
      if (restaurantId && promotion.restaurantId !== restaurantId) {
        return {
          valid: false,
          error: `This promotion is only valid for ${promotion.restaurantName}`
        }
      }

      // Check minimum order amount
      if (promotion.minimumOrder > 0 && orderTotal < promotion.minimumOrder) {
        return {
          valid: false,
          error: `Minimum order amount is $${promotion.minimumOrder}`
        }
      }

      // Check usage limit
      if (promotion.usageLimit > 0) {
        const usedPromotions = this.getUsedPromotions()
        const userUsage = usedPromotions[promotion.code] || 0
        
        if (userUsage >= promotion.usageLimit) {
          return {
            valid: false,
            error: 'You have reached the usage limit for this promotion'
          }
        }
      }

      return {
        valid: true,
        promotion: promotion
      }
    } catch (error) {
      console.error('Error validating promotion:', error)
      return {
        valid: false,
        error: 'Failed to validate promotion'
      }
    }
  }

  calculateDiscount(promotion, orderTotal, deliveryFee = 0) {
    let discount = 0

    switch (promotion.type) {
      case 'percentage':
        discount = (orderTotal * promotion.discountValue) / 100
        if (promotion.maximumDiscount > 0) {
          discount = Math.min(discount, promotion.maximumDiscount)
        }
        break

      case 'fixed_amount':
        discount = Math.min(promotion.discountValue, orderTotal)
        break

      case 'free_delivery':
        discount = deliveryFee
        break

      case 'buy_one_get_one':
        // This is simplified - in a real app, you'd need to analyze the cart items
        discount = (orderTotal * promotion.discountValue) / 100
        if (promotion.maximumDiscount > 0) {
          discount = Math.min(discount, promotion.maximumDiscount)
        }
        break

      default:
        discount = 0
    }

    return Math.round(discount * 100) / 100 // Round to 2 decimal places
  }

  async applyPromotion(code, orderTotal, restaurantId = null, deliveryFee = 0) {
    try {
      const validation = await this.validatePromotion(code, orderTotal, restaurantId)
      
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      const discount = this.calculateDiscount(validation.promotion, orderTotal, deliveryFee)
      
      // Track usage
      this.trackPromotionUsage(code)

      return {
        success: true,
        promotion: validation.promotion,
        discount: discount,
        finalTotal: Math.max(0, orderTotal - discount)
      }
    } catch (error) {
      console.error('Error applying promotion:', error)
      return {
        success: false,
        error: 'Failed to apply promotion'
      }
    }
  }

  getUsedPromotions() {
    try {
      const stored = localStorage.getItem(USED_PROMOTIONS_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error loading used promotions:', error)
      return {}
    }
  }

  trackPromotionUsage(code) {
    try {
      const usedPromotions = this.getUsedPromotions()
      usedPromotions[code] = (usedPromotions[code] || 0) + 1
      localStorage.setItem(USED_PROMOTIONS_KEY, JSON.stringify(usedPromotions))
    } catch (error) {
      console.error('Error tracking promotion usage:', error)
    }
  }

  async getPromotionsByRestaurant(restaurantId) {
    try {
      const promotions = await this.getPromotions()
      return promotions.filter(promotion => promotion.restaurantId === restaurantId)
    } catch (error) {
      console.error('Error loading promotions by restaurant:', error)
      return []
    }
  }

  async getFeaturedPromotions(limit = 3) {
    try {
      const promotions = await this.getPromotions()
      
      // Sort by discount value (highest first) and take the specified limit
      return promotions
        .sort((a, b) => {
          if (a.type === 'percentage' && b.type === 'percentage') {
            return b.discountValue - a.discountValue
          }
          if (a.type === 'fixed_amount' && b.type === 'fixed_amount') {
            return b.discountValue - a.discountValue
          }
          // Prioritize percentage and fixed amount discounts
          if (a.type === 'percentage' || a.type === 'fixed_amount') return -1
          if (b.type === 'percentage' || b.type === 'fixed_amount') return 1
          return 0
        })
        .slice(0, limit)
    } catch (error) {
      console.error('Error loading featured promotions:', error)
      return []
    }
  }
}

export const promotionService = new PromotionService()