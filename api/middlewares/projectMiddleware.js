const Project = require('../models/project.model');
const Task = require('../models/task.model');

const projectAccess = async (req, res, next) => {
  try {
    let projectId = req.params.projectId || req.body?.projectId;

    // If accessing project directly
    if (!projectId && req.params.id && req.baseUrl.includes("projects")) {
      projectId = req.params?.id;
    }

    // If accessing task route for updating and deleting tasks (optional good for security )
    if (!projectId && req.params.id) {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      projectId = task.projectId;
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID missing" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      member =>member.toString() === req.user.id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }
console.log("req.user:", req.user);
console.log("project members:", project.members);
    req.project = project;
    next();

  } catch (error) {
    next(error);
  }
};

module.exports = projectAccess;