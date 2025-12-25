const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const BATCH_SIZE = 1000;
const TOTAL_RECORDS = 100000;

// Helper function to generate random data
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Emma'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
const streetTypes = ['Street', 'Avenue', 'Road', 'Lane', 'Boulevard', 'Drive'];
const courseNames = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Economics'];
const courseCodes = ['MATH', 'PHYS', 'CHEM', 'BIO', 'CS', 'ENG', 'HIST', 'ECON'];
const grades = ['A', 'B', 'C', 'D', 'F'];

// Seed Institutes
async function seedInstitutes() {
  console.log('🏫 Seeding Institutes...');
  
  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, TOTAL_RECORDS - i);
    
    for (let j = 0; j < batchSize; j++) {
      const id = i + j + 1;
      batch.push({
        name: `Institute ${id}`,
        address: `${randomInt(1, 9999)} ${randomChoice(streetTypes)}, ${randomChoice(cities)}`,
        contact: `+1${randomInt(100, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`
      });
    }
    
    await prisma.institute.createMany({ data: batch, skipDuplicates: true });
    console.log(`   Created ${i + batchSize}/${TOTAL_RECORDS} institutes`);
  }
  
  console.log('✅ Institutes seeded successfully\n');
}

// Seed Students
async function seedStudents() {
  console.log('👨‍🎓 Seeding Students...');
  
  const instituteCount = await prisma.institute.count();
  
  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, TOTAL_RECORDS - i);
    
    for (let j = 0; j < batchSize; j++) {
      const id = i + j + 1;
      const firstName = randomChoice(firstNames);
      const lastName = randomChoice(lastNames);
      batch.push({
        name: `${firstName} ${lastName} ${id}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${id}@example.com`,
        instituteId: randomInt(1, instituteCount)
      });
    }
    
    await prisma.student.createMany({ data: batch, skipDuplicates: true });
    console.log(`   Created ${i + batchSize}/${TOTAL_RECORDS} students`);
  }
  
  console.log('✅ Students seeded successfully\n');
}

// Seed Courses
async function seedCourses() {
  console.log('📚 Seeding Courses...');
  
  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, TOTAL_RECORDS - i);
    
    for (let j = 0; j < batchSize; j++) {
      const id = i + j + 1;
      const courseName = randomChoice(courseNames);
      const courseCode = randomChoice(courseCodes);
      batch.push({
        name: `${courseName} ${id}`,
        code: `${courseCode}${randomInt(100, 499)}`,
        credits: randomInt(1, 4),
        year: randomInt(2020, 2025)
      });
    }
    
    await prisma.course.createMany({ data: batch, skipDuplicates: true });
    console.log(`   Created ${i + batchSize}/${TOTAL_RECORDS} courses`);
  }
  
  console.log('✅ Courses seeded successfully\n');
}

// Seed Results
async function seedResults() {
  console.log('📊 Seeding Results...');
  
  const studentCount = await prisma.student.count();
  const courseCount = await prisma.course.count();
  const instituteCount = await prisma.institute.count();
  
  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, TOTAL_RECORDS - i);
    
    for (let j = 0; j < batchSize; j++) {
      const studentId = randomInt(1, studentCount);
      const courseId = randomInt(1, courseCount);
      const instituteId = randomInt(1, instituteCount);
      const score = randomInt(0, 100);
      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
      
      batch.push({
        studentId,
        courseId,
        instituteId,
        score,
        grade,
        year: randomInt(2020, 2025)
      });
    }
    
    await prisma.result.createMany({ data: batch, skipDuplicates: true });
    console.log(`   Created ${i + batchSize}/${TOTAL_RECORDS} results`);
  }
  
  console.log('✅ Results seeded successfully\n');
}

// Seed Users (Admin and test users)
async function seedUsers() {
  console.log('👤 Seeding Users...');
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });
  
  // Create regular test user
  const regularPassword = await bcrypt.hash('user123', salt);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: regularPassword,
      name: 'Regular User',
      role: 'user'
    }
  });
  
  console.log('✅ Users seeded successfully\n');
}

// Main seed function
async function main() {
  console.log('🌱 Starting database seeding...\n');
  console.log(`   Total records per table: ${TOTAL_RECORDS}\n`);
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.result.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.institute.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Data cleared\n');
    
    // Seed data in order (respecting foreign key dependencies)
    await seedUsers();
    await seedInstitutes();
    await seedStudents();
    await seedCourses();
    await seedResults();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
