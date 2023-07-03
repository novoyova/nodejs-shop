const mongoose = require('mongoose');

const Order = require('./order.model');
const Product = require('../product/product.model');

exports.getAllOrder = (req, res, next) => {
  Order.find()
    .select('_id product quantity')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${doc._id}`
            }
          };
        })
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
};

exports.createOrder = (req, res, next) => {
  // Make sure that the product is exist
  Product.findById(req.body.productId).exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });

      order.save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: 'Order stored',
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity
            },
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${result._id}`
            }
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error: error
          });
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
};

exports.getOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }

      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders'
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
};

exports.deleteOrder = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: {
            productId: 'ID',
            quantity: 'Number'
          }
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
};