const User = require('../models/user');
const Items = require('../models/items');
const HashMap = require('hashmap');
const NodeSchedule = require('node-schedule');
// sender module
const Sender = require('../modules/senderModule');

// hash map to store schedule job with object id
let map = new HashMap();

// initialize all reminders when server is started
Items.getAllSchedules(function(err,schedules) {
  if(err) {
    throw err;
  }
  else {
    for(let i = 0; i < schedules.length; i++) {
      if(schedules[i].schedule.length > 0) {
        for(let j = 0; j < schedules[i].schedule.length; j++) {
          // date from schedule is line below, use that where Date.now() is currently
          // schedules[i].schedule[j].startDate
          // TODO: check if schedules[i].schedule[j].notification is true before scheduling and adding to hashmap
          let job = NodeSchedule.scheduleJob(Date.now() + 1000, function() {
            // item id is schedules[i].id
            // schedule id is schedules[i].schedule[j].id
            // notificationAction(schedules[i].user, schedules[i].schedule[j]); //MOST IMPORTANT LINE HERE
          });
          map.set(schedules[i].schedule[j].id, job);
        }
      }
    }
  }
});

//TODO: handle edit schedule with hash map, you will need to get by objectId
// you will need to edit the job by rescheduling
//TODO: handle edit delete schedule
// you will need to cancel the job

// userId is the id of the user, used to get the settings
// scheduleObject is the object of the schedule that we will notify the user of
function notificationAction(userId, scheduleObject) {
  // scheduleObject example
  // { _id: 5bf4a8697740281aa81360eb,
  // description: 'testing',
  // endDate: 2019-03-03T00:03:00.000Z,
  // startDate: 2019-05-05T10:30:00.000Z,
  // notification: true }

  // TODO: if endDate is empty, do not include it in the reminder
  const reminderDescription = "Reminder: " + scheduleObject.description +
   "\nStart: " + scheduleObject.startDate + "\nEnd: " + scheduleObject.endDate;

  User.getNotificationInfoById(userId, function(error, userObject) {
    if(error) {
      throw error;
    }
    else {
      if(userObject.settings.notificationTypes.textMessage) {
        // send text with schedule object info
        sendSMSNotification(reminderDescription, userObject.phoneNumber);
      }

      if(userObject.settings.notificationTypes.email) {
        // send email with schedule object info
        const reminderSubject = "Zeitplan Reminder";
        sendEmailNotification(userObject.email, reminderSubject, reminderDescription);
      }

      if(userObject.settings.notificationTypes.pushNotification) {
        // send push notification with schedule object info
        // TODO: implement push notifications
      }
    }
  });
}

function sendSMSNotification(description, phoneNumber) {
  const smsPromise = Sender.sendSMS(description, phoneNumber);
  smsPromise.then(function(result) {
    console.log("SendSMS Notification Successful:", result);
  }, function(err) {
    console.error("SendSMS Notification Error:", err);
  });
}

function sendEmailNotification(email, subject, text) {
  const emailPromise = Sender.sendEmail(email, subject, text);
  emailPromise.then(function(result) {
    console.log("SendEmail Notification Successful:", result);
  }, function(err) {
    console.error("SendEmail Notification Error:", err);
  });
}

// TODO: complete push notification integration
function sendPushNotification() {

}

// function exports to be used in the schedule api calls
// TODO: complete following methods
// TODO: decide what parameters are necessary
module.exports.addScheduleNotification = () => {

}

module.exports.editScheduleNotification = () => {

}

module.exports.removeScheduleNotification = () => {

}
