import { Card, CardContent } from '@/components/ui/card'

export default function FAQPage() {
  const faqs = [
    {
      category: 'General',
      questions: [
        { q: 'What is SL Vehicle Rental?', a: 'SL Vehicle Rental is Sri Lanka\'s premier vehicle rental marketplace connecting vehicle owners and renters.' },
        { q: 'How does it work?', a: 'Create an account, browse vehicles, book securely, and pick up with your QR code.' },
        { q: 'Is KYC mandatory?', a: 'Yes, KYC verification is required for both renting and listing vehicles to ensure safety.' },
      ],
    },
    {
      category: 'For Renters',
      questions: [
        { q: 'How do I rent a vehicle?', a: 'Browse available vehicles, select dates, complete booking, and pick up with your QR code.' },
        { q: 'What payment methods are accepted?', a: 'We accept PayHere, credit/debit cards via Stripe, EZ Cash, and wallet payments.' },
        { q: 'Can I cancel my booking?', a: 'Yes, you can cancel according to the cancellation policy shown during booking.' },
      ],
    },
    {
      category: 'For Owners',
      questions: [
        { q: 'How much can I earn?', a: 'Earnings vary by vehicle type and location. Average LKR 30,000-100,000/month.' },
        { q: 'What is the commission rate?', a: 'We charge only 5% commission, one of the lowest in the industry.' },
        { q: 'When do I get paid?', a: 'Payments are transferred to your wallet immediately after each completed rental.' },
      ],
    },
  ]

  return (
    <div>
      <section className="bg-primary py-16 text-white">
        <div className="container-padding mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
          <p className="text-lg">Find answers to common questions</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-padding mx-auto max-w-4xl">
          {faqs.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <h3 className="mb-2 text-lg font-semibold">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
