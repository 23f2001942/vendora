# Vendora - Online Delivery System

## Project Overview

Vendora is a comprehensive web-based e-commerce platform that connects **Customers**, **Retailers**, and **Wholesalers** in a seamless supply chain ecosystem. This platform addresses the modern retail challenges by creating a three-tier marketplace that streamlines the supply chain while enhancing user experience.

## Key Features

### 🛍️ Customer Features
- **Smart Product Discovery**: Browse products by category with advanced filtering
- **Intelligent Search**: Filter by price, stock availability, and location
- **Location-Based Shopping**: Find nearby retailers using Google Maps integration
- **Shopping Cart**: Add multiple items, manage quantities, view cart summary
- **Secure Checkout**: Multi-step checkout with address and payment management
- **Real-Time Order Tracking**: Live delivery status updates with map visualization
- **Feedback System**: Rate and review products and retailers
- **Payment Options**: Multiple payment methods (Card, UPI, Net Banking, COD)

### 🏪 Retailer Features
- **Inventory Management**: Add, update, and manage product listings
- **Stock Control**: Real-time stock quantity tracking and updates
- **B2B Ordering**: Request products from wholesalers with MOQ validation
- **Order Management**: View and manage customer orders with status updates
- **Analytics Dashboard**: 
  - Total products and orders
  - Revenue tracking
  - Order statistics by status
  - Delivery performance metrics
- **Wholesaler Discovery**: Browse and order from multiple wholesalers
- **Automatic Inventory Updates**: Stock automatically updated on B2B order approval

### 🏭 Wholesaler Features
- **Bulk Product Management**: Manage large inventories with MOQ settings
- **B2B Order Processing**: Approve or reject retailer requests
- **Stock Management**: Track and update bulk stock quantities
- **Order Analytics**: Monitor B2B order trends and performance
- **Retailer Network**: View and manage retailer relationships
- **Service Area Management**: Define geographic coverage areas

## Core Objectives

1. ✅ **Seamless Platform**: Enable smooth interaction between customers, retailers, and wholesalers
2. ✅ **Personalized Experience**: Search, filtering, and recommendations based on user behavior
3. ✅ **Local Business Support**: Highlight region-specific local products
4. ✅ **Transparency**: Real-time pricing, stock updates, and location-based suggestions
5. ✅ **Robust Operations**: Order placement, payment processing, and real-time tracking

## User Hierarchy & Roles

### Customer
- Browse, search, and filter products
- Add items to cart and place orders
- Make payments (online/offline)
- Track deliveries in real-time
- Provide feedback and ratings

### Retailer
- Manage product inventory and pricing
- Track customer purchase history
- Place B2B orders with wholesalers
- Handle customer orders and queries
- View analytics and performance metrics

### Wholesaler
- Manage bulk inventory for retailers
- Set wholesale pricing and MOQ
- Process retailer orders (approve/reject)
- Maintain retailer transaction history
- Update stock after order fulfillment

## Technical Highlights

- **Modern Tech Stack**: React, TypeScript, Tailwind CSS, Supabase
- **Real-Time Updates**: Live order tracking and notifications
- **Automated Delivery**: Cron-based delivery status progression
- **Secure Authentication**: Email and social login (Google, Facebook)
- **Location Services**: Google Maps API integration
- **Responsive Design**: Mobile-friendly interface
- **Edge Functions**: Serverless backend for business logic
- **Database**: PostgreSQL with Row Level Security (RLS)

## Project Structure

```
vendora/
├── docs/                    # Comprehensive documentation
│   ├── TECH_STACK.md       # Technology stack details
│   ├── DATABASE_SCHEMA.md  # Database design and relationships
│   ├── API_REFERENCE.md    # Edge functions and API documentation
│   └── USER_GUIDE.md       # Step-by-step user guide
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React context providers
│   └── integrations/      # Supabase integration
├── supabase/
│   ├── functions/         # Edge functions
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

## Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Documentation

- **[Tech Stack](./docs/TECH_STACK.md)**: Detailed information about technologies used
- **[Database Schema](./docs/DATABASE_SCHEMA.md)**: Complete database structure and relationships
- **[API Reference](./docs/API_REFERENCE.md)**: Edge functions and API documentation
- **[User Guide](./docs/USER_GUIDE.md)**: Step-by-step instructions for all user types

## License

This project is open source and available under the MIT License.
