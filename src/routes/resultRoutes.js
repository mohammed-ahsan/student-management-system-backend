const express = require('express');
const router = express.Router();
const {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult
} = require('../controllers/resultController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllResults);
router.get('/:id', getResultById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createResult);
router.put('/:id', authenticateToken, updateResult);
router.delete('/:id', authenticateToken, deleteResult);

module.exports = router;
