const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
// Validate `:id` params for all routes that include an id segment.
// router.param('id', tourController.checkID);

// Collection routes:
// GET /api/v1/tours     -> list all tours
// POST /api/v1/tours    -> create a new tour
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// Resource routes:
// GET /api/v1/tours/:id    -> get one tour
// PATCH /api/v1/tours/:id  -> update one tour (placeholder)
// DELETE /api/v1/tours/:id -> delete one tour (placeholder)
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTourById)
  .delete(tourController.deleteTourById);

module.exports = router;
