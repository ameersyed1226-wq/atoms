// Real student data for NetCampus - I CSE, CKCET
// Face images stored in Firebase Storage, other data in localStorage

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "./firebase";
import { SUBJECTS, TIMETABLE, getCurrentDayName, getTrackableSubjects, hasPeriodStarted, type DayName, type Subject } from "./timetable";

/**
 * Upload a face image (base64 data URL) to Firebase Storage.
 * Returns the download URL, or the original base64 if Firebase is not configured.
 */
export async function uploadFaceImageToFirebase(
  studentId: string,
  base64DataUrl: string
): Promise<string> {
  // If Firebase is not configured, fall back to base64 in localStorage
  if (!isFirebaseConfigured()) {
    console.warn("⚠️ Firebase not configured — storing image as base64 in localStorage");
    return base64DataUrl;
  }

  try {
    // Convert base64 data URL to Blob
    const response = await fetch(base64DataUrl);
    const blob = await response.blob();

    // Upload to Firebase Storage: faces/{studentId}.jpg
    const storageRef = ref(storage, `faces/${studentId}_${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);

    // Get the public download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`✅ Face image uploaded to Firebase: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error("❌ Firebase upload failed:", error);
    // Fall back to base64 if upload fails
    return base64DataUrl;
  }
}

export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  department: string;
  year: string;
  section: string;
  face_registered: boolean;
  face_image?: string | null;
  face_embedding?: number[] | null;
  attendance_percentage: number;
  present_days: number;
  total_days: number;
  warning_sent: boolean;
}

export interface AttendanceRecord {
  student_id: string;
  date: string;
  status: "present" | "absent";
  method: "face" | "manual";
}

// Period-wise attendance record (tracks each period separately)
export interface PeriodAttendanceRecord {
  student_id: string;
  date: string;
  period: number;
  subject_code: string;
  subject_name: string;
  status: "present" | "absent";
  method: "face" | "manual";
  timestamp: string;
}

// Subject-wise attendance stats for a student
export interface SubjectAttendanceStat {
  subject_code: string;
  subject_name: string;
  short: string;
  faculty: string;
  type: "theory" | "lab" | "other";
  total_periods: number;
  present_periods: number;
  percentage: number;
}

export interface LeaveRequest {
  id: string;
  student_id: string;
  reason: string;
  leave_date: string;
  leave_end_date: string | null;
  status: "pending" | "approved" | "rejected";
  teacher_remark: string | null;
  created_at: string;
}

