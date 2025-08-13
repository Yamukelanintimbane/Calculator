const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@fooddelivery.com',
    password: 'admin123456',
    role: 'admin',
    phone: '+1-555-0100',
    address: {
      street: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: {
        type: 'Point',
        coordinates: [-74.006, 40.7128]
      }
    },
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'customer123',
    role: 'user',
    phone: '+1-555-0101',
    address: {
      street: '456 Customer Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484]
      }
    },
    isEmailVerified: true,
    isActive: true,
    preferences: {
      cuisineTypes: ['Italian', 'Mexican', 'Chinese'],
      dietaryRestrictions: ['Vegetarian'],
      maxDeliveryDistance: 8000
    }
  },
  {
    name: 'Sarah Customer',
    email: 'sarah@example.com',
    password: 'customer123',
    role: 'user',
    phone: '+1-555-0102',
    address: {
      street: '789 Food Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9911, 40.7505]
      }
    },
    isEmailVerified: true,
    isActive: true,
    preferences: {
      cuisineTypes: ['Japanese', 'Thai', 'Indian'],
      dietaryRestrictions: [],
      maxDeliveryDistance: 12000
    }
  },
  {
    name: 'Mike Restaurant Owner',
    email: 'mike@restaurant.com',
    password: 'owner123',
    role: 'restaurant_owner',
    phone: '+1-555-0200',
    address: {
      street: '321 Restaurant Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10004',
      coordinates: {
        type: 'Point',
        coordinates: [-74.0139, 40.7033]
      }
    },
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Lisa Restaurant Owner',
    email: 'lisa@restaurant.com',
    password: 'owner123',
    role: 'restaurant_owner',
    phone: '+1-555-0201',
    address: {
      street: '654 Kitchen Road',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9712, 40.7505]
      }
    },
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'David Delivery',
    email: 'david@delivery.com',
    password: 'delivery123',
    role: 'delivery_person',
    phone: '+1-555-0300',
    address: {
      street: '987 Delivery Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10006',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484]
      }
    },
    isEmailVerified: true,
    isActive: true
  }
];

