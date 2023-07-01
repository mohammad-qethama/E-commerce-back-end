// user getter using USERMODEL moongoose

const User = require('../models/usersModel.js');
const catchAsync = require('../utils/catchAsync.js');
exports.getMe = catchAsync(async (req, res) => {
  //   const user = await User.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json(user);
});

exports.addToMyCart = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  const product = await Product.findById(req.body.productId);
  user.cart.products.push(product);
  await user.save();
  res.status(200).json({
    status: 'success',
    data: user.cart,
  });
});

exports.deleteFromMyCart = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  const product = await Product.findById(req.body.productId);
  user.carts.products = user.cart.products.filter((el) => el.id !== product.id);
  await user.save();
  res.status(200).json({
    status: 'success',
    data: user.cart,
  });
});
