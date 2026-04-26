const express = require('express');
const protect = require('../middlewares/authMiddleware');
const projectAccess = require('../middlewares/projectMiddleware');

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getRecentActivity
} = require('../controllers/task.controller');

const router = express.Router();

router.use(protect);

router.get('/activity', getRecentActivity);
router.post('/', projectAccess, createTask);
router.put('/:id', projectAccess, updateTask);
router.delete('/:id', projectAccess, deleteTask);
router.get('/:projectId', projectAccess, getTasks);

module.exports = router;
