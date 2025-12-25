const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createStudent);
router.put('/:id', authenticateToken, updateStudent);
router.delete('/:id', authenticateToken, deleteStudent);

module.exports = router;
