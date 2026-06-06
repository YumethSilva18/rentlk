'use client'

import React from 'react'
import { Search, MapPin, Calendar, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  onSearch: (params: { query: string; city?: string; dateRange?: string }) => void
  className?: string
}

export function SearchFilters({
  onSearch,
  className,
}: SearchFiltersProps) {
  const [query, setQuery] = React.useState('')
  const [city, setCity] = React.useState('')
  const [dateRange, setDateRange] = React.useState('')

  const handleSearch = () => {
    onSearch({
      query,
      city: city || undefined,
      dateRange: dateRange || undefined,
    })
  }

  const handleClear = () => {
    setQuery('')
    setCity('')
    setDateRange('')
    onSearch({ query: '' })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by brand, model, or type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[150px]">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Colombo">Colombo</SelectItem>
              <SelectItem value="Kandy">Kandy</SelectItem>
              <SelectItem value="Galle">Galle</SelectItem>
              <SelectItem value="Jaffna">Jaffna</SelectItem>
              <SelectItem value="Negombo">Negombo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="weekend">This Weekend</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1 sm:flex-none">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        {(query || city) && (
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
