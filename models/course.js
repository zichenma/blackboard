var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new mongoose.Schema({
    courseID: String,
    courseName: String,
    isEditing: Boolean,
    created_at: {type: Date, default: Date.now}
});
mongoose.model('Course', courseSchema);