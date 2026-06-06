# RentLK Backend - NestJS API

Production-grade backend for **RentLK**, a Sri Lankan peer-to-peer vehicle rental marketplace.

## Tech Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **Authentication**: JWT (Access + Refresh) with session tracking
- **Storage**: AWS S3
- **Email**: AWS SES
- **SMS**: Dialog (Sri Lanka)
- **Payments**: PayHere, Stripe, EzCash (abstracted gateway interface)
- **Real-time**: WebSockets (Socket.io)
- **Maps**: Google Maps (geocoding)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Start Development Server
```bash
npm run start:dev
```
Server will start at `http://localhost:3000`

## API Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login with phone/email
- `POST /auth/logout` - Logout current session
- `POST /auth/logout-all` - Logout all devices
- `POST /auth/refresh` - Refresh access token
- `GET /auth/sessions` - List active sessions
- `DELETE /auth/sessions/:id` - Revoke session

### Users
- `GET /users/me` - Get profile
- `PUT /users/me` - Update profile
- `POST /users/me/avatar` - Upload avatar
- `GET /users/me/preferences` - Get user preferences
- `PUT /users/me/preferences` - Update preferences
- `GET /users/me/saved-vehicles` - List saved vehicles
- `POST /vehicles/:id/save` - Save vehicle
- `DELETE /vehicles/:id/save` - Unsave vehicle

### KYC
- `POST /kyc/submit` - Submit KYC documents
- `GET /kyc/me` - Get KYC status
- `GET /kyc/me/status` - Get simplified status
- `GET /kyc/me/eligibility/:action` - Check eligibility (book/list)
- `POST /kyc/resubmit` - Resubmit after rejection
- `GET /kyc/admin/submissions` - Admin queue
- `PUT /kyc/admin/:id/review` - Approve/reject

