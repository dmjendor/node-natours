const express = require('express');
const viewsController = require('../controllers/viewsController');
// const loginController = require('../controllers/loginController');

const router = express.Router({ mergeParams: true });

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);

// LOGIN
router.get('/login', viewsController.getLoginForm);
module.exports = router;
