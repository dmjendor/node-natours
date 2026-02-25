const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    select: false,
    required: [true, 'A user must have a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    select: false,
    validate: {
      // this only works on CREATE and SAVE
      validator: function (val) {
        return val === this.password;
      },
      message: 'The confirm password must match the password.',
    },
    required: [true, 'You must confirm the entered password'],
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

userSchema.pre('save', async function (next) {
  // Only run if the password has been modified
  if (!this.isModified('password')) return next();

  // Encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
  // Clear the confirm so it isn't saved to the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // Only run if the password has been modified
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // gives the database time to save the change. So the check for changedPasswordAfter doesnt fail immediately.
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async function (
  enteredPassword,
  userPassword
) {
  const pass = await bcrypt.compare(enteredPassword, userPassword);
  return pass;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};
module.exports = mongoose.model('User', userSchema);
