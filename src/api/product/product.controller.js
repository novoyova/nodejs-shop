const mongoose = require('mongoose');

const Product = require('./product.model');

exports.getAllProduct = (req, res, next) => {
  Product.find().select('_id price name productImage').exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`
            }
          };
        })
      }
      console.log(response);
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.createProduct = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path.replace(/\\/g, '/')
  });

  product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        }
      });
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).select('_id name price productImage').exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products'
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.updateProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.updateOne({ _id: id }, { $set: req.body }).exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id }).exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};