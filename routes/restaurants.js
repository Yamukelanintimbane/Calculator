const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET all restaurants (public route)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, cuisineType, minRating, maxDeliveryFee } = req.query;

    let query = Restaurant.find({
      status: 'approved',
      isActive: true,
    });

    if (search) {
      query = query.or([
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]);
    }

    if (cuisineType) {
      query = query.where({ cuisineTypes: cuisineType });
    }

    if (minRating) {
      query = query.where({ 'ratings.average': { $gte: parseFloat(minRating) } });
    }

    if (maxDeliveryFee) {
      query = query.where({ 'deliveryInfo.deliveryFee': { $lte: parseFloat(maxDeliveryFee) } });
    }

    const restaurants = await query
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'ratings.average': -1 });

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
});

// GET nearby restaurants (public route)
router.get('/nearby', async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const restaurants = await Restaurant.find({
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(maxDistance),
        },
      },
      status: 'approved',
      isActive: true,
    }).limit(20);

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
});

// GET restaurant by ID (public route)
router.get('/:id', async (req, res, next) => {
  try {
    // Basic ObjectId validation
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID format'
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || restaurant.status !== 'approved' || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found or not available'
      });
    }
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;