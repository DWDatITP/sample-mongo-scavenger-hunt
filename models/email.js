var mongoose = require('mongoose');

/*
 * each email looks like this:
 * {
 * }
 */

var emailSchema = mongoose.Schema({
  /* uncomment this and make your schema correct by
   * adding properties.
   *
   * Look in models/questions.js if you need help
  */
});

var Email = mongoose.model('emails', emailSchema);

module.exports = Email;
