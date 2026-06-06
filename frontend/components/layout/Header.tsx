'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Car, Menu, X, Globe, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'

export default function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('You have been logged out')
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-navy-blue text-white shadow-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Car className="h-6 w-6 text-navy-blue" />
          </div>
          <span className="hidden text-xl font-bold text-white sm:inline-block">
            Rentlk
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-gray-300">
            How It Works
          </Link>
          <Link href="#list-vehicle" className="text-sm font-medium transition-colors hover:text-gray-300">
            List Your Vehicle
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-gray-300">
            Support
          </Link>
        </div>

        {/* Auth & Language */}
        <div className="hidden items-center space-x-4 md:flex">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-gray-300"
            >
              <Globe className="h-4 w-4" />
              <span>English</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-button bg-white py-1 shadow-card-hover">
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-light-grey">
                  English
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-light-grey">
                  සිංහල
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-light-grey">
                  தமிழ்
                </button>
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/20"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-navy-blue">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white py-2 shadow-lg">
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {user.kycStatus === 'approved' && (
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Verified
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium transition-colors hover:text-gray-300">
                Log In
              </Link>
              <Link href="/signup">
                <Button className="rounded-button bg-white px-6 py-2 font-semibold text-navy-blue shadow-button hover:bg-gray-200 hover:scale-105 transition-all">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-navy-blue md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="#how-it-works"
              className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#list-vehicle"
              className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              List Your Vehicle
            </Link>
            <Link
              href="/about"
              className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            <div className="border-t border-white/10 pt-4">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-300 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-button bg-white font-semibold text-navy-blue shadow-button hover:bg-gray-200">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
