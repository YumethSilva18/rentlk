# SL Vehicle Rental Frontend

Premium vehicle rental marketplace platform for Sri Lanka built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

### For All Users
- **Unified Account System**: Single account to both rent vehicles and list your own
- **Vehicle Discovery**: Browse and search thousands of vehicles across Sri Lanka
- **Smart Filtering**: Filter by location, type, price, features, and more
- **Secure Booking**: End-to-end booking process with payment integration
- **Real-time Messaging**: Chat with vehicle owners and renters
- **Reviews & Ratings**: Build trust through community feedback
- **KYC Verification**: Mandatory identity verification for safety
- **Wallet System**: Manage earnings and payments in one place
- **GPS Tracking**: Track your bookings in real-time

### For Vehicle Owners
- **Easy Listing**: List your vehicle in minutes
- **Earnings Dashboard**: Track your income and bookings
- **Availability Management**: Control when your vehicle is available
- **Automated Payments**: Receive payments directly to your wallet

### For Renters
- **Instant Booking**: Book vehicles with just a few clicks
- **Flexible Dates**: Choose your pickup and return dates
- **Add-ons**: Insurance, GPS, driver service, and more
- **QR Codes**: Easy vehicle pickup with QR codes
- **Booking History**: Track all your past and upcoming bookings

### For Admins
- **User Management**: Manage all users and their activities
- **KYC Reviews**: Approve or reject identity verifications
- **Vehicle Moderation**: Review and approve vehicle listings
- **Fraud Detection**: Monitor suspicious activities
- **Revenue Analytics**: Track platform performance
- **Transaction Oversight**: Monitor all financial transactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **Maps**: Google Maps API
- **Payments**: PayHere, Stripe, EZ Cash
- **Real-time**: Socket.IO
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-org/sl-vehicle-rental-frontend.git
cd sl-vehicle-rental-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

4. Configure your environment variables in `.env.local`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
sl-vehicle-rental-frontend/
├── app/                    # Next.js app directory
│   ├── (marketing)/       # Public marketing pages
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Authenticated user pages
│   └── (admin)/           # Admin dashboard pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── auth/             # Auth-related components
│   ├── vehicle/          # Vehicle components
│   ├── booking/          # Booking components
│   └── ...
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── services/             # API service layer
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## Key Features Implementation

### Unified User System
Unlike typical rental platforms that separate renters and owners, our platform uses a single user account. Every user can:
- Browse and rent vehicles
- List their own vehicles for rent
- Manage both booking history and listed vehicles from one dashboard

### KYC Requirement
To ensure platform safety and trust:
- KYC verification is mandatory before booking any vehicle
- KYC verification is mandatory before listing any vehicle
- Clear lock states and CTAs guide users through verification
- Admin review queue for all KYC submissions

### Sri Lankan Context
Platform is optimized for Sri Lankan market:
- LKR currency formatting
- +94 phone number validation
- Major Sri Lankan cities pre-populated
- Local payment methods (PayHere, EZ Cash)
- 5% platform commission

## Design System

### Colors
- **Primary Navy**: #001F3F
- **Deep Navy Hover**: #003366
- **Accent Gold**: #D4AF37
- **Background**: #F5F5F5
- **Success**: #2ECC40
- **Warning**: #FF851B
- **Error**: #FF4136

### Typography
- **Font Family**: Inter
- Clean, readable hierarchy
- Responsive sizing

### Components
- Rounded cards with soft shadows
- Smooth hover states
- Premium, trustworthy aesthetic
- Fully responsive design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Environment Variables

See `.env.local.example` for required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, email support@sl-vehicle-rental.lk or join our Slack channel.
