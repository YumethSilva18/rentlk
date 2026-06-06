import Link from 'next/link'
import { Car } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-600 to-primary-700">
      <div className="container-padding mx-auto flex min-h-screen flex-col items-center justify-center py-12">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center space-x-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
            <Car className="h-7 w-7 text-primary" />
          </div>
          <span className="text-2xl font-bold text-white">SL Vehicle Rental</span>
        </Link>

        {/* Auth Content */}
        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} SL Vehicle Rental. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