const realStudents: Omit<Student, "id" | "attendance_percentage" | "present_days" | "total_days" | "warning_sent" | "face_registered" | "face_image">[] = [
  { name: "ABARNA K", email: "abarna.k@ckcet.ac.in", password: "bzKSyPyoMA", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "ABINAYA L", email: "abinaya.l@ckcet.ac.in", password: "4xpKX9k3sI", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "ANANDHI R", email: "anandhicse@ckcet.ac.in", password: "rkbMH6lKSX", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "ANUSIYA R", email: "anusiya.r@ckcet.ac.in", password: "Af81PjxJHE", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "ARCHANA AR", email: "archana.ar@ckcet.ac.in", password: "IP2tTJyP0f", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "ARUN KUMAR S", email: "arunkumarcse@ckcet.ac.in", password: "PJsXo1MMmJ", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "BARATH P", email: "barathcse@ckcet.ac.in", password: "RzFDvjHNpL", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "CHANDRU P", email: "chandrucse@ckcet.ac.in", password: "dp2md3aF9T", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "CHAARUDEASHNI P", email: "chaarudeashni.p@ckcet.ac.in", password: "roKxchjyJ0", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "DEEPIKA DEVI D", email: "deepikadevi.d@ckcet.ac.in", password: "SyBQPlqPds", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "DENISHRAJA I", email: "denishraja.i@ckcet.ac.in", password: "yClblStzMPW", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "DHARSHINI P", email: "dharshini.p@ckcet.ac.in", password: "8IeZhoy6yH", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "DHASIN C", email: "dhasin.c@ckcet.ac.in", password: "jr2uuO1Bp6", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "GOBINATH R", email: "gobinath.r@ckcet.ac.in", password: "ibs5B6MT8u", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "GURUPRASAD M", email: "guruprasad.m@ckcet.ac.in", password: "j6ahrzsBK5", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "HARISH S", email: "harishcse@ckcet.ac.in", password: "SCAkDedmJE", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "HUMAIRAA H", email: "humairaa.h@ckcet.ac.in", password: "oXzOShJP4h", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "JAIAKASH K", email: "jaiakash.k@ckcet.ac.in", password: "6kzq2OfqaH", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "JAYAKAVIN M", email: "jayakavin.m@ckcet.ac.in", password: "jVPIGqS4mB", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "JAYAPRIYA M", email: "jayapriya.m@ckcet.ac.in", password: "ln4PsMVbuz", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "JAYASHRI R", email: "jayashri.r@ckcet.ac.in", password: "QZbEzqwAWy", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "JAGAN I", email: "jagan.i@ckcet.ac.in", password: "XAwJXORob7", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "KAVIN S R", email: "kavin.sr@ckcet.ac.in", password: "ZtkBQeos9g", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "KOUSHIKRAM P", email: "koushikram.p@ckcet.ac.in", password: "wA105qTmzs", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "LAKSITHA A", email: "laksitha.a@ckcet.ac.in", password: "h69KEweu0o", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "LATHIKA V", email: "lathika.v@ckcet.ac.in", password: "8rTV9as2b4", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "LOGAJANANI R", email: "logajanani.r@ckcet.ac.in", password: "BMedtCHM7o", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "LOSHINI S", email: "loshini.s@ckcet.ac.in", password: "lcbh1qvAnn", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "MADESH M", email: "madeshcse@ckcet.ac.in", password: "MgI2Nnixe0", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "MOFLIN A", email: "moflin.a@ckcet.ac.in", password: "kscmdCltTi", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "MOHAMED WAHID H", email: "mohamedwahid.h@ckcet.ac.in", password: "Vt4B6wsiQk", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "MOHAN P", email: "mohan.p@ckcet.ac.in", password: "aBINSqgSRT", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "MOHANRAJ R", email: "mohanraj.r@ckcet.ac.in", password: "s7u6ITRtVP", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "MOUNIGA P", email: "mouniga.p@ckcet.ac.in", password: "zhhIOW3Yfw", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "NABISHA BEGUM B", email: "nabishabegum.b@ckcet.ac.in", password: "Z2vVTQhaz2", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "NASREEN M R", email: "nasreen.mr@ckcet.ac.in", password: "FfDbyxg6Af", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "PRADEEPA P", email: "pradeepa.p@ckcet.ac.in", password: "MG6AcBPhDV", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "PRATHEEKSHA J", email: "pratheeksha.j@ckcet.ac.in", password: "P42z1I0OAY", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "RAKSHANA PR", email: "rakshana.pr@ckcet.ac.in", password: "xH8YVr9sEe", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "RANJANA R", email: "ranjana.r@ckcet.ac.in", password: "qTY6YIrgw7", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "RISHEGA V", email: "rishega.v@ckcet.ac.in", password: "mKyq23RtpA", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SABARINARAYANAN V", email: "sabarinarayanan.v@ckcet.ac.in", password: "6mLP32P33M", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SAFWA M", email: "safwa.m@ckcet.ac.in", password: "zuZMzhVx2u", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SANGEERTHAN B", email: "sangeerthan.b@ckcet.ac.in", password: "CFw9yFgyRk", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SASIKUMAR P", email: "sasikumar.p@ckcet.ac.in", password: "2ZdQ8pFoJC", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SATHYA PRIYA M", email: "sathyapriya.m@ckcet.ac.in", password: "zHm7U6KhrA", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SAUMYA L", email: "saumya.l@ckcet.ac.in", password: "WPfKRaGHaf", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SHANMUGA PRIYA D", email: "shanmugapriya.d@ckcet.ac.in", password: "caYsFAQZpM", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SIVAPRIYA D", email: "sivapriya.d@ckcet.ac.in", password: "0FDZuJS4ft", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SIVASRI N", email: "sivasri.n@ckcet.ac.in", password: "sFZ2puQVUA", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SOKESHWARAPANDIAN S", email: "sokeshwarapandian.s@ckcet.ac.in", password: "Aid0GJjF5k", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SUBASH S", email: "subashcse@ckcet.ac.in", password: "IM1M671VSi", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SUBASRI M", email: "subasricse@ckcet.ac.in", password: "QkrbZLNzAx", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SUDHARSHANA P", email: "sudharshana.p@ckcet.ac.in", password: "W9LD8CIALn", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SUMAYYAH NILOFAR SR", email: "sumayyanilofar.sr@ckcet.ac.in", password: "z05WPx27sj", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "SYED AMEER R", email: "syedameer.r@ckcet.ac.in", password: "QAdO22NHns", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "THARUN G", email: "tharun.g@ckcet.ac.in", password: "R32L8qMQ8O", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "VARSHAMATHI S", email: "varshamathi.s@ckcet.ac.in", password: "kiktEjl7XV", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "VARSHINI G", email: "varshini.g@ckcet.ac.in", password: "0fVRSCVJyq", department: "CSE", year: "2nd Year", section: "I CSE" },
  { name: "ZARASRI B", email: "zarasri.b@ckcet.ac.in", password: "Sa3LpRYdso", department: "CSE", year: "2nd Year", section: "I CSE" },
];

