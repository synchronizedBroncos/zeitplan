var mongoose = require('mongoose');
require("dotenv").config()

//Test connect to DB to display tasks (tasks will be moved to be a property of Users, currently testing)
var url = process.env.DB_URI;

mongoose.connect(url, { useNewUrlParser: true })

var db = mongoose.connection;

var tasksSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isDone: {
        type: Boolean,
        required: false
    }
});

var Task = module.exports = mongoose.model('Task', tasksSchema);

//Get Tasks from db
module.exports.getTasks = function(callback, limit){
    Task.find(callback).limit(limit);
}

module.exports.getTask = function(id, callback){
    Task.findById(id, callback);
}

module.exports.deleteTask = function(id, callback){
    Task.findByIdAndDelete(id, callback);
}

//Add Task to db
module.exports.addTask = function(task, callback){
    Task.create(task, callback);
}