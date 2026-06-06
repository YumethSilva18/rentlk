import { format, formatDistanceToNow, parseISO, differenceInDays, differenceInHours } from 'date-fns'

export const formatters = {
  currency: (amount: number, currency: string = 'LKR'): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  },

  number: (value: number): string => {
    return new Intl.NumberFormat('en-LK').format(value)
  },

  percentage: (value: number): string => {
    return `${Math.round(value)}%`
  },

  date: (date: string | Date, formatStr: string = 'PPP'): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, formatStr)
  },

  dateTime: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'PPP p')
  },

  relativeTime: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true })
  },

  rentalDuration: (startDate: string | Date, endDate: string | Date): string => {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
    const days = differenceInDays(end, start)
    if (days === 0) {
      const hours = differenceInHours(end, start)
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    }
    return `${days} day${days !== 1 ? 's' : ''}`
  },

  rating: (rating: number): string => {
    return rating.toFixed(1)
  },

  fileSize: (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
  },

  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    return phone
  },

  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength)}...`
  },
}
