const { getUser, getUsers, editUser, findUserByEmail, deleteUser } = require('../controllers/user.controller');
const protect = require('../middlewares/authMiddleware')

const express = require('express');
const router = express.Router();

router.get('/', getUsers);
router.get('/find-by-email', protect, findUserByEmail);
router.get('/profile', protect, getUser);
router.put('/profile', protect, editUser);
router.delete('/profile', protect, deleteUser);

module.exports = router;