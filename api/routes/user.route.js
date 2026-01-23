const { getUser, getUsers, editUser } = require('../controllers/user.controller');
const protect = require('../middlewares/authMiddleware')

const express = require('express');
const router = express.Router();

router.get('/', getUsers);
router.get('/profile', protect, getUser);
router.put('/profile',protect, editUser);

module.exports = router;