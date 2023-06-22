const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppErrors');
const catchAsync = require('../utils/catchAsync');

const secret = 'ASWEALLbe-@l$ivedSetoff@sidemen-secrets-models*&';
const signJwt = (id) => {
  return jwt.sign({ id: id }, secret, {
    expiresIn: '90d',
  });
};
const createTokenAndSend = (user, statusCode, res) => {
  try {
    const token = signJwt(user._id);

    const cookiesOptions = {
      expire: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('jwt', token, cookiesOptions);
    res.status(statusCode).json({
      status: 'success',
      token,
    });
  } catch (error) {
    console.log(error);

    res.json({ error });
  }
};
exports.handleSignUp = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log({ newUser });
  createTokenAndSend(newUser, 201, res, next);
});

exports.handleSignIn = catchAsync(async (req, res, next) => {
  //authriazation headers extraction from request obj
  const { email, password } = req.body;
  //1)check if email and password exist
  if (!email || !password)
    return next(new AppError('please provide email and password', 400));
  //2)check if user exists && password is correct

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('incorrect email or password', 401));

  //3)if everything ok, send token to client
  createTokenAndSend(user, 200, res, next);
});

exports.handleSignOut = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success',
  });
});

exports.tokenChecker = catchAsync(async (req, res, next) => {
  console.log(req.cookies);
  let token;
  if (
    req?.cookies?.jwt ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer'))
  ) {
    token = req?.cookies.jwt || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // const token = req.cookies.jwt;
  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('user no longer exists', 401));
  req.user = user;
  next();
});

exports.checkCapability = (capability) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next(
          new AppError('You dont have permission to do this operation', 403)
        );
      }
    } catch (e) {
      next(new AppError(e.message, 500));
    }
  };
};

exports.handleSignOut = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt'); //clear cookie
});
