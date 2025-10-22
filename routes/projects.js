const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const proj = new Project({ owner: req.user._id, title, description, status });
    await proj.save();
    res.json(proj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List user's projects (with optional search/pagination)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = { owner: req.user._id };
    if (q) filter.title = { $regex: q, $options: 'i' };

    const projects = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project + its tasks
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Not found' });

    const tasks = await Task.find({ project: project._id }).sort({ createdAt: -1 });
    res.json({ project, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (and its tasks)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Not found' });
    await Task.deleteMany({ project: project._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
