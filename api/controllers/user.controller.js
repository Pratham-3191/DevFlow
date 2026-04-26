const User = require('../models/user.model');
const Task = require('../models/task.model');
const Project = require('../models/project.model');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ body: users, message: 'Users fetched successfully' });
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password -refreshToken -__v');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

const editUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { name, phone, location, bio, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        location,
        bio,
        avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -refreshToken -__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
const findUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ✅ SAFE CHECK (no crash)
    if (req.user?.email && normalizedEmail === req.user.email.toLowerCase()) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const user = await User.findOne({ email: normalizedEmail })
      .select('_id email name');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("FIND USER ERROR:", error); // 🔥 helps debugging
    next(error);
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Task.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    );

    await Project.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    const userProjects = await Project.find({ createdBy: userId });

    const projectIds = userProjects.map(p => p._id);

    await Task.deleteMany({ projectId: { $in: projectIds } });

    await Project.deleteMany({ _id: { $in: projectIds } });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted permanently" });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUser, getUsers, editUser, findUserByEmail, deleteUser };