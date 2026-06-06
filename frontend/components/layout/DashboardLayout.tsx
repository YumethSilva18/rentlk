'use client'

import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar: string | null
    kycStatus?: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/my-bookings': 'My Bookings',
    '/my-vehicles': 'My Vehicles',
    '/add-vehicle': 'Add Vehicle',
    '/messages': 'Messages',
    '/payments': 'Payment Methods',
    '/wallet': 'Wallet',
    '/saved-vehicles': 'Saved Vehicles',
    '/reviews': 'Reviews',
    '/notifications': 'Notifications',
    '/settings': 'Settings',
    '/help-center': 'Help Center',
    '/kyc': 'KYC Verification',
    '/profile': 'Profile',
  }

  const currentTitle = pageTitles[pathname] || 'Dashboard'

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
            <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
