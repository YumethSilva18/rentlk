'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X, LogIn, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated?: boolean
  links: { href: string; label: string }[]
}

export default function MobileNav({ isOpen, onClose, isAuthenticated = false, links }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl md:hidden">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <span className="text-lg font-bold text-primary">Menu</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t px-6 py-6 space-y-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/my-bookings"
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                My Bookings
              </Link>
              <Link
                href="/messages"
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Messages
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full justify-start">
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={onClose}>
                <Button className="w-full justify-start">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
