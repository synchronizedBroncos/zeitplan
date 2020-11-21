var express = require('express');
var router = express.Router();

let flashClass = "green";

require("dotenv").config();

//Require models
const Items = require('../models/items');
const Users = require('../models/user');

// require modules
const Notifications = require('../modules/notificationsModule');

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

router.post('/api/addSchedule/:user_id', function(req,res,next){
  let schedule = req.body;
  Items.addScheduleByUserId(req.params.user_id, schedule, function(err, itemsObject){
    if(err){
      throw err;
    }
    else {
      Notifications.addScheduleNotification(req.params.user_id, itemsObject.schedule[itemsObject.schedule.length-1]);
      res.json(itemsObject);
    }
  });
});

  router.post('/api/editSchedule/:user_id', function(req,res,next) {
    let schedule = req.body;
    Items.editScheduleByUserId(req.params.user_id, schedule, function(err, itemsObject) {
      if(err){
        throw err;
      }
      else {
        Notifications.editScheduleNotification(req.params.user_id, schedule);
        res.json(itemsObject);
      }
    });
  });

  router.delete('/api/removeSchedule/:user_id/:schedule_id', function(req,res){
    Items.removeScheduleByUserId(req.params.user_id, req.params.schedule_id, function(err, itemsObject){
      if(err){
        throw err;
      }
      else {
        Notifications.removeScheduleNotification(req.params.schedule_id);
        res.json({message : "Sucessfully Deleted schedule!"});
      }
    });
  });

  router.delete('/api/removeLog/:user_id/:log_id', function(req,res){
    Items.removeLogByUserId(req.params.user_id, req.params.log_id, function(err, itemsObject){
      if(err){
        throw err;
      }
      else {
        res.json({message : "Sucessfully Deleted log!"});
      }
    });
  });

router.post('/api/sendScheduleToLogs/:user_id', function(req,res,next){
    let schedule = req.body;
    Items.sendScheduleToLogs(req.params.user_id, schedule, function(err,schedule){
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

router.get('/', ensureAuthenticated, function(req, res, next) {
  console.log(req.user);
  res.render('Homepage', { title: 'Zeitplan', name: req.user.name, expressFlash: req.flash('message'), flashClass: flashClass });
});

module.exports = router;
