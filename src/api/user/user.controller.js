const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./user.model');

exports.getAllUser = (req, res, next) => {
  User.find().exec()
    .then(result => {
      res.status(200).json({
        users: result
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
};

exports.signup = (req, res, next) => {
  // Check if user is exist
  User.find({ email: req.body.email }).exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'email already used'
        });
      } else {
        // Hashed the password
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            return res.status(500).json({
              error: error
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(error => {
                console.log(error);
                res.status(500).json({
                  error: error
                });
              });
          }
        });
      }
    })
};

exports.login = (req, res, next) => {
  User.find({ email: req.body.email }).exec()
    .then(user => {
      // Check if user exist
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }

      // Check if password match
      bcrypt.compare(req.body.password, user[0].password, (error, result) => {
        if (result) {
          const token = jwt.sign({
            userId: user[0]._id,
            email: user[0].email
          },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          );

          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Auth failed'
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

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId }).exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
};