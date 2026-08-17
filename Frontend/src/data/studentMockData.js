export const studentMockData = {
  profile: {
    name: 'Aisha Sharma',
    studentId: 'STD-2024-0421',
    email: 'aisha@school.com',
    phone: '9800000000',
    className: '10',
    section: 'A',
    dob: '2009-03-12',
    address: 'Koteswor, Kathmandu',
    guardianName: 'Ramesh Sharma',
    guardianPhone: '9860000000',
    profileImage: ''
  },
  stats: {
    pendingTasks: 5,
    submittedHomework: 12,
    learningMaterials: 24,
    upcomingDeadlines: 4,
    attendancePercentage: 87,
    quizSummary: 3,
    recentNotices: 2,
  },
  tasks: [
    {
      id: 1,
      title: 'Algebra Practice Set',
      subject: 'Mathematics',
      teacher: 'Mr. Arjun Shah',
      deadline: '2026-08-20',
      status: 'Pending',
      description: 'Solve the first 15 questions in the algebra worksheet and show your working clearly.',
      instructions: 'Submit as a PDF or image. Use neat handwriting and include all steps.'
    },
    {
      id: 2,
      title: 'Lab Report Draft',
      subject: 'Physics',
      teacher: 'Ms. Nirmala KC',
      deadline: '2026-08-22',
      status: 'In Progress',
      description: 'Prepare a short lab report explaining the experiment and your observations.',
      instructions: 'Keep the report under 600 words and include the graph screenshot.'
    },
    {
      id: 3,
      title: 'Essay Review',
      subject: 'English',
      teacher: 'Mr. Suman Rai',
      deadline: '2026-08-18',
      status: 'Submitted',
      description: 'Review and rewrite the essay with better grammar and structure.',
      instructions: 'Use the review checklist provided in class.'
    },
    {
      id: 4,
      title: 'Biology Quiz Revision',
      subject: 'Biology',
      teacher: 'Mrs. Poonam Gurung',
      deadline: '2026-08-17',
      status: 'Overdue',
      description: 'Complete the revision quiz and revisit the chapter on cells.',
      instructions: 'Attempt all questions before the due time.'
    }
  ],
  materials: [
    {
      id: 1,
      subject: 'Computer Science',
      chapter: 'Chapter 1',
      title: 'Introduction to Programming',
      type: 'PDF',
      size: '2.4 MB',
      url: '#'
    },
    {
      id: 2,
      subject: 'Computer Science',
      chapter: 'Chapter 2',
      title: 'Networking Basics',
      type: 'PPT',
      size: '5.8 MB',
      url: '#'
    },
    {
      id: 3,
      subject: 'Mathematics',
      chapter: 'Algebra',
      title: 'Algebra Notes',
      type: 'PDF',
      size: '1.9 MB',
      url: '#'
    },
    {
      id: 4,
      subject: 'Physics',
      chapter: 'Motion',
      title: 'Motion Video Tutorial',
      type: 'Video',
      size: '12 min',
      url: '#'
    }
  ],
  homework: [
    {
      id: 1,
      title: 'Math Worksheet',
      subject: 'Mathematics',
      teacher: 'Mr. Arjun Shah',
      deadline: '2026-08-20',
      status: 'Submitted',
      submittedAt: '2026-08-18',
      description: 'Complete the worksheet and upload the final answer sheet.'
    },
    {
      id: 2,
      title: 'Biology Diagram Task',
      subject: 'Biology',
      teacher: 'Mrs. Poonam Gurung',
      deadline: '2026-08-25',
      status: 'Not Submitted',
      submittedAt: null,
      description: 'Draw and label the human digestive system diagram.'
    }
  ],
  assignments: [
    {
      id: 1,
      title: 'Science Project Presentation',
      subject: 'Science',
      teacher: 'Ms. Sita Thapa',
      deadline: '2026-08-24',
      status: 'Reviewed',
      description: 'Prepare a presentation on renewable energy sources and include references.',
      submittedAt: '2026-08-17',
      file: 'science_project.pdf'
    },
    {
      id: 2,
      title: 'History Essay',
      subject: 'History',
      teacher: 'Mr. Binod Joshi',
      deadline: '2026-08-27',
      status: 'Late Submission',
      description: 'Write an essay on the causes and effects of industrialization.',
      submittedAt: '2026-08-28',
      file: 'history_essay.pdf'
    }
  ],
  quizzes: [
    {
      id: 1,
      title: 'Computer Science MCQ',
      subject: 'Computer Science',
      totalQuestions: 10,
      timeLimit: '20 mins',
      deadline: '2026-08-21',
      status: 'Available',
      instructions: 'Attempt all questions and select only one correct answer.',
      questions: [
        {
          id: 1,
          question: 'Which of the following is a programming language?',
          options: ['HTML', 'CSS', 'Python', 'SQL'],
          answer: 'Python'
        },
        {
          id: 2,
          question: 'What does CPU stand for?',
          options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Control Processing Utility'],
          answer: 'Central Processing Unit'
        }
      ]
    },
    {
      id: 2,
      title: 'Chemistry Revision Quiz',
      subject: 'Chemistry',
      totalQuestions: 8,
      timeLimit: '15 mins',
      deadline: '2026-08-23',
      status: 'Upcoming',
      instructions: 'This will test your chapter revision and application skills.',
      questions: [
        {
          id: 1,
          question: 'What is the symbol for sodium?',
          options: ['S', 'So', 'Na', 'N'],
          answer: 'Na'
        }
      ]
    }
  ],
  attendance: {
    percentage: 87,
    present: 42,
    absent: 5,
    late: 3,
    history: [
      { date: '2026-08-10', status: 'Present' },
      { date: '2026-08-11', status: 'Absent' },
      { date: '2026-08-12', status: 'Present' },
      { date: '2026-08-13', status: 'Late' },
      { date: '2026-08-14', status: 'Present' }
    ]
  },
  results: [
    { subject: 'Mathematics', marks: 85, grade: 'A', remarks: 'Excellent' },
    { subject: 'Science', marks: 78, grade: 'B+', remarks: 'Good' },
    { subject: 'Computer Science', marks: 91, grade: 'A+', remarks: 'Excellent' },
    { subject: 'English', marks: 82, grade: 'A', remarks: 'Very Good' }
  ],
  announcements: [
    {
      id: 1,
      title: 'School Science Exhibition',
      description: 'The school science exhibition will be held on Saturday at 10:00 AM in the main hall.',
      date: '2026-08-16',
      postedBy: 'Admin Office',
      category: 'School',
      isRead: false
    },
    {
      id: 2,
      title: 'Class Test Update',
      description: 'The mathematics class test has been rescheduled to Thursday.',
      date: '2026-08-15',
      postedBy: 'Mr. Arjun Shah',
      category: 'Class',
      isRead: true
    }
  ],
  deadlines: [
    { id: 1, title: 'Mathematics Assignment', subject: 'Mathematics', dueDate: '2026-08-20', status: 'Due Soon' },
    { id: 2, title: 'Physics Lab Report', subject: 'Physics', dueDate: '2026-08-22', status: 'Upcoming' },
    { id: 3, title: 'History Essay', subject: 'History', dueDate: '2026-08-27', status: 'Overdue' },
    { id: 4, title: 'Quiz: Chemistry', subject: 'Chemistry', dueDate: '2026-08-23', status: 'Upcoming' }
  ]
};
