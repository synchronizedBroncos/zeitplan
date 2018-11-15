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
  Items.find(query, callback).select('ttr');
}

module.exports.addTTRByUserId = function(userId, addTTR, callback){
  Items.findOneAndUpdate({user:userId},{$push:{ttr:addTTR}}, callback);
}

module.exports.removeTTRByUserId = function(userId, ttrId, callback){
  Items.findOneAndUpdate({user:userId}, {$pull: {ttr:{_id:ttrId}}}, callback);
}

module.exports.editTTRByUserId = function(userId, ttr, callback){
  Items.findOneAndUpdate({user:userId, "ttr._id": ttr._id},{
    $set: {'ttr.$.description': ttr.description, 'ttr.$.dueDate': ttr.dueDate}}, callback);
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
