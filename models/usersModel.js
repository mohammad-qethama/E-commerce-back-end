const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: [true, 'please enter your account  username'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, ' an unique and valid email address is required'],
    validate: [validator.isEmail, 'please enter an valid email'],
  },
  password: {
    type: String,
    required: [true, 'please enter password '],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function () {
        return this.passwordConfirm === this.password;
      },
      message: 'password and password confirmation does not match',
    },
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'moderator', 'admin'],
    default: 'user',
  },
  photo: { type: String },
  cart: { type: Object, default: { products: [], totalPrice: 0 } },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.virtual('capabilities').get(function () {
  const userRoles = this.role;
  const userCapabilities = {
    user: ['read'],
    moderator: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete'],
  };
  return userCapabilities[userRoles];
});
const User = mongoose.model('User', userSchema);

module.exports = User;
