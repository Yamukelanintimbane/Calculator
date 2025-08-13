# Food Delivery Application

A comprehensive food delivery platform built with Node.js, Express, and MongoDB. This application includes user management, restaurant listings, order processing, and admin functionality.

## Features

- **User Management**: Customers, restaurant owners, delivery personnel, and admins
- **Restaurant Management**: Restaurant listings with menus, ratings, and delivery information
- **Order Processing**: Complete order lifecycle from creation to delivery
- **Geospatial Features**: Find nearby restaurants using coordinates
- **Admin Dashboard**: Manage restaurants, users, and orders
- **Search & Filtering**: Search restaurants by name, cuisine type, ratings, etc.

## Database Models

### User
- Multiple roles: user, restaurant_owner, admin, delivery_person
- Address with geospatial coordinates
- Preferences and dietary restrictions
- Email verification and account status

### Restaurant
- Complete restaurant information with menus
- Operating hours and delivery settings
- Ratings and reviews
- Geospatial location for nearby searches

### Order
- Complete order lifecycle tracking
- Multiple payment methods and statuses
- Delivery tracking with estimated times
- Customer ratings and reviews

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## Database Seeding

The seed script creates comprehensive sample data including:

### Sample Users
- **Admin User**: `admin@fooddelivery.com` / `admin123456`
- **John Customer**: `john@example.com` / `customer123`
- **Sarah Customer**: `sarah@example.com` / `customer123`
- **Mike Restaurant Owner**: `mike@restaurant.com` / `owner123`
- **Lisa Restaurant Owner**: `lisa@restaurant.com` / `owner123`
- **David Delivery**: `david@delivery.com` / `delivery123`

### Sample Restaurants
- **Pizza Palace**: Italian pizza restaurant
- **Sushi Express**: Japanese sushi restaurant
- **Burger Joint**: American burger restaurant

### Sample Orders
- 3-5 orders per restaurant with realistic data
- Various order statuses (pending, confirmed, preparing, ready, out_for_delivery, delivered)
- Complete order details including items, pricing, delivery info

## API Endpoints

### Public Routes
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/nearby` - Find nearby restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID

### Admin Routes (placeholder authentication)
- `GET /api/admin/restaurants` - Get all restaurants (admin view)
- `PUT /api/admin/restaurants/:id/status` - Update restaurant status
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders` - Get all orders

## Sample API Calls

### Get All Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### Search Restaurants
```bash
curl "http://localhost:5000/api/restaurants?search=pizza&cuisineType=Italian"
```

### Find Nearby Restaurants
```bash
curl "http://localhost:5000/api/restaurants/nearby?latitude=40.7128&longitude=-74.0060"
```

### Get Admin Data
```bash
curl http://localhost:5000/api/admin/restaurants
curl http://localhost:5000/api/admin/orders
curl http://localhost:5000/api/admin/users
```

## Database Schema Highlights

### Geospatial Indexes
- User addresses and restaurant locations are indexed for geospatial queries
- Supports finding nearby restaurants efficiently

### Text Search
- Restaurant names, descriptions, and cuisine types are indexed for text search
- Enables fast search functionality

### Order Number Generation
- Automatic order number generation with date-based sequencing
- Format: `ORD{YY}{MM}{DD}{SEQUENCE}`

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/food-delivery

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Admin
ADMIN_EMAIL=admin@fooddelivery.com
ADMIN_PASSWORD=admin123456
```

## Development

### Running Tests
```bash
npm test
```

### Database Reset
```bash
npm run seed
```

### Production Build
```bash
npm start
```

## Sample Data Structure

### Order Example
```json
{
  "orderNumber": "ORD2408060001",
  "customer": "user_id",
  "restaurant": "restaurant_id",
  "deliveryPerson": "delivery_person_id",
  "items": [
    {
      "name": "Margherita Pizza",
      "price": 18.99,
      "quantity": 2,
      "subtotal": 37.98
    }
  ],
  "subtotal": 37.98,
  "deliveryFee": 3.99,
  "tax": 3.32,
  "tip": 5.00,
  "total": 50.29,
  "orderStatus": "delivered",
  "paymentStatus": "paid"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details