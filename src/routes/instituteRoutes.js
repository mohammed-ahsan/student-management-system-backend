const express = require('express');
const router = express.Router();
const {
  getAllInstitutes,
  getInstituteById,
  createInstitute,
  updateInstitute,
  deleteInstitute
} = require('../controllers/instituteController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllInstitutes);
router.get('/:id', getInstituteById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createInstitute);
router.put('/:id', authenticateToken, updateInstitute);
router.delete('/:id', authenticateToken, deleteInstitute);

module.exports = router;
