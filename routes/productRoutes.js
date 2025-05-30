
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProduct, getPaginatedProducts, getProductById } = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
router.post('/', verifyToken, upload.array('productImage', 5), uploadProduct);
router.get('/paginated', verifyToken, getPaginatedProducts);
router.get('/:id', verifyToken, getProductById); // ✅ NEW ROUTE for product details

module.exports = router;
