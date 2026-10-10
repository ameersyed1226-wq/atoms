/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StudentProfile,
  AttendanceSubject,
  AttendanceLogEntry,
  InternalMarkEntry,
  SemesterGPA,
  LeaveRequest,
  FeeItem,
  Transaction,
  StudentCertificate,
  InternshipEntry,
  StudentGoal,
  SupportTicket,
  AchievementBadge
} from './types';

export const initialStudentProfile: StudentProfile = {
  name: "Ameer Syed",
  rollNumber: "22CSE0408",
  department: "Computer Science & Engineering",
  semester: 6,
  email: "ameersyed1226@gmail.com",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
};

export const initialAttendanceSubjects: AttendanceSubject[] = [
  { id: "1", code: "CSE-301", name: "Software Engineering", attended: 36, total: 40, teacher: "Dr. Clara Oswald" },
  { id: "2", code: "CSE-302", name: "Computer Networks", attended: 31, total: 38, teacher: "Prof. Alan Turing" },
  { id: "3", code: "CSE-303", name: "Database Management Systems", attended: 38, total: 40, teacher: "Dr. Grace Hopper" },
  { id: "4", code: "CSE-304", name: "Artificial Intelligence", attended: 26, total: 35, teacher: "Prof. John McCarthy" }, // 74.2% (Below 75% criteria)
  { id: "5", code: "CSE-305", name: "Discrete Mathematics", attended: 34, total: 40, teacher: "Dr. Ada Lovelace" }
];

export const initialAttendanceLogs: AttendanceLogEntry[] = [
  { id: "l1", date: "2026-08-07", status: "Present", subjectName: "Software Engineering" },
  { id: "l2", date: "2026-08-07", status: "Present", subjectName: "Database Management Systems" },
  { id: "l3", date: "2026-08-06", status: "Absent", subjectName: "Artificial Intelligence" },
  { id: "l4", date: "2026-08-06", status: "Present", subjectName: "Computer Networks" },
  { id: "l5", date: "2026-08-05", status: "Present", subjectName: "Discrete Mathematics" },
  { id: "l6", date: "2026-08-05", status: "Present", subjectName: "Software Engineering" },
  { id: "l7", date: "2026-08-04", status: "Present", subjectName: "Database Management Systems" },
  { id: "l8", date: "2026-08-04", status: "Present", subjectName: "Artificial Intelligence" },
  { id: "l9", date: "2026-08-03", status: "On Leave", subjectName: "Computer Networks" }
];

export const initialInternalMarks: InternalMarkEntry[] = [
  {
    id: "im1",
    subjectCode: "CSE-301",
    subjectName: "Software Engineering",
    assessments: { quiz1: 8.5, midterm: 26, quiz2: 9, assignment: 9.5, project: 36 }
  },
  {
    id: "im2",
    subjectCode: "CSE-302",
    subjectName: "Computer Networks",
    assessments: { quiz1: 7, midterm: 22, quiz2: 8, assignment: 8, project: 32 }
  },
  {
    id: "im3",
    subjectCode: "CSE-303",
    subjectName: "Database Management Systems",
    assessments: { quiz1: 9.5, midterm: 28.5, quiz2: 10, assignment: 9.5, project: 38 }
  },
  {
    id: "im4",
    subjectCode: "CSE-304",
    subjectName: "Artificial Intelligence",
    assessments: { quiz1: 6.5, midterm: 19, quiz2: 7.5, assignment: 8, project: 30 }
  },
  {
    id: "im5",
    subjectCode: "CSE-305",
    subjectName: "Discrete Mathematics",
    assessments: { quiz1: 8, midterm: 24.5, quiz2: 8, assignment: 9, project: 35 }
  }
];

