const express = require('express');

const authController = require('../controllers/authController');

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
module.exports = router;
