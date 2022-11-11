const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //*1) Get tours data from collection.
  const tours = await Tour.find();

  //* 2) Build template

  //* 3) Render that template using tour data from 1.
  return res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // TODO: 1) Get the data, for the requested tour. (including reviews, and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // TODO: 2) Build template

  // TODO: 3) Render that template using tour data from 1.
  return res
    .status(200)
    .set({
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Content-Security-Policy':
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    })

    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: `Your account`,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings.
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs.
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: `My Tours`,
    tours,
  });
});

exports.updateUserDate = catchAsync(async (req, res, next) => {
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

  return res.status(200).render('account', {
    title: `Your account`,
    user: updatedUser,
  });
});

exports.getLoginForm = (req, res) =>
  res.status(200).render('login', {
    title: `Log into your account`,
  });

exports.getSignupForm = (req, res) =>
  res.status(200).render('signup', {
    title: `Create new Account`,
  });
