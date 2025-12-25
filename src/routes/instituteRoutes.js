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
/**
 * @swagger
 * /api/institutes:
 *   get:
 *     summary: Get all institutes
 *     tags: [Institutes]
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
 *         description: Institutes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstitutesResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllInstitutes);

/**
 * @swagger
 * /api/institutes/{id}:
 *   get:
 *     summary: Get institute by ID
 *     tags: [Institutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Institute ID
 *     responses:
 *       200:
 *         description: Institute retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Institute'
 *       404:
 *         description: Institute not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getInstituteById);

// Protected routes (require authentication)
/**
 * @swagger
 * /api/institutes:
 *   post:
 *     summary: Create a new institute
 *     tags: [Institutes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Example University
 *               address:
 *                 type: string
 *                 example: 123 Main Street, City
 *               email:
 *                 type: string
 *                 format: email
 *                 example: info@example.edu
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Institute created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createInstitute);

/**
 * @swagger
 * /api/institutes/{id}:
 *   put:
 *     summary: Update an institute
 *     tags: [Institutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Institute ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated University Name
 *               address:
 *                 type: string
 *                 example: 456 New Street, City
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.edu
 *               phone:
 *                 type: string
 *                 example: "+9876543210"
 *     responses:
 *       200:
 *         description: Institute updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Institute not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, updateInstitute);

/**
 * @swagger
 * /api/institutes/{id}:
 *   delete:
 *     summary: Delete an institute
 *     tags: [Institutes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Institute ID
 *     responses:
 *       200:
 *         description: Institute deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Institute not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, deleteInstitute);

module.exports = router;
