const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');

const OrderController = require('./order.controller');

// Handle incoming GET requests to /orders
router.get('/', checkAuth, OrderController.getAllOrder);

router.post('/', checkAuth, OrderController.createOrder);

router.get('/:orderId', checkAuth, OrderController.getOrder);

router.delete('/:orderId', checkAuth, OrderController.deleteOrder);

module.exports = router;