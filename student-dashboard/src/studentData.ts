import { 
  StudentProfile, 
  AttendanceSubject, 
  InternalMarkEntry, 
  SemesterGPA, 
  LeaveRequest, 
  FeeItem, 
  Transaction, 
  StudentCertificate, 
  InternshipEntry 
} from './types';

// Mentee 1: Syed Ameer R (Original default data)
export const profileSyedAmeer: StudentProfile = {
  name: "Syed Ameer R",
  rollNumber: "22CSE0408",
  department: "Computer Science & Engineering",
  semester: 6,
  email: "ameersyed1226@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
};

export const attendanceSyedAmeer: AttendanceSubject[] = [
  { id: "sa1", code: "CSE-301", name: "Software Engineering", attended: 36, total: 40, teacher: "Dr. Clara Oswald" },
  { id: "sa2", code: "CSE-302", name: "Computer Networks", attended: 31, total: 38, teacher: "Prof. Alan Turing" },
  { id: "sa3", code: "CSE-303", name: "Database Management Systems", attended: 38, total: 40, teacher: "Dr. Grace Hopper" },
  { id: "sa4", code: "CSE-304", name: "Artificial Intelligence", attended: 26, total: 35, teacher: "Prof. John McCarthy" },
  { id: "sa5", code: "CSE-305", name: "Discrete Mathematics", attended: 34, total: 40, teacher: "Dr. Ada Lovelace" }
];

export const internalsSyedAmeer: InternalMarkEntry[] = [
  { id: "ims1", subjectCode: "CSE-301", subjectName: "Software Engineering", assessments: { quiz1: 8.5, midterm: 26, quiz2: 9, assignment: 9.5, project: 36 } },
  { id: "ims2", subjectCode: "CSE-302", subjectName: "Computer Networks", assessments: { quiz1: 7, midterm: 22, quiz2: 8, assignment: 8, project: 32 } },
  { id: "ims3", subjectCode: "CSE-303", subjectName: "Database Management Systems", assessments: { quiz1: 9.5, midterm: 28.5, quiz2: 10, assignment: 9.5, project: 38 } },
  { id: "ims4", subjectCode: "CSE-304", subjectName: "Artificial Intelligence", assessments: { quiz1: 6.5, midterm: 19, quiz2: 7.5, assignment: 8, project: 30 } },
  { id: "ims5", subjectCode: "CSE-305", subjectName: "Discrete Mathematics", assessments: { quiz1: 8, midterm: 24.5, quiz2: 8, assignment: 9, project: 35 } }
];

export const semestersSyedAmeer: SemesterGPA[] = [
  {
    id: "sems1",
    semesterNumber: 1,
    gpa: 8.85,
    courses: [
      { id: "cs11", code: "MAT-101", name: "Engineering Mathematics I", credits: 4, grade: "A" },
      { id: "cs12", code: "PHY-101", name: "Engineering Physics", credits: 4, grade: "A" },
      { id: "cs13", code: "CSE-101", name: "Programming in C", credits: 3, grade: "S" },
      { id: "cs14", code: "CIV-101", name: "Basic Civil Engineering", credits: 2, grade: "B" }
    ]
  },
  {
    id: "sems2",
    semesterNumber: 2,
    gpa: 9.12,
    courses: [
      { id: "cs21", code: "MAT-102", name: "Engineering Mathematics II", credits: 4, grade: "S" },
      { id: "cs22", code: "CHM-101", name: "Engineering Chemistry", credits: 4, grade: "A" },
      { id: "cs23", code: "CSE-102", name: "Data Structures & Algorithms", credits: 4, grade: "S" }
    ]
  }
];

// Mentee 2: Tharun G (Excellent status)
export const profileTharun: StudentProfile = {
  name: "Tharun G",
  rollNumber: "22CSE0401",
  department: "Computer Science & Engineering",
  semester: 6,
  email: "tharung@university.edu",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
};

export const attendanceTharun: AttendanceSubject[] = [
  { id: "t1", code: "CSE-301", name: "Software Engineering", attended: 39, total: 40, teacher: "Dr. Clara Oswald" },
  { id: "t2", code: "CSE-302", name: "Computer Networks", attended: 37, total: 38, teacher: "Prof. Alan Turing" },
  { id: "t3", code: "CSE-303", name: "Database Management Systems", attended: 40, total: 40, teacher: "Dr. Grace Hopper" },
  { id: "t4", code: "CSE-304", name: "Artificial Intelligence", attended: 33, total: 35, teacher: "Prof. John McCarthy" },
  { id: "t5", code: "CSE-305", name: "Discrete Mathematics", attended: 38, total: 40, teacher: "Dr. Ada Lovelace" }
];

