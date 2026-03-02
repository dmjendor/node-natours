const mongoose = require('mongoose');
const Review = require('../models/reviewModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const reviews = await Review.find()
    .populate({
      path: 'tour',
      select: 'name',
      options: { skipGuidesPopulate: true },
    })
    .populate({
      path: 'user',
      select: 'name photo',
    });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: { reviews },
  });
});

exports.getTourReviews = catchAsync(async (req, res, next) => {
  const tourId = new mongoose.Types.ObjectId(req.params.tour);

  const reviews = await Review.find({ tour: tourId })
    .populate({
      path: 'tour',
      select: 'name',
      options: { skipGuidesPopulate: true },
    })
    .populate({
      path: 'user',
      select: 'name',
    });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: { reviews },
  });
});

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.params.user);

  const reviews = await Review.find({ user: userId })
    .populate({
      path: 'tour',
      select: 'name',
      options: { skipGuidesPopulate: true },
    })
    .populate({
      path: 'user',
      select: 'name',
    });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: { reviews },
  });
});

/**
 * POST /api/v1/reviews
 * Create a new review from request body and persist to the JSON data file.
 */
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { user: newReview },
  });
});
