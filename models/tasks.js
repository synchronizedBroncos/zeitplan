var mongoose = require('mongoose');

var tasksSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    }
});

var Task = module.exports = mongoose.model('Task', tasksSchema);

//Get Tasks
module.exports.getTasks = function(callback, limit){
    Task.find(callback).limit(limit);
}

module.exports.addTask = function(task, callback){
    Task.create(task, callback);
}