const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

// Resource routes:
// GET /api/v1/users/:id    -> get one user
// PATCH /api/v1/users/:id  -> update one user (placeholder)
// DELETE /api/v1/users/:id -> delete one user (placeholder)
router.route('/tour/:tour').get(reviewController.getTourReviews);

router.route('/user/:user').get(reviewController.getUserReviews);
//   .patch(userController.updateUserById)
//   .delete(userController.deleteUserById);

module.exports = router;