export const initialSemesters: SemesterGPA[] = [
  {
    id: "sem1",
    semesterNumber: 1,
    gpa: 8.85,
    courses: [
      { id: "c11", code: "MAT-101", name: "Engineering Mathematics I", credits: 4, grade: "A" },
      { id: "c12", code: "PHY-101", name: "Engineering Physics", credits: 4, grade: "A" },
      { id: "c13", code: "CSE-101", name: "Programming in C", credits: 3, grade: "S" },
      { id: "c14", code: "CIV-101", name: "Basic Civil Engineering", credits: 2, grade: "B" },
      { id: "c15", code: "ENG-101", name: "Technical English", credits: 2, grade: "A" }
    ]
  },
  {
    id: "sem2",
    semesterNumber: 2,
    gpa: 9.12,
    courses: [
      { id: "c21", code: "MAT-102", name: "Engineering Mathematics II", credits: 4, grade: "S" },
      { id: "c22", code: "CHM-101", name: "Engineering Chemistry", credits: 4, grade: "A" },
      { id: "c23", code: "CSE-102", name: "Data Structures & Algorithms", credits: 4, grade: "S" },
      { id: "c24", code: "MECH-101", name: "Engineering Mechanics", credits: 3, grade: "B" },
      { id: "c25", code: "HUM-101", name: "Professional Ethics", credits: 1, grade: "S" }
    ]
  },
  {
    id: "sem3",
    semesterNumber: 3,
    gpa: 9.30,
    courses: [
      { id: "c31", code: "MAT-201", name: "Discrete Structures", credits: 4, grade: "A" },
      { id: "c32", code: "CSE-201", name: "Object Oriented Programming in C++", credits: 3, grade: "S" },
      { id: "c33", code: "CSE-202", name: "Digital Logic & Design", credits: 4, grade: "S" },
      { id: "c34", code: "CSE-203", name: "Computer Organization & Architecture", credits: 3, grade: "A" },
      { id: "c35", code: "CSE-204", name: "OOP & Data Structures Lab", credits: 2, grade: "S" }
    ]
  },
  {
    id: "sem4",
    semesterNumber: 4,
    gpa: 8.95,
    courses: [
      { id: "c41", code: "MAT-202", name: "Probability & Queueing Theory", credits: 4, grade: "B" },
      { id: "c42", code: "CSE-205", name: "Operating Systems", credits: 4, grade: "A" },
      { id: "c43", code: "CSE-206", name: "Design & Analysis of Algorithms", credits: 4, grade: "S" },
      { id: "c44", code: "CSE-207", name: "Microprocessors & Microcontrollers", credits: 3, grade: "B" },
      { id: "c45", code: "CSE-208", name: "Operating Systems Lab", credits: 1, grade: "S" }
    ]
  },
  {
    id: "sem5",
    semesterNumber: 5,
    gpa: 9.42,
    courses: [
      { id: "c51", code: "CSE-209", name: "Formal Languages & Automata Theory", credits: 3, grade: "A" },
      { id: "c52", code: "CSE-210", name: "Object Oriented Analysis & Design", credits: 3, grade: "S" },
      { id: "c53", code: "CSE-211", name: "Computer Graphics & Multimedia", credits: 3, grade: "A" },
      { id: "c54", code: "CSE-212", name: "Java Programming", credits: 4, grade: "S" },
      { id: "c55", code: "CSE-213", name: "Database & Java Lab", credits: 2, grade: "S" }
    ]
  }
];

export const initialLeaves: LeaveRequest[] = [
  {
    id: "lr1",
    startDate: "2026-08-01",
    endDate: "2026-08-02",
    leaveType: "Sick Leave",
    reason: "Suffering from high seasonal flu. Under medical supervision.",
    status: "Approved",
    appliedDate: "2026-07-31"
  },
  {
    id: "lr2",
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    leaveType: "Casual Leave",
    reason: "Family wedding event in hometown.",
    status: "Approved",
    appliedDate: "2026-07-12"
  },
  {
    id: "lr3",
    startDate: "2026-08-12",
    endDate: "2026-08-13",
    leaveType: "Duty Leave",
    reason: "Representing university in the Inter-College Hackathon Championship.",
    status: "Pending",
    appliedDate: "2026-08-06"
  }
];

