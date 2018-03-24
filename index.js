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

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', (callback) => {
  console.log('Connection succeeded.');
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
console.log('Listening on port : ' + port);
