'use client'

import Link from 'next/link'
import { Car } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-primary p-12 lg:flex">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <Link href="/" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Car className="h-10 w-10 text-white" />
            </Link>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-white">SL Vehicle Rental</h1>
          <p className="text-lg text-white/80">
            Premium vehicle rental marketplace in Sri Lanka.
            Rent vehicles or list your own for extra income.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-sm text-white/70">Vehicles</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-sm text-white/70">Users</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">4.8</p>
              <p className="text-sm text-white/70">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">SL Vehicle</span>
            </Link>
          </div>

          {title && (
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}

          <div className="rounded-xl bg-white p-6 shadow-sm lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
