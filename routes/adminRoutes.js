const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticate);
router.use(authorizeAdmin);

// Movies management
router.post('/movies', adminController.createMovie);
router.put('/movies/:movieId', adminController.updateMovie);
router.delete('/movies/:movieId', adminController.deleteMovie);

// Review management
router.delete('/reviews/:reviewId', adminController.deleteReviewAdmin);

module.exports = router;
