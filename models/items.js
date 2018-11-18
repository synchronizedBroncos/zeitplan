var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Items Schema
var ItemsSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  username: {
    type: String,
    index: true
  },
  ttr: [{
    description: {
      type: String
    },
    dueDate: {
      type: Date
    }
  }],
  schedule: [{

    title: 
    {
      type: String
    },

    description: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    notification: {
      type: Boolean
    }
  }],
  logs: [{
    description: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    completed: {
      type: Boolean
    },
    reason: {
      type: String
    }
  }]
});

var Items = module.exports = mongoose.model('Items', ItemsSchema);

module.exports.getItemsById = function(id, callback){
  Items.findById(id, callback);
}

module.exports.getItemsByUsername = function(username, callback){
  var query = {username: username};
  Items.findOne(query, callback);
}

module.exports.getItemsByUserId = function(userId, callback){
  var query = {user: userId};
  Items.findOne(query, callback);
}

module.exports.getTtrByUserId = function(userId, callback){
  console.log("HIIIIIIIIIIII ttr");
  var query = {user: userId};
  Items.findOne(query, callback).select('ttr');
}

module.exports.addTTRByUserId = function(userId, addTTR, callback){
  Items.findOneAndUpdate({user:userId},{$push:{ttr:addTTR}}, callback).select('ttr');
}

module.exports.removeTTRByUserId = function(userId, ttrId, callback){
  Items.findOneAndUpdate({user:userId}, {$pull: {ttr:{_id:ttrId}}}, callback).select('ttr');
}

module.exports.editTTRByUserId = function(userId, ttr, callback){
  Items.findOneAndUpdate({user:userId, "ttr._id": ttr._id},{
    $set: {'ttr.$.description': ttr.description, 'ttr.$.dueDate': ttr.dueDate}}, callback).select('ttr');
}

module.exports.getScheduleByUserId = function(userId, callback){
  console.log("HIIIIIIIIIIII");
  var query = {user: userId};
  Items.findOne(query, callback).select('schedule');
}

/*
module.exports.addScheduleByUserId = function(userId, callback){
  var query = {user: userId};
  Items.findOneAndUpdate({user:userId},{$push:{schdule:addSchedule}}, callback);
}

module.exports.removeScheduleByUserId = function(userId, scheduleId, callback){
  Items.findOneAndUpdate({user:userId}, {$pull: {schedule:{_id:scheduleId}}}, callback);
}

module.exports.editScheduleByUserId = function(userId, schdule, callback){
  Items.findOneAndUpdate({user:userId, "schedule._id": schedule._id},{
    $set: {'schdule.$.title': schedule.newTitle  ,schdule.description, 'schdule.$.description': schdule.description, 'schdule.$.startDate': schdule.newStartDate, 'schedule.$.endDate': schedule.newEndDate}}, callback);
}
*/

module.exports.getLogsByUserId = function(userId, callback){
  var query = {user: userId};
  Items.findOne(query, callback).select('logs');
}

module.exports.createItem = function(newItem, callback){
  newItem.save(callback);
}
