const User = require('../models/user.model');

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

module.exports = { getUser, getUsers, editUser };