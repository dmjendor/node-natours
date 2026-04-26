const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

// const loginController = require('../controllers/loginController');

const router = express.Router({ mergeParams: true });

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);

// LOGIN
router.get('/login', viewsController.getLoginForm);
module.exports = router;
