'use client'

import React from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AvailabilityCalendarProps {
  availableDates: string[]
  blockedDates: string[]
  onDateSelect?: (date: string) => void
  selectedDate?: string
  className?: string
}

export function AvailabilityCalendar({
  availableDates,
  blockedDates,
  onDateSelect,
  selectedDate,
  className,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  const formatDate = (day: number) => {
    const d = new Date(year, month, day)
    return d.toISOString().split('T')[0]
  }

  const isToday = (day: number) => {
    const today = new Date()
    return formatDate(day) === today.toISOString().split('T')[0]
  }

  const isAvailable = (day: number) => {
    const date = formatDate(day)
    if (blockedDates.includes(date)) return false
    if (availableDates.length > 0) return availableDates.includes(date)
    return true
  }

  const isPast = (day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(year, month, day)
    return checkDate < today
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1 font-medium text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = formatDate(day)
          const available = isAvailable(day)
          const past = isPast(day)
          const today = isToday(day)

          return (
            <button
              key={day}
              onClick={() => !past && available && onDateSelect?.(date)}
              disabled={past || !available}
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
                past && 'text-muted-foreground/30 cursor-not-allowed',
                !available && !past && 'text-muted-foreground/40 cursor-not-allowed line-through',
                available && !past && 'hover:bg-primary/10 cursor-pointer',
                selectedDate === date && 'bg-primary text-primary-foreground hover:bg-primary/90',
                today && !selectedDate && 'font-bold text-primary',
              )}
            >
              {day}
              {today && selectedDate !== date && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-primary/20" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded bg-muted-foreground/30" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  )
}
