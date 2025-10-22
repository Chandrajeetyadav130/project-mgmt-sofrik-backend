const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Test User' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // hashed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
