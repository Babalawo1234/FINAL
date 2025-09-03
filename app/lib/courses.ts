import {
  Course,
  CourseWithProgress,
  UserCourse,
  DashboardStats,
  CourseCategory,
} from './definitions';

// Extend the Course type to include code and requirements
type CourseWithCode = Course & {
  code: string;
  requirements?: string[];
  department: string;
  catalog: string;
};

// Course catalog structure by department and year
type CourseCatalog = {
  [department: string]: {
    [catalog: string]: CourseWithCode[];
  };
};

// Define the type for user courses by user ID
type UserCoursesByUser = {
  [userId: string]: UserCourse[];
};

// Flattened course array for easier access
export const MOCK_COURSES: Course[] = [
  // Computer Science 2022 Catalog
  {
    id: 'cs-101-2022',
    code: 'CSC 101',
    title: 'Introduction to Computer Science',
    description: 'Fundamentals of computer science and programming',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-102-2022',
    code: 'CSC 102',
    title: 'Data Structures and Algorithms',
    description: 'Advanced data structures and algorithm analysis',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 4,
    difficulty: 'intermediate',
    requirements: ['CSC 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-201-2022',
    code: 'CSC 201',
    title: 'Web Development',
    description: 'Modern web development technologies',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 2,
    difficulty: 'intermediate',
    requirements: ['CSC 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-202-2022',
    code: 'CSC 202',
    title: 'Advanced Programming',
    description: 'Advanced programming concepts and techniques',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 2,
    difficulty: 'intermediate',
    requirements: ['CSC 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Information Systems 2022 Catalog
  {
    id: 'is-101-2022',
    code: 'CIS 101',
    title: 'Introduction to Information Systems',
    description: 'Basic concepts of information systems',
    category: 'Core',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 2,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Information Security & Assurance 2022 Catalog
  {
    id: 'isa-101-2022',
    code: 'ISA 101',
    title: 'Introduction to Cybersecurity',
    description: 'Fundamentals of information security',
    category: 'Core',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // 2018 Catalog courses
  {
    id: 'cs-101-2018',
    code: 'CSC 101',
    title: 'Introduction to Programming',
    description: 'Basic programming concepts',
    category: 'Core',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2018',
    duration: 16,
    credits: 3,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2018-01-15T00:00:00Z',
    updated_at: '2018-01-15T00:00:00Z',
  },
  {
    id: 'isa-101-2018',
    code: 'ISA 101',
    title: 'Cybersecurity Fundamentals',
    description: 'Basic security concepts',
    category: 'Core',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2018',
    duration: 16,
    credits: 3,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2018-01-15T00:00:00Z',
    updated_at: '2018-01-15T00:00:00Z',
  },
  // Additional Computer Science Courses
  {
    id: 'cs-203-2022',
    code: 'CSC 203',
    title: 'Database Systems',
    description: 'Design and implementation of database systems',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['CSC 102'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-204-2022',
    code: 'CSC 204',
    title: 'Software Engineering',
    description: 'Software development methodologies and project management',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CSC 102', 'CSC 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-301-2022',
    code: 'CSC 301',
    title: 'Computer Networks',
    description: 'Network protocols and distributed systems',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CSC 102'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-302-2022',
    code: 'CSC 302',
    title: 'Operating Systems',
    description: 'Operating system concepts and implementation',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CSC 102'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-401-2022',
    code: 'CSC 401',
    title: 'Artificial Intelligence',
    description: 'AI algorithms and machine learning fundamentals',
    category: 'Major',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CSC 102', 'MTH 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-402-2022',
    code: 'CSC 402',
    title: 'Computer Graphics',
    description: 'Computer graphics programming and visualization',
    category: 'Elective',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CSC 102', 'MTH 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-403-2022',
    code: 'CSC 403',
    title: 'Mobile App Development',
    description: 'iOS and Android application development',
    category: 'Elective',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['CSC 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cs-404-2022',
    code: 'CSC 404',
    title: 'Machine Learning',
    description: 'Supervised and unsupervised learning algorithms',
    category: 'Elective',
    department: 'Computer Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CSC 102', 'MTH 201', 'STA 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Information Security & Assurance Courses
  {
    id: 'isa-201-2022',
    code: 'ISA 201',
    title: 'Network Security',
    description: 'Network security protocols and implementation',
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['ISA 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'isa-202-2022',
    code: 'ISA 202',
    title: 'Ethical Hacking',
    description: 'Penetration testing and vulnerability assessment',
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['ISA 101', 'ISA 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'isa-301-2022',
    code: 'ISA 301',
    title: 'Digital Forensics',
    description: 'Computer forensics and incident response',
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['ISA 101', 'ISA 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'isa-302-2022',
    code: 'ISA 302',
    title: 'Cryptography',
    description: 'Cryptographic algorithms and protocols',
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['ISA 101', 'MTH 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'isa-401-2022',
    code: 'ISA 401',
    title: 'Security Risk Management',
    description: 'Risk assessment and security management',
    category: 'Major',
    department: 'Information Security & Assurance',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['ISA 201', 'ISA 301'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Information Systems Courses
  {
    id: 'is-201-2022',
    code: 'CIS 201',
    title: 'Systems Analysis and Design',
    description: 'Information systems analysis and design methodologies',
    category: 'Major',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['CIS 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'is-202-2022',
    code: 'CIS 202',
    title: 'Business Intelligence',
    description: 'Data warehousing and business analytics',
    category: 'Major',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['CIS 101', 'CSC 203'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'is-301-2022',
    code: 'CIS 301',
    title: 'Enterprise Resource Planning',
    description: 'ERP systems implementation and management',
    category: 'Major',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['CIS 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'is-302-2022',
    code: 'CIS 302',
    title: 'IT Project Management',
    description: 'Project management methodologies for IT projects',
    category: 'Major',
    department: 'Information Systems',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['CIS 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Data Science Courses
  {
    id: 'ds-101-2022',
    code: 'DSC 101',
    title: 'Introduction to Data Science',
    description: 'Overview of data science concepts and applications',
    category: 'Core',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'ds-201-2022',
    code: 'DSC 201',
    title: 'Statistics for Data Science',
    description: 'Statistical methods and probability for data analysis',
    category: 'Major',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['DSC 101', 'MTH 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'ds-202-2022',
    code: 'DSC 202',
    title: 'Python for Data Science',
    description: 'Python programming for data analysis and visualization',
    category: 'Major',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['DSC 101', 'CSC 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'ds-301-2022',
    code: 'DSC 301',
    title: 'Machine Learning for Data Science',
    description: 'Advanced machine learning algorithms for data science',
    category: 'Major',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['DSC 201', 'DSC 202'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'ds-302-2022',
    code: 'DSC 302',
    title: 'Big Data Analytics',
    description: 'Processing and analyzing large-scale datasets',
    category: 'Major',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['DSC 202', 'CSC 203'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'ds-401-2022',
    code: 'DSC 401',
    title: 'Deep Learning',
    description: 'Neural networks and deep learning architectures',
    category: 'Elective',
    department: 'Data Science',
    school: 'School of IT and Computing',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['DSC 301'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Mathematics and General Studies Courses
  {
    id: 'mth-201-2022',
    code: 'MTH 201',
    title: 'Calculus I',
    description: 'Differential and integral calculus',
    category: 'Mathematics',
    department: 'Mathematics',
    school: 'School of Sciences',
    catalog: '2022',
    duration: 16,
    credits: 4,
    difficulty: 'intermediate',
    requirements: ['MTH 112'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'mth-202-2022',
    code: 'MTH 202',
    title: 'Calculus II',
    description: 'Advanced calculus and series',
    category: 'Mathematics',
    department: 'Mathematics',
    school: 'School of Sciences',
    catalog: '2022',
    duration: 16,
    credits: 4,
    difficulty: 'advanced',
    requirements: ['MTH 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'sta-201-2022',
    code: 'STA 201',
    title: 'Statistics',
    description: 'Statistical methods and analysis',
    category: 'Core',
    department: 'Mathematics',
    school: 'School of Sciences',
    catalog: '2022',
    duration: 16,
    credits: 1,
    difficulty: 'intermediate',
    requirements: ['MTH 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'gst-201-2022',
    code: 'GST 201',
    title: 'Technical Writing',
    description: 'Professional and technical communication',
    category: 'General Studies',
    department: 'English',
    school: 'School of Liberal Arts',
    catalog: '2022',
    duration: 16,
    credits: 2,
    difficulty: 'beginner',
    requirements: ['GST 122'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'gst-301-2022',
    code: 'GST 301',
    title: 'Research Methodology',
    description: 'Research methods and academic writing',
    category: 'General Studies',
    department: 'Research',
    school: 'School of Liberal Arts',
    catalog: '2022',
    duration: 16,
    credits: 2,
    difficulty: 'intermediate',
    requirements: ['GST 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  // Software Engineering Courses
  {
    id: 'se-101-2022',
    code: 'SWE 101',
    title: 'Introduction to Software Engineering',
    description: 'Software development lifecycle and methodologies',
    category: 'Core',
    department: 'Software Engineering',
    school: 'School of Engineering',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'beginner',
    requirements: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'se-201-2022',
    code: 'SWE 201',
    title: 'Software Requirements Engineering',
    description: 'Requirements gathering and analysis',
    category: 'Major',
    department: 'Software Engineering',
    school: 'School of Engineering',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'intermediate',
    requirements: ['SWE 101'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'se-301-2022',
    code: 'SWE 301',
    title: 'Software Testing and Quality Assurance',
    description: 'Software testing methodologies and quality control',
    category: 'Major',
    department: 'Software Engineering',
    school: 'School of Engineering',
    catalog: '2022',
    duration: 16,
    credits: 3,
    difficulty: 'advanced',
    requirements: ['SWE 201'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  }
];

// Legacy catalog structure for backward compatibility
const LEGACY_COURSES: CourseCatalog = {
  'Computer Science': {
    '2022': [
      {
        id: 'cs-101-2022',
        code: 'CSC 101',
        title: 'Introduction to Computer Science',
        description: 'Fundamentals of computer science and programming',
        category: 'Core',
        department: 'Computer Science',
        school: 'School of IT and Computing',
        catalog: '2022',
        duration: 16,
        credits: 3,
        difficulty: 'beginner',
        requirements: [],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 'cs-102-2022',
        code: 'CSC 102',
        title: 'Data Structures and Algorithms',
        description: 'Advanced data structures and algorithm analysis',
        category: 'Core',
        department: 'Computer Science',
        school: 'School of IT and Computing',
        catalog: '2022',
        duration: 16,
        credits: 4,
        difficulty: 'intermediate',
        requirements: ['CSC 101'],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 'cs-201-2022',
        code: 'CSC 201',
        title: 'Web Development',
        description: 'Modern web development technologies',
        category: 'Major',
        department: 'Computer Science',
        school: 'School of IT and Computing',
        catalog: '2022',
        duration: 16,
        credits: 3,
        difficulty: 'intermediate',
        requirements: ['CSC 101'],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      },
      {
        id: 'cs-202-2022',
        code: 'CSC 202',
        title: 'Advanced Programming',
        description: 'Advanced programming concepts and techniques',
        category: 'Major',
        department: 'Computer Science',
        school: 'School of IT and Computing',
        catalog: '2022',
        duration: 16,
        credits: 3,
        difficulty: 'intermediate',
        requirements: ['CSC 101'],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      }
    ],
    '2018': [
      {
        id: 'cs-101-2018',
        code: 'CSC 101',
        title: 'Introduction to Programming',
        description: 'Basic programming concepts',
        category: 'Core',
        department: 'Computer Science',
        school: 'School of IT and Computing',
        catalog: '2018',
        duration: 16,
        credits: 3,
        difficulty: 'beginner',
        requirements: [],
        created_at: '2018-01-15T00:00:00Z',
        updated_at: '2018-01-15T00:00:00Z',
      }
    ]
  },
  'Information Systems': {
    '2022': [
      {
        id: 'is-101-2022',
        code: 'CIS 101',
        title: 'Introduction to Information Systems',
        description: 'Fundamentals of information systems',
        category: 'Core',
        department: 'Information Systems',
        school: 'School of IT and Computing',
        catalog: '2022',
        duration: 16,
        credits: 3,
        difficulty: 'beginner',
        requirements: [],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      }
    ]
  },
  'Information Security & Assurance': {
    '2022': [
      {
        id: 'isa-101-2022',
        code: 'ISA 101',
        title: 'Introduction to Cybersecurity',
        description: 'Fundamentals of information security',
        category: 'Core',
        department: 'Information Security & Assurance',
        school: 'School of IT and Computing',
        catalog: '2022',
        duration: 16,
        credits: 3,
        difficulty: 'beginner',
        requirements: [],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
      }
    ],
    '2018': [
      {
        id: 'isa-101-2018',
        code: 'ISA 101',
        title: 'Cybersecurity Fundamentals',
        description: 'Basic security concepts',
        category: 'Core',
        department: 'Information Security & Assurance',
        school: 'School of IT and Computing',
        catalog: '2018',
        duration: 16,
        credits: 3,
        difficulty: 'beginner',
        requirements: [],
        created_at: '2018-01-15T00:00:00Z',
        updated_at: '2018-01-15T00:00:00Z',
      }
    ]
  }
};

// Remove the old flattened version since MOCK_COURSES is now already flattened

// User courses in localStorage - Initialize as empty object
let MOCK_USER_COURSES: UserCoursesByUser = {};

// Import sessionManager
import { sessionManager } from './auth';

// Get the current authenticated user using sessionManager
function getCurrentUser() {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionManager.getUser();
}

// Initialize user courses from localStorage or with default data
export function getUserCourses(): UserCourse[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const user = getCurrentUser();
    if (!user) return [];
    
    const storedCourses = localStorage.getItem('userCourses');
    if (storedCourses) {
      MOCK_USER_COURSES = JSON.parse(storedCourses) as UserCoursesByUser;
    }
    
    if (!MOCK_USER_COURSES[user.id]) {
      MOCK_USER_COURSES[user.id] = [];
    }
    
    // If user has no courses, add comprehensive default courses for all departments
    if (MOCK_USER_COURSES[user.id].length === 0) {
      const defaultCourses: UserCourse[] = [
        // Computer Science Core Courses
        {
          id: '1',
          user_id: user.id,
          course_id: 'cs-101-2022',
          status: 'in_progress',
          progress: 65,
          semester: 'Fall',
          year: '2024',
          started_at: '2024-08-01',
          completed_at: null,
          grade: undefined,
          notes: 'Introduction to Programming - Midterm next week'
        },
        {
          id: '2',
          user_id: user.id,
          course_id: 'cs-102-2022',
          status: 'not_started',
          progress: 0,
          semester: null,
          year: null,
          started_at: null,
          completed_at: null,
          grade: undefined,
          notes: 'Data Structures and Algorithms - Prerequisite: CSC 101'
        },
        {
          id: '3',
          user_id: user.id,
          course_id: 'cs-201-2022',
          status: 'completed',
          progress: 100,
          semester: 'Spring',
          year: '2024',
          started_at: '2024-01-15',
          completed_at: '2024-05-15',
          grade: 'A',
          notes: 'Object-Oriented Programming - Excellent performance'
        },
        {
          id: '4',
          user_id: user.id,
          course_id: 'cs-301-2022',
          status: 'not_started',
          progress: 0,
          semester: null,
          year: null,
          started_at: null,
          completed_at: null,
          grade: undefined,
          notes: 'Database Systems - Plan to take next semester'
        },
        // Information Security & Assurance Courses
        {
          id: '5',
          user_id: user.id,
          course_id: 'isa-101-2022',
          status: 'in_progress',
          progress: 40,
          semester: 'Fall',
          year: '2024',
          started_at: '2024-08-01',
          completed_at: null,
          grade: undefined,
          notes: 'Introduction to Cybersecurity - First project due soon'
        },
        {
          id: '6',
          user_id: user.id,
          course_id: 'isa-201-2022',
          status: 'not_started',
          progress: 0,
          semester: null,
          year: null,
          started_at: null,
          completed_at: null,
          grade: undefined,
          notes: 'Network Security - Advanced course'
        },
        // Data Science Courses
        {
          id: '7',
          user_id: user.id,
          course_id: 'ds-101-2022',
          status: 'completed',
          progress: 100,
          semester: 'Spring',
          year: '2024',
          started_at: '2024-01-15',
          completed_at: '2024-05-15',
          grade: 'B+',
          notes: 'Introduction to Data Science - Good foundation'
        },
        {
          id: '8',
          user_id: user.id,
          course_id: 'ds-201-2022',
          status: 'in_progress',
          progress: 75,
          semester: 'Fall',
          year: '2024',
          started_at: '2024-08-01',
          completed_at: null,
          grade: undefined,
          notes: 'Machine Learning - Final project in progress'
        },
        // Software Engineering Courses
        {
          id: '9',
          user_id: user.id,
          course_id: 'se-101-2022',
          status: 'completed',
          progress: 100,
          semester: 'Fall',
          year: '2023',
          started_at: '2023-08-01',
          completed_at: '2023-12-15',
          grade: 'A',
          notes: 'Software Engineering Principles - Great teamwork experience'
        },
        {
          id: '10',
          user_id: user.id,
          course_id: 'se-201-2022',
          status: 'in_progress',
          progress: 30,
          semester: 'Fall',
          year: '2024',
          started_at: '2024-08-01',
          completed_at: null,
          grade: undefined,
          notes: 'Advanced Software Development - Working on group project'
        },
        // Information Systems Courses
        {
          id: '11',
          user_id: user.id,
          course_id: 'is-101-2022',
          status: 'completed',
          progress: 100,
          semester: 'Spring',
          year: '2024',
          started_at: '2024-01-15',
          completed_at: '2024-05-15',
          grade: 'B',
          notes: 'Business Information Systems - Practical applications'
        },
        {
          id: '12',
          user_id: user.id,
          course_id: 'is-201-2022',
          status: 'not_started',
          progress: 0,
          semester: null,
          year: null,
          started_at: null,
          completed_at: null,
          grade: undefined,
          notes: 'Enterprise Systems - Next year course'
        },
        // Mathematics & General Education
        {
          id: '13',
          user_id: user.id,
          course_id: 'math-101-2022',
          status: 'completed',
          progress: 100,
          semester: 'Spring',
          year: '2024',
          started_at: '2024-01-15',
          completed_at: '2024-05-15',
          grade: 'B+',
          notes: 'Calculus I - Good foundation in mathematics'
        },
        {
          id: '14',
          user_id: user.id,
          course_id: 'eng-101-2022',
          status: 'in_progress',
          progress: 80,
          semester: 'Fall',
          year: '2024',
          started_at: '2024-08-01',
          completed_at: null,
          grade: undefined,
          notes: 'Final project due soon'
        },
        // Business Courses
        {
          id: '15',
          user_id: user.id,
          course_id: 'bus-101-2022',
          status: 'completed',
          progress: 100,
          semester: 'Fall',
          year: '2023',
          started_at: '2023-08-01',
          completed_at: '2023-12-15',
          grade: 'A',
          notes: 'Business Fundamentals - Strong analytical skills'
        },
        {
          id: '16',
          user_id: user.id,
          course_id: 'bus-201-2022',
          status: 'in_progress',
          progress: 55,
          semester: 'Fall',
          year: '2024',
          started_at: '2024-08-01',
          completed_at: null,
          grade: undefined,
          notes: 'Strategic Management - Case study presentations ongoing'
        },
        // Engineering Courses
        {
          id: '17',
          user_id: user.id,
          course_id: 'eng-201-2022',
          status: 'not_started',
          progress: 0,
          semester: null,
          year: null,
          started_at: null,
          completed_at: null,
          grade: undefined,
          notes: 'Engineering Mathematics - Advanced calculus required'
        },
        {
          id: '18',
          user_id: user.id,
          course_id: 'eng-301-2022',
          status: 'completed',
          progress: 100,
          semester: 'Spring',
          year: '2024',
          started_at: '2024-01-15',
          completed_at: '2024-05-15',
          grade: 'B',
          notes: 'Systems Engineering - Complex project completed'
        }
      ];
      
      MOCK_USER_COURSES[user.id] = defaultCourses;
      localStorage.setItem('userCourses', JSON.stringify(MOCK_USER_COURSES));
      console.log('Initialized comprehensive default courses for user:', user.id, defaultCourses);
      return defaultCourses;
    }
    
    return MOCK_USER_COURSES[user.id];
  } catch (error) {
    console.error('Error initializing user courses:', error);
    return [];
  }
}

// Log available course IDs for debugging
console.log('Available courses:');
MOCK_COURSES.forEach((course) => {
  console.log(`- ${course.id}: ${(course as any).code || 'N/A'} - ${course.title} (${course.department})`);
});

// Simulate API delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Save user courses to localStorage
async function saveUserCoursesToStorage(userId: string, courses: UserCourse[]): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      MOCK_USER_COURSES[userId] = courses;
      localStorage.setItem('userCourses', JSON.stringify(MOCK_USER_COURSES));
    }
  } catch (error) {
    console.error('Error saving user courses:', error);
    throw error;
  }
}

// API functions
export async function fetchCourses(userCatalog?: string, userSchool?: string): Promise<Course[]> {
  await delay(300);
  
  let filteredCourses = [...MOCK_COURSES];
  
  // Filter by catalog if specified
  if (userCatalog) {
    filteredCourses = filteredCourses.filter(course => course.catalog === userCatalog);
  }
  
  // Filter by school if specified
  if (userSchool) {
    filteredCourses = filteredCourses.filter(course => course.school === userSchool);
  }
  
  return filteredCourses;
}

// Helper function to get course requirements
function getCourseRequirements(courseId: string): string[] {
  const course = MOCK_COURSES.find(c => c.id === courseId);
  return course?.requirements || [];
}

export async function fetchUserCourses(userId: string): Promise<CourseWithProgress[]> {
  try {
    // Always use localStorage - no database dependency
    console.log('Using localStorage for user courses');
    return getLocalStorageCourses(userId);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    // Initialize with default courses if localStorage fails
    getUserCourses(); // This will create default courses
    return getLocalStorageCourses(userId);
  }
}

function getLocalStorageCourses(userId: string): CourseWithProgress[] {
  const userCoursesData = getUserCourses();
  const allCourses = MOCK_COURSES;
  
  // If user has no courses in localStorage, initialize with defaults
  if (userCoursesData.length === 0) {
    console.log('No courses found, initializing defaults for user:', userId);
    getUserCourses(); // This will create default courses
    const newUserCoursesData = getUserCourses();
    
    return allCourses.map((course: Course): CourseWithProgress => {
      const userCourse = newUserCoursesData.find(uc => uc.course_id === course.id);
      
      return {
        ...course,
        status: userCourse?.status || 'not_started',
        progress: userCourse?.progress || 0,
        grade: userCourse?.grade || null,
        semester: userCourse?.semester || null,
        year: userCourse?.year || null,
        started_at: userCourse?.started_at || null,
        completed_at: userCourse?.completed_at || null,
        notes: userCourse?.notes || ''
      };
    });
  }
  
  const coursesWithProgress = allCourses.map((course: Course): CourseWithProgress => {
    const userCourse = userCoursesData.find(uc => uc.course_id === course.id);
    
    return {
      ...course,
      status: userCourse?.status || 'not_started',
      progress: userCourse?.progress || 0,
      grade: userCourse?.grade || null,
      semester: userCourse?.semester || null,
      year: userCourse?.year || null,
      started_at: userCourse?.started_at || null,
      completed_at: userCourse?.completed_at || null,
      notes: userCourse?.notes || ''
    };
  });
  
  return coursesWithProgress;
}

export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  await delay(300);
  
  // Get user courses from localStorage
  const userCoursesData = getUserCourses();
  const totalCourses = userCoursesData.length;
  const completedCourses = userCoursesData.filter(c => c.status === 'completed').length;
  const inProgressCourses = userCoursesData.filter(c => c.status === 'in_progress').length;
  const notStartedCourses = totalCourses - completedCourses - inProgressCourses;
  
  // Calculate credits earned using updated credit values
  const creditsEarned = userCoursesData
    .filter(c => c.status === 'completed')
    .reduce((sum, course) => {
      const courseData = MOCK_COURSES.find(c => c.id === course.course_id);
      return sum + (courseData?.credits || 0);
    }, 0);
  
  return {
    totalCourses,
    completedCourses,
    inProgressCourses,
    notStartedCourses,
    creditsEarned,
    completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
  };
}

export async function fetchCourseCategories(): Promise<CourseCategory[]> {
  await delay(300);
  
  // Count courses by category from the courses array
  const coreCount = MOCK_COURSES.filter(c => c.category === 'Core').length;
  const majorCount = MOCK_COURSES.filter(c => c.category === 'Major').length;
  const electiveCount = MOCK_COURSES.filter(c => c.category === 'Free Elective').length;
  const genEdCount = MOCK_COURSES.filter(c => c.category === 'General Education').length;
  
  const categories = [
    {
      id: '1',
      name: 'Core',
      description: 'Fundamental required courses',
      count: coreCount
    },
    {
      id: '2',
      name: 'Major',
      description: 'Courses specific to your major',
      count: majorCount
    },
    {
      id: '3',
      name: 'Free Elective',
      description: 'Optional courses from any discipline',
      count: electiveCount
    },
    {
      id: '4',
      name: 'General Education',
      description: 'General education requirements',
      count: genEdCount
    }
  ];

  return categories.map(({ id, name, description, count }) => ({
    id,
    name,
    description,
    course_count: count
  }));
}

export async function fetchFilteredCourses(query: string): Promise<CourseWithProgress[]> {
  await delay(300);
  
  const lowerQuery = query.toLowerCase();
  const filteredCourses = MOCK_COURSES
    .filter(course => 
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      (course as any).code?.toLowerCase().includes(lowerQuery)
    )
    .map(course => ({
      ...course,
      status: 'not_started' as const,
      progress: 0,
      started_at: null,
      completed_at: null,
      grade: null,
      notes: ''
    }));
    
  return filteredCourses;
}

export async function saveCourse(
  userId: string,
  courseData: Omit<UserCourse, 'id' | 'user_id'> & { id?: string }
): Promise<UserCourse> {
  await delay(300);
  
  let userCourse: UserCourse;
  
  // Ensure MOCK_USER_COURSES is properly initialized for the user
  if (!MOCK_USER_COURSES[userId]) {
    MOCK_USER_COURSES[userId] = [];
  }
  
  const userCourses = MOCK_USER_COURSES[userId];
  
  if (courseData.id) {
    // Update existing course
    const index = userCourses.findIndex(uc => uc.id === courseData.id);
    
    if (index === -1) {
      throw new Error('Course not found');
    }
    
    userCourse = {
      ...userCourses[index],
      ...courseData,
      user_id: userId,
      course_id: courseData.course_id || userCourses[index].course_id,
      status: courseData.status || 'not_started',
      progress: courseData.progress || 0,
    };
    
    userCourses[index] = userCourse;
  } else {
    // Add new course
    userCourse = {
      id: `uc-${Date.now()}`,
      user_id: userId,
      course_id: courseData.course_id,
      status: courseData.status || 'not_started',
      progress: courseData.progress || 0,
      grade: courseData.grade,
      notes: courseData.notes || '',
      started_at: courseData.started_at,
      completed_at: courseData.completed_at,
    };
    
    userCourses.push(userCourse);
  }
  
  // Save the updated courses for the user
  await saveUserCoursesToStorage(userId, userCourses);
  return userCourse;
}

// Update a course's progress and status
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progress: number,
  grade?: string,
  semester?: string,
  year?: string
): Promise<UserCourse | null> {
  // Use localStorage directly
  const userCoursesKey = 'userCourses';
  const existingData = JSON.parse(localStorage.getItem(userCoursesKey) || '{}');
  
  if (!existingData[userId]) {
    existingData[userId] = [];
  }
  
  const userCourses = existingData[userId];
  const userCourseIndex = userCourses.findIndex(
    (uc: any) => uc.user_id === userId && uc.course_id === courseId
  );
  
  if (userCourseIndex === -1) {
    const newUserCourse: UserCourse = {
      id: `uc-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      status,
      progress,
      grade: grade ? (grade as 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E' | 'F') : null,
      semester: semester as 'Fall' | 'Spring' || null,
      year: year || null,
      started_at: status === 'in_progress' ? new Date().toISOString() : null,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      notes: ''
    };
    
    userCourses.push(newUserCourse);
  } else {
    const userCourse = userCourses[userCourseIndex];
    userCourse.status = status;
    userCourse.progress = progress;
    
    if (grade) {
      userCourse.grade = grade as 'A+' | 'A' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E' | 'F';
    }
    
    if (semester) {
      userCourse.semester = semester as 'Fall' | 'Spring';
    }
    
    if (year) {
      userCourse.year = year;
    }
    
    if (status === 'in_progress' && !userCourse.started_at) {
      userCourse.started_at = new Date().toISOString();
    }
    
    if (status === 'completed') {
      userCourse.completed_at = new Date().toISOString();
    }
  }
  
  localStorage.setItem(userCoursesKey, JSON.stringify(existingData));
  
  // Trigger refresh in Progress page
  localStorage.setItem('lastGradeUpdate', Date.now().toString());
  
  return userCourses[userCourseIndex] || userCourses[userCourses.length - 1];
}

// Function to reset theme to light mode (for logout)
export function resetThemeOnLogout() {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Export the save function with the correct name
export const saveUserCourses = saveUserCoursesToStorage;