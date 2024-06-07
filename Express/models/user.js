const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Export the model
module.exports = { UserSchema };