var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Items = require('../models/items');
var HashMap = require('hashmap');
var schedule = require('node-schedule');

// hash map to store schedule job with object id
var map = new HashMap();

Items.getAllSchedules(function(err,schedules) {
  if(err){
    throw err;
  }
  else{
    //console.log(schedules);
    for(let i = 0; i < schedules.length; i++) {
      //console.log('schedule here:', schedules[i].schedule);
      if(schedules[i].schedule.length > 0) {
        //console.log("schedules exist for this user");
        for(let j = 0; j < schedules[i].schedule.length; j++) {
          //console.log("object should have id here");
          //console.log(schedules[i].schedule[j]);
          //console.log("objectId",schedules[i].schedule[j].id);
          // date from schedule is line below, use that where Date.now() is currently
          // schedules[i].schedule[j].startDate
          let job = schedule.scheduleJob(Date.now() + 1000, function() {
            // item id is schedules[i].id
            // schedule id is schedules[i].schedule[j].id
            notificationAction(schedules[i].user, schedules[i].schedule[j]);
          });
          map.set(schedules[i].schedule[j].id, job);
        }
      } else {
        //console.log("no schedules for this user")
      }
    }
  }
});

//TODO: handle edit schedule with hash map, you will need to get by objectId
// you will need to edit the job by rescheduling
//TODO: handle edit delete schedule
// you will need to cancel the job
router.get('/someAPI', function(req,res,next) {
  res.send("hi");
});

// userId is the id of the user, used to get the settings
// scheduleObject is the object of the schedule that we will notify the user of
function notificationAction(userId, scheduleObject) {
  //console.log("userId:", userId);
  //console.log("notify action:", scheduleObject);

  User.getSettingsById(userId, function(error, queryObject){
    if(error){
      throw error;
    }
    else{
      //console.log(queryObject);
      if(queryObject.settings.notificationTypes.textMessage) {
        // send text with schedule object info
        //console.log("send text");
      }

      if(queryObject.settings.notificationTypes.email) {
        // send email with schedule object info
        //console.log("send email");
      }

      if(queryObject.settings.notificationTypes.pushNotification) {
        // send push notification with schedule object info
        //console.log("send notif");
      }
    }
  });
}

//console.log('notifications file');

module.exports = router;
