var mongoose = require('mongoose');

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

//Add Task to db
module.exports.addTask = function(task, callback){
    Task.create(task, callback);
}