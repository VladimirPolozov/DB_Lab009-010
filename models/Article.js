const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: String,
  text: String,
  rating: Number,
});

const articleSchema = new mongoose.Schema({
  title: String,
  authors: [String],
  datePublished: Date,
  content: String,
  tags: [String],
  reviews: [reviewSchema],
});

module.exports = mongoose.model('Article', articleSchema);