var Question = require('./models/question');
var Email    = require('./models/email');
var mongoose = require('mongoose');
var mongoDbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/sample-mongo-scavenger-hunt';

var questionData = require('./data/questions.json');
var enronData = require('./data/enron.json');

mongoose.connect(mongoDbUri);

var remaining = 0;
mongoose.connection.db.on('open', function(){
  mongoose.connection.db.dropCollection('questions', function(err, result) {
    if (err) {
      console.log('err:',err);
    }
    questionData.forEach(function(q){
      var question = new Question(q);
      remaining++;
      console.log('saving q');
      question.save(function(err){
        if (err) {
          console.log('err:',err);
        } else {
          console.log('saved question',question);
        }
        remaining--;
      });
    });
  });
});

setInterval(function(){
  if (remaining > 0) {
    console.log('remaining:',remaining);
  } else {
    process.exit(0);
  }
}, 500);
