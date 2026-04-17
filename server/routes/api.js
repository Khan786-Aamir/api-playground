const express = require('express');
const router = express.Router();
const axios = require('axios');
const Endpoint = require('../models/Endpoint');
const { protect } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

// @route   GET /api/endpoints
router.get('/', async (req, res) => {
  try {
    const endpoints = await Endpoint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(endpoints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch endpoints' });
  }
});

// @route   POST /api/endpoints
router.post('/', async (req, res) => {
  try {
    const { name, url, method, headers, body } = req.body;

    if (!name || !url || !method) {
      return res.status(400).json({ message: 'Name, URL, and method are required' });
    }

    const endpoint = await Endpoint.create({
      user: req.user._id,
      name,
      url,
      method,
      headers: headers || {},
      body: body || '',
    });

    res.status(201).json(endpoint);
  } catch (error) {
    console.error('Create endpoint error:', error);
    res.status(500).json({ message: 'Failed to create endpoint' });
  }
});

// @route   DELETE /api/endpoints/:id
router.delete('/:id', async (req, res) => {
  try {
    const endpoint = await Endpoint.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    await endpoint.deleteOne();
    res.json({ message: 'Endpoint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete endpoint' });
  }
});

// @route   POST /api/endpoints/:id/test
router.post('/:id/test', async (req, res) => {
  try {
    const endpoint = await Endpoint.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    const headersObj = {};
    if (endpoint.headers instanceof Map) {
      endpoint.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (typeof endpoint.headers === 'object') {
      Object.assign(headersObj, endpoint.headers);
    }

    const config = {
      method: endpoint.method.toLowerCase(),
      url: endpoint.url,
      headers: headersObj,
      timeout: 15000,
      validateStatus: () => true, // Don't throw on any HTTP status
    };

    if (['post', 'put', 'patch'].includes(config.method) && endpoint.body) {
      try {
        config.data = JSON.parse(endpoint.body);
      } catch {
        config.data = endpoint.body;
      }
    }

    const startTime = Date.now();
    const response = await axios(config);
    const duration = Date.now() - startTime;

    // Save last response
    endpoint.lastResponse = {
      status: response.status,
      data: response.data,
      testedAt: new Date(),
    };
    await endpoint.save();

    res.json({
      status: response.status,
      statusText: response.statusText,
      duration,
      headers: response.headers,
      data: response.data,
    });
  } catch (error) {
    console.error('Test endpoint error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(502).json({ message: 'Connection refused — the target server is not reachable.', code: error.code });
    }
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return res.status(504).json({ message: 'Request timed out after 15 seconds.', code: error.code });
    }
    if (error.code === 'ENOTFOUND') {
      return res.status(502).json({ message: 'Host not found — check the URL.', code: error.code });
    }

    res.status(500).json({ message: error.message || 'Failed to test endpoint' });
  }
});

module.exports = router;
