const Tour = require('../models/tourModel');

/**
 * GET /api/v1/tours
 * Return all tours with metadata (request timestamp and count).
 */
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1a)  Filtering
    const { page, limit, sort, fields, ...queryObj } = req.query;

    // 1b) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // 2) Build Query
    let query = Tour.find(JSON.parse(queryStr));
    console.log(req.query);

    // 3) Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-name');
    }

    // 4) Field Limiting
    if (fields) {
      const queryFields = fields.split(',').join(' ');
      query = query.select(queryFields);
    } else {
      query = query.select('-__v');
    }

    // 5) Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 100;
    const skip = (pageNum - 1) * limitNum;
    query = query.skip(skip).limit(limitNum);

    if (page) {
      const numTours = await Tour.countDocuments();
      if (skip > numTours) throw new Error('This page does not exist.');
    }

    // EXECUTE QUERY
    const tours = await query;

    // const tours = await Tour.find()
    //   .where('duration')
    //   .lte(5)
    //   .where('difficulty')
    //   .equals('easy');
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
