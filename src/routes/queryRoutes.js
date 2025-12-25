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
 * @route   GET /api/queries/institute-results/:instituteId
 * @desc    Get all results of students per institute
 * @access  Public
 */
router.get('/institute-results/:instituteId', getInstituteResults);

/**
 * @route   GET /api/queries/top-courses
 * @desc    Get top courses taken by users per year
 * @access  Public
 */
router.get('/top-courses', getTopCoursesByYear);

/**
 * @route   GET /api/queries/top-students
 * @desc    Get top ranking students by highest results
 * @access  Public
 */
router.get('/top-students', getTopRankingStudents);

/**
 * @route   GET /api/queries/institute-performance
 * @desc    Get student performance summary by institute
 * @access  Public
 */
router.get('/institute-performance', getInstitutePerformance);

/**
 * @route   GET /api/queries/course-grades/:courseId
 * @desc    Get course grade distribution
 * @access  Public
 */
router.get('/course-grades/:courseId', getCourseGradeDistribution);

module.exports = router;
