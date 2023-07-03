const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../../middleware/check-auth');

const ProductController = require('./product.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 mb
  },
  fileFilter: fileFilter
});

router.get('/', ProductController.getAllProduct);

// Use Form
router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

router.get('/:productId', ProductController.getProduct);

// PUT: sends data that updates the entire resource
// PATCH: sends partial data that is to be updated without modifying the entire data
// Use JSON Content
router.patch('/:productId', checkAuth, ProductController.updateProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;