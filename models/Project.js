const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active','completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
