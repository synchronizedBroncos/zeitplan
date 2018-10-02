var express = require('express');
var router = express.Router();
var requestify = require('requestify');
require("dotenv").config()

//Nodemailer
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'zeitplanme@gmail.com',
    pass: process.env.GM_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

let HelperOptions = {
  from: '"Zeitplan" <zeitplanme@gmail.com',
  to: 'zeitplanme@gmail.com',
  subject: "Hello From Zeitplan!",
  text: 'Welcome to Zeitplan'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zeitplan' });
});

/* Abe's first http get method. */
router.get('/abe', function(req, res, next) {
  res.send('This is Abe\'s first HTTP get method!');
});

/* Alex's first http get method. */
router.get('/alex', function(req, res, next){
   res.send('SYNCRHONIZED');
 });

/* Christian's first http get method. */
router.get('/chris', function(req, res, next) {
	res.send('Hi my name is zeit Christian and let\'s gooooooo');
});

/* Jason's first http get method. */
router.get('/jason', function(req, res, next) {
	res.send('I am groot');
});
/* Amir's first http get method. */
router.get('/amir', function(req, res, next) {
	res.send('Hi my name is Amir and IM READY');
});

/* Nodemailer HTTP GET method */
router.get('/mail', function(req, res, next) {

  transporter.sendMail(HelperOptions, (error, info) => {
    if(error){
      res.send(error);
    }

    res.send("Mail sent." + info);
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}
router.get('/requestify', function(req, res, next){
  requestify.get('https://jsonplaceholder.typicode.com/todos/1').then(function(response) {
      // Get the response body
      res.send(response.getBody());
  });
});


// Route to axiom
router.get('/axiom', function(req, res, next){
axios.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(function (response) {
    res.send(response);
  })
  .catch(function (error) {
    res.send(error);
  });
});

module.exports = router;
