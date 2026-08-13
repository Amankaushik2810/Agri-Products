const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserById, } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/profile', authMiddleware, getUserProfile);
router.put('/update-profile', authMiddleware, updateUserProfile);
router.get('/:id', authMiddleware, getUserById); // <== this one is used in your OwnerChatDashboard

module.exports = router;
