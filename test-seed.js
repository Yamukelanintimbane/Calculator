const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

// Test data (simplified version)
const testUsers = [
  {
    name: 'Test Admin',
    email: 'testadmin@example.com',
    password: 'test123456',
    role: 'admin',
    phone: '+1-555-0001',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      coordinates: {
        type: 'Point',
        coordinates: [-74.006, 40.7128]
      }
    },
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Test Customer',
    email: 'testcustomer@example.com',
    password: 'test123456',
    role: 'user',
    phone: '+1-555-0002',
    address: {
      street: '456 Test Ave',
      city: 'Test City',
      state: 'TS',
      zipCode: '12346',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484]
      }
    },
    isEmailVerified: true,
    isActive: true
  }
];

const testRestaurants = [
  {
    name: 'Test Pizza Place',
    description: 'A test pizza restaurant for demonstration purposes.',
    phone: '+1-555-1001',
    email: 'test@pizzatest.com',
    cuisineTypes: ['Italian', 'Pizza'],
    address: {
      street: '789 Test Blvd',
      city: 'Test City',
      state: 'TS',
      zipCode: '12347',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9911, 40.7505]
      }
    },
    menu: [
      {
        name: 'Test Margherita Pizza',
        description: 'A test pizza with tomato sauce and mozzarella',
        price: 15.99,
        category: 'Pizza',
        preparationTime: 15,
        allergens: ['Dairy', 'Gluten'],
        nutritionalInfo: {
          calories: 800,
          protein: 30,
          carbs: 90,
          fat: 30
        }
      }
    ],
    operatingHours: {
      monday: { open: '11:00', close: '22:00', isOpen: true },
      tuesday: { open: '11:00', close: '22:00', isOpen: true },
      wednesday: { open: '11:00', close: '22:00', isOpen: true },
      thursday: { open: '11:00', close: '22:00', isOpen: true },
      friday: { open: '11:00', close: '23:00', isOpen: true },
      saturday: { open: '12:00', close: '23:00', isOpen: true },
      sunday: { open: '12:00', close: '21:00', isOpen: true }
    },
    deliveryInfo: {
      deliveryFee: 2.99,
      minimumOrder: 10.00,
      deliveryRadius: 5000,
      estimatedDeliveryTime: 30
    },
    ratings: {
      average: 4.5,
      count: 50
    },
    status: 'approved',
    isActive: true,
    isOpen: true
  }
];

// Function to create test orders
const createTestOrders = async (users, restaurants) => {
  const orders = [];
  const customers = users.filter(user => user.role === 'user');
  
  for (const restaurant of restaurants) {
    const restaurantMenu = restaurant.menu;
    
    // Create 2 test orders per restaurant
    for (let i = 0; i < 2; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const menuItem = restaurantMenu[0]; // Use first menu item
      const quantity = 1;
      
      const subtotal = menuItem.price * quantity;
      const deliveryFee = restaurant.deliveryInfo.deliveryFee;
      const tax = subtotal * 0.0875;
      const tip = 3.00;
      const total = subtotal + deliveryFee + tax + tip;
      
      const order = {
        customer: customer._id,
        restaurant: restaurant._id,
        items: [{
          menuItem: menuItem._id || new mongoose.Types.ObjectId(),
          name: menuItem.name,
          price: menuItem.price,
          quantity: quantity,
          subtotal: subtotal
        }],
        deliveryAddress: customer.address,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        tip: tip,
        total: total,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
        actualDeliveryTime: new Date(Date.now() + 25 * 60000),
        rating: 5,
        review: 'Great test order!',
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      };
      
      orders.push(order);
    }
  }
  
  return orders;
};

// Test seeding function
const testSeedDatabase = async () => {
  try {
    console.log('🧪 Starting test database seeding...');
    
    // Check if MongoDB URI is available
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri === 'mongodb://localhost:27017/food-delivery') {
      console.log('⚠️  No MONGODB_URI found or using default localhost.');
      console.log('📝 To test with a real database, please:');
      console.log('   1. Set up MongoDB Atlas (free tier available)');
      console.log('   2. Add your connection string to .env file');
      console.log('   3. Run: npm run seed');
      console.log('');
      console.log('🔍 For now, showing the data structure that would be created:');
      
      // Show what would be created
      console.log('\n📋 Sample Data Structure:');
      console.log('Users:');
      testUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.role}) - ${user.email}`);
      });
      
      console.log('\nRestaurants:');
      testRestaurants.forEach(restaurant => {
        console.log(`   - ${restaurant.name} (${restaurant.cuisineTypes.join(', ')})`);
        console.log(`     Menu items: ${restaurant.menu.length}`);
      });
      
      console.log('\nOrders:');
      console.log('   - 2 orders per restaurant would be created');
      console.log('   - Each order includes items, pricing, delivery info');
      
      return;
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create users
    console.log('👥 Creating test users...');
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    
    // Create restaurants
    console.log('🍕 Creating test restaurants...');
    const createdRestaurants = [];
    const restaurantOwners = createdUsers.filter(user => user.role === 'restaurant_owner');
    
    for (let i = 0; i < testRestaurants.length; i++) {
      const restaurantData = {
        ...testRestaurants[i],
        owner: restaurantOwners[i] ? restaurantOwners[i]._id : createdUsers[0]._id // Use admin if no restaurant owner
      };
      
      const restaurant = await Restaurant.create(restaurantData);
      createdRestaurants.push(restaurant);
      console.log(`✅ Created restaurant: ${restaurant.name}`);
    }
    
    // Create orders
    console.log('📦 Creating test orders...');
    const testOrders = await createTestOrders(createdUsers, createdRestaurants);
    
    for (const orderData of testOrders) {
      const order = await Order.create(orderData);
      console.log(`✅ Created order: ${order.orderNumber} - $${order.total.toFixed(2)}`);
    }
    
    console.log('\n🎉 Test database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Restaurants: ${createdRestaurants.length}`);
    console.log(`   - Orders: ${testOrders.length}`);
    
  } catch (error) {
    console.error('❌ Error during test seeding:', error.message);
    console.log('\n💡 To set up MongoDB:');
    console.log('   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
    console.log('   2. Or use MongoDB Atlas: https://www.mongodb.com/atlas');
    console.log('   3. Update your .env file with the connection string');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
};

// Run the test
testSeedDatabase();