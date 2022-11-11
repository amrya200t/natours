const express = require('express');
const viewsController = require('../controllers/viewsController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.protect, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserDate
);

module.exports = router;
