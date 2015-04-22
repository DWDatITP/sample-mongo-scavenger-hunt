var mongoose = require('mongoose');

/*
 * each email looks something like this:
 {
  "sender":"rosalee.fleming@enron.com",
  "recipients":["sherri.reinartz@enron.com"],
  "cc":[],
  "text":"Here is the text of the email",
  "to":["sherri.reinartz@enron.com"],
  "bcc":[],
  "replyto":null,
  "date":"2000-01-12 08:24:00-08:00",
  "folder":"_sent",
  "subject":"Re: EXECUTIVE COMMITTEE MEETINGS - MONDAY, JANUARY 17"
 } 
*/

var emailSchema = mongoose.Schema({
  /* uncomment this and make your schema correct by
   * adding properties.
   *
   * Look in models/questions.js if you need help
  */
 sender: String,
 recipients: [String],
 cc: [String],
 text: String,
 to: [String],
 bcc: [String],
 replyto: String,
 date: Date,
 folder: String,
 subject: String
});

var Email = mongoose.model('emails', emailSchema);

module.exports = Email;