### Vehicles
- `GET /vehicles` - Search & filter vehicles (public)
- `GET /vehicles/featured` - Featured listings (public)
- `GET /vehicles/types` - Vehicle types (public)
- `GET /vehicles/:id` - Get vehicle details (public)
- `POST /vehicles` - Create listing (KYC required)
- `PUT /vehicles/:id` - Update listing
- `DELETE /vehicles/:id` - Soft delete
- `GET /vehicles/my/list` - Owner's vehicles
- `GET /vehicles/my/stats` - Owner dashboard stats
- `POST /vehicles/:id/images` - Upload image
- `DELETE /vehicles/:id/images/:imageId` - Delete image
- `PUT /vehicles/:id/images/reorder` - Reorder images
- `POST /vehicles/:id/features` - Add feature
- `DELETE /vehicles/:id/features/:name` - Remove feature
- `POST /vehicles/:id/availability` - Set availability block
- `DELETE /vehicles/:id/availability/:id` - Remove availability
- `GET /vehicles/:id/availability` - Get availability schedule

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/my` - User's bookings
- `GET /bookings/:id` - Get booking details
- `GET /bookings/:id/timeline` - Status history
- `GET /bookings/:id/invoice` - Generate invoice
- `POST /bookings/:id/start` - Start booking
- `POST /bookings/:id/complete` - Complete booking
- `POST /bookings/:id/dispute` - Dispute booking
- `POST /bookings/:id/cancel` - Cancel booking
- `PUT /bookings/:id/admin-status` - Admin force status

### Payments
- `POST /payments/initiate` - Initiate payment
- `GET /payments/:id` - Get payment status
- `POST /payments/:id/confirm` - Confirm payment
- `POST /payments/:id/refund` - Process refund (admin)
- `POST /payments/:id/retry` - Retry failed payment
- `POST /payments/webhook/payhere` - PayHere webhook
- `POST /payments/webhook/stripe` - Stripe webhook
- `POST /payments/webhook/ezcash` - EzCash webhook

### Wallet
- `GET /wallets/me` - Get wallet with full balances
- `GET /wallets/me/balance` - Get balance summary
- `GET /wallets/me/transactions` - Transaction history
- `GET /wallets/me/ledger` - Full audit ledger
- `POST /wallets/me/withdraw` - Withdraw (disabled, use payouts)
- `GET /wallets/admin/:userId` - Admin view wallet
- `POST /wallets/admin/:userId/reconcile` - Reconcile balances

### Payouts
- `POST /payouts/request` - Request payout
- `GET /payouts/my` - My payouts
- `GET /payouts/:id` - Get payout details
- `PUT /payouts/:id/cancel` - Cancel payout
- `PUT /payouts/:id/approve` - Approve (admin)
- `PUT /payouts/:id/reject` - Reject (admin)
- `PUT /payouts/:id/process` - Process (admin)
- `PUT /payouts/:id/fail` - Fail (admin)

### Messages
- `GET /messages/conversations` - List conversations
- `GET /messages/conversations/:id` - Get conversation
- `POST /messages/conversations` - Create conversation
- `GET /messages/conversations/:id/messages` - Get messages
- `POST /messages/send` - Send message
- `PUT /messages/:id/read` - Mark message read
- `PUT /messages/conversations/:id/read` - Mark conversation read

### Reviews
- `POST /reviews` - Create review
- `GET /reviews/me` - My reviews
- `GET /reviews/eligibility/:bookingId` - Check eligibility
- `GET /reviews/user/:userId` - User reviews (public)
- `GET /reviews/vehicle/:vehicleId` - Vehicle reviews (public)
- `GET /reviews/:id` - Get review (public)
- `PUT /reviews/:id/moderate` - Moderate (admin)

### Notifications
- `GET /notifications` - List notifications
- `GET /notifications/unread-count` - Unread count
- `GET /notifications/summary` - Summary with preferences
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all read
- `DELETE /notifications/:id` - Delete notification
- `DELETE /notifications/clear-read` - Clear read notifications

### Tracking
- `POST /tracking/sessions` - Create tracking session
- `GET /tracking/sessions/active` - Active sessions
- `GET /tracking/sessions/:id` - Get session
- `GET /tracking/sessions/booking/:bookingId` - By booking
- `PUT /tracking/sessions/:id/end` - End session
- `POST /tracking/sessions/:id/locations` - Add location
- `GET /tracking/sessions/:id/locations` - Get locations
- `GET /tracking/sessions/:id/route-summary` - Route summary
- `POST /tracking/sessions/:id/geofence-check` - Check geofence

### Admin
- `GET /admin/dashboard` - Dashboard stats
- `GET /admin/users` - User management
- `GET /admin/bookings` - Booking management
- `GET /admin/transactions` - Transaction review
- `PUT /admin/users/:id/suspend` - Suspend user
- `PUT /admin/users/:id/reinstate` - Reinstate user
- `PUT /admin/vehicles/:id/moderate` - Moderate vehicle
- `GET /admin/fraud-alerts` - Fraud queue
- `PUT /admin/fraud-alerts/:id/resolve` - Resolve alert
- `POST /admin/:entity/:entityId/notes` - Add note
- `GET /admin/:entity/:entityId/notes` - Get notes
- `GET /admin/reports/revenue` - Revenue reports
- `GET /admin/reports/platform` - Platform reports

### Health
- `GET /health` - Health check
- `GET /health/db` - Database health
- `GET /health/redis` - Redis health

## Key Features

### Security
- **Brute-force protection**: 5 failed login attempts → 30-minute lockout
- **Device/session tracking**: Full session lifecycle with token rotation
- **Account lockout**: Configurable lockout duration
- **IP anomaly detection**: Detects suspicious login locations
- **Suspended account checks**: Prevents login for suspended users
- **Security event logging**: All security events logged to audit trail

### Money Handling
- **Server-side pricing**: Never trust frontend calculations
- **Transaction-safe operations**: All booking/payment/wallet changes use `$transaction()`
- **Idempotent payments**: Duplicate payment prevention via idempotency keys
- **Balance separation**: `pendingBalance`, `availableBalance`, `heldBalance`
- **Payout workflow**: Request → Approve → Process → Complete (transaction-safe)
- **Reconciliation**: Admin can verify wallet balances match transaction history

### Booking State Machine
```
PENDING → CONFIRMED → ACTIVE → COMPLETED
    ↓          ↓         ↓