const sampleRestaurants = [
  {
    name: 'Pizza Palace',
    description: 'Authentic Italian pizza made with fresh ingredients and traditional recipes. Our wood-fired ovens create the perfect crispy crust every time.',
    phone: '+1-555-1000',
    email: 'info@pizzapalace.com',
    cuisineTypes: ['Italian', 'Pizza'],
    address: {
      street: '123 Pizza Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10007',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9911, 40.7505]
      }
    },
    menu: [
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 18.99,
        category: 'Pizza',
        preparationTime: 15,
        allergens: ['Dairy', 'Gluten'],
        nutritionalInfo: {
          calories: 850,
          protein: 35,
          carbs: 95,
          fat: 35
        }
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni with melted cheese and tomato sauce',
        price: 22.99,
        category: 'Pizza',
        preparationTime: 18,
        allergens: ['Dairy', 'Gluten', 'Pork'],
        nutritionalInfo: {
          calories: 950,
          protein: 40,
          carbs: 95,
          fat: 45
        }
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
        price: 12.99,
        category: 'Salad',
        preparationTime: 8,
        allergens: ['Dairy', 'Gluten', 'Eggs'],
        nutritionalInfo: {
          calories: 320,
          protein: 15,
          carbs: 25,
          fat: 20
        }
      },
      {
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 6.99,
        category: 'Appetizer',
        preparationTime: 5,
        allergens: ['Dairy', 'Gluten'],
        nutritionalInfo: {
          calories: 280,
          protein: 8,
          carbs: 35,
          fat: 12
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
      deliveryFee: 3.99,
      minimumOrder: 15.00,
      deliveryRadius: 6000,
      estimatedDeliveryTime: 35
    },
    ratings: {
      average: 4.5,
      count: 127
    },
    status: 'approved',
    isActive: true,
    isOpen: true
  },
  {
    name: 'Sushi Express',
    description: 'Fresh and delicious sushi made with premium fish and authentic Japanese techniques. Quick service for busy professionals.',
    phone: '+1-555-1001',
    email: 'info@sushiexpress.com',
    cuisineTypes: ['Japanese', 'Sushi'],
    address: {
      street: '456 Sushi Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10008',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484]
      }
    },
    menu: [
      {
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll with tobiko',
        price: 14.99,
        category: 'Rolls',
        preparationTime: 12,
        allergens: ['Fish', 'Shellfish'],
        nutritionalInfo: {
          calories: 255,
          protein: 9,
          carbs: 38,
          fat: 7
        }
      },
      {
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 8.99,
        category: 'Nigiri',
        preparationTime: 8,
        allergens: ['Fish'],
        nutritionalInfo: {
          calories: 120,
          protein: 12,
          carbs: 15,
          fat: 3
        }
      },
      {
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu and seaweed',
        price: 4.99,
        category: 'Soup',
        preparationTime: 5,
        allergens: ['Soy'],
        nutritionalInfo: {
          calories: 85,
          protein: 6,
          carbs: 8,
          fat: 3
        }
      },
      {
        name: 'Edamame',
        description: 'Steamed soybeans with sea salt',
        price: 6.99,
        category: 'Appetizer',
        preparationTime: 3,
        allergens: ['Soy'],
        nutritionalInfo: {
          calories: 120,
          protein: 11,
          carbs: 9,
          fat: 5
        }
      }
    ],
    operatingHours: {
      monday: { open: '11:30', close: '21:30', isOpen: true },
      tuesday: { open: '11:30', close: '21:30', isOpen: true },
      wednesday: { open: '11:30', close: '21:30', isOpen: true },
      thursday: { open: '11:30', close: '21:30', isOpen: true },
      friday: { open: '11:30', close: '22:30', isOpen: true },
      saturday: { open: '12:00', close: '22:30', isOpen: true },
      sunday: { open: '12:00', close: '21:00', isOpen: true }
    },
    deliveryInfo: {
      deliveryFee: 4.99,
      minimumOrder: 20.00,
      deliveryRadius: 5000,
      estimatedDeliveryTime: 30
    },
    ratings: {
      average: 4.7,
      count: 89
    },
    status: 'approved',
    isActive: true,
    isOpen: true
  },
  {
    name: 'Burger Joint',
    description: 'Gourmet burgers made with premium beef and fresh ingredients. Hand-cut fries and milkshakes complete the perfect meal.',
    phone: '+1-555-1002',
    email: 'info@burgerjoint.com',
    cuisineTypes: ['American', 'Burgers'],
    address: {
      street: '789 Burger Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10009',
      coordinates: {
        type: 'Point',
        coordinates: [-73.9712, 40.7505]
      }
    },
    menu: [
      {
        name: 'Classic Cheeseburger',
        description: '1/3 lb beef patty with cheese, lettuce, tomato, and special sauce',
        price: 16.99,
        category: 'Burgers',
        preparationTime: 12,
        allergens: ['Dairy', 'Gluten', 'Beef'],
        nutritionalInfo: {
          calories: 650,
          protein: 35,
          carbs: 45,
          fat: 35
        }
      },
      {
        name: 'Bacon Deluxe',
        description: 'Double patty with bacon, cheese, and all the fixings',
        price: 22.99,
        category: 'Burgers',
        preparationTime: 15,
        allergens: ['Dairy', 'Gluten', 'Beef', 'Pork'],
        nutritionalInfo: {
          calories: 950,
          protein: 45,
          carbs: 45,
          fat: 55
        }
      },
      {
        name: 'Hand-Cut Fries',
        description: 'Crispy golden fries seasoned with sea salt',
        price: 5.99,
        category: 'Sides',
        preparationTime: 8,
        allergens: [],
        nutritionalInfo: {
          calories: 380,
          protein: 5,
          carbs: 45,
          fat: 18
        }
      },
      {
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate milkshake with whipped cream',
        price: 7.99,
        category: 'Drinks',
        preparationTime: 5,
        allergens: ['Dairy'],
        nutritionalInfo: {
          calories: 420,
          protein: 8,
          carbs: 55,
          fat: 18
        }
      }
    ],
    operatingHours: {
      monday: { open: '11:00', close: '23:00', isOpen: true },
      tuesday: { open: '11:00', close: '23:00', isOpen: true },
      wednesday: { open: '11:00', close: '23:00', isOpen: true },
      thursday: { open: '11:00', close: '23:00', isOpen: true },
      friday: { open: '11:00', close: '00:00', isOpen: true },
      saturday: { open: '12:00', close: '00:00', isOpen: true },
      sunday: { open: '12:00', close: '22:00', isOpen: true }
    },
    deliveryInfo: {
      deliveryFee: 2.99,
      minimumOrder: 12.00,
      deliveryRadius: 7000,
      estimatedDeliveryTime: 25
    },
    ratings: {
      average: 4.3,
      count: 156
    },
    status: 'approved',
    isActive: true,
    isOpen: true
  }
];

