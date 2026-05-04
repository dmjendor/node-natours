const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

// const loginController = require('../controllers/loginController');

const router = express.Router({ mergeParams: true });

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

// LOGIN
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
