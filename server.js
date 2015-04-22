var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
// var mongoDbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/sample-mongo-scavenger-hunt';
var mongoDbUri = 'mongodb://heroku_app36113912:vg3efitofs0i5j2lo05fslb4tc@ds043348.mongolab.com:43348/heroku_app36113912';

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
  var answer = req.query.answer;

  var query = Question.find();
  if (search) {
    query = query.$where('this.question.indexOf("' + search + '") > -1');
  }
  if (value) {
    query = query.where('value').gte(value);
  }
  if (answer) {
    query = query.$where('this.answer.indexOf("' + answer + '") > -1');
  }

  query.exec(function(err, questions){
    if (err) { return res.send(err); }

    res.render('jeopardy', {questions: questions, search:search, value:value});
  });
});

app.get('/emails', function(req, res){
  var page = 1;
  Email.find({}).sort({date:-1}).limit(25).exec(function(err, emails) {
    res.render('emails', {emails: emails, page: page, subject:''});
  });
});

app.get('/emails/search', function(req, res){
  var page = 1;
  var subject = req.query.subject;

  var query = Email.find().limit(25);
  query = query.$where('this.subject.indexOf("' + subject + '") > -1');

  console.log('searchign for',subject);
  console.log('query',query);

  query.exec(function(err, emails) {
    res.render('emails', {emails: emails, page: page, subject: subject});
  });
});


app.get('/emails/:page', function(req, res){
  // it must be an integer
  var page = parseInt(req.params.page);
  var toSkip = page * 25;

  Email.find({}).sort({date:-1}).limit(25).skip(toSkip).exec(function(err, emails) {
    res.render('emails', {emails: emails, page: page, subject: ''});
  });
});

app.get('/people', function(req, res){
  Person.find(function(err, people){
    if (err) {
      return res.send(err);
    }
    res.render('people', {people:people});
  });
});

app.get('/people/:id', function(req, res){
  var id = req.params.id;
  Person.findById(id, function(err, person){
    var colorId = person.colorId;
    Color.findById(colorId, function(err, color) {
      res.render('person', {person: person, color: color});
    });
  });
});

app.listen(port, function(){
  console.log('Listening on ',port);
});