export const initialFees: FeeItem[] = [
  { id: "f1", name: "Academic Tuition Fees", total: 85000, paid: 85000, category: "Tuition" },
  { id: "f2", name: "Hostel & Dining Charges", total: 45000, paid: 30000, category: "Hostel" }, // 15000 remaining
  { id: "f3", name: "Library & Lab Deposits", total: 5000, paid: 5000, category: "Library" },
  { id: "f4", name: "Semester Examination Fees", total: 3000, paid: 3000, category: "Exam" }
];

export const initialTransactions: Transaction[] = [
  {
    id: "t1",
    date: "2026-07-02",
    amount: 85000,
    itemPaid: "Academic Tuition Fees",
    paymentMethod: "Net Banking",
    receiptNumber: "REC-2026-88402"
  },
  {
    id: "t2",
    date: "2026-07-05",
    amount: 30000,
    itemPaid: "Hostel & Dining Charges",
    paymentMethod: "Debit Card",
    receiptNumber: "REC-2026-90412"
  },
  {
    id: "t3",
    date: "2026-07-06",
    amount: 5000,
    itemPaid: "Library & Lab Deposits",
    paymentMethod: "UPI",
    receiptNumber: "REC-2026-91104"
  },
  {
    id: "t4",
    date: "2026-07-10",
    amount: 3000,
    itemPaid: "Semester Examination Fees",
    paymentMethod: "UPI",
    receiptNumber: "REC-2026-92841"
  }
];

export const initialCertificates: StudentCertificate[] = [
  {
    id: "cert1",
    title: "Deep Learning Specialization (Coursera)",
    category: "Online Course",
    issueDate: "2026-05-14",
    fileName: "deep_learning_specialization.pdf",
    status: "Verified",
    fileSize: "1.4 MB"
  },
  {
    id: "cert2",
    title: "National Smart India Hackathon 2025 Winner",
    category: "Hackathon",
    issueDate: "2025-11-20",
    fileName: "sih_2025_winner_certificate.pdf",
    status: "Verified",
    fileSize: "2.8 MB"
  },
  {
    id: "cert3",
    title: "Google Cloud Foundations Course",
    category: "Online Course",
    issueDate: "2026-02-10",
    fileName: "gcp_foundations.pdf",
    status: "Pending Verification",
    fileSize: "950 KB"
  }
];

export const initialInternships: InternshipEntry[] = [
  {
    id: "int1",
    companyName: "Google India",
    role: "Google Summer of Code (GSoC) Mentee",
    duration: "3 Months",
    startDate: "2026-05-20",
    status: "Completed",
    fileName: "gsoc_completion_letter.pdf",
    description: "Contributed to open-source database migration systems, improving processing efficiency by 14%."
  },
  {
    id: "int2",
    companyName: "TechCorp Solutions Ltd.",
    role: "Frontend Engineering Intern",
    duration: "2 Months",
    startDate: "2026-07-01",
    status: "Ongoing",
    fileName: "techcorp_offer_letter.pdf",
    description: "Developing responsive administrative portals in React, TypeScript, and modern Tailwind configurations."
  }
];

export const initialGoals: StudentGoal[] = [
  { id: "g1", title: "Maintain Semester GPA above 9.0", category: "Academic", targetDate: "2026-11-30", completed: false, createdAt: "2026-08-01" },
  { id: "g2", title: "Earn AWS Cloud Practitioner certification", category: "Skill Acquisition", targetDate: "2026-09-15", completed: false, createdAt: "2026-08-02" },
  { id: "g3", title: "Contribute 20+ commits to open-source repositories", category: "Skill Acquisition", targetDate: "2026-10-01", completed: false, createdAt: "2026-08-03" },
  { id: "g4", title: "Revamp Tech Portfolio Website using Tailwind", category: "Career", targetDate: "2026-08-15", completed: true, createdAt: "2026-07-25" },
  { id: "g5", title: "Complete 100 days of DSA problems", category: "Academic", targetDate: "2026-09-30", completed: false, createdAt: "2026-08-04" }
];

