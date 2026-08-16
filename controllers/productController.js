const Product = require('../models/product');

// Upload a new product
const uploadProduct = async (req, res) => {
  try {
    const {
      location,
      type,
      description,
      startingAmount,
      endTime,
      duration,
    } = req.body;

    const images = req.files?.map((file) => file.path) || [];

    const newProduct = new Product({
      location,
      type,
      description,
      startingAmount,
      startTime: new Date(), // Start time is now
      endTime: new Date(endTime),
      duration,
      images,
      createdBy: req.user.id,
    });

    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Error uploading product:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get paginated products: GET /api/products/paginated?page=1&limit=4
const getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Product.countDocuments();
    const hasMore = (page * limit) < totalCount;

    res.status(200).json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasMore,
    });
  } catch (err) {
    console.error('Error fetching paginated products:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  uploadProduct,
  getPaginatedProducts,
  getProductById, // export the new controller
};
