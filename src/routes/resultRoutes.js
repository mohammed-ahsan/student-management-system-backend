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
/**
 * @swagger
 * /api/results:
 *   get:
 *     summary: Get all results
 *     tags: [Results]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultsResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllResults);

/**
 * @swagger
 * /api/results/{id}:
 *   get:
 *     summary: Get result by ID
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Result ID
 *     responses:
 *       200:
 *         description: Result retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Result'
 *       404:
 *         description: Result not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getResultById);

// Protected routes (require authentication)
/**
 * @swagger
 * /api/results:
 *   post:
 *     summary: Create a new result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - courseId
 *               - marks
 *               - grade
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "456"
 *               courseId:
 *                 type: string
 *                 example: "789"
 *               marks:
 *                 type: number
 *                 format: float
 *                 example: 85.5
 *               grade:
 *                 type: string
 *                 example: "A"
 *               semester:
 *                 type: string
 *                 example: "Fall 2024"
 *     responses:
 *       201:
 *         description: Result created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createResult);

/**
 * @swagger
 * /api/results/{id}:
 *   put:
 *     summary: Update a result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Result ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marks:
 *                 type: number
 *                 format: float
 *                 example: 90.0
 *               grade:
 *                 type: string
 *                 example: "A+"
 *               semester:
 *                 type: string
 *                 example: "Spring 2025"
 *     responses:
 *       200:
 *         description: Result updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Result not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, updateResult);

/**
 * @swagger
 * /api/results/{id}:
 *   delete:
 *     summary: Delete a result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Result ID
 *     responses:
 *       200:
 *         description: Result deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Result not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, deleteResult);

module.exports = router;
