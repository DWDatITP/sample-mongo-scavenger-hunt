var Question = require('./models/question');
var Email    = require('./models/email');
var Color    = require('./models/color');
var Person   = require('./models/person');
var mongoose = require('mongoose');
var mongoDbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/sample-mongo-scavenger-hunt';

var questionData = require('./data/questions.json');
var emailData = require('./data/enron.json');

mongoose.connect(mongoDbUri);

function loadQuestions(done){
  var remaining = 0;
  mongoose.connection.db.dropCollection('questions', function(err, result) {
    if (err && err.message !== 'ns not found' ) { return console.log('drop col err:',err); }

    questionData.forEach(function(q){
      var question = new Question(q);
      remaining++;
      question.save(function(err){
        if (err) { console.log('err saving q:',err); }
        remaining--;
      });
    });

    var interval = setInterval(function(){
      if (remaining > 0) {
        console.log('remaining questions:',remaining);
      } else {
        clearInterval(interval);
        done();
      }
    }, 500);
  });
}

function loadEnron(done){
  var remaining = 0;
  mongoose.connection.db.dropCollection('emails', function(err, result) {
    if (err && err.message !== 'ns not found' ) { return console.log('drop col err:',err); }

    emailData.forEach(function(e){
      var email = new Email(e);
      remaining++;
      email.save(function(err){
        if (err) { console.log('err saving e:',err); }
        remaining--;
      });
    });

    var interval = setInterval(function(){
      if (remaining > 0) {
        console.log('remaining emails:',remaining);
      } else {
        clearInterval(interval);
        done();
      }
    }, 500);
  });
}

var colorIds = [];
function loadColors(done){
  var colorData = require('./data/colors.json');
  var remaining = 0;
  mongoose.connection.db.dropCollection('colors', function(err, result) {
    if (err && err.message !== 'ns not found' ) { return console.log('drop col err:',err); }

    colorData.forEach(function(c){
      var color = new Color(c);
      remaining++;
      color.save(function(err){
        if (err) { console.log('err saving e:',err); }
        colorIds.push(color.id);
        remaining--;
      });
    });

    var interval = setInterval(function(){
      if (remaining > 0) {
        console.log('remaining colors:',remaining);
      } else {
        clearInterval(interval);
        done();
      }
    }, 500);
  });
}

function loadPeople(done){
  var personData = require('./data/celebs.json');
  var remaining = 0;
  mongoose.connection.db.dropCollection('persons', function(err, result) {
    if (err && err.message !== 'ns not found' ) { return console.log('drop col err:',err); }

    personData.forEach(function(p){
      var person = new Person(p);
      person.colorId = colorIds[ Math.floor(Math.random()*colorIds.length)];
      remaining++;
      person.save(function(err){
        if (err) { console.log('err saving e:',err); }
        remaining--;
      });
    });

    var interval = setInterval(function(){
      if (remaining > 0) {
        console.log('remaining persons:',remaining);
      } else {
        clearInterval(interval);
        done();
      }
    }, 500);
  });
}

mongoose.connection.db.on('open', function(){
  loadQuestions(function(){
    console.log('done with qs!');
    loadEnron(function(){
      console.log('done with enron!');
      loadColors(function(){
        console.log('done w/ colors');
        loadPeople(function(){
          console.log('done w/ people');
          process.exit(1);
        });
      });
    });
  });
});