// Function to create sample orders
const createSampleOrders = async (users, restaurants) => {
  const orders = [];
  const customers = users.filter(user => user.role === 'user');
  const deliveryPersons = users.filter(user => user.role === 'delivery_person');

  // Create orders for each restaurant
  for (const restaurant of restaurants) {
    const restaurantMenu = restaurant.menu;
    
    // Create 3-5 orders per restaurant
    const numOrders = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numOrders; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const deliveryPerson = deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)];
      
      // Select random menu items
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedItems = [];
      const usedIndices = new Set();
      
      for (let j = 0; j < numItems; j++) {
        let itemIndex;
        do {
          itemIndex = Math.floor(Math.random() * restaurantMenu.length);
        } while (usedIndices.has(itemIndex));
        
        usedIndices.add(itemIndex);
        const menuItem = restaurantMenu[itemIndex];
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        selectedItems.push({
          menuItem: menuItem._id || new mongoose.Types.ObjectId(),
          name: menuItem.name,
          price: menuItem.price,
          quantity: quantity,
          specialInstructions: Math.random() > 0.7 ? 'Extra spicy please' : '',
          subtotal: menuItem.price * quantity
        });
      }
      
      const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const deliveryFee = restaurant.deliveryInfo.deliveryFee;
      const tax = subtotal * 0.0875; // 8.75% tax rate
      const tip = Math.floor(Math.random() * 5) + 2; // $2-$6 tip
      const total = subtotal + deliveryFee + tax + tip;
      
      // Random order status
      const statuses = ['delivered', 'out_for_delivery', 'ready', 'preparing', 'confirmed'];
      const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Calculate estimated delivery time
      const now = new Date();
      const estimatedDeliveryTime = new Date(now.getTime() + (restaurant.deliveryInfo.estimatedDeliveryTime * 60000));
      
      const order = {
        customer: customer._id,
        restaurant: restaurant._id,
        deliveryPerson: deliveryPerson._id,
        items: selectedItems,
        deliveryAddress: customer.address,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        tip: tip,
        total: total,
        paymentMethod: ['credit_card', 'debit_card', 'digital_wallet'][Math.floor(Math.random() * 3)],
        paymentStatus: 'paid',
        orderStatus: orderStatus,
        estimatedDeliveryTime: estimatedDeliveryTime,
        actualDeliveryTime: orderStatus === 'delivered' ? new Date(estimatedDeliveryTime.getTime() + (Math.random() * 300000)) : null,
        specialInstructions: Math.random() > 0.8 ? 'Please ring doorbell twice' : '',
        rating: orderStatus === 'delivered' ? Math.floor(Math.random() * 2) + 4 : null, // 4-5 stars
        review: orderStatus === 'delivered' && Math.random() > 0.5 ? 'Great food and fast delivery!' : null,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
      };
      
      orders.push(order);
    }
  }
  
  return orders;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    
    // Create restaurants
    console.log('🍕 Creating restaurants...');
    const createdRestaurants = [];
    const restaurantOwners = createdUsers.filter(user => user.role === 'restaurant_owner');
    
    for (let i = 0; i < sampleRestaurants.length; i++) {
      const restaurantData = {
        ...sampleRestaurants[i],
        owner: restaurantOwners[i % restaurantOwners.length]._id
      };
      
      const restaurant = await Restaurant.create(restaurantData);
      createdRestaurants.push(restaurant);
      console.log(`✅ Created restaurant: ${restaurant.name}`);
    }
    
    // Create orders
    console.log('📦 Creating orders...');
    const sampleOrders = await createSampleOrders(createdUsers, createdRestaurants);
    
    for (const orderData of sampleOrders) {
      const order = await Order.create(orderData);
      console.log(`✅ Created order: ${order.orderNumber} - $${order.total.toFixed(2)}`);
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Restaurants: ${createdRestaurants.length}`);
    console.log(`   - Orders: ${sampleOrders.length}`);
    
    // Display sample data
    console.log('\n📋 Sample Data Created:');
    console.log('Users:');
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.role}) - ${user.email}`);
    });
    
    console.log('\nRestaurants:');
    createdRestaurants.forEach(restaurant => {
      console.log(`   - ${restaurant.name} (${restaurant.cuisineTypes.join(', ')})`);
    });
    
    console.log('\nOrders:');
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    recentOrders.forEach(order => {
      console.log(`   - ${order.orderNumber}: $${order.total.toFixed(2)} (${order.orderStatus})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };