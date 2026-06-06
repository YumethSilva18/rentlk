'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', formData)
  }

  return (
    <div className="flex flex-col">
      <section className="bg-primary py-16 text-white">
        <div className="container-padding mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="text-lg text-gray-100">We're here to help</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-padding mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 text-2xl font-semibold">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Subject</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Message</label>
                      <textarea
                        className="w-full rounded-lg border p-3"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Mail className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Email</h3>
                  <p className="text-gray-600">support@slvehiclerental.lk</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Phone className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Phone</h3>
                  <p className="text-gray-600">+94 11 234 5678</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <MapPin className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Address</h3>
                  <p className="text-gray-600">
                    123 Galle Road<br />
                    Colombo 03<br />
                    Sri Lanka
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
