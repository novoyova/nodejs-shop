const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/product/product.routes');
const orderRoutes = require('./api/order/order.routes');
const userRoutes = require('./api/user/user.routes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(response => {
    console.log(`Database connected to ${response.connection.host}`);
  })
  .catch(error => {
    console.log({message: 'Failed to connect to database', error: error});
  });

/**
 * Middleware
 */
app.use(morgan('dev'));

// Make uploads folder publicly accessible
app.use('/uploads', express.static('uploads'));

// Parsing the body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }

  next();
});

// Routes which handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Create error if no routes can handle the request
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Handle error created above or error flows from anywhere else in this application
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;