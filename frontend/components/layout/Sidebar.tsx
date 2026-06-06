'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Car,
  PlusCircle,
  MessageSquare,
  CreditCard,
  Wallet,
  Heart,
  Star,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  User,
} from 'lucide-react'

interface SidebarLink {
  name: string
  href: string
  icon: React.ElementType
  badge?: number
}

const sidebarLinks: SidebarLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
  { name: 'My Vehicles', href: '/my-vehicles', icon: Car },
  { name: 'Add Vehicle', href: '/add-vehicle', icon: PlusCircle },
  { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 3 },
  { name: 'Payment Methods', href: '/payments', icon: CreditCard },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Saved Vehicles', href: '/saved-vehicles', icon: Heart },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 5 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help Center', href: '/help-center', icon: HelpCircle },
]

interface SidebarProps {
  user?: {
    name: string
    email: string
    avatar: string | null
    kycStatus?: string
  }
  onClose?: () => void
}

export default function Sidebar({ user, onClose }: SidebarProps) {
  const pathname = usePathname()

  const defaultUser = {
    name: 'User',
    email: 'user@example.com',
    avatar: null,
    kycStatus: 'pending',
  }

  const currentUser = user || defaultUser

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" className="mt-2 w-full justify-center">Verified</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="mt-2 w-full justify-center">KYC Rejected</Badge>
      case 'pending':
        return <Badge variant="warning" className="mt-2 w-full justify-center">KYC Pending</Badge>
      default:
        return (
          <Link href="/kyc" onClick={onClose}>
            <Badge variant="outline" className="mt-2 w-full cursor-pointer justify-center">
              Complete KYC
            </Badge>
          </Link>
        )
    }
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-primary">SL Vehicle</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
          </div>
        </div>
        {currentUser.kycStatus && getKycBadge(currentUser.kycStatus)}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
              )}
            >
              <div className="flex items-center">
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.name}
              </div>
              {link.badge && (
                <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto">
                  {link.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t p-4">
        <Link href="/login" onClick={onClose}>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  )
}
