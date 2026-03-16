const Tour = require('../models/tourModel');
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

  console.log(tour);
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
