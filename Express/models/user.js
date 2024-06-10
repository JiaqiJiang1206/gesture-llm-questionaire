const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    contact: {type: Number, require: true},
    age: {type: Number, require: true},
    gender: {type:String, require: true},
    courses: {type: String, require: true}
});

const User = mongoose.model('Users', UserSchema);

// Export the model
module.exports = { User };