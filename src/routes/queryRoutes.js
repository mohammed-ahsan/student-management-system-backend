const express = require('express');
const router = express.Router();
const {
  getInstituteResults,
  getTopCoursesByYear,
  getTopRankingStudents,
  getInstitutePerformance,
  getCourseGradeDistribution
} = require('../controllers/queryController');
const { authenticateToken } = require('../middleware/auth');

// All query routes are public for demonstration purposes
// In production, you might want to protect some of these

/**
 * @swagger
 * /api/queries/institute-results/{instituteId}:
 *   get:
 *     summary: Get all results of students per institute
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: instituteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Institute ID
 *     responses:
 *       200:
 *         description: Institute results retrieved successfully
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
 *                     instituteId:
 *                       type: string
 *                       example: cm123abc456
 *                     instituteName:
 *                       type: string
 *                       example: Example University
 *                     totalStudents:
 *                       type: integer
 *                       example: 50
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Result'
 *       404:
 *         description: Institute not found
 *       500:
 *         description: Internal server error
 */
router.get('/institute-results/:instituteId', getInstituteResults);

/**
 * @swagger
 * /api/queries/top-courses:
 *   get:
 *     summary: Get top courses taken by users per year
 *     tags: [Queries]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter courses
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of top courses to return
 *     responses:
 *       200:
 *         description: Top courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopCoursesResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/top-courses', getTopCoursesByYear);

/**
 * @swagger
 * /api/queries/top-students:
 *   get:
 *     summary: Get top ranking students by highest results
 *     tags: [Queries]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of top students to return
 *       - in: query
 *         name: instituteId
 *         schema:
 *           type: string
 *         description: Filter by institute ID
 *     responses:
 *       200:
 *         description: Top students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopStudentsResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/top-students', getTopRankingStudents);

/**
 * @swagger
 * /api/queries/institute-performance:
 *   get:
 *     summary: Get student performance summary by institute
 *     tags: [Queries]
 *     responses:
 *       200:
 *         description: Institute performance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstitutePerformanceResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/institute-performance', getInstitutePerformance);

/**
 * @swagger
 * /api/queries/course-grades/{courseId}:
 *   get:
 *     summary: Get course grade distribution
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Grade distribution retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GradeDistributionResponse'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get('/course-grades/:courseId', getCourseGradeDistribution);

module.exports = router;
