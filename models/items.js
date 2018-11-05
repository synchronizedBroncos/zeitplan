var mongoose = require('mongoose');

//Items Schema
var ItemsSchema = mongoose.Schema({
  user: {
    type: ObjectId,
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
  var query = {user: userId};
  Items.findOne(query, callback).select('ttr');
}

module.exports.getScheduleByUserId = function(userId, callback){
  var query = {user: userId};
  Items.findOne(query, callback).select('schedule');
}

module.exports.getLogsByUserId = function(userId, callback){
  var query = {user: userId};
  Items.findOne(query, callback).select('logs');
}

module.exports.createItem = function(newItem, callback){
  newItem.save(callback);
}
