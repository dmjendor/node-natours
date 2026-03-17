const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
  // get all the tour data from the collection
  const user = await User.find();
  if (!user)
    return next(new AppError('Invalid username or password entered.', 400));
  // build template
  // renter template using tour data.
  res.status(200).render('overview', {
    title: 'All Tours',
    user,
  });
});
