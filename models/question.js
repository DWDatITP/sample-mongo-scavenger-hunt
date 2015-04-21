var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
  category: String,
  airDate: Date,
  question: String,
  value: Number,
  answer: String,
  round: String,
  showNumber: Number
});

var Question = mongoose.model('questions', questionSchema);

module.exports = Question;