export const initialTickets: SupportTicket[] = [
  {
    id: "tk1",
    title: "Air Conditioning Maintenance in Room B-302",
    category: "Hostel",
    message: "The AC unit in hostel wing B, room 302 has been leaking water since last night and is not cooling efficiently. Please send a technician.",
    status: "Resolved",
    createdAt: "2026-08-02T10:00:00Z",
    replies: [
      {
        id: "rep1",
        sender: "Student",
        message: "The AC unit in hostel wing B, room 302 has been leaking water since last night.",
        timestamp: "2026-08-02T10:00:00Z"
      },
      {
        id: "rep2",
        sender: "Admin",
        message: "Hi Ameer, we have registered your complaint and assigned technician Mr. Raj. He will visit your room between 2 PM - 4 PM today.",
        timestamp: "2026-08-02T11:15:00Z"
      },
      {
        id: "rep3",
        sender: "Student",
        message: "Technician visited and resolved the issue. Works perfectly now, thank you!",
        timestamp: "2026-08-02T16:30:00Z"
      },
      {
        id: "rep4",
        sender: "Admin",
        message: "Glad to hear that. Closing this support ticket. Let us know if you have any other issues.",
        timestamp: "2026-08-02T17:00:00Z"
      }
    ]
  },
  {
    id: "tk2",
    title: "Quiz-2 Re-evaluation Request for CSE-304",
    category: "Academics",
    message: "In my Artificial Intelligence Quiz 2, there seems to be a grading error in Question 4. I submitted the correct heuristic formula but was marked zero.",
    status: "In Progress",
    createdAt: "2026-08-05T09:12:00Z",
    replies: [
      {
        id: "rep5",
        sender: "Student",
        message: "In my Artificial Intelligence Quiz 2, there seems to be a grading error in Question 4.",
        timestamp: "2026-08-05T09:12:00Z"
      },
      {
        id: "rep6",
        sender: "Admin",
        message: "Hello Ameer, we have forwarded your re-evaluation query to Prof. John McCarthy. He is currently reviewing the answer keys and will update your marks if valid. We'll keep you posted.",
        timestamp: "2026-08-06T14:20:00Z"
      }
    ]
  }
];

export const badgesList: AchievementBadge[] = [
  {
    id: "bd1",
    title: "Academic Prodigy",
    description: "Maintain an excellent academic standard with a CGPA exceeding 9.0.",
    icon: "GraduationCap",
    category: "academic",
    howToUnlock: "Achieve a cumulative CGPA of 9.0 or higher across active semesters."
  },
  {
    id: "bd2",
    title: "Perfect Presence",
    description: "Exceptional discipline and regularity in lectures.",
    icon: "CalendarCheck",
    category: "attendance",
    howToUnlock: "Maintain an overall attendance of 90% or higher across all registered subjects."
  },
  {
    id: "bd3",
    title: "Certified Scholar",
    description: "Acquire external knowledge and build credentials.",
    icon: "FileCheck",
    category: "involvement",
    howToUnlock: "Upload at least 3 academic or technical certificates that are successfully verified."
  },
  {
    id: "bd4",
    title: "Sovereign Paid",
    description: "Clear financial dues in a timely and structured manner.",
    icon: "DollarSign",
    category: "payment",
    howToUnlock: "Settle all pending tuition, library, and hostel outstanding dues to zero."
  },
  {
    id: "bd5",
    title: "Goal Conqueror",
    description: "Ambitious goal-setter who follows through.",
    icon: "Trophy",
    category: "milestone",
    howToUnlock: "Set and mark at least 3 different personal goals as completed under Goal Tracking."
  }
];
