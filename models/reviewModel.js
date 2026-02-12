const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review must have text'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'A review must have a rating'],
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review must belong to a tour'],
  },
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
