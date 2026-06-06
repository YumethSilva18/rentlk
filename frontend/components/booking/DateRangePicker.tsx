'use client'

import React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatDate } from '@/lib/utils'

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onChange: (range: { start: Date | undefined; end: Date | undefined }) => void
  disabledDates?: Date[]
  className?: string
}

export function DateRangePicker({ startDate, endDate, onChange, disabledDates, className }: DateRangePickerProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? formatDate(startDate) : 'Pickup date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(d) => onChange({ start: d, end: endDate })}
            disabled={(d) => d < new Date() || (disabledDates?.some((dd) => dd.toDateString() === d.toDateString()) ?? false)}
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">to</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? formatDate(endDate) : 'Return date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(d) => onChange({ start: startDate, end: d })}
            disabled={(d) => !startDate || d <= startDate || (disabledDates?.some((dd) => dd.toDateString() === d.toDateString()) ?? false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
