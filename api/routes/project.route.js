const express = require('express');
const protect = require('../middlewares/authMiddleware');
const projectAccess = require('../middlewares/projectMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember
} = require('../controllers/project.controller');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.get('/:id', projectAccess, getProjectById);
router.post('/', createProject);
router.put('/:id', projectAccess, updateProject);
router.delete('/:id', projectAccess, deleteProject);
router.post('/:id/members', projectAccess, addProjectMember);

module.exports = router;
