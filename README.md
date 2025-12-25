# Student Management System

A comprehensive web application built with Express.js, Prisma ORM, PostgreSQL, and JWT authentication. This system manages students, institutes, courses, and results with advanced querying capabilities and database indexing for performance optimization.

## Features

✅ **JWT Authentication** - Secure user authentication with access tokens  
✅ **Refresh Token System** - Token rotation with device fingerprinting for enhanced security  
✅ **PostgreSQL Database** - Relational database with Prisma ORM  
✅ **CRUD Operations** - Full Create, Read, Update, Delete for all entities  
✅ **Pagination** - Efficient data retrieval with pagination support  
✅ **Complex Queries** - Advanced queries with joins, aggregations, and window functions  
✅ **Database Indexing** - Optimized indexes for improved query performance  
✅ **Data Seeding** - Seed script for generating 100,000 records per table  
✅ **Rate Limiting** - API rate limiting to prevent abuse and brute force attacks

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit

## Project Structure

```
student-management-system/
├── prisma/
│   └── schema.prisma          # Database schema with indexes
├── src/
│   ├── config/
│   │   └── database.js         # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── instituteController.js
│   │   ├── studentController.js
│   │   ├── courseController.js
│   │   ├── resultController.js
│   │   └── queryController.js # Complex queries
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── rateLimiter.js     # Rate limiting middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── instituteRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── resultRoutes.js
│   │   └── queryRoutes.js
│   ├── index.js               # Application entry point
│   └── seed.js               # Database seeding 
├── .env                      # Environment variables
├── package.json
└── README.md                 # This file
```

## Database Schema

### Tables

1. **User** - Authentication users
   - id, email, password, name, role, timestamps
   - Indexes: email
   - Relations: refreshTokens

2. **RefreshToken** - Session management tokens
   - id, token, userId, deviceId, deviceName, deviceType, expiresAt, createdAt, revoked, replacedByToken
   - Indexes: token, userId, deviceId, expiresAt
   - Relations: user

3. **Institute** - Educational institutions
   - id, name, address, contact, timestamps
   - Indexes: name, id
   - Relations: students, results

4. **Student** - Student records
   - id, name, email, instituteId, timestamps
   - Indexes: instituteId, email, id
   - Relations: institute, results

5. **Course** - Course offerings
   - id, name, code, credits, year, timestamps
   - Indexes: name, code, year, id
   - Relations: results

6. **Result** - Student exam results
   - id, studentId, courseId, instituteId, score, grade, year, timestamps
   - Indexes: studentId, courseId, instituteId, score, year, grade, (studentId, courseId), (instituteId, year)
   - Relations: student, course, institute

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   - Create a PostgreSQL database named `student_management`
   - Update the `DATABASE_URL` in `.env` file with your credentials

4. **Configure environment variables**
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/student_management?schema=public"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="15m"
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

7. **Seed the database (optional)**
   ```bash
   npm run seed
   ```
   This will create 100,000 records in each table for performance testing.

8. **Start the development server**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

9. **Verify the server is running**
   ```bash
   curl http://localhost:3000/health
   ```

### Complex Query Endpoints

#### Get Institute Results
```http
GET /api/queries/institute-results/:instituteId?page=1&limit=10&year=2024
```
Returns all results of students per institute with pagination.

#### Get Top Courses by Year
```http
GET /api/queries/top-courses?year=2024&limit=10
```
Returns top courses taken by users per year with enrollment count and average scores.

#### Get Top Ranking Students
```http
GET /api/queries/top-students?limit=10&year=2024
```
Returns top ranking students by highest results with rank position.

#### Get Institute Performance
```http
GET /api/queries/institute-performance?year=2024
```
Returns student performance summary by institute with statistics.

#### Get Course Grade Distribution
```http
GET /api/queries/course-grades/:courseId
```
Returns grade distribution for a specific course.

## Pagination

Most list endpoints support pagination:

```http
GET /api/students?page=1&limit=10
```

Response includes pagination metadata:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100000,
    "totalPages": 10000
  }
}
```

## Database Indexing

### Created Indexes

Indexes have been created on all tables to optimize query performance:

**User Table:**
- email (unique)

**Institute Table:**
- name, id

**Student Table:**
- instituteId, email, id

**Course Table:**
- name, code, year, id

**Result Table:**
- studentId, courseId, instituteId, score, year, grade
- Composite indexes: (studentId, courseId), (instituteId, year)

### Performance Comparison

With 100,000 records per table, indexes significantly improve query performance:

**Example Query: Get results by institute and year**

Without index on (instituteId, year):
- Query time: ~2-3 seconds

With index on (instituteId, year):
- Query time: ~50-100ms

**Example Query: Get student by email**

Without index on email:
- Query time: ~1-2 seconds

With index on email:
- Query time: ~5-10ms

## Test Credentials

After running the seed script, you can use these credentials for testing:

**Admin User:**
- Email: admin@example.com
- Password: admin123

**Regular User:**
- Email: user@example.com
- Password: user123

## Security Features

1. **Password Hashing** - All passwords are hashed using bcrypt with salt rounds
2. **JWT Authentication** - Secure token-based authentication with short-lived access tokens (15 minutes)
3. **Refresh Token System** - Token rotation with device fingerprinting for enhanced session security
4. **Role-Based Access Control** - Different access levels for different user roles
5. **Input Validation** - Request validation using express-validator
6. **SQL Injection Prevention** - Prisma ORM provides built-in protection
7. **Rate Limiting** - Protection against brute force attacks and API abuse



## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run seed
```

### Prisma Studio

Prisma Studio is a visual database editor that lets you view and edit data:

```bash
npm run prisma:studio
```

## Performance Testing

The seed script generates 100,000 records per table. You can test query performance using the complex query endpoints:

```bash
# Test top courses query
curl http://localhost:3000/api/queries/top-courses?year=2024

# Test institute performance query
curl http://localhost:3000/api/queries/institute-performance
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists

### Migration Errors
- Run `npx prisma migrate reset` to reset database
- Check for conflicting migrations

### JWT Token Issues
- Verify JWT_SECRET is set in .env
- Check token expiration time
- Ensure token is sent in Authorization header

### Production URL

The application is deployed and available at:
- **API**: http://34.171.199.43
- **Health Check**: http://34.171.199.43/health

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## Documentation

- [README.md](README.md) - This file (project overview and API documentation)

## License

ISC

## Contact

For questions or issues, please open an issue on the repository.

---

**Note**: This is a demonstration project. For production use, implement additional security measures such as rate limiting, refresh tokens, HTTPS, and comprehensive error handling.
