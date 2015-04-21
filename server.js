var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
var mongoDbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/sample-mongo-scavenger-hunt';

var Question = require('./models/question');
var Email    = require('./models/email');

// This allows us to read POSTed form data using `req.body`
app.use(bodyParser.urlencoded({extended:true}));

// This makes it so that `res.render` renders ejs views in the views/
// folder
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index');
});

app.listen(port, function(){
  console.log('Listening on ',port);
});
