const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const courses = [
  {
    id: 'CSC101',
    code: 'CSC 101',
    title: 'Introduction to Computer Science',
    description: 'Fundamentals of computer science and programming',
    credits: 3,
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'CSC201',
    code: 'CSC 201',
    title: 'Data Structures and Algorithms',
    description: 'Study of data structures and algorithmic problem solving',
    credits: 3,
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'CSC301',
    code: 'CSC 301',
    title: 'Database Systems',
    description: 'Design and implementation of database systems',
    credits: 3,
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'CSC401',
    code: 'CSC 401',
    title: 'Software Engineering',
    description: 'Principles and practices of software development',
    credits: 3,
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  {
    id: 'ISA101',
    code: 'ISA 101',
    title: 'Introduction to Information Security',
    description: 'Fundamentals of information security and assurance',
    credits: 3,
    category: 'Core',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'ISA201',
    code: 'ISA 201',
    title: 'Network Security',
    description: 'Security in computer networks and communications',
    credits: 3,
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'intermediate'
  },
  {
    id: 'ISA301',
    code: 'ISA 301',
    title: 'Cryptography',
    description: 'Mathematical foundations of cryptographic systems',
    credits: 3,
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  {
    id: 'ISA401',
    code: 'ISA 401',
    title: 'Ethical Hacking',
    description: 'Penetration testing and vulnerability assessment',
    credits: 3,
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  },
  {
    id: 'DS101',
    code: 'DSC 101',
    title: 'Introduction to Data Science',
    description: 'Fundamentals of data science and analytics',
    credits: 3,
    category: 'Core',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'beginner'
  },
  {
    id: 'DS201',
    code: 'DSC 201',
    title: 'Machine Learning',
    description: 'Algorithms and techniques for machine learning',
    credits: 3,
    category: 'Major',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    difficulty: 'advanced'
  }
];

async function main() {
  console.log('Seeding courses...');
  
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {},
      create: course,
    });
  }
  
  console.log('Courses seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
