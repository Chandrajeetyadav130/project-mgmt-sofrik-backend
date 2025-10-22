const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