// ─── Storage Keys ───
const STUDENTS_KEY = "netcampus_students_v3";
const ATTENDANCE_KEY = "netcampus_attendance_v3";
const PERIOD_ATTENDANCE_KEY = "netcampus_period_attendance_v1";
const LEAVES_KEY = "netcampus_leaves_v3";

/** Broadcast updated local storage data to CKCET Student Portal parent iframe if present */
function broadcastSync() {
  if (typeof window !== "undefined") {
    const students = localStorage.getItem(STUDENTS_KEY);
    const attendance = localStorage.getItem(ATTENDANCE_KEY);
    const periods = localStorage.getItem(PERIOD_ATTENDANCE_KEY);
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'SYNC_ATTENDANCE_DATA',
        students,
        attendance,
        periods
      }, '*');
    }
  }
}

// ─── Generate Initial Data ───
function generateStudents(): Student[] {
  return realStudents.map((s, i) => {
    const percentage = Math.floor(Math.random() * 30) + 65; // 65-95%
    return {
      ...s,
      id: `STU${String(i + 1).padStart(3, "0")}`,
      face_registered: false,
      face_image: null,
      face_embedding: null,
      attendance_percentage: percentage,
      present_days: 0,
      total_days: 0,
      warning_sent: false,
    };
  });
}

export interface DateAttendanceDetail {
  date: string;
  dayName: DayName | "Sunday";
  status: "present" | "absent";
  method: "face" | "manual";
  periods: {
    period: number;
    subjectCode: string;
    subjectShort: string;
    subjectName: string;
    status: "present" | "absent";
    method?: "face" | "manual";
    timestamp?: string;
  }[];
}

/**
 * Generate historical attendance records for the semester since July 1, 2026.
 */
function generateHistoricalData(students: Student[]): {
  attendance: AttendanceRecord[];
  periodAttendance: PeriodAttendanceRecord[];
} {
  const attendanceRecords: AttendanceRecord[] = [];
  const periodRecords: PeriodAttendanceRecord[] = [];
  
  const today = new Date();
  const startDate = new Date("2026-07-01");
  
  // Iterate from July 1, 2026 to today
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // Skip Sundays
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
    const dayName = dayNames[dayOfWeek] as DayName;
    
    const schedule = TIMETABLE[dayName] || [];
    
    students.forEach(student => {
      // Determine if student was present today based on target attendance percentage
      const isPresentToday = Math.random() * 100 < student.attendance_percentage;
      
      attendanceRecords.push({
        student_id: student.id,
        date: dateStr,
        status: isPresentToday ? "present" : "absent",
        method: isPresentToday ? (Math.random() > 0.3 ? "face" : "manual") : "manual"
      });
      
      schedule.forEach(entry => {
        const subject = SUBJECTS[entry.subjectCode];
        if (!subject) return;
        
        let status: "present" | "absent" = "absent";
        let method: "face" | "manual" = "manual";
        
        if (isPresentToday) {
          // If overall present, high chance of attending this period
          if (subject.type === "other") {
            status = "present";
            method = "manual";
          } else {
            status = Math.random() > 0.12 ? "present" : "absent";
            method = status === "present" ? (Math.random() > 0.4 ? "face" : "manual") : "manual";
          }
        }
        
        periodRecords.push({
          student_id: student.id,
          date: dateStr,
          period: entry.period,
          subject_code: entry.subjectCode,
          subject_name: subject.name,
          status,
          method,
          timestamp: new Date(new Date(d).setHours(9 + entry.period, 0, 0, 0)).toISOString()
        });
      });
    });
  }
  
  return { attendance: attendanceRecords, periodAttendance: periodRecords };
}

