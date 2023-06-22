const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.tokenChecker,
    authController.checkCapability('create'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.tokenChecker,
    authController.checkCapability('update'),
    productController.editProduct
  )
  .delete(
    authController.tokenChecker,
    authController.checkCapability('delete'),
    productController.deleteProduct
  );
module.exports = router;
