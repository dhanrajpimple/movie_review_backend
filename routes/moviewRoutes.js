const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieControllers');
const reviewController = require('../controllers/reviewControllers');
const { authenticate } = require('../middleware/auth');

// Movies list and details
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieDetails);

// Reviews operations (authenticated)
router.post('/:movieId/reviews', authenticate, reviewController.addReview);
router.put('/:movieId/reviews/:reviewId', authenticate, reviewController.editReview);
router.delete('/:movieId/reviews/:reviewId', authenticate, reviewController.deleteReview);
router.post('/reviews/:reviewId/like', authenticate, reviewController.likeReview);

module.exports = router;