export const internalsTharun: InternalMarkEntry[] = [
  { id: "imt1", subjectCode: "CSE-301", subjectName: "Software Engineering", assessments: { quiz1: 9.5, midterm: 29, quiz2: 9.5, assignment: 10, project: 38 } },
  { id: "imt2", subjectCode: "CSE-302", subjectName: "Computer Networks", assessments: { quiz1: 9, midterm: 28, quiz2: 9, assignment: 9.5, project: 37 } },
  { id: "imt3", subjectCode: "CSE-303", subjectName: "Database Management Systems", assessments: { quiz1: 10, midterm: 30, quiz2: 10, assignment: 10, project: 40 } },
  { id: "imt4", subjectCode: "CSE-304", subjectName: "Artificial Intelligence", assessments: { quiz1: 8.5, midterm: 27, quiz2: 9, assignment: 9, project: 36 } },
  { id: "imt5", subjectCode: "CSE-305", subjectName: "Discrete Mathematics", assessments: { quiz1: 9.5, midterm: 29, quiz2: 9.5, assignment: 10, project: 38 } }
];

export const semestersTharun: SemesterGPA[] = [
  {
    id: "semt1",
    semesterNumber: 1,
    gpa: 9.45,
    courses: [
      { id: "ct11", code: "MAT-101", name: "Engineering Mathematics I", credits: 4, grade: "S" },
      { id: "ct12", code: "PHY-101", name: "Engineering Physics", credits: 4, grade: "S" },
      { id: "ct13", code: "CSE-101", name: "Programming in C", credits: 3, grade: "S" }
    ]
  },
  {
    id: "semt2",
    semesterNumber: 2,
    gpa: 9.60,
    courses: [
      { id: "ct21", code: "MAT-102", name: "Engineering Mathematics II", credits: 4, grade: "S" },
      { id: "ct22", code: "CHM-101", name: "Engineering Chemistry", credits: 4, grade: "S" },
      { id: "ct23", code: "CSE-102", name: "Data Structures & Algorithms", credits: 4, grade: "A" }
    ]
  }
];

// Mentee 3: Sathya (At-risk attendance/marks)
export const profileSathya: StudentProfile = {
  name: "Sathya",
  rollNumber: "22CSE0415",
  department: "Computer Science & Engineering",
  semester: 6,
  email: "sathya@university.edu",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
};

export const attendanceSathya: AttendanceSubject[] = [
  { id: "sa_s1", code: "CSE-301", name: "Software Engineering", attended: 26, total: 40, teacher: "Dr. Clara Oswald" },
  { id: "sa_s2", code: "CSE-302", name: "Computer Networks", attended: 24, total: 38, teacher: "Prof. Alan Turing" },
  { id: "sa_s3", code: "CSE-303", name: "Database Management Systems", attended: 28, total: 40, teacher: "Dr. Grace Hopper" },
  { id: "sa_s4", code: "CSE-304", name: "Artificial Intelligence", attended: 20, total: 35, teacher: "Prof. John McCarthy" },
  { id: "sa_s5", code: "CSE-305", name: "Discrete Mathematics", attended: 25, total: 40, teacher: "Dr. Ada Lovelace" }
];

export const internalsSathya: InternalMarkEntry[] = [
  { id: "ims_s1", subjectCode: "CSE-301", subjectName: "Software Engineering", assessments: { quiz1: 6, midterm: 18, quiz2: 6.5, assignment: 7, project: 24 } },
  { id: "ims_s2", subjectCode: "CSE-302", subjectName: "Computer Networks", assessments: { quiz1: 5.5, midterm: 16, quiz2: 6, assignment: 6.5, project: 22 } },
  { id: "ims_s3", subjectCode: "CSE-303", subjectName: "Database Management Systems", assessments: { quiz1: 7, midterm: 20, quiz2: 7, assignment: 8, project: 28 } },
  { id: "ims_s4", subjectCode: "CSE-304", subjectName: "Artificial Intelligence", assessments: { quiz1: 5, midterm: 15, quiz2: 5, assignment: 6, project: 20 } },
  { id: "ims_s5", subjectCode: "CSE-305", subjectName: "Discrete Mathematics", assessments: { quiz1: 6, midterm: 17, quiz2: 6, assignment: 7, project: 25 } }
];

