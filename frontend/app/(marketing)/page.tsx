'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Search,
  Key,
  Sparkles,
  Star,
  UserCheck,
  Quote,
  DollarSign,
  ShieldCheck,
  Globe,
  Zap,
  BadgeCheck,
  TrendingUp,
  Phone,
  Apple,
  Smartphone,
  Check,
  ChevronRight,
  MapPin,
  Car,
} from 'lucide-react'

const featuredVehicles = [
  {
    id: 1,
    name: 'Toyota Vitz',
    type: 'Compact Hatchback',
    year: 2022,
    price: 8500,
    location: 'Colombo',
    rating: 4.9,
    reviews: 127,
    transmission: 'Automatic',
    seats: 5,
    features: ['AC', 'GPS'],
    owner: 'Kamal Perera',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
  },
  {
    id: 2,
    name: 'Tuk-Tuk',
    type: 'Bajaj RE',
    year: 2021,
    price: 3500,
    location: 'Kandy',
    rating: 4.8,
    reviews: 89,
    transmission: 'Manual',
    seats: 3,
    features: ['GPS', 'Music System'],
    owner: 'Nimal Silva',
    image: 'https://images.unsplash.com/photo-1598756103498-cb31fcaaa0c7?w=800&q=80',
  },
  {
    id: 3,
    name: 'Honda Civic',
    type: 'Sedan',
    year: 2023,
    price: 12000,
    location: 'Galle',
    rating: 5.0,
    reviews: 156,
    transmission: 'Automatic',
    seats: 5,
    features: ['AC', 'GPS'],
    owner: 'Priya Fernando',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  },
  {
    id: 4,
    name: 'Toyota KDH Van',
    type: '12-Seater',
    year: 2020,
    price: 18000,
    location: 'Negombo',
    rating: 4.7,
    reviews: 94,
    transmission: 'Manual',
    seats: 12,
    features: ['AC', 'GPS'],
    owner: 'Sunil Jayasinghe',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
  },
  {
    id: 5,
    name: 'Yamaha FZ',
    type: 'Motorcycle',
    year: 2022,
    price: 2500,
    location: 'Ella',
    rating: 4.9,
    reviews: 73,
    transmission: 'Manual',
    seats: 2,
    features: ['Helmet Included', 'GPS'],
    owner: 'Ravi Kumar',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80',
  },
  {
    id: 6,
    name: 'Mercedes-Benz E-Class',
    type: 'Luxury Sedan',
    year: 2023,
    price: 35000,
    location: 'Colombo',
    rating: 5.0,
    reviews: 42,
    transmission: 'Automatic',
    seats: 5,
    features: ['AC', 'GPS'],
    owner: 'Amal Wickramasinghe',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
]

const testimonials = [
  {
    quote: 'Rented a car for our 2-week Sri Lanka trip. The owner was incredibly helpful and the car was in perfect condition. The 5% commission is unbeatable!',
    name: 'Sarah Johnson',
    role: 'Tourist from UK',
    location: 'Colombo',
  },
  {
    quote: 'I have been listing my van on RentLK for 6 months now. The platform is easy to use, payments are secure, and I earn 95% of the rental fee. Highly recommend!',
    name: 'Chaminda Perera',
    role: 'Vehicle Owner',
    location: 'Kandy',
  },
  {
    quote: 'Needed a car for a wedding in Galle. Found the perfect vehicle on RentLK, booking was smooth, and the owner was very professional. Will definitely use again!',
    name: 'Priya Fernando',
    role: 'Local Renter',
    location: 'Galle',
  },
  {
    quote: 'Rented a tuk-tuk to explore Ella. What an amazing experience! The KYC process was quick, payment was secure, and the owner even gave us local tips.',
    name: 'David Chen',
    role: 'Tourist from Singapore',
    location: 'Ella',
  },
  {
    quote: 'As a tuk-tuk owner, RentLK has been a game-changer. I get consistent bookings, the platform handles everything, and I keep 95% of earnings. Excellent!',
    name: 'Nimal Silva',
    role: 'Vehicle Owner',
    location: 'Negombo',
  },
  {
    quote: 'Best car rental experience in Sri Lanka! The app is user-friendly, prices are transparent, and the 24/7 support team was very helpful when we had questions.',
    name: 'Emma Williams',
    role: 'Tourist from Australia',
    location: 'Colombo',
  },
]

const benefits = [
  {
    icon: DollarSign,
    title: 'Lower Prices',
    description: 'Save up to 40% by renting directly from owners without intermediary fees',
  },
  {
    icon: UserCheck,
    title: 'Verified Users',
    description: 'All users undergo strict verification for your safety and security',
  },
  {
    icon: Zap,
    title: 'No Intermediaries',
    description: 'Direct connection between owners and customers for transparent transactions',
  },
  {
    icon: Globe,
    title: 'Flexible Booking',
    description: 'Book vehicles on your schedule with instant confirmation',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: '100% secure online payment system with buyer protection',
  },
  {
    icon: TrendingUp,
    title: 'Earn More',
    description: 'Vehicle owners keep 90% of rental income with full control',
  },
]

const p2pSteps = [
  {
    number: '1',
    icon: Search,
    title: 'Discovery',
    description: 'Filter through our verified fleet by location, type, and availability. Find the exact machine for your mission.',
  },
  {
    number: '2',
    icon: Key,
    title: 'Handover',
    description: 'Direct communication with the owner for a personalized hand-off. No counters, no lines, just keys.',
  },
  {
    number: '3',
    icon: Sparkles,
    title: 'Freedom',
    description: "Drive with peace of mind knowing you're backed by Rentlk's secure transaction and insurance protocols.",
  },
]

const howItWorks = [
  { step: 1, title: 'Register', description: 'Create your account and complete verification' },
  { step: 2, title: 'Search', description: 'Find the perfect vehicle for your needs' },
  { step: 3, title: 'Book', description: 'Request booking and make secure payment' },
  { step: 4, title: 'Drive', description: 'Pick up the vehicle and enjoy your journey' },
]

const appFeatures = [
  'Real-time booking updates',
  'In-app messaging with owners',
  'Digital KYC verification',
  'Secure mobile payments',
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'owners'>('customers')

  return (
    <div className="flex flex-col">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-navy-blue text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Sri Lankan Landscape"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-blue via-navy-blue/90 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              Rent Vehicles from Local Owners in Sri Lanka
            </h1>
            <p className="mb-8 text-xl text-gray-200 md:text-2xl">
              Connect directly with verified vehicle owners. Self-drive or with driver. Secure payments. 24/7 support.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/search">
                <Button size="lg" className="rounded-button bg-white px-8 py-6 text-lg font-semibold text-navy-blue shadow-button hover:bg-gray-200 hover:scale-105 transition-all">
                  <Search className="mr-2 h-5 w-5" />
                  Find a Vehicle
                </Button>
              </Link>
              <Link href="/list-own-vehicles">
                <Button size="lg" variant="outline" className="rounded-button border-2 border-white px-8 py-6 text-lg font-semibold text-white hover:bg-white/10 transition-all">
                  List Your Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Smart P2P Logistics ===== */}
      <section className="bg-navy-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Smart P2P Logistics</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-300">
              Seamlessly connecting owners and drivers with our transparent, three-step engine designed for maximum efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {p2pSteps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="rounded-modal bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-400">
                    <Icon className="h-8 w-8 text-navy-blue" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    {step.number}. {step.title}
                  </h3>
                  <p className="leading-relaxed text-gray-300">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Featured Vehicles ===== */}
      <section id="featured-vehicles" className="overflow-hidden bg-light-grey py-16">
        <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-navy-blue md:text-4xl">Featured Vehicles</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Discover our most popular vehicles from verified owners across Sri Lanka
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory' }}>
            {featuredVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="group flex w-[320px] flex-shrink-0 flex-col overflow-hidden rounded-card bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4 flex items-center space-x-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                    <BadgeCheck className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.type} &bull; {vehicle.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-navy-blue">
                        LKR {vehicle.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">per day</p>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{vehicle.location}</span>
                  </div>
                  <div className="mb-3 flex items-center space-x-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(vehicle.rating) ? 'fill-gold text-gold' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{vehicle.rating}</span>
                    <span className="text-xs text-gray-400">({vehicle.reviews} reviews)</span>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{vehicle.transmission}</span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{vehicle.seats} Seats</span>
                    {vehicle.features.map((f) => (
                      <span key={f} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{f}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-blue text-sm font-bold text-white">
                        {vehicle.owner.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">{vehicle.owner}</span>
                    </div>
                    <span className="flex items-center text-sm font-medium text-navy-blue group-hover:underline">
                      View Details <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/search">
            <Button variant="outline" size="lg" className="rounded-button border-2 border-navy-blue text-navy-blue hover:bg-navy-blue hover:text-white">
              View All Vehicles
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="bg-navy-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Simple steps to get started
            </p>
            <div className="inline-flex rounded-full bg-white/10 p-1">
              <button
                onClick={() => setActiveTab('customers')}
                className={`rounded-full px-8 py-3 font-semibold transition-all ${
                  activeTab === 'customers'
                    ? 'bg-gray-400 text-navy-blue'
                    : 'text-white hover:text-gray-300'
                }`}
              >
                For Customers
              </button>
              <button
                onClick={() => setActiveTab('owners')}
                className={`rounded-full px-8 py-3 font-semibold transition-all ${
                  activeTab === 'owners'
                    ? 'bg-gray-400 text-navy-blue'
                    : 'text-white hover:text-gray-300'
                }`}
              >
                For Owners
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, idx) => (
              <div
                key={step.step}
                className="relative rounded-card bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                {idx < howItWorks.length - 1 && (
                  <div className="absolute left-full top-12 z-0 hidden h-0.5 w-full bg-white/20 lg:block" />
                )}
                <div className="relative z-10 mb-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-400">
                    <span className="text-2xl font-bold text-navy-blue">{step.step}</span>
                  </div>
                </div>
                <h3 className="mb-3 text-center text-xl font-bold">{step.title}</h3>
                <p className="text-center text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why Choose RentLK? ===== */}
      <section className="bg-navy-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose RentLK?</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Benefits that make us different
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="rounded-card bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <div className="mb-6">
                    <Icon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{benefit.title}</h3>
                  <p className="leading-relaxed text-gray-300">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="overflow-hidden bg-light-grey py-16">
        <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-navy-blue md:text-4xl">What Our Customers Say</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Join thousands of satisfied customers who trust RentLK for their vehicle rental needs
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8" style={{ scrollSnapType: 'x mandatory' }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex w-[380px] flex-shrink-0 flex-col rounded-card bg-white p-6 shadow-card"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Quote className="mb-4 h-10 w-10 text-navy-blue" />
                <div className="mb-4 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mb-6 flex-1 leading-relaxed text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                  <div className="mt-1 flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Download App ===== */}
      <section className="bg-navy-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Download the RentLK App</h2>
              <p className="mb-8 text-lg text-gray-200">
                Book vehicles on the go. Available for iOS and Android. Get instant notifications, manage bookings, and chat with owners directly from your phone.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="flex items-center space-x-3 rounded-button bg-white px-6 py-3 font-semibold text-navy-blue shadow-button transition-all hover:bg-light-grey hover:scale-105">
                  <Apple className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-xs">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 rounded-button bg-white px-6 py-3 font-semibold text-navy-blue shadow-button transition-all hover:bg-light-grey hover:scale-105">
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-xs">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </button>
              </div>
              <div className="mt-8 space-y-3">
                {appFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-gold" />
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex md:justify-center">
              <div className="relative">
                <div className="h-[500px] w-[250px] rounded-[2rem] border-4 border-gray-700 bg-navy-blue p-2 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center space-y-6 rounded-[1.5rem] bg-navy-blue px-4 text-center">
                    <Car className="h-12 w-12 text-gold" />
                    <div>
                      <p className="text-lg font-bold">RentLK</p>
                      <p className="text-xs text-gray-400">Vehicle Rental</p>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-button bg-white/10 px-6 py-2 text-sm">Find Vehicles</div>
                      <div className="rounded-button bg-white/10 px-6 py-2 text-sm">My Bookings</div>
                      <div className="rounded-button bg-white/10 px-6 py-2 text-sm">Messages</div>
                    </div>
                    <div className="rounded-full bg-gold px-6 py-2 text-sm font-semibold text-navy-blue">
                      Get Started
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
