const { prisma } = require('../config/database');

/**
 * Get all courses with pagination
 * GET /api/courses
 */
const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' }
      }),
      prisma.course.count()
    ]);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get course by ID
 * GET /api/courses/:id
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        results: {
          include: {
            student: true,
            institute: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create new course
 * POST /api/courses
 */
const createCourse = async (req, res) => {
  try {
    const { name, code, credits, year } = req.body;

    if (!name || !code || !credits || !year) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, credits, and year are required'
      });
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        credits: parseInt(credits),
        year: parseInt(year)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update course
 * PUT /api/courses/:id
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credits, year } = req.body;

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(credits && { credits: parseInt(credits) }),
        ...(year && { year: parseInt(year) })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete course
 * DELETE /api/courses/:id
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
