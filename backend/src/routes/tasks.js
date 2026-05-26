const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// All task routes are protected by auth middleware
router.get('/', auth, getAllTasks);
router.get('/:id', auth, getTaskById);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;