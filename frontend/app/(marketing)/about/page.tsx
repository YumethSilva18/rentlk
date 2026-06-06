import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, TrendingUp, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-primary py-16 text-white">
        <div className="container-padding mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About SL Vehicle Rental</h1>
          <p className="text-lg text-gray-100">
            Sri Lanka's most trusted vehicle rental marketplace
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="prose prose-lg mx-auto">
            <h2>Our Mission</h2>
            <p>
              To connect vehicle owners and renters across Sri Lanka through a safe, secure, and trustworthy platform that benefits everyone.
            </p>

            <h2>Our Story</h2>
            <p>
              Founded in 2024, SL Vehicle Rental was born from a simple idea: make vehicle rental easy, affordable, and accessible to everyone in Sri Lanka. We saw an opportunity to help vehicle owners earn extra income while providing renters with more choices and better prices.
            </p>

            <h2>What Makes Us Different</h2>
            <ul>
              <li>Unified account system - rent OR list vehicles with one account</li>
              <li>Mandatory KYC verification for safety and trust</li>
              <li>Only 5% commission - one of the lowest in the industry</li>
              <li>24/7 local support in Sinhala, Tamil, and English</li>
              <li>Comprehensive insurance on all rentals</li>
            </ul>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 not-prose my-8">
              {[
                { icon: Users, label: '25,000+', desc: 'Happy Users' },
                { icon: TrendingUp, label: '5,000+', desc: 'Active Vehicles' },
                { icon: Shield, label: '100%', desc: 'Verified Users' },
                { icon: Award, label: '4.9/5', desc: 'Average Rating' },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6 text-center">
                    <stat.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                    <div className="text-3xl font-bold">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
