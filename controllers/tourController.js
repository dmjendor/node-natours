const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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
exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
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
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Unable to retrieve tours.',
      error: error,
    });
  }
};

/**
 * GET /api/v1/tours/:id
 * Return a single tour matching a MongoDB ObjectId.
 */
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    /// This is mongoose shorthand for
    /// Tour.findONe({_id: req.params.id});

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour found with id ${req.params.id}.`,
      });
    }

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Unable to retrieve tour.',
      error: error,
    });
  }
};

/**
 * POST /api/v1/tours
 * Create a new tour from request body and persist to the JSON data file.
 */
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Invalid data sent',
    });
  }
};

/**
 * PATCH /api/v1/tours/:id
 * Placeholder handler for partial updates.
 */
exports.updateTourById = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Unable to update tour',
    });
  }
};

/**
 * DELETE /api/v1/tours/:id
 * Placeholder handler for deleting a tour by id.
 */
exports.deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Unable to delete tour',
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Unable to get tour stats',
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    // const year = Number(req.params.year);
    const year = req.params.year * 1;
    console.log('year', new Date(`${year}-01-01`));
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
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Unable to get tour stats',
    });
  }
};
