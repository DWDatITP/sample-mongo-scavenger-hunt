var mongoose = require('mongoose');

var colorSchema = mongoose.Schema({
  name: String
});

var Color = mongoose.model('colors', colorSchema);

module.exports = Color;
