const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

// Example function to create a specific order
const createSpecificOrder = async () => {
  try {
    console.log('🍕 Creating a specific order example...');
    
    // Check if we have a database connection
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri === 'mongodb://localhost:27017/food-delivery') {
      console.log('⚠️  No database connection available.');
      console.log('📝 This example shows the order creation process:');
      
      // Show the order creation process
      console.log('\n📋 Order Creation Process:');
      console.log('1. Find or create a customer');
      console.log('2. Find or create a restaurant');
      console.log('3. Select menu items');
      console.log('4. Calculate pricing');
      console.log('5. Create the order');
      
      // Example order data
      const exampleOrder = {
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            coordinates: {
              type: 'Point',
              coordinates: [-74.006, 40.7128]
            }
          }
        },
        restaurant: {
          name: 'Pizza Palace',
          deliveryFee: 3.99,
          minimumOrder: 15.00
        },
        items: [
          {
            name: 'Margherita Pizza',
            price: 18.99,
            quantity: 2,
            subtotal: 37.98
          },
          {
            name: 'Garlic Bread',
            price: 6.99,
            quantity: 1,
            subtotal: 6.99
          }
        ],
        pricing: {
          subtotal: 44.97,
          deliveryFee: 3.99,
          tax: 3.93, // 8.75% tax rate
          tip: 5.00,
          total: 57.89
        },
        orderDetails: {
          paymentMethod: 'credit_card',
          estimatedDeliveryTime: '30 minutes',
          specialInstructions: 'Extra cheese on pizza, please ring doorbell'
        }
      };
      
      console.log('\n📦 Example Order Structure:');
      console.log(JSON.stringify(exampleOrder, null, 2));
      
      return;
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Step 1: Find or create a customer
    console.log('\n👤 Step 1: Finding customer...');
    let customer = await User.findOne({ email: 'john@example.com' });
    
    if (!customer) {
      console.log('Creating new customer...');
      customer = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'customer123',
        role: 'user',
        phone: '+1-555-0101',
        address: {
          street: '123 Main St',
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
      });
      console.log(`✅ Created customer: ${customer.name}`);
    } else {
      console.log(`✅ Found customer: ${customer.name}`);
    }
    
    // Step 2: Find or create a restaurant
    console.log('\n🍕 Step 2: Finding restaurant...');
    let restaurant = await Restaurant.findOne({ name: 'Pizza Palace' });
    
    if (!restaurant) {
      console.log('Creating new restaurant...');
      restaurant = await Restaurant.create({
        name: 'Pizza Palace',
        description: 'Authentic Italian pizza made with fresh ingredients.',
        owner: customer._id, // Using customer as owner for demo
        phone: '+1-555-1000',
        email: 'info@pizzapalace.com',
        cuisineTypes: ['Italian', 'Pizza'],
        address: {
          street: '456 Pizza Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
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
      });
      console.log(`✅ Created restaurant: ${restaurant.name}`);
    } else {
      console.log(`✅ Found restaurant: ${restaurant.name}`);
    }
    
    // Step 3: Create order items
    console.log('\n📦 Step 3: Creating order items...');
    const orderItems = [
      {
        menuItem: restaurant.menu[0]._id || new mongoose.Types.ObjectId(),
        name: restaurant.menu[0].name,
        price: restaurant.menu[0].price,
        quantity: 2,
        specialInstructions: 'Extra cheese please',
        subtotal: restaurant.menu[0].price * 2
      },
      {
        menuItem: restaurant.menu[1]._id || new mongoose.Types.ObjectId(),
        name: restaurant.menu[1].name,
        price: restaurant.menu[1].price,
        quantity: 1,
        subtotal: restaurant.menu[1].price * 1
      }
    ];
    
    console.log('Order items:');
    orderItems.forEach(item => {
      console.log(`   - ${item.name} x${item.quantity}: $${item.subtotal.toFixed(2)}`);
    });
    
    // Step 4: Calculate pricing
    console.log('\n💰 Step 4: Calculating pricing...');
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryFee = restaurant.deliveryInfo.deliveryFee;
    const tax = subtotal * 0.0875; // 8.75% tax rate
    const tip = 5.00;
    const total = subtotal + deliveryFee + tax + tip;
    
    console.log(`   Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   Delivery Fee: $${deliveryFee.toFixed(2)}`);
    console.log(`   Tax (8.75%): $${tax.toFixed(2)}`);
    console.log(`   Tip: $${tip.toFixed(2)}`);
    console.log(`   Total: $${total.toFixed(2)}`);
    
    // Step 5: Create the order
    console.log('\n📋 Step 5: Creating the order...');
    const order = await Order.create({
      customer: customer._id,
      restaurant: restaurant._id,
      items: orderItems,
      deliveryAddress: customer.address,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      tip: tip,
      total: total,
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      estimatedDeliveryTime: new Date(Date.now() + (restaurant.deliveryInfo.estimatedDeliveryTime * 60000)),
      specialInstructions: 'Please ring doorbell twice',
      createdAt: new Date()
    });
    
    console.log(`✅ Order created successfully!`);
    console.log(`   Order Number: ${order.orderNumber}`);
    console.log(`   Total Amount: $${order.total.toFixed(2)}`);
    console.log(`   Status: ${order.orderStatus}`);
    console.log(`   Estimated Delivery: ${order.estimatedDeliveryTime.toLocaleTimeString()}`);
    
    // Display the complete order
    console.log('\n📋 Complete Order Details:');
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('restaurant', 'name');
    
    console.log(JSON.stringify(populatedOrder, null, 2));
    
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
};

// Run the example
createSpecificOrder();