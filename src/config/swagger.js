const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management System API',
      version: '1.0.0',
      description: 'A comprehensive student management system with authentication, institute management, student records, courses, results, and query handling',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Server is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Institute: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm123abc456'
            },
            name: {
              type: 'string',
              example: 'Example University'
            },
            address: {
              type: 'string',
              example: '123 Main Street, City'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'info@example.edu'
            },
            phone: {
              type: 'string',
              example: '+1234567890'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        InstitutesResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Institute'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 25
                },
                totalPages: {
                  type: 'integer',
                  example: 3
                }
              }
            }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm456def789'
            },
            name: {
              type: 'string',
              example: 'Jane Smith'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jane@example.com'
            },
            rollNumber: {
              type: 'string',
              example: '2023001'
            },
            instituteId: {
              type: 'string',
              example: 'cm123abc456'
            },
            institute: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'cm123abc456'
                },
                name: {
                  type: 'string',
                  example: 'Example University'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        StudentsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Student'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 50
                },
                totalPages: {
                  type: 'integer',
                  example: 5
                }
              }
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm789ghi012'
            },
            name: {
              type: 'string',
              example: 'Introduction to Computer Science'
            },
            code: {
              type: 'string',
              example: 'CS101'
            },
            description: {
              type: 'string',
              example: 'Basic programming concepts'
            },
            credits: {
              type: 'integer',
              example: 3
            },
            instituteId: {
              type: 'string',
              example: 'cm123abc456'
            },
            institute: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'cm123abc456'
                },
                name: {
                  type: 'string',
                  example: 'Example University'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CoursesResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Course'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 15
                },
                totalPages: {
                  type: 'integer',
                  example: 2
                }
              }
            }
          }
        },
        Result: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm345jkl678'
            },
            studentId: {
              type: 'string',
              example: 'cm456def789'
            },
            courseId: {
              type: 'string',
              example: 'cm789ghi012'
            },
            marks: {
              type: 'number',
              format: 'float',
              example: 85.5
            },
            grade: {
              type: 'string',
              example: 'A'
            },
            semester: {
              type: 'string',
              example: 'Fall 2024'
            },
            student: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'cm456def789'
                },
                name: {
                  type: 'string',
                  example: 'Jane Smith'
                },
                email: {
                  type: 'string',
                  example: 'jane@example.com'
                }
              }
            },
            course: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'cm789ghi012'
                },
                name: {
                  type: 'string',
                  example: 'Introduction to Computer Science'
                },
                code: {
                  type: 'string',
                  example: 'CS101'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ResultsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Result'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 100
                },
                totalPages: {
                  type: 'integer',
                  example: 10
                }
              }
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: 'cm111aaa222'
                    },
                    name: {
                      type: 'string',
                      example: 'John Doe'
                    },
                    email: {
                      type: 'string',
                      example: 'john@example.com'
                    },
                    role: {
                      type: 'string',
                      example: 'TEACHER'
                    }
                  }
                }
              }
            }
          }
        },
        TopCourse: {
          type: 'object',
          properties: {
            courseId: {
              type: 'string',
              example: 'cm789ghi012'
            },
            courseName: {
              type: 'string',
              example: 'Introduction to Computer Science'
            },
            courseCode: {
              type: 'string',
              example: 'CS101'
            },
            enrollmentCount: {
              type: 'integer',
              example: 150
            }
          }
        },
        TopCoursesResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TopCourse'
              }
            }
          }
        },
        TopStudent: {
          type: 'object',
          properties: {
            studentId: {
              type: 'string',
              example: 'cm456def789'
            },
            studentName: {
              type: 'string',
              example: 'Jane Smith'
            },
            studentEmail: {
              type: 'string',
              example: 'jane@example.com'
            },
            instituteName: {
              type: 'string',
              example: 'Example University'
            },
            averageMarks: {
              type: 'number',
              format: 'float',
              example: 92.5
            },
            totalResults: {
              type: 'integer',
              example: 5
            }
          }
        },
        TopStudentsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TopStudent'
              }
            }
          }
        },
        InstitutePerformance: {
          type: 'object',
          properties: {
            instituteId: {
              type: 'string',
              example: 'cm123abc456'
            },
            instituteName: {
              type: 'string',
              example: 'Example University'
            },
            totalStudents: {
              type: 'integer',
              example: 50
            },
            averageMarks: {
              type: 'number',
              format: 'float',
              example: 78.5
            },
            highestGrade: {
              type: 'string',
              example: 'A+'
            }
          }
        },
        InstitutePerformanceResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/InstitutePerformance'
              }
            }
          }
        },
        GradeDistribution: {
          type: 'object',
          properties: {
            grade: {
              type: 'string',
              example: 'A'
            },
            count: {
              type: 'integer',
              example: 15
            },
            percentage: {
              type: 'number',
              format: 'float',
              example: 30.0
            }
          }
        },
        GradeDistributionResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                courseId: {
                  type: 'string',
                  example: 'cm789ghi012'
                },
                courseName: {
                  type: 'string',
                  example: 'Introduction to Computer Science'
                },
                totalResults: {
                  type: 'integer',
                  example: 50
                },
                gradeDistribution: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/GradeDistribution'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
