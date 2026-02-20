const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

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
