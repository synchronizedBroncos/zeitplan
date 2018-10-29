var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var axios = require('axios');
var getUri = require('get-uri');

require("dotenv").config()

//Require task model
Task = require('../models/tasks')

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
  from: '"Zeitplan" <zeitplanme@gmail.com>',
  to: 'zeitplanme@gmail.com',
  subject: "Hello From Zeitplan!",
  text: 'Welcome to Zeitplan'
};

//API Call to return tasks from DB
router.get('/api/tasks', function(req,res,next){
  Task.getTasks(function(err,tasks){
    if(err){
      throw err;
    }
    else{
      res.json(tasks);
    }
  });
});

//API Call to return specific task
router.get('/api/tasks/:task_id', function(req,res){
  Task.getTask(req.params.task_id, function(err,task){
    if(err){
      throw err;
    }
    else{
      res.json(task);
    }
  });
});

//API Call to delete specific task
router.delete('/api/tasks/:task_id', function(req,res){
  Task.deleteTask(req.params.task_id, function(err,task){
    if(err){
      throw err;
    }
    else{
      res.json({message : "Sucessfully Deleted Task!"});
    }
  });
});

//POST API call to store task in DB
router.post('/api/tasks', function(req,res,next){
  let task = req.body;
    Task.addTask(task, function(err,task){
    if(err){
      throw err;
    }
    else{
      res.json(task);
    }
  });
});

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

/*get-uri method*/
router.get('/uri', function(req, res, next){
  getUri('http://cs480-projects.github.io/teams-fall2018/index.html', function(err, rs){
    if(err){
      res.send(err);
    }else {
      rs.on('readable', function(){
        let data;
        while(data = this.read()){
          res.send(data);
        }
      });
      rs.destroy();
    }
  });
 });
/* Nodemailer HTTP GET method */
router.get('/mail', function(req, res, next) {

  transporter.sendMail(HelperOptions, (error, info) => {
    if(error){
      res.send(error);
    }

    res.send("Mail sent." + JSON.stringify(info));
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

// sample request with requestify module
router.get('/requestify', function(req, res, next){
  requestify.get('https://jsonplaceholder.typicode.com/todos/1').then(function(response) {
      // Get the response body
      res.send(response.getBody());
  });
});

// Route to axios
router.get('/axios', function(req, res, next){
axios.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(function (response) {
    res.send(response);
  })
  .catch(function (error) {
    res.send(error);
  });
});

module.exports = router;
