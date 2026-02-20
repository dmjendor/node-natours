const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
});

/**
 * GET /api/v1/users/:id
 * Return a single user matching a MongoDB ObjectId.
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  /// This is mongoose shorthand for
  /// User.findONe({_id: req.params.id});

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: { user },
  });
});

/**
 * POST /api/v1/users
 * Create a new user from request body and persist to the JSON data file.
 */
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { user: newUser },
  });
});

/**
 * PATCH /api/v1/users/:id
 * Placeholder handler for partial updates.
 */
exports.updateUserById = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

/**
 * DELETE /api/v1/users/:id
 * Placeholder handler for deleting a user by id.
 */
exports.deleteUserById = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(201).json({
    status: 'success',
    data: null,
  });
});
