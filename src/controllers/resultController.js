const { prisma } = require('../config/database');

/**
 * Get all results with pagination
 * GET /api/results
 */
const getAllResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        skip,
        take: limit,
        include: {
          student: true,
          course: true,
          institute: true
        },
        orderBy: { id: 'asc' }
      }),
      prisma.result.count()
    ]);

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get result by ID
 * GET /api/results/:id
 */
const getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.result.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: true,
        course: true,
        institute: true
      }
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create new result
 * POST /api/results
 */
const createResult = async (req, res) => {
  try {
    const { studentId, courseId, instituteId, score, grade, year } = req.body;

    if (!studentId || !courseId || !instituteId || score === undefined || !grade || !year) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const result = await prisma.result.create({
      data: {
        studentId: parseInt(studentId),
        courseId: parseInt(courseId),
        instituteId: parseInt(instituteId),
        score: parseFloat(score),
        grade,
        year: parseInt(year)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: result
    });
  } catch (error) {
    console.error('Create result error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update result
 * PUT /api/results/:id
 */
const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, courseId, instituteId, score, grade, year } = req.body;

    const result = await prisma.result.update({
      where: { id: parseInt(id) },
      data: {
        ...(studentId && { studentId: parseInt(studentId) }),
        ...(courseId && { courseId: parseInt(courseId) }),
        ...(instituteId && { instituteId: parseInt(instituteId) }),
        ...(score !== undefined && { score: parseFloat(score) }),
        ...(grade && { grade }),
        ...(year && { year: parseInt(year) })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Result updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update result error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
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
 * Delete result
 * DELETE /api/results/:id
 */
const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.result.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Delete result error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
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
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult
};
