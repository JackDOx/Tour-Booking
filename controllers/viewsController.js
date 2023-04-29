const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const { updateUser } = require('./userController');

exports.getOverview = catchAsync( async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using tour data from step 1
  res.status(200).render('overview', {  //render the file overview.pug with this data
    title: 'All Tours',
    tours
});
});

exports.getTour = catchAsync(async (req, res, next) => {

  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  };

  res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200)
  .set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('login', {
    title: 'Log into your account'
  });

};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up new user'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

// Controller for Booked tours rendering
exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all tours users have booked
  const bookings = await Booking.find( {user: req.user.id});

  //2) Find tours with the returned Ids
  const tourIDs = bookings.map(el => el.tour) // return the ids of the tours user has booked
  const tours = await Tour.find({_id: {$in: tourIDs}}); // find all tours with id in the tourIDs array
  
  res.status(200).render('booking', {
    title: 'My booked Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.user.id);
  const updateUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  },
  {
    new: true,
    runValidators: true
  });

  res.status(200).render('account', {
    title: 'Your account',
    user: updateUser
  });
});