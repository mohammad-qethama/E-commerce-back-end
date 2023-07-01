const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.handleSignUp);
router.post('/signin', authController.handleSignIn);
router.post('/signInAsVendor', (req, res, next) => {
  res.status(200).json({ response: 'not implemented yet' });
});

router.get('/signout', authController.handleSignOut);

router.get(
  '/secret-route',
  authController.tokenChecker,
  authController.checkCapability('delete'),
  (req, res, next) => {
    res.send(`Secret route`);
  }
);
router.get(
  '/api/v1/users/me',
  authController.tokenChecker,
  userController.getMe
);

router.patch(
  '/api/v1/users/addToMyCart',
  authController.tokenChecker,
  userController.addToMyCart
);
module.exports = router;
