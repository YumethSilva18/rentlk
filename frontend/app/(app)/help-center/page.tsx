'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, HelpCircle, MessageSquare, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

const faqItems = [
  {
    question: 'How do I rent a vehicle?',
    answer: 'Browse available vehicles on our platform, select your desired dates and location, and submit a booking request. The vehicle owner will confirm your booking, and you can make the payment securely through our platform.',
  },
  {
    question: 'What documents do I need to rent a vehicle?',
    answer: 'You will need a valid driving license, a government-issued ID (NIC or Passport), and a valid payment method. Some owners may require additional documentation for high-value vehicles.',
  },
  {
    question: 'How does KYC verification work?',
    answer: 'KYC (Know Your Customer) verification ensures the safety of our platform. Upload a photo of your ID document and a selfie. Our team reviews your submission within 24-48 hours. Once verified, you unlock full platform features.',
  },
  {
    question: 'What is the cancellation policy?',
    answer: 'Free cancellation is available up to 24 hours before the pickup time. Cancellations within 24 hours may incur a fee of up to 50% of the booking amount. No-shows are charged the full amount.',
  },
  {
    question: 'How do I list my vehicle for rent?',
    answer: 'After KYC verification, go to "Add Vehicle" from your dashboard. Fill in the vehicle details, upload clear photos, set your pricing, and submit for review. Listings are typically approved within 24 hours.',
  },
  {
    question: 'How are payments handled?',
    answer: 'All payments are processed securely through our platform. Renters pay upfront, and funds are held in escrow until the booking is completed. Owners receive payment 24 hours after successful completion.',
  },
  {
    question: 'What insurance coverage is provided?',
    answer: 'Basic insurance is included in every booking. This covers third-party liability and basic damage. Premium insurance options are available at checkout for additional coverage.',
  },
  {
    question: 'How does vehicle tracking work?',
    answer: 'Some vehicles are equipped with GPS tracking devices. If enabled by the owner, renters can view the vehicle location during the rental period. Tracking helps with security and recovery in case of issues.',
  },
]

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-600">Find answers to common questions or get in touch with our support team.</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search help articles..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Button variant="outline" className="flex-col py-6 h-auto" asChild>
              <Link href="/messages">
                <MessageSquare className="mb-2 h-6 w-6" />
                <span className="font-semibold">Live Chat</span>
                <span className="text-xs text-gray-500">Chat with support</span>
              </Link>
            </Button>
            <Button variant="outline" className="flex-col py-6 h-auto" asChild>
              <Link href="/contact">
                <Mail className="mb-2 h-6 w-6" />
                <span className="font-semibold">Email Us</span>
                <span className="text-xs text-gray-500">support@slvehiclerental.lk</span>
              </Link>
            </Button>
            <Button variant="outline" className="flex-col py-6 h-auto" asChild>
              <Link href="/contact">
                <Phone className="mb-2 h-6 w-6" />
                <span className="font-semibold">Call Us</span>
                <span className="text-xs text-gray-500">+94 11 234 5678</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
