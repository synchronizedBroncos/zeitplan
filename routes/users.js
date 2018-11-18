var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Item = require('../models/items');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', checkAuthenticated, function(req, res, next) {
  res.render('register', {title: 'Register', expressFlash: req.flash('message'), errors: []});
});

router.get('/login', checkAuthenticated, function(req, res, next) {
  let message = req.flash('error');
  if(message[0] == null || message[0] === '') {
    message = req.flash('message');
  }
  res.render('login', {title: 'Login', expressFlash: message});
});

router.post('/login',
passport.authenticate('local', {failureRedirect: '/users/login', badRequestMessage : 'Invalid username or password.', failureFlash: true}),
function(req, res) {
  req.flash('message', 'You are now logged in');
  res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Form Validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('phoneNumber', 'Phone number is required').notEmpty();
  req.checkBody('phoneNumber', 'Phone number is not valid').isMobilePhone();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(password);
  //Check errors
  var errors = req.validationErrors();
  if(errors){
    console.log('Errors', errors);
    res.render('register', {
      title: 'Register',
      expressFlash: 'Registration failed',
      errors: errors
    });
  } else {
    console.log('No errors');
    var newUser = new User({
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      username: username,
      password: password,
      settings: {
        notificationTypes: {
          textMessage: true,
          email: true,
          pushNotification: true
        }
      }
    });
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
      var newItem = new Item({
        user: user.id,
        username: user.username,
        ttr: [],
        schedule: [],
        logs: []
      });
      Item.createItem(newItem, function(err, item){
        if(err) throw err;
        console.log(item);
      });
    });
    req.flash('message', 'You are now registered and can login');
    res.location('/users/login');
    res.redirect('/users/login');
  }
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('message', 'You are now logged out');
  res.redirect('/users/login');
});

// function to check if user is logged in
function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/');
  } else {
    return next();
  }
}

module.exports = router;
