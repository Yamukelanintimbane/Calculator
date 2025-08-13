const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// Middleware placeholder - you can implement these later
const protect = (req, res, next) => {
  // For now, just pass through
  next();
};

const authorize = (role) => {
  return (req, res, next) => {
    // For now, just pass through
    next();
  };
};

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName} format`
      });
    }
    next();
  };
};

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      success: false,
      error: 'Page must be a positive number'
    });
  }
  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Limit must be between 1 and 100'
    });
  }
  next();
};

// Admin controller functions
const getAllRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = Restaurant.find();
    
    if (status) {
      query = query.where({ status });
    }
    
    const restaurants = await query
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Restaurant.countDocuments(query.getQuery());
    
    res.status(200).json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateRestaurantStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    
    let query = User.find();
    
    if (role) {
      query = query.where({ role });
    }
    
    const users = await query
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query.getQuery());
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = Order.find();
    
    if (status) {
      query = query.where({ orderStatus: status });
    }
    
    const orders = await query
      .populate('customer', 'name email')
      .populate('restaurant', 'name')
      .populate('deliveryPerson', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query.getQuery());
    
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Apply middleware
router.use(protect, authorize('admin'));

// Routes
router.get('/restaurants', validatePagination, getAllRestaurants);
router.put('/restaurants/:id/status', validateObjectId('id'), updateRestaurantStatus);
router.get('/users', validatePagination, getAllUsers);
router.delete('/users/:id', validateObjectId('id'), deleteUser);
router.get('/orders', validatePagination, getAllOrders);

module.exports = router;