// Price utility functions for booking calculations

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPriceWithCents(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function calculateWeeklyDiscount(dailyRate: number, weeklyRate?: number): number {
  if (!weeklyRate) {
    // Default 10% weekly discount
    return dailyRate * 7 * 0.9
  }
  return weeklyRate
}

export function calculateMonthlyDiscount(dailyRate: number, monthlyRate?: number): number {
  if (!monthlyRate) {
    // Default 20% monthly discount
    return dailyRate * 30 * 0.8
  }
  return monthlyRate
}

export function calculateTotalPrice(
  dailyRate: number,
  days: number,
  stayType: 'daily' | 'weekly' | 'monthly',
  weeklyRate?: number,
  monthlyRate?: number
): number {
  switch (stayType) {
    case 'daily':
      return days * dailyRate
    case 'weekly': {
      const weeks = Math.ceil(days / 7)
      const weeklyPrice = calculateWeeklyDiscount(dailyRate, weeklyRate)
      return weeks * weeklyPrice
    }
    case 'monthly': {
      const months = Math.ceil(days / 30)
      const monthlyPrice = calculateMonthlyDiscount(dailyRate, monthlyRate)
      return months * monthlyPrice
    }
    default:
      return days * dailyRate
  }
}

export function getOptimalStayType(days: number): 'daily' | 'weekly' | 'monthly' {
  if (days >= 28) return 'monthly'
  if (days >= 7) return 'weekly'
  return 'daily'
}

export function calculateSavings(
  dailyRate: number,
  days: number,
  stayType: 'weekly' | 'monthly',
  weeklyRate?: number,
  monthlyRate?: number
): number {
  const dailyTotal = days * dailyRate
  const discountedTotal = calculateTotalPrice(dailyRate, days, stayType, weeklyRate, monthlyRate)
  return Math.max(0, dailyTotal - discountedTotal)
}

export function formatSavings(savings: number): string {
  if (savings <= 0) return ''
  return `Save ${formatPrice(savings)}`
}