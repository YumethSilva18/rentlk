import Link from 'next/link'
import { Car, Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-blue text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                <Car className="h-6 w-6 text-navy-blue" />
              </div>
              <span className="text-lg font-bold text-white">Rentlk</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Sri Lanka&apos;s most trusted peer-to-peer vehicle rental marketplace. Only 5% commission.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="transition-colors hover:text-gold">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors hover:text-gold">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors hover:text-gold">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-300 transition-colors hover:text-gold">About Us</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-gray-300 transition-colors hover:text-gold">How It Works</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Careers</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Press</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Safety</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-300 transition-colors hover:text-gold">Contact Us</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-300 transition-colors hover:text-gold">Trust & Safety</Link></li>
            </ul>
          </div>

          {/* For Renters */}
          <div>
            <h3 className="mb-4 font-semibold">For Renters</h3>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-sm text-gray-300 transition-colors hover:text-gold">Search Vehicles</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Booking Guide</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Insurance</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-300 transition-colors hover:text-gold">FAQs</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="mb-4 font-semibold">For Owners</h3>
            <ul className="space-y-2">
              <li><Link href="/list-own-vehicles" className="text-sm text-gray-300 transition-colors hover:text-gold">List Your Vehicle</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Owner Resources</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-gray-300 transition-colors hover:text-gold">Success Stories</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mb-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 md:grid-cols-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-gray-400">24/7 Support</p>
              <p className="text-sm font-medium">+94 11 234 5678</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Us</p>
              <p className="text-sm font-medium">support@rentlk.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Head Office</p>
              <p className="text-sm font-medium">Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RentLK. All rights reserved.
          </p>
          <div className="mt-4 flex items-center space-x-6 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
              Cookie Policy
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Language:</span>
              <button className="transition-colors hover:text-white">English</button>
              <span className="text-gray-600">|</span>
              <button className="transition-colors hover:text-white">සිංහල</button>
              <span className="text-gray-600">|</span>
              <button className="transition-colors hover:text-white">தமிழ்</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
