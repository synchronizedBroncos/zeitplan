var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  deviceTokens: [{
    type: String
  }],
  settings: {
    notificationTypes: {
      textMessage: {
        type: Boolean
      },
      email: {
        type: Boolean
      },
      pushNotification: {
        type: Boolean
      }
    }
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getNotificationInfoById = function(id, callback){
  User.findById(id, callback).select('settings email phoneNumber deviceTokens -_id');
}

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.getDeviceTokensByUserId = function(userId, callback){
  User.findOne({ _id: userId}, callback).select('deviceTokens');
}

module.exports.addDeviceTokenByUserId = function(userId, deviceToken, callback){
  User.findOneAndUpdate({ _id: userId }, { $push: {deviceTokens: deviceToken} }, {new: true}, callback).select('deviceTokens');
}

module.exports.clearDeviceTokensByUserId = function(userId, callback){
  User.findOneAndUpdate({ _id: userId }, { $pull: {deviceTokens: { $type : "string" } } }, {new: true}, callback).select('deviceTokens');
}

module.exports.getSettingsByUserId = function(userId, callback){
  var query = {_id: userId};
  User.findOne(query, callback).select('settings');
}

module.exports.editSettingsByUserId = function(user_id, data, callback){
  User.findOneAndUpdate({_id:user_id},{$set: {'settings.notificationTypes.textMessage': data.textMessage,
   'settings.notificationTypes.email': data.email, 'settings.notificationTypes.pushNotification' : data.pushNotification}}, callback).select('settings');
}

module.exports.setPushNotificationsOffByUserId = function(user_id, callback) {
  User.findOneAndUpdate({_id:user_id},{$set: {'settings.notificationTypes.pushNotification' : false}}, callback).select('settings');
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null, isMatch);
  });
}

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			newUser.password = hash;
   			newUser.save(callback);
    	});
	});
}
