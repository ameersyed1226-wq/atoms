export interface Student {
  name: string;
  email: string;
  regNo: string;
  department: string;
  semester: number;
  cgpa: number;
  avatar?: string;
  joinedYear: number;
  password?: string;
}

export interface Course {
  code: string;
  name: string;
  credits: number;
  faculty: string;
  attendancePresent: number;
  attendanceTotal: number;
  ia1Marks?: number; // Internal Assessment 1 (out of 20)
  ia2Marks?: number; // Internal Assessment 2 (out of 20)
  modelMarks?: number; // Model Exam (out of 50)
  internalTotal?: number; // IA1 + IA2 + Model (out of 50 or normalized to 100)
  currentGrade?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'academic' | 'exam' | 'placement' | 'event' | 'general';
  priority: 'low' | 'medium' | 'high';
  author: string;
}

export interface TimetablePeriod {
  subject: string;
  code: string;
  time: string;
  room: string;
  faculty: string;
}

export interface DayTimetable {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface TicketReply {
  id: string;
  sender: 'student' | 'admin';
  message: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'academic' | 'exams' | 'fees' | 'hostel' | 'it-support';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  replies: TicketReply[];
}
