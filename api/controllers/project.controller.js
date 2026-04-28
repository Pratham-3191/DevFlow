const Project = require('../models/project.model');
const User = require('../models/user.model');
const mongoose = require("mongoose");
const Task = require('../models/task.model');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only fetch projects where user is a member
    const projects = await Project.find({
      members: userId,
    }).populate('members', 'name')

    const projectWithStats = await Promise.all(
      projects.map(async (project) => {
        const totaltasks = await Task.countDocuments({
          projectId: project._id,
        })

        const CompletedTasks = await Task.countDocuments({
          projectId: project._id,
          status: 'Completed',
        })

        const progress =
          totaltasks === 0 ? 0 : Math.floor((CompletedTasks / totaltasks) * 100);
        const activeTasks = totaltasks === 0 ? 0 : totaltasks - CompletedTasks

        return {
          ...project.toObject(),
          CompletedTasks,
          totaltasks,
          activeTasks,
          progress
        }
      })
    );


    res.status(200).json(projectWithStats)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single project

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create project
const createProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    let memberIds = [];

    if (members && members.length > 0) {
      const users = await User.find({ email: { $in: members } });
      memberIds = users.map(u => u._id);

      if (users.length !== members.length) {
        return res.status(400).json({ message: 'Some users not found' });
      }
    }

    memberIds.push(req.user.id);

    const uniqueMembers = [...new Set(memberIds.map(id => id.toString()))];

   
    const project = new Project({
      name,
      description,
      createdBy: req.user.id,
      members: uniqueMembers,
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('members', 'name');

    
    const totaltasks = await Task.countDocuments({
      projectId: project._id,
    });

    const CompletedTasks = await Task.countDocuments({
      projectId: project._id,
      status: 'Completed',
    });

    const progress =
      totaltasks === 0 ? 0 : Math.floor((CompletedTasks / totaltasks) * 100);

    const activeTasks =
      totaltasks === 0 ? 0 : totaltasks - CompletedTasks;

    // Return SAME SHAPE as GET API
    res.status(201).json({
      ...populatedProject.toObject(),
      CompletedTasks,
      totaltasks,
      activeTasks,
      progress,
    });

  } catch (err) {
    console.error('Create Project Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project creator can delete this project.' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add project member
const addProjectMember = async (req, res, next) => {
  try {
    const { userId, email } = req.body;

    let user;

    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent adding yourself
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const project = req.project;

    //  Prevent duplicate members 
    const isAlreadyMember = project.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push(user._id);
    await project.save();

    res.status(200).json({
      message: 'Member added successfully',
      members: project.members,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
};
