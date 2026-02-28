const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/**
 * GET /api/v1/tours
 * Return all tours with metadata (request timestamp and count).
 */
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(
    // Populate does make an additional query to the database so can impact performance
    Tour.find(),
    req.query
  )

    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
});

/**
 * GET /api/v1/tours/:id
 * Return a single tour matching a MongoDB ObjectId.
 */
exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  /// This is mongoose shorthand for
  /// Tour.findONe({_id: req.params.id});

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: { tour },
  });
});

/**
 * POST /api/v1/tours
 * Create a new tour from request body and persist to the JSON data file.
 */
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});

/**
 * PATCH /api/v1/tours/:id
 * Placeholder handler for partial updates.
 */
exports.updateTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(201).json({
    status: 'success',
    data: { tour },
  });
});

/**
 * DELETE /api/v1/tours/:id
 * Placeholder handler for deleting a tour by id.
 */
exports.deleteTourById = catchAsync(async (req, res, next) => {
  const result = await Tour.deleteOne({ _id: req.params.id });

  if (result.deletedCount === 0) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);
  res.status(201).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // const year = Number(req.params.year);
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        $expr: {
          $and: [
            { $gte: [{ $toDate: '$startDates' }, new Date(`${year}-01-01`)] },
            { $lte: [{ $toDate: '$startDates' }, new Date(`${year}-12-31`)] },
          ],
        },
      },
    },
    {
      $group: {
        _id: { $month: { $toDate: '$startDates' } },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(201).json({
    status: 'success',
    data: plan,
  });
});
