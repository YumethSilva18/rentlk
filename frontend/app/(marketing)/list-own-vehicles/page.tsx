import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Camera,
  CheckCircle2,
  AlertCircle,
  Users,
  Star,
  Calendar,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ListOwnVehiclesPage() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up and complete KYC verification for safety and trust',
      icon: Users,
    },
    {
      number: 2,
      title: 'Add Vehicle Details',
      description: 'Upload photos and provide information about your vehicle',
      icon: Camera,
    },
    {
      number: 3,
      title: 'Set Your Price',
      description: 'Choose your daily rate and availability schedule',
      icon: DollarSign,
    },
    {
      number: 4,
      title: 'Start Earning',
      description: 'Get bookings and receive payments directly to your wallet',
      icon: TrendingUp,
    },
  ]

  const benefits = [
    {
      title: 'Earn Up to LKR 100,000/Month',
      description: 'Turn your idle vehicle into a steady income stream',
      icon: DollarSign,
      color: 'text-success',
    },
    {
      title: 'You Control Everything',
      description: 'Set your own prices, availability, and rental terms',
      icon: Shield,
      color: 'text-primary',
    },
    {
      title: '24/7 Support',
      description: 'Our team is always here to help you succeed',
      icon: Clock,
      color: 'text-accent',
    },
    {
      title: 'Only 5% Commission',
      description: 'One of the lowest rates in the industry',
      icon: TrendingUp,
      color: 'text-warning',
    },
  ]

  const requirements = [
    'Valid vehicle registration and insurance',
    'Vehicle must be in good working condition',
    'Clear photos of the vehicle (minimum 5)',
    'Complete KYC verification',
    'Sri Lankan driving license',
    'Vehicle must be less than 15 years old',
  ]

  const faqs = [
    {
      question: 'How much can I earn?',
      answer:
        'Earnings depend on your vehicle type and location. On average, owners earn LKR 30,000 - 100,000 per month.',
    },
    {
      question: 'Is my vehicle insured?',
      answer:
        'Yes, all rentals include comprehensive insurance coverage for your peace of mind.',
    },
    {
      question: 'When do I get paid?',
      answer:
        'Payments are transferred to your wallet immediately after each completed rental.',
    },
    {
      question: 'Can I reject booking requests?',
      answer:
        'Yes, you have full control and can accept or reject any booking request.',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent via-accent-600 to-accent-700 text-white">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="container-padding relative mx-auto py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white backdrop-blur">
              Start Earning Today
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Turn Your Vehicle Into Income
            </h1>
            <p className="mb-8 text-lg text-gray-100 md:text-xl">
              List your car, van, or motorcycle and earn money when you're not using it
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="xl" className="bg-white text-accent hover:bg-gray-100" asChild>
                <Link href="/add-vehicle">List Your Vehicle</Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>

            {/* Earnings Preview */}
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
                <div className="text-3xl font-bold">LKR 40,000</div>
                <div className="text-sm text-gray-200">Avg. Monthly Earnings (Car)</div>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
                <div className="text-3xl font-bold">LKR 75,000</div>
                <div className="text-sm text-gray-200">Avg. Monthly Earnings (Van)</div>
              </div>
              <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-gray-200">You Keep (5% Commission)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing bg-white">
        <div className="container-padding mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Start earning in 4 simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
                    {step.number}
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <step.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing bg-gray-50">
        <div className="container-padding mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Why List With Us
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center">
                <CardContent className="pt-6">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 ${benefit.color}`}>
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-spacing bg-white">
        <div className="container-padding mx-auto">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Vehicle Requirements
              </h2>
              <p className="text-lg text-gray-600">
                Make sure your vehicle meets these criteria
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-warning/10 p-4">
                  <div className="flex items-start">
                    <AlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
                    <div>
                      <p className="font-medium text-gray-900">KYC Verification Required</p>
                      <p className="mt-1 text-sm text-gray-600">
                        All vehicle owners must complete KYC verification before listing. This helps maintain trust and safety on our platform.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-spacing bg-gray-50">
        <div className="container-padding mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Hear from our successful vehicle owners
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Nimal Silva',
                location: 'Galle',
                vehicle: 'Toyota Hiace Van',
                earnings: 'LKR 85,000/month',
                quote: "Listing my van was the best decision. I earn steady income without much effort.",
              },
              {
                name: 'Kasun Fernando',
                location: 'Colombo',
                vehicle: 'Toyota Prius',
                earnings: 'LKR 45,000/month',
                quote: "The platform makes everything easy. Bookings, payments, everything is automated.",
              },
              {
                name: 'Amila Perera',
                location: 'Kandy',
                vehicle: 'Honda CR-V',
                earnings: 'LKR 55,000/month',
                quote: "I love that I control my schedule. I can block dates whenever I need my vehicle.",
              },
            ].map((story) => (
              <Card key={story.name}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-600 italic">"{story.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{story.name}</p>
                    <p className="text-sm text-gray-500">{story.location}</p>
                    <p className="mt-2 text-sm text-gray-600">{story.vehicle}</p>
                    <Badge variant="success" className="mt-2">
                      {story.earnings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-white">
        <div className="container-padding mx-auto">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-accent text-white">
        <div className="container-padding mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Start Earning?
          </h2>
          <p className="mb-8 text-lg text-gray-100">
            Join thousands of vehicle owners already earning on our platform
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-white text-accent hover:bg-gray-100" asChild>
              <Link href="/add-vehicle">List Your Vehicle Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