export const semestersSathya: SemesterGPA[] = [
  {
    id: "sems_s1",
    semesterNumber: 1,
    gpa: 7.20,
    courses: [
      { id: "cs_s11", code: "MAT-101", name: "Engineering Mathematics I", credits: 4, grade: "C" },
      { id: "cs_s12", code: "PHY-101", name: "Engineering Physics", credits: 4, grade: "B" },
      { id: "cs_s13", code: "CSE-101", name: "Programming in C", credits: 3, grade: "B" }
    ]
  },
  {
    id: "sems_s2",
    semesterNumber: 2,
    gpa: 7.42,
    courses: [
      { id: "cs_s21", code: "MAT-102", name: "Engineering Mathematics II", credits: 4, grade: "B" },
      { id: "cs_s22", code: "CHM-101", name: "Engineering Chemistry", credits: 4, grade: "C" },
      { id: "cs_s23", code: "CSE-102", name: "Data Structures & Algorithms", credits: 4, grade: "D" }
    ]
  }
];

// Mentee 4: Logajanani (Highly excellent status)
export const profileLogajanani: StudentProfile = {
  name: "Logajanani",
  rollNumber: "22CSE0422",
  department: "Computer Science & Engineering",
  semester: 6,
  email: "logajanani@university.edu",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
};

export const attendanceLogajanani: AttendanceSubject[] = [
  { id: "l1", code: "CSE-301", name: "Software Engineering", attended: 40, total: 40, teacher: "Dr. Clara Oswald" },
  { id: "l2", code: "CSE-302", name: "Computer Networks", attended: 38, total: 38, teacher: "Prof. Alan Turing" },
  { id: "l3", code: "CSE-303", name: "Database Management Systems", attended: 39, total: 40, teacher: "Dr. Grace Hopper" },
  { id: "l4", code: "CSE-304", name: "Artificial Intelligence", attended: 34, total: 35, teacher: "Prof. John McCarthy" },
  { id: "l5", code: "CSE-305", name: "Discrete Mathematics", attended: 40, total: 40, teacher: "Dr. Ada Lovelace" }
];

export const internalsLogajanani: InternalMarkEntry[] = [
  { id: "iml1", subjectCode: "CSE-301", subjectName: "Software Engineering", assessments: { quiz1: 10, midterm: 30, quiz2: 10, assignment: 10, project: 39 } },
  { id: "iml2", subjectCode: "CSE-302", subjectName: "Computer Networks", assessments: { quiz1: 9.5, midterm: 29.5, quiz2: 10, assignment: 10, project: 39 } },
  { id: "iml3", subjectCode: "CSE-303", subjectName: "Database Management Systems", assessments: { quiz1: 10, midterm: 30, quiz2: 10, assignment: 10, project: 40 } },
  { id: "iml4", subjectCode: "CSE-304", subjectName: "Artificial Intelligence", assessments: { quiz1: 9, midterm: 29, quiz2: 9.5, assignment: 10, project: 38 } },
  { id: "iml5", subjectCode: "CSE-305", subjectName: "Discrete Mathematics", assessments: { quiz1: 10, midterm: 30, quiz2: 10, assignment: 10, project: 40 } }
];

export const semestersLogajanani: SemesterGPA[] = [
  {
    id: "sems_l1",
    semesterNumber: 1,
    gpa: 9.65,
    courses: [
      { id: "cs_l11", code: "MAT-101", name: "Engineering Mathematics I", credits: 4, grade: "S" },
      { id: "cs_l12", code: "PHY-101", name: "Engineering Physics", credits: 4, grade: "S" },
      { id: "cs_l13", code: "CSE-101", name: "Programming in C", credits: 3, grade: "S" }
    ]
  },
  {
    id: "sems_l2",
    semesterNumber: 2,
    gpa: 9.78,
    courses: [
      { id: "cs_l21", code: "MAT-102", name: "Engineering Mathematics II", credits: 4, grade: "S" },
      { id: "cs_l22", code: "CHM-101", name: "Engineering Chemistry", credits: 4, grade: "S" },
      { id: "cs_l23", code: "CSE-102", name: "Data Structures & Algorithms", credits: 4, grade: "S" }
    ]
  }
];

// Helper to bundle all data
export const studentsDatabase = {
  "22CSE0408": {
    profile: profileSyedAmeer,
    attendance: attendanceSyedAmeer,
    internals: internalsSyedAmeer,
    semesters: semestersSyedAmeer
  },
  "22CSE0401": {
    profile: profileTharun,
    attendance: attendanceTharun,
    internals: internalsTharun,
    semesters: semestersTharun
  },
  "22CSE0415": {
    profile: profileSathya,
    attendance: attendanceSathya,
    internals: internalsSathya,
    semesters: semestersSathya
  },
  "22CSE0422": {
    profile: profileLogajanani,
    attendance: attendanceLogajanani,
    internals: internalsLogajanani,
    semesters: semestersLogajanani
  }
};
