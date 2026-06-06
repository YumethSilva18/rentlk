'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  FileCheck,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Menu,
  X,
  LogOut,
  Shield,
  Bell,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar: string | null
  }
}

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'KYC Reviews', href: '/admin/kyc-reviews', icon: FileCheck },
  { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  { name: 'Fraud Alerts', href: '/admin/fraud-alerts', icon: AlertTriangle },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
]

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const defaultUser = {
    name: 'Admin',
    email: 'admin@slvehiclerental.lk',
    avatar: null,
  }

  const currentUser = user || defaultUser

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col bg-gray-900 text-white lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-700 px-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Admin Panel</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
              <span className="text-sm font-medium">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
            asChild
          >
            <Link href="/">
              <LogOut className="mr-3 h-5 w-5" />
              Back to Site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white lg:hidden overflow-y-auto">
            <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
              <Link href="/admin" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">Admin Panel</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {adminLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {link.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
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
            <h1 className="text-xl font-bold text-gray-900">
              {adminLinks.find((link) => link.href === pathname)?.name || 'Admin Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
