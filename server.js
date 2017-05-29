'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({
    secret: 'secretMukul',
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', express.static(process.cwd() + '/public'))
app.set('view engine', 'ejs')

routes(app, passport);

var port = process.env.PORT;

app.listen(port || 3000, function () {
    console.log('Listening on port + ' + port + '...');
});
