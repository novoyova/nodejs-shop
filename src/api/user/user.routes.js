const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');

const UserController = require('./user.controller');

// router.get('/', UserController.getAllUser);

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

// router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;