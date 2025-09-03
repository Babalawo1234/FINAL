import { User, Course, UserCourse, DashboardStats } from './storage';
import { CourseManager } from './course-manager';
import { AuthManager } from './auth-new';

export interface ExportData {
  user: User;
  courses: (Course & UserCourse)[];
  stats: DashboardStats;
  exportDate: string;
  version: string;
}

export class DataExportManager {
  static exportUserData(): ExportData | null {
    try {
      const user = AuthManager.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const userCourses = CourseManager.getUserCoursesWithProgress(user.id);
      const allCourses = CourseManager.getAllCourses();
      
      const coursesWithDetails = userCourses.map(uc => {
        const courseDetails = allCourses.find(c => c.id === uc.courseId);
        return courseDetails ? { ...courseDetails, ...uc } : null;
      }).filter(Boolean) as (Course & UserCourse)[];

      const stats = CourseManager.calculateDashboardStats(user.id);

      return {
        user: {
          ...user,
          password: '[REDACTED]' // Don't export password
        } as User,
        courses: coursesWithDetails,
        stats,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Export error:', error);
      return null;
    }
  }

  static downloadAsJSON(): void {
    const data = this.exportUserData();
    if (!data) {
      alert('Failed to export data');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic-data-${data.user.studentId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static downloadAsCSV(): void {
    const data = this.exportUserData();
    if (!data) {
      alert('Failed to export data');
      return;
    }

    // Create CSV content
    const csvRows = [
      ['Course Code', 'Course Title', 'Credits', 'Semester', 'Year', 'Status', 'Grade', 'Progress'],
      ...data.courses.map(course => [
        course.code,
        course.title,
        course.credits.toString(),
        course.semester || '',
        course.year || '',
        course.status,
        course.grade || '',
        `${course.progress || 0}%`
      ])
    ];

    const csvContent = csvRows.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic-courses-${data.user.studentId}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static generateTranscript(): void {
    const data = this.exportUserData();
    if (!data) {
      alert('Failed to generate transcript');
      return;
    }

    const completedCourses = data.courses.filter(c => c.status === 'completed' && c.grade);
    
    // Group by semester/year
    const semesters: { [key: string]: (Course & UserCourse)[] } = {};
    completedCourses.forEach(course => {
      const key = `${course.semester || 'Fall'} ${course.year || '2024'}`;
      if (!semesters[key]) semesters[key] = [];
      semesters[key].push(course);
    });

    // Calculate GPA
    const getGradePoints = (grade: string): number => {
      const gradeMap: { [key: string]: number } = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
      };
      return gradeMap[grade] || 0;
    };

    let totalPoints = 0;
    let totalCredits = 0;
    completedCourses.forEach(course => {
      if (course.grade) {
        const points = getGradePoints(course.grade) * course.credits;
        totalPoints += points;
        totalCredits += course.credits;
      }
    });

    const overallGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

    // Generate HTML transcript
    const transcriptHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Academic Transcript - ${data.user.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .student-info { margin-bottom: 20px; }
        .semester { margin-bottom: 20px; }
        .semester h3 { background: #f0f0f0; padding: 10px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f9f9f9; }
        .summary { margin-top: 30px; padding: 20px; background: #f9f9f9; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>AMERICAN UNIVERSITY OF NIGERIA</h1>
        <h2>Official Academic Transcript</h2>
    </div>
    
    <div class="student-info">
        <p><strong>Student Name:</strong> ${data.user.fullName || data.user.name}</p>
        <p><strong>Student ID:</strong> ${data.user.studentId}</p>
        <p><strong>Department:</strong> ${data.user.department}</p>
        <p><strong>Degree:</strong> ${data.user.degreeType}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    ${Object.entries(semesters).map(([semester, courses]) => {
      const semesterCredits = courses.reduce((sum, c) => sum + c.credits, 0);
      const semesterPoints = courses.reduce((sum, c) => sum + (getGradePoints(c.grade || 'F') * c.credits), 0);
      const semesterGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits).toFixed(2) : '0.00';
      
      return `
    <div class="semester">
        <h3>${semester}</h3>
        <table>
            <thead>
                <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                </tr>
            </thead>
            <tbody>
                ${courses.map(course => `
                <tr>
                    <td>${course.code}</td>
                    <td>${course.title}</td>
                    <td>${course.credits}</td>
                    <td>${course.grade}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        <p><strong>Semester Credits:</strong> ${semesterCredits} | <strong>Semester GPA:</strong> ${semesterGPA}</p>
    </div>
      `;
    }).join('')}

    <div class="summary">
        <h3>Academic Summary</h3>
        <p><strong>Total Credits Completed:</strong> ${totalCredits}</p>
        <p><strong>Overall GPA:</strong> ${overallGPA}</p>
        <p><strong>Total Courses:</strong> ${completedCourses.length}</p>
    </div>
</body>
</html>
    `;

    const blob = new Blob([transcriptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript-${data.user.studentId}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static importUserData(jsonData: string): boolean {
    try {
      const data: ExportData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.user || !data.courses || !data.stats) {
        throw new Error('Invalid data format');
      }

      const currentUser = AuthManager.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Import courses (merge with existing)
      data.courses.forEach(course => {
        try {
          CourseManager.enrollInCourse(
            currentUser.id,
            course.courseId,
            course.semester as any,
            course.year || '2024'
          );
          
          // Update course details - using direct storage access since updateUserCourse doesn't exist
          const userCourses = JSON.parse(localStorage.getItem('userCourses') || '[]');
          const existingIndex = userCourses.findIndex((uc: any) => 
            uc.userId === currentUser.id && uc.courseId === course.courseId
          );
          
          if (existingIndex >= 0) {
            userCourses[existingIndex] = {
              ...userCourses[existingIndex],
              status: course.status,
              grade: course.grade,
              progress: course.progress
            };
            localStorage.setItem('userCourses', JSON.stringify(userCourses));
          }
        } catch (error) {
          console.warn('Failed to import course:', course.code, error);
        }
      });

      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }
}
