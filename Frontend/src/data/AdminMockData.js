export const stats = {
  totalStudents: 1247,
  totalTeachers: 48,
  totalSubjects: 32,
  totalMaterials: 156,
  totalAssignments: 89,
  totalSubmissions: 234,
  totalTasks: 67,
  recentNotices: 5,
};

export const students = [
  {
    id: 1,
    name: "John Doe",
    class: "10",
    section: "A",
    studentId: "STU-2024-001",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    class: "9",
    section: "B",
    studentId: "STU-2024-002",
    status: "Active",
  },
];

export const teachers = [
  {
    id: 1,
    name: "Mr. Robert Wilson",
    email: "robert@school.com",
    subjects: ["Mathematics", "Physics"],
    classes: ["10", "9"],
  },
];

export const subjects = [
  {
    id: 1,
    name: "Computer Science",
    teacher: "Mr. Robert Wilson",
    chapters: [
      "Introduction to Programming",
      "Data Structures",
      "Algorithms",
      "Database Management",
    ],
  },
];

export const announcements = [
  {
    id: 1,
    title: "School Holiday",
    date: "2024-04-28",
    content: "School will remain closed.",
  },
];

export const recentActivities = [
  {
    message: "John Doe submitted Math homework",
    time: "2 hours ago",
  },
];