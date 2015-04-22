var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
var mongoDbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/sample-mongo-scavenger-hunt';

mongoose.connect(mongoDbUri);
var db = mongoose.connection.db;
db.on('error', function(err){
  console.log('Error connecting to db: ',err);
});
db.on('open', function(){
  console.log('Connected to Mongo');
});


var Question = require('./models/question');
var Email    = require('./models/email');
var Person   = require('./models/person');
var Color    = require('./models/color');

// This allows us to read POSTed form data using `req.body`
app.use(bodyParser.urlencoded({extended:true}));

// This makes it so that `res.render` renders ejs views in the views/
// folder
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index');
});

app.get('/jeopardy', function(req, res){
  res.render('jeopardy', {questions:[], search:''});
});

app.get('/jeopardy/search', function(req, res){
  var search = req.query.search;
  var value  = req.query.value;

  var query = Question.find();
  if (search) {
    query = query.$where('this.question.indexOf("' + search + '") > -1');
  }
  if (value) {
    query = query.where('value').equals(value);
  }

  query.exec(function(err, questions){
    if (err) { return res.send(err); }

    res.render('jeopardy', {questions: questions, search:search});
  });
});

app.get('/emails', function(req, res){
  var page = 1;
  Email.find({}).limit(25).exec(function(err, emails) {
    res.render('emails', {emails: emails, page: page});
  });
});

app.get('/emails/:page', function(req, res){
  var page = req.params.page;

  Email.find({}).limit(25).exec(function(err, emails) {
    res.render('emails', {emails: emails, page: page});
  });
});

app.get('/people', function(req, res){
  res.render('people', {people:[]});
});

app.get('/people/:id', function(req, res){
  res.render('person', {person: {}, color: {}});
});

// show users
// with favorite colors

app.listen(port, function(){
  console.log('Listening on ',port);
});
