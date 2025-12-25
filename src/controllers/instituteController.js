const { prisma } = require('../config/database');

/**
 * Get all institutes with pagination
 * GET /api/institutes
 */
const getAllInstitutes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [institutes, total] = await Promise.all([
      prisma.institute.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' }
      }),
      prisma.institute.count()
    ]);

    res.status(200).json({
      success: true,
      data: institutes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get institutes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get institute by ID
 * GET /api/institutes/:id
 */
const getInstituteById = async (req, res) => {
  try {
    const { id } = req.params;

    const institute = await prisma.institute.findUnique({
      where: { id: parseInt(id) },
      include: {
        students: true,
        results: true
      }
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: 'Institute not found'
      });
    }

    res.status(200).json({
      success: true,
      data: institute
    });
  } catch (error) {
    console.error('Get institute error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create new institute
 * POST /api/institutes
 */
const createInstitute = async (req, res) => {
  try {
    const { name, address, contact } = req.body;

    if (!name || !address || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, and contact are required'
      });
    }

    const institute = await prisma.institute.create({
      data: {
        name,
        address,
        contact
      }
    });

    res.status(201).json({
      success: true,
      message: 'Institute created successfully',
      data: institute
    });
  } catch (error) {
    console.error('Create institute error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update institute
 * PUT /api/institutes/:id
 */
const updateInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contact } = req.body;

    const institute = await prisma.institute.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(contact && { contact })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Institute updated successfully',
      data: institute
    });
  } catch (error) {
    console.error('Update institute error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Institute not found'
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
 * Delete institute
 * DELETE /api/institutes/:id
 */
const deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.institute.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      success: true,
      message: 'Institute deleted successfully'
    });
  } catch (error) {
    console.error('Delete institute error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Institute not found'
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
  getAllInstitutes,
  getInstituteById,
  createInstitute,
  updateInstitute,
  deleteInstitute
};
