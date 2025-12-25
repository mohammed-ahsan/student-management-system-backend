const express = require('express');
const router = express.Router();
const { signup, signin, getCurrentUser, refreshToken, logout, logoutAll } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TEACHER, STUDENT]
 *                 example: TEACHER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/signin', signin);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: cm111aaa222
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       example: TEACHER
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token obtained from login/signup
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad request - Refresh token is required
 *       401:
 *         description: Unauthorized - Invalid, expired, or revoked refresh token
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   delete:
 *     summary: Logout from current device
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Logs out the user from the current device by invalidating the refresh token associated with the access token's device
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.delete('/logout', authenticateToken, logout);

/**
 * @swagger
 * /api/auth/logout-all:
 *   delete:
 *     summary: Logout from all devices
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out from all devices successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.delete('/logout-all', authenticateToken, logoutAll);

module.exports = router;
