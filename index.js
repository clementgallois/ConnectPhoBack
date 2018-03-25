// server.js

// set up
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const mongoose = require('mongoose');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config/config.js');

var server = require('http').createServer(app);
var io = require('socket.io')(server);


// configuration
mongoose.connect(config.database.url); // connect to our database

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error'));
// eslint-disable-next-line no-console
db.once('open', () => { console.log('Connection succeeded.');});

app.use(function(req, res, next) {
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Allow any request headers
  res.header('Access-Control-Allow-Origin', '*');

  // Allow any request headers
  if (req.get('Access-Control-Request-Headers')){
    res.setHeader('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
  }

  // Request methods you wish to allow (all here)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Pass to next layer of middleware
  next();
});


app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('secret', config.secret);

// routes
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, io); // api routes

// launch
app.listen(port);
// eslint-disable-next-line no-console
console.log('Listening on port : ' + port);
