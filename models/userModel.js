const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
});

userSchema.pre('save', async function (next) {
  // Only run if the password has been modified
  if (!this.isModified('password')) return next();

  // Encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
  // Clear the confirm so it isn't saved to the database
  this.passwordConfirm = undefined;
});

userSchema.methods.checkPassword = async function (
  enteredPassword,
  userPassword
) {
  const pass = await bcrypt.compare(enteredPassword, userPassword);
  console.log(enteredPassword, userPassword, pass);
  return pass;
};

module.exports = mongoose.model('User', userSchema);