CANCELLED   CANCELLED  DISPUTED → COMPLETED/CANCELLED
```

### KYC Tiers
- **NONE**: No KYC. Cannot book or list.
- **BASIC**: NIC or Driving License approved. Can book and list basic vehicles.
- **VERIFIED**: Passport or enhanced verification. Higher booking limits.

### Event-Driven Architecture
Events emitted for:
- `booking:created`, `booking:confirmed`, `booking:completed`, `booking:cancelled`
- `payment:success`, `payment:failed`, `payment:refunded`
- `kyc:approved`, `kyc:rejected`, `kyc:submitted`
- `review:created`
- `message:sent`
- `fraud:alert`
- `tracking:speed:alert`

Events trigger:
- In-app notifications
- Email dispatch (AWS SES)
- SMS dispatch (Dialog)
- Push notification hooks (FCM/APNs)
- Audit logging
- Admin alerts for high-severity fraud

### WebSocket Gateway
Real-time messaging, typing indicators, read receipts, and live tracking location updates.

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Change all default secrets in `.env`
- [ ] Configure production database connection pool
- [ ] Set up Redis with authentication
- [ ] Configure AWS S3 with production bucket
- [ ] Set up AWS SES verified domain
- [ ] Configure production payment gateway credentials
- [ ] Enable rate limiting for production
- [ ] Set up monitoring (Sentry, CloudWatch, etc.)
- [ ] Configure backup strategy for database
- [ ] Set up SSL/TLS for API
- [ ] Run `npm run build` and use `npm run start:prod`

## Project Structure

```
apps/backend/src/
├── common/                 # Shared utilities, DTOs, guards, interceptors
├── config/env/             # Environment configuration modules
├── database/
│   ├── prisma/             # Prisma service and module
│   ├── repositories/       # Data access layer
│   └── transactions/       # Transaction management
├── events/                 # Event bus and event handlers
├── health/                 # Health checks
├── integrations/
│   ├── email/              # AWS SES
│   ├── fraud/              # Fraud scoring and rules engine
│   ├── maps/               # Google Maps
│   ├── payments/           # Payment gateway abstraction
│   ├── sms/                # Dialog SMS
│   ├── storage/            # AWS S3
│   └── websocket/          # Socket.io gateway
├── jobs/                   # Background jobs (BullMQ)
└── modules/
    ├── admin/              # Admin dashboard and tools
    ├── auth/               # Authentication and security
    ├── bookings/           # Booking lifecycle
    ├── fraud/              # Domain fraud management
    ├── kyc/                # KYC verification
    ├── messages/           # Conversation-based messaging
    ├── notifications/      # Multi-channel notifications
    ├── payments/           # Payment processing
    ├── payouts/            # Payout lifecycle
    ├── reviews/            # Reviews and ratings
    ├── tracking/           # GPS tracking
    ├── users/              # User profile and preferences
    ├── vehicles/           # Vehicle listings
    └── wallets/            # Wallet and ledger
```

## Commands Reference

```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug mode

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate:dev # Create and apply migration
npm run prisma:migrate:deploy # Apply pending migrations (production)
npm run prisma:studio      # Open Prisma Studio

# Testing
npm run test               # Run tests
npm run test:watch         # Watch mode
npm run test:cov           # Coverage
npm run test:e2e           # E2E tests

# Production
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled output
```

## License

Proprietary - RentLK Platform