// ─── Student CRUD ───
export function getStudents(): Student[] {
  const stored = localStorage.getItem(STUDENTS_KEY);
  if (stored) return JSON.parse(stored);
  const students = generateStudents();
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return students;
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  broadcastSync();
}

export function getStudentById(id: string): Student | null {
  const students = getStudents();
  return students.find(s => s.id === id) || null;
}

export function getStudentByEmailPassword(email: string, password: string): Student | null {
  const students = getStudents();
  return students.find(s => s.email === email && s.password === password) || null;
}

export function addStudent(student: Omit<Student, "id" | "attendance_percentage" | "present_days" | "total_days" | "warning_sent">): Student {
  const students = getStudents();
  const lastNum = students.length > 0
    ? Math.max(...students.map(s => parseInt(s.id.replace("STU", ""))))
    : 0;
  const newId = `STU${String(lastNum + 1).padStart(3, "0")}`;

  const newStudent: Student = {
    ...student,
    id: newId,
    attendance_percentage: 0,
    present_days: 0,
    total_days: 0,
    warning_sent: false,
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<Student>) {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    saveStudents(students);
  }
}

export async function registerFace(studentId: string, faceImage: string, faceEmbedding?: number[]) {
  const imageUrl = await uploadFaceImageToFirebase(studentId, faceImage);
  updateStudent(studentId, {
    face_registered: true,
    face_image: imageUrl,
    face_embedding: faceEmbedding || null,
  });
}

// Recalculates stats from attendance records to avoid double-incrementing bugs
export function recalculateStudentStats(studentId: string) {
  const students = getStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return;

  const attendanceRecords = getAttendanceRaw().filter(r => r.student_id === studentId);
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(r => r.status === "present").length;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  students[index].total_days = totalDays;
  students[index].present_days = presentDays;
  students[index].attendance_percentage = percentage;

  saveStudents(students);
}

// ─── Attendance ───
export function getAttendance(): AttendanceRecord[] {
  autoFillAbsentPeriodsForToday();
  autoFillOverallAttendanceForToday();

  const stored = localStorage.getItem(ATTENDANCE_KEY);
  if (stored) return JSON.parse(stored);
  
  // If no attendance exists, generate history for the semester
  const students = getStudents();
  const { attendance, periodAttendance } = generateHistoricalData(students);
  
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
  localStorage.setItem(PERIOD_ATTENDANCE_KEY, JSON.stringify(periodAttendance));
  
  // Save updated student counts based on generated history
  const updatedStudents = students.map(student => {
    const studentDays = attendance.filter(a => a.student_id === student.id);
    const totalDays = studentDays.length;
    const presentDays = studentDays.filter(a => a.status === "present").length;
    const pct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    
    return {
      ...student,
      total_days: totalDays,
      present_days: presentDays,
      attendance_percentage: pct
    };
  });
  saveStudents(updatedStudents);
  
  return attendance;
}

export function saveAttendance(records: AttendanceRecord[]) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  broadcastSync();
}

export function getTodayAttendance(): AttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0];
  const records = getAttendance();
  return records.filter(r => r.date === today);
}

export function markAttendance(studentId: string, status: "present" | "absent", method: "face" | "manual") {
  const records = getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const existing = records.find(r => r.student_id === studentId && r.date === today);
  if (existing) {
    existing.status = status;
    existing.method = method;
  } else {
    records.push({ student_id: studentId, date: today, status, method });
  }
  saveAttendance(records);
  recalculateStudentStats(studentId);
}

