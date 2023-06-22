const Product = require('../models/productsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppErrors');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({}, { comments: 0 });
  res.status(200).json({ status: 'success', data: { products } });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: { product } });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.body)
    return res
      .status(400)
      .json({ status: 'fail', message: 'dont send empty requests please!!' });

  console.log(req.body);

  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    img: req.body.img,
    price: req.body.price,
    category: req.body.category,
  });

  res.status(201).json({ status: 'success', data: { product } });
});

exports.editProduct = catchAsync(async (req, res, next) => {
  const { rating, ...updatedObj } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updatedObj,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedProduct) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({ status: 'success', data: { updatedProduct } });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({ status: 'success', data: null });
});
