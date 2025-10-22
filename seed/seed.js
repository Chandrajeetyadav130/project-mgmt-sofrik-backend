require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

(async () => {
  try {
    const uri = process.env.atlas_DB_URL;
    await connectDB(uri);

    // Clear
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // Create user
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Test@123', salt);
    const user = new User({ name: 'Seed User', email: 'test@example.com', password: hashed });
    await user.save();

    // Create 2 projects
    const projects = [];
    for (let i = 1; i <= 2; i++) {
      const p = new Project({
        owner: user._id,
        title: `Seed Project ${i}`,
        description: `This is a seeded project ${i}`
      });
      await p.save();
      projects.push(p);
    }

    // Add 3 tasks per project
    for (const p of projects) {
      for (let t = 1; t <= 3; t++) {
        const statuses = ['todo', 'in-progress', 'done'];
        const task = new Task({
          project: p._id,
          title: `Task ${t} - ${p.title}`,
          description: `Seeded task ${t} for ${p.title}`,
          status: statuses[(t - 1) % statuses.length],
          dueDate: new Date(Date.now() + 86400000 * t)
        });
        await task.save();
      }
    }

    console.log('Seed completed: user test@example.com / Test@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
