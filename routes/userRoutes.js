const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUserById);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// Limit access on all routes after this to Admin users only
router.use(authController.restrictTo('admin'));

// Collection routes:
// GET /api/v1/users     -> list all users
// POST /api/v1/users    -> create a new user
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// Resource routes:
// GET /api/v1/users/:id    -> get one user
// PATCH /api/v1/users/:id  -> update one user (placeholder)
// DELETE /api/v1/users/:id -> delete one user (placeholder)
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
