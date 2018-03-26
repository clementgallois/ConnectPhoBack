// server.js

// set up
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const socketioJwt = require('socketio-jwt');

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

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('secret', config.secret);

//set socket to authenticate a user using jsonwebtoken
io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));

// routes
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, io); // api routes

// launch
server.listen(8080);
// eslint-disable-next-line no-console
console.log('Listening on port : ' + 8080);
