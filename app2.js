var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var googleauth_fn = require('./modules/googleauth');


mongoose.connect('mongodb://localhost/james', function (err) {
    if (err) console.error('Could not connect to mongodb!');
    else console.log('Connected to MongoDB!!!');
});

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var google_creds = require('./config');



// ======== BEGIN PASSPORTJS CODE =========== //
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
      clientID: google_creds.GOOGLE_CLIENT_ID,
      clientSecret: google_creds.GOOGLE_CLIENT_SECRET,
      callbackURL: google_creds.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
));

// ======== END PASSPORTJS CODE =========== //

var routes = require('./routes/index');
var users = require('./routes/users');

// Reference: https://github.com/jaredhanson/passport-google-oauth/blob/master/examples/oauth2/app.js
// Google Developer Console - https://console.developers.google.com/

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// todo: for james and likhita: modularize the code by passing the app into a separate function
googleauth_fn(app);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
    function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    });

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
