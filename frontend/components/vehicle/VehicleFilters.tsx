'use client'

import React from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { VehicleFilters as VehicleFiltersType } from '@/types'

interface VehicleFiltersProps {
  filters: VehicleFiltersType
  onFilterChange: (filters: VehicleFiltersType) => void
  onClearFilters: () => void
  className?: string
}

export function VehicleFilters({
  filters,
  onFilterChange,
  onClearFilters,
  className,
}: VehicleFiltersProps) {
  const activeFilterCount = [
    filters.search,
    filters.city,
    filters.type?.length,
    filters.transmission?.length,
    filters.fuelType?.length,
  ].filter(Boolean).length

  const updateFilter = (key: keyof VehicleFiltersType, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-muted-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search vehicles..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          value={filters.city || ''}
          onValueChange={(v) => updateFilter('city', v || undefined)}
        >
          <SelectTrigger>
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

        <Select
          value={filters.sortBy || ''}
          onValueChange={(v) => updateFilter('sortBy', v || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Default</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