// Raw getters to avoid infinite recursion in helper functions
function getPeriodAttendanceRaw(): PeriodAttendanceRecord[] {
  const stored = localStorage.getItem(PERIOD_ATTENDANCE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function getAttendanceRaw(): AttendanceRecord[] {
  const stored = localStorage.getItem(ATTENDANCE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function autoFillAbsentPeriodsForToday() {
  const dayName = getCurrentDayName();
  if (!dayName) return; // Sunday

  const today = new Date().toISOString().split("T")[0];
  const schedule = TIMETABLE[dayName] || [];
  const students = getStudents();
  
  let records = getPeriodAttendanceRaw();
  let changed = false;

  students.forEach(student => {
    schedule.forEach(entry => {
      // Check if period has started
      if (hasPeriodStarted(entry.period)) {
        const subject = SUBJECTS[entry.subjectCode];
        if (!subject || entry.subjectCode === "Free") return;

        // Check if there is already a record for this student, today, and this period
        const existing = records.find(
          r => r.student_id === student.id && r.date === today && r.period === entry.period
        );

        if (!existing) {
          // If no record exists, they didn't scan -> Mark them ABSENT!
          records.push({
            student_id: student.id,
            date: today,
            period: entry.period,
            subject_code: entry.subjectCode,
            subject_name: subject.name,
            status: "absent",
            method: "manual",
            timestamp: new Date().toISOString()
          });
          changed = true;
        }
      }
    });
  });

  if (changed) {
    localStorage.setItem(PERIOD_ATTENDANCE_KEY, JSON.stringify(records));
  }
}

export function autoFillOverallAttendanceForToday() {
  const dayName = getCurrentDayName();
  if (!dayName) return;

  const today = new Date().toISOString().split("T")[0];
  const students = getStudents();
  const periodRecords = getPeriodAttendanceRaw();
  let attendanceRecords = getAttendanceRaw();
  let changed = false;

  students.forEach(student => {
    // Find today's period records for this student
    const todayPeriods = periodRecords.filter(r => r.student_id === student.id && r.date === today);
    if (todayPeriods.length === 0) return;

    // If they are present in at least one period today, they are present overall
    const isPresent = todayPeriods.some(p => p.status === "present");
    const status = isPresent ? "present" : "absent";

    const existing = attendanceRecords.find(r => r.student_id === student.id && r.date === today);
    if (existing) {
      if (existing.status !== status) {
        existing.status = status;
        changed = true;
      }
    } else {
      attendanceRecords.push({
        student_id: student.id,
        date: today,
        status,
        method: isPresent ? "face" : "manual"
      });
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceRecords));
    // Recalculate stats for students whose attendance changed
    students.forEach(student => {
      recalculateStudentStats(student.id);
    });
  }
}

// ─── Period-wise Attendance ───
export function getPeriodAttendance(): PeriodAttendanceRecord[] {
  autoFillAbsentPeriodsForToday();
  autoFillOverallAttendanceForToday();

  const stored = localStorage.getItem(PERIOD_ATTENDANCE_KEY);
  if (stored) return JSON.parse(stored);
  
  // Calling getAttendance() will trigger generation of both overall and period history
  getAttendance();
  
  const storedPeriods = localStorage.getItem(PERIOD_ATTENDANCE_KEY);
  return storedPeriods ? JSON.parse(storedPeriods) : [];
}

export function savePeriodAttendance(records: PeriodAttendanceRecord[]) {
  localStorage.setItem(PERIOD_ATTENDANCE_KEY, JSON.stringify(records));
  broadcastSync();
}

/** Mark attendance for a specific period and subject */
export function markPeriodAttendance(
  studentId: string,
  period: number,
  subjectCode: string,
  method: "face" | "manual"
) {
  const records = getPeriodAttendance();
  const today = new Date().toISOString().split("T")[0];
  const subject = SUBJECTS[subjectCode];
  if (!subject) return;

  // Check if already marked for this period today
  const existing = records.find(
    r => r.student_id === studentId && r.date === today && r.period === period
  );

  if (existing) {
    existing.status = "present";
    existing.method = method;
    existing.timestamp = new Date().toISOString();
  } else {
    records.push({
      student_id: studentId,
      date: today,
      period,
      subject_code: subjectCode,
      subject_name: subject.name,
      status: "present",
      method,
      timestamp: new Date().toISOString(),
    });
  }

  savePeriodAttendance(records);

  // Also mark in overall attendance (which handles student stats recalculation)
  markAttendance(studentId, "present", method);
}

/** Get today's period attendance for a student */
export function getTodayPeriodAttendance(studentId: string): PeriodAttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0];
  return getPeriodAttendance().filter(
    r => r.student_id === studentId && r.date === today
  );
}

/** Get subject-wise attendance stats for a student */
export function getSubjectWiseAttendance(studentId: string): SubjectAttendanceStat[] {
  const allRecords = getPeriodAttendance().filter(r => r.student_id === studentId);
  const trackableSubjects = getTrackableSubjects();

  return trackableSubjects.map(subject => {
    const subjectRecords = allRecords.filter(r => r.subject_code === subject.code);
    const presentRecords = subjectRecords.filter(r => r.status === "present");

    const totalPeriods = subjectRecords.length;
    const presentPeriods = presentRecords.length;
    const percentage = totalPeriods > 0 ? Math.round((presentPeriods / totalPeriods) * 100) : 0;

    return {
      subject_code: subject.code,
      subject_name: subject.name,
      short: subject.short,
      faculty: subject.faculty,
      type: subject.type,
      total_periods: totalPeriods,
      present_periods: presentPeriods,
      percentage,
    };
  });
}

/** Get student's detailed date-wise attendance log */
export function getStudentAttendanceHistory(studentId: string): DateAttendanceDetail[] {
  const attendanceRecords = getAttendance()
    .filter(r => r.student_id === studentId)
    .sort((a, b) => b.date.localeCompare(a.date)); // descending
    
  const periodRecords = getPeriodAttendance().filter(r => r.student_id === studentId);
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
  
  return attendanceRecords.map(record => {
    const dateObj = new Date(record.date);
    const dayOfWeek = dateObj.getDay();
    const dayName = dayNames[dayOfWeek];
    
    const schedule = dayName !== "Sunday" ? TIMETABLE[dayName] : [];
    
    const periods = schedule.map(entry => {
      const subject = SUBJECTS[entry.subjectCode];
      const periodRecord = periodRecords.find(
        p => p.date === record.date && p.period === entry.period
      );
      
      return {
        period: entry.period,
        subjectCode: entry.subjectCode,
        subjectShort: subject?.short || entry.subjectCode,
        subjectName: subject?.name || "",
        status: periodRecord ? periodRecord.status : (subject?.type === "other" ? "present" : "absent"),
        method: periodRecord?.method,
        timestamp: periodRecord?.timestamp,
      };
    });
    
    return {
      date: record.date,
      dayName,
      status: record.status,
      method: record.method,
      periods,
    };
  });
}

/** Get all period attendance for a specific date (teacher view) */
export function getDatePeriodAttendance(date: string): PeriodAttendanceRecord[] {
  return getPeriodAttendance().filter(r => r.date === date);
}

// ─── Leave Requests ───
export function getLeaveRequests(): LeaveRequest[] {
  const stored = localStorage.getItem(LEAVES_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

function saveLeaveRequests(requests: LeaveRequest[]) {
  localStorage.setItem(LEAVES_KEY, JSON.stringify(requests));
}

export function getLeaveRequestsByStudent(studentId: string): LeaveRequest[] {
  return getLeaveRequests()
    .filter(lr => lr.student_id === studentId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllLeaveRequests(): LeaveRequest[] {
  return getLeaveRequests()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function addLeaveRequest(studentId: string, reason: string, leaveDate: string, leaveEndDate: string | null): LeaveRequest {
  const requests = getLeaveRequests();
  const newRequest: LeaveRequest = {
    id: `LR${Date.now()}`,
    student_id: studentId,
    reason,
    leave_date: leaveDate,
    leave_end_date: leaveEndDate,
    status: "pending",
    teacher_remark: null,
    created_at: new Date().toISOString(),
  };
  requests.push(newRequest);
  saveLeaveRequests(requests);
  return newRequest;
}

export function updateLeaveRequest(leaveId: string, updates: Partial<LeaveRequest>) {
  const requests = getLeaveRequests();
  const index = requests.findIndex(lr => lr.id === leaveId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    saveLeaveRequests(requests);
  }
}

// ─── Teacher Credentials ───
export const TEACHER_CREDENTIALS = {
  email: "teacher@ckcet.ac.in",
  password: "teacher123",
};
