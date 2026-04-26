const Task = require('../models/task.model');
const Project = require('../models/project.model'); // ✅ ADD THIS
const mongoose = require('mongoose');


const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    // get user's projects
    const projects = await Project.find({ members: userId });

    const projectIds = projects.map(p => p._id);

    // get recent tasks
    const tasks = await Task.find({
      projectId: { $in: projectIds }
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate("assignedTo", "name")
      .populate({
        path: "projectId",
        populate: {
          path: "createdBy",
          select: "name"
        }
      });

    const activities = tasks.map(task => ({
      id: task._id,
      action:
        task.status === "Completed"
          ? `Task "${task.title}" completed`
          : `Task "${task.title}" updated`,

      // ✅ FIX HERE
      user:
        task.assignedTo?.length > 0
          ? task.assignedTo[0].name
          : task.projectId?.createdBy?.name || "User",

      time: task.updatedAt,
    }));

    res.json(activities);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Get all tasks (only if user is project member)
const getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId || req.query.projectId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // ✅ Check if user is project member
    const project = await Project.findOne({
      _id: projectId,
      members: userId,
    });

    if (!project) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get single task (with access check)
const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('projectId');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ✅ Check project membership
    if (!task.projectId.members.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ CREATE TASK + ADD MEMBERS TO PROJECT
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedMember,
      dueDate,
      status,
      priority,
    } = req.body;

    const userId = req.user.id;

    // ✅ 1. CHECK PROJECT EXISTS
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ 2. CHECK IF USER IS CREATOR
    if (project.createdBy.toString() !== userId) {
      return res.status(403).json({
        message: "Only project owner can create tasks",
      });
    }

    // ✅ 3. Continue your logic
    let assignedUsers = [];

    if (assignedMember && Array.isArray(assignedMember)) {
      assignedUsers = assignedMember;
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedUsers,
      dueDate,
      status,
      priority,
    });

    // ✅ ADD assigned users to project members
    if (assignedUsers.length > 0) {
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: {
          members: { $each: assignedUsers },
        },
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    res.status(201).json(populatedTask);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// UPDATE TASK (ADD USERS + ACCESS CONTROL)
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { assignedMember } = req.body;

    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ✅ Get project
    const project = await Project.findById(existingTask.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // ✅ Permission check
    const isAssigned = existingTask.assignedTo.some(
      (id) => id.toString() === userId
    );

    const isCreator = project.createdBy.toString() === userId;

    if (!isAssigned && !isCreator) {
      return res.status(403).json({ message: "Not allowed to edit this task" });
    }

    // ✅ Prepare update object
    let updateQuery = { ...req.body };
    delete updateQuery.assignedMember;

    // ✅ Replace assigned users
    if (assignedMember && Array.isArray(assignedMember)) {
      updateQuery.assignedTo = assignedMember;

      // ✅ Ensure assigned users are project members
      await Project.findByIdAndUpdate(existingTask.projectId, {
        $addToSet: {
          members: { $each: assignedMember },
        },
      });
    }

    // ✅ Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    // 🔥 AUTO CLEANUP LOGIC (IMPORTANT)
    const allTasks = await Task.find({
      projectId: existingTask.projectId,
    });

    const stillAssignedUserIds = new Set();

    // collect all assigned users
    allTasks.forEach(task => {
      task.assignedTo.forEach(uid => {
        stillAssignedUserIds.add(uid.toString());
      });
    });

    const projectDoc = await Project.findById(existingTask.projectId);

    // keep only creator + still assigned users
    const updatedMembers = projectDoc.members.filter(memberId => {
      return (
        memberId.toString() === projectDoc.createdBy.toString() ||
        stillAssignedUserIds.has(memberId.toString())
      );
    });

    projectDoc.members = updatedMembers;
    await projectDoc.save();

    res.status(200).json(updatedTask);

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};


// UPDATE TASK (ADD USERS + ACCESS CONTROL)
const updateTask1 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { assignedMember } = req.body;

    const existingTask = await Task.findById(req.params.id)

    if (!existingTask) {
      return res.status(404).json('No Tasks found')
    }

    const project = await Project.findById(existingTask.projectId);

    if (!project) {
      return res.status(404).json('No project found')
    }

    const isAssigned = existingTask.assignedTo.some(Id => Id.toString() === userId)
    const isCreator = project.createdBy.toString() === userId;

    if (!isAssigned && !isCreator) {
      return res.status(403).json('Dont have access to edit the task');
    }

    const updatedDoc = { ...req.body }
    delete updatedDoc.assignedMember;

    if (assignedMember && Array.isArray(assignedMember)) {
      updatedDoc.assignedTo = assignedMember;

      await Project.findByIdAndUpdate(existingTask.projectId, {
        $addToSet: {
          members: { $each: assignedMember }
        }
      }
      )
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id,
      updatedDoc,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email')
      .populate('projectId', 'name')


    const allTasks = await Task.find({ projectId: existingTask.projectId })

    const isstillAssigned = new Set()

    allTasks.forEach(task => task.assignedTo.forEach(id => {
      return (
        isstillAssigned.add(id.toString())
      )
    }))

    const projectDoc = await Project.findById(existingTask.projectId)
    const newMembers = projectDoc.members.filter(member => (
      isstillAssigned.has(member.toString()) ||
      member.toString() === projectDoc.createdBy.toString()
    ))
    projectDoc.members = newMembers;

    await projectDoc.save()

    return res.status(200).json(updatedTask)

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};


// ✅ Delete task (only creator)
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);

    if (project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only creator can delete task" });
    }

    await task.deleteOne();

    const allTasks = await Task.find({ projectId: task.projectId })

    const isstillAssigned = new Set();

    allTasks.forEach(t => {
      t.assignedTo.forEach(id => {
        isstillAssigned.add(id.toString());
      });
    });

    const projectDoc = await Project.findById(task.projectId)

    const newMembers = projectDoc.members.filter(id => (
      id.toString() === projectDoc.createdBy.toString() ||
      isstillAssigned.has(id.toString())
    ))

    projectDoc.members = newMembers;

    await projectDoc.save();

    res.status(200).json({ message: 'Task deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getRecentActivity
};