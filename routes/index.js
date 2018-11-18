var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var axios = require('axios');
var getUri = require('get-uri');

let flashClass = "green";

require("dotenv").config();

//Require task model
const Task = require('../models/tasks');
const Items = require('../models/items');
const Users = require('../models/user');

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

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

//API CALL to return schedule from DB
router.get('/api/schedule/:user_id', function(req,res,next){
  Items.getScheduleByUserId(req.params.user_id, function(err,schedule){
    if(err){
      throw err;
    }
    else{
      res.json(schedule);
    }
  });
});

router.get('/api/currentUserId', ensureAuthenticated, function(req,res,next){
  res.send(req.user.id);
});

//API Call to return ttr from DB
router.get('/api/ttrs/:user_id', function(req,res,next){
  Items.getTtrByUserId(req.params.user_id, function(err,ttrs){
    if(err){
      throw err;
    }
    else{
      res.json(ttrs);
    }
  });
});

//API Call to return logs from DB
router.get('/api/logs/:user_id', function(req,res,next){
  Items.getLogsByUserId(req.params.user_id, function(err,logs){
    if(err){
      throw err;
    }
    else{
      res.json(logs);
    }
  });
});

router.get('/api/getSettings/:user_id', function(req,res,next){
  Users.getSettingsByUserId(req.params.user_id, function(err,settings){
    if(err){
      throw err;
    }
    else{
      res.json(settings);
    }
  });
});

router.post('/api/changeSettings/:user_id', function(req,res,next){
    let data = req.body;
    Users.editSettingsByUserId(req.params.user_id, data, function(err,data){
    if(err){
      throw err;
    }
    else{
      res.json(data);
    }
    });
  });

router.post('/api/editTTR/:user_id', function(req,res,next){
    let ttr = req.body;
    Items.editTTRByUserId(req.params.user_id, ttr, function(err,ttr){
    if(err){
      throw err;
    }
    else{
      res.json(ttr);
    }
    });
  });

router.post('/api/addTTR/:user_id', function(req,res,next){
    let ttr = req.body;
    Items.addTTRByUserId(req.params.user_id, ttr, function(err,ttr){
    if(err){
      throw err;
    }
    else{
      res.json(ttr);
    }
    });
  });

  //API Call to delete specific ttr
  router.delete('/api/removeTTR/:user_id/:task_id', function(req,res){
    let ttr = req.body;
    Items.removeTTRByUserId(req.params.user_id, req.params.task_id, function(err,ttr){
      if(err){
        throw err;
      }
      else{
        res.json({message : "Sucessfully Deleted TTR!"});
      }
    });
  });

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
// router.get('/', ensureAuthenticated, function(req, res, next) {
//   console.log(req.user);
//   res.render('index', { title: 'Zeitplan', expressFlash: req.flash('message'), flashClass: flashClass });
// });

router.get('/', ensureAuthenticated, function(req, res, next) {
  console.log(req.user);
  res.render('homepage', { title: 'Zeitplan', name: req.user.name, expressFlash: req.flash('message'), flashClass: flashClass });
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
