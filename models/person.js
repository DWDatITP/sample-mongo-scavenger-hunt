var mongoose = require('mongoose');

var personSchema = mongoose.Schema({
  name: String,
  colorId: String
});

var Person = mongoose.model('persons', personSchema);

module.exports = Person;
