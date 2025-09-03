import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleCourses = [
  {
    code: 'CSC101',
    title: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer science and programming',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: '16 weeks',
    credits: 3,
    difficulty: 'Beginner',
    requirements: [],
  },
  {
    code: 'CSC201',
    title: 'Data Structures and Algorithms',
    description: 'Study of data structures and algorithmic problem solving',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: '16 weeks',
    credits: 3,
    difficulty: 'Intermediate',
    requirements: ['CSC101'],
  },
  {
    code: 'ISA101',
    title: 'Introduction to Information Security',
    description: 'Fundamentals of information security and cybersecurity',
    category: 'Core',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: '16 weeks',
    credits: 3,
    difficulty: 'Beginner',
    requirements: [],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create courses
  for (const course of sampleCourses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: {},
      create: {
        code: course.code,
        title: course.title,
        description: course.description,
        category: course.category,
        department: course.department,
        school: course.school,
        catalog: course.catalog,
        duration: course.duration,
        credits: Number(course.credits),
        difficulty: course.difficulty,
        requirements: course.requirements || [],
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
