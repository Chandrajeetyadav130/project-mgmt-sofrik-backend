const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create task for a project
router.post('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, status, dueDate } = req.body;
    const task = new Task({ project: project._id, title, description, status, dueDate });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (only owner of project can)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Not found' });

    if (String(task.project.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Not found' });

    if (String(task.project.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await task.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List tasks for a project with optional status filter
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const q = { project: project._id };
    if (status) q.status = status;

    const tasks = await Task.find(q).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
