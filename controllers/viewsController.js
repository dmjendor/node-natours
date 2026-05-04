const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get all the tour data from the collection
  const tours = await Tour.find();
  // build template
  // renter template using tour data.
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // get all the tour data from the collection

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
    populate: {
      path: 'user',
      select: 'name photo', // or 'name image' depending on your User schema
    },
  });

  if (!tour) {
    return next(new AppError('Please provide a valid tour slug', 400));
  }

  // build template
  // renter template using tour data.
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    mapboxToken: process.env.MAP_KEY,
  });
});

exports.getLoginForm = (req, res) => {
  // get all the tour data from the collection
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
