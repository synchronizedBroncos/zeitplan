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
          if(schedules[i].schedule[j].notification && schedules[i].schedule[j].startDate && schedules[i].schedule[j].startDate.getTime() > new Date().getTime()) {
            // notification will be scheduled, all criteria met
            let job = NodeSchedule.scheduleJob(schedules[i].schedule[j].startDate, function() {
              // item id is schedules[i].id, schedule id is schedules[i].schedule[j].id
              notificationAction(schedules[i].user, schedules[i].schedule[j]); //MOST IMPORTANT LINE HERE
            });
            map.set(schedules[i].schedule[j].id, job);
          }
        }
      }
    }
    console.log("Finished setting up notifications for all users");
  }
});

// format date into PT timezone, can potentially get timezone from user setting in future
function formatDate(tempDate) {
  let date = new Date(tempDate);
  const ptTime = date.toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
  date = new Date(ptTime);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ":" + minutes + " " + ampm + " PT";
}

// userId is the id of the user, used to get the settings
// scheduleObject is the object of the schedule that we will notify the user of
function notificationAction(userId, scheduleObject) {
  // scheduleObject example
  // { _id: 5bf4a8697740281aa81360eb,
  // description: 'testing',
  // endDate: 2019-03-03T00:03:00.000Z,
  // startDate: 2019-05-05T10:30:00.000Z,
  // notification: true }

  let reminderDescription = "Reminder: " + scheduleObject.description +
   "\nFrom " + formatDate(scheduleObject.startDate);
  if(!(scheduleObject.endDate == null)) {
    reminderDescription += " to " + formatDate(scheduleObject.endDate);
  }

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
        const notificationObject = {
          title: "Reminder: " + scheduleObject.description,
          body: !(scheduleObject.endDate == null) ? "From " + formatDate(scheduleObject.startDate) + " to " + formatDate(scheduleObject.endDate) : "From " + formatDate(scheduleObject.startDate),
          icon: "https://www.app.zeitplan.me/resources/cropped_logo.png",
          click_action: "https://www.app.zeitplan.me/"
        }
        for(let i = 0; i < userObject.deviceTokens.length; i++) {
          sendPushNotification(userObject.deviceTokens[i], notificationObject);
        }
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

function sendPushNotification(deviceToken, notificationObject) {
  const pushPromise = Sender.sendPushNotification(deviceToken, notificationObject);
  pushPromise.then(function(result) {
    console.log("SendPushNotification Successful:", result);
  }, function(err) {
    console.error("SendPushNotification Error:", err);
  });
}

// function exports to be used in the schedule api calls
module.exports.addScheduleNotification = (userId, scheduleObject) => {
  // if notification is desired and start time is in future, schedule the notification
  if(scheduleObject.notification && scheduleObject.startDate && scheduleObject.startDate.getTime() > new Date().getTime()) {
    let job = NodeSchedule.scheduleJob(scheduleObject.startDate, function() {
      notificationAction(userId, scheduleObject); //MOST IMPORTANT LINE HERE
    });
    map.set(scheduleObject.id, job);
  }
}

module.exports.editScheduleNotification = (userId, scheduleObject) => {
  // if exists, cancel job
  if(!(map.get(scheduleObject._id) == null)) {
    map.get(scheduleObject._id).cancel();
  }

  // if notification is desired and start time is in future, schedule the notification
  if(scheduleObject.notification && scheduleObject.startDate && new Date(scheduleObject.startDate).getTime() > new Date().getTime()) {
    let job = NodeSchedule.scheduleJob(scheduleObject.startDate, function() {
      notificationAction(userId, scheduleObject);
    });
    map.set(scheduleObject._id, job);
  }
}

module.exports.removeScheduleNotification = (scheduleId) => {
  // if exists, cancel job and delete notification from hash map
  if(!(map.get(scheduleId) == null)) {
    map.get(scheduleId).cancel();
    map.delete(scheduleId);
  }
}
