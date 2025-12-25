const { prisma } = require('../config/database');

/**
 * Get all results of students per institute with pagination
 * Complex query joining multiple tables
 * GET /api/queries/institute-results/:instituteId
 */
const getInstituteResults = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const year = req.query.year ? parseInt(req.query.year) : undefined;
    const skip = (page - 1) * limit;

    const where = {
      instituteId: parseInt(instituteId),
      ...(year && { year })
    };

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
          course: true,
          institute: true
        },
        orderBy: { score: 'desc' }
      }),
      prisma.result.count({ where })
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
    console.error('Get institute results error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get top courses taken by users per year
 * Complex query with aggregation
 * GET /api/queries/top-courses
 */
const getTopCoursesByYear = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const limit = parseInt(req.query.limit) || 10;

    // Using raw SQL for complex aggregation with GROUP BY
    const topCourses = await prisma.$queryRaw`
      SELECT 
        c.id,
        c.name,
        c.code,
        c.credits,
        c.year,
        COUNT(r.id) as enrollment_count,
        AVG(r.score) as average_score,
        MAX(r.score) as max_score,
        MIN(r.score) as min_score
      FROM "Course" c
      INNER JOIN "Result" r ON c.id = r."courseId"
      WHERE c.year = ${year}
      GROUP BY c.id, c.name, c.code, c.credits, c.year
      ORDER BY enrollment_count DESC
      LIMIT ${limit}
    `;
    
    const serializedCourses = topCourses.map(course => ({
      ...course,
      id: Number(course.id),
      enrollment_count: Number(course.enrollment_count),
      credits: Number(course.credits),
      year: Number(course.year),
      max_score: Number(course.max_score),
      min_score: Number(course.min_score)
    }));

    res.status(200).json({
      success: true,
      data: serializedCourses,
      year
    });
  } catch (error) {
    console.error('Get top courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get top ranking students by highest results
 * Complex query with aggregation and window functions
 * GET /api/queries/top-students
 */
const getTopRankingStudents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const year = req.query.year ? parseInt(req.query.year) : undefined;

    let topStudents;
    
    if (year) {
      topStudents = await prisma.$queryRaw`
        SELECT 
          s.id,
          s.name,
          s.email,
          i.name as institute_name,
          COUNT(r.id) as total_courses,
          AVG(r.score) as average_score,
          SUM(r.score) as total_score,
          MAX(r.score) as highest_score,
          MIN(r.score) as lowest_score,
          RANK() OVER (ORDER BY AVG(r.score) DESC) as rank_position
        FROM "Student" s
        INNER JOIN "Result" r ON s.id = r."studentId"
        INNER JOIN "Institute" i ON s."instituteId" = i.id
        WHERE r.year = ${year}
        GROUP BY s.id, s.name, s.email, i.name
        ORDER BY average_score DESC
        LIMIT ${limit}
      `;
    } else {
    // Using raw SQL for complex ranking query
      topStudents = await prisma.$queryRaw`
        SELECT 
          s.id,
          s.name,
          s.email,
          i.name as institute_name,
          COUNT(r.id) as total_courses,
          AVG(r.score) as average_score,
          SUM(r.score) as total_score,
          MAX(r.score) as highest_score,
          MIN(r.score) as lowest_score,
          RANK() OVER (ORDER BY AVG(r.score) DESC) as rank_position
        FROM "Student" s
        INNER JOIN "Result" r ON s.id = r."studentId"
        INNER JOIN "Institute" i ON s."instituteId" = i.id
        GROUP BY s.id, s.name, s.email, i.name
        ORDER BY average_score DESC
        LIMIT ${limit}
      `;
    }
    
    const serializedStudents = topStudents.map(student => ({
      ...student,
      id: Number(student.id),
      total_courses: Number(student.total_courses),
      total_score: Number(student.total_score),
      highest_score: Number(student.highest_score),
      lowest_score: Number(student.lowest_score),
      rank_position: Number(student.rank_position)
    }));

    res.status(200).json({
      success: true,
      data: serializedStudents,
      ...(year && { year })
    });
  } catch (error) {
    console.error('Get top students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get student performance summary by institute
 * Complex aggregation query
 * GET /api/queries/institute-performance
 */
const getInstitutePerformance = async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : undefined;

    let instituteStats;
    
    if (year) {
      instituteStats = await prisma.$queryRaw`
        SELECT 
          i.id,
          i.name,
          i.address,
          i.contact,
          COUNT(DISTINCT s.id) as total_students,
          COUNT(DISTINCT r."courseId") as total_courses_offered,
          COUNT(r.id) as total_results,
          AVG(r.score) as average_score,
          MAX(r.score) as highest_score,
          MIN(r.score) as lowest_score,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.score) as median_score
        FROM "Institute" i
        LEFT JOIN "Student" s ON i.id = s."instituteId"
        LEFT JOIN "Result" r ON s.id = r."studentId"
        WHERE r.year = ${year}
        GROUP BY i.id, i.name, i.address, i.contact
        ORDER BY average_score DESC
      `;
    } else {
      instituteStats = await prisma.$queryRaw`
        SELECT 
          i.id,
          i.name,
          i.address,
          i.contact,
          COUNT(DISTINCT s.id) as total_students,
          COUNT(DISTINCT r."courseId") as total_courses_offered,
          COUNT(r.id) as total_results,
          AVG(r.score) as average_score,
          MAX(r.score) as highest_score,
          MIN(r.score) as lowest_score,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.score) as median_score
        FROM "Institute" i
        LEFT JOIN "Student" s ON i.id = s."instituteId"
        LEFT JOIN "Result" r ON s.id = r."studentId"
        GROUP BY i.id, i.name, i.address, i.contact
        ORDER BY average_score DESC
      `;
    }
    
    const serializedStats = instituteStats.map(stat => ({
      ...stat,
      id: Number(stat.id),
      total_students: Number(stat.total_students),
      total_courses_offered: Number(stat.total_courses_offered),
      total_results: Number(stat.total_results),
      highest_score: Number(stat.highest_score),
      lowest_score: Number(stat.lowest_score)
    }));

    res.status(200).json({
      success: true,
      data: serializedStats,
      ...(year && { year })
    });
  } catch (error) {
    console.error('Get institute performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get course grade distribution
 * Complex aggregation with GROUP BY
 * GET /api/queries/course-grades/:courseId
 */
const getCourseGradeDistribution = async (req, res) => {
  try {
    const { courseId } = req.params;

    const gradeDistribution = await prisma.result.groupBy({
      by: ['grade'],
      where: {
        courseId: parseInt(courseId)
      },
      _count: {
        grade: true
      },
      _avg: {
        score: true
      },
      orderBy: {
        grade: 'asc'
      }
    });

    const totalStudents = gradeDistribution.reduce(
      (sum, item) => sum + item._count.grade,
      0
    );

    const distribution = gradeDistribution.map(item => ({
      grade: item.grade,
      count: item._count.grade,
      percentage: ((item._count.grade / totalStudents) * 100).toFixed(2),
      averageScore: parseFloat(item._avg.score.toFixed(2))
    }));

    res.status(200).json({
      success: true,
      data: distribution,
      totalStudents
    });
  } catch (error) {
    console.error('Get course grade distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getInstituteResults,
  getTopCoursesByYear,
  getTopRankingStudents,
  getInstitutePerformance,
  getCourseGradeDistribution
};
