/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  email: string;
  avatarUrl: string;
}

export interface AttendanceSubject {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
  teacher: string;
}

export interface AttendanceLogEntry {
  id: string;
  date: string;
  status: 'Present' | 'Absent' | 'On Leave';
  subjectName: string;
}

export interface AssessmentMarks {
  quiz1: number; // max 10
  midterm: number; // max 30
  quiz2: number; // max 10
  assignment: number; // max 10
  project: number; // max 40
}

export interface InternalMarkEntry {
  id: string;
  subjectCode: string;
  subjectName: string;
  assessments: AssessmentMarks;
}

export interface CourseGrade {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface SemesterGPA {
  id: string;
  semesterNumber: number;
  gpa: number;
  courses: CourseGrade[];
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Medical' | 'Duty Leave';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface FeeItem {
  id: string;
  name: string;
  total: number;
  paid: number;
  category: 'Tuition' | 'Hostel' | 'Library' | 'Exam';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  itemPaid: string;
  paymentMethod: string;
  receiptNumber: string;
}

export interface StudentCertificate {
  id: string;
  title: string;
  category: 'Online Course' | 'Extracurricular' | 'Sports' | 'Technical Paper' | 'Hackathon';
  issueDate: string;
  fileName: string;
  status: 'Pending Verification' | 'Verified' | 'Rejected';
  fileSize: string;
}

export interface InternshipEntry {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  startDate: string;
  status: 'Offered' | 'Ongoing' | 'Completed';
  fileName?: string;
  description: string;
}

export interface StudentGoal {
  id: string;
  title: string;
  category: 'Academic' | 'Skill Acquisition' | 'Career' | 'Physical';
  targetDate: string;
  completed: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: 'Academics' | 'Hostel' | 'Fee Payment' | 'IT Support' | 'Exam Cell';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  replies: Array<{
    id: string;
    sender: 'Student' | 'Admin';
    message: string;
    timestamp: string;
  }>;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'academic' | 'attendance' | 'involvement' | 'payment' | 'milestone';
  howToUnlock: string;
}
