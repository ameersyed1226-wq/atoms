// ═══════════════════════════════════════════════════════════════
// CKCET — III Year CSE Timetable (Odd Semester 2026-2027)
// Department of Computer Science & Engineering
// Classroom: B-207
// ═══════════════════════════════════════════════════════════════

export interface Subject {
  code: string;
  name: string;
  short: string;
  faculty: string;
  type: "theory" | "lab" | "other";
}

export interface PeriodTiming {
  period: number;
  start: string; // "HH:MM" 24hr format
  end: string;
  label: string;
}

export interface TimetableEntry {
  period: number;
  subjectCode: string;
}

export type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

// ─── Subject Master Data ───
export const SUBJECTS: Record<string, Subject> = {
  CB3491: { code: "CB3491", name: "Cryptography and Cyber Security", short: "CCS", faculty: "Varalakshmi.K", type: "theory" },
  CCS341: { code: "CCS341", name: "Data Warehousing", short: "DW", faculty: "Ranjani K", type: "theory" },
  CCS375: { code: "CCS375", name: "Web Technologies", short: "WT", faculty: "MALATHI R", type: "theory" },
  CS3501: { code: "CS3501", name: "Compiler Design", short: "CD", faculty: "Vimal Raja", type: "theory" },
  CS3551: { code: "CS3551", name: "Distributed Computing", short: "DC", faculty: "sivaprakash", type: "theory" },
  CS3591: { code: "CS3591", name: "Computer Networks", short: "CN", faculty: "Elakiya V", type: "theory" },
  ICL:    { code: "ICL", name: "IIY/Counselling/Library", short: "ICL", faculty: "sivaprakash", type: "other" },
  MX3081: { code: "MX3081", name: "Introduction to Women and Gender S...", short: "IWGS", faculty: "Varalakshmi.K", type: "theory" },
  WL005:  { code: "WL005", name: "Win@Life 05", short: "WL05", faculty: "sivaprakash", type: "other" },
  TPP005: { code: "TPP005", name: "Training & Placement Programing 05", short: "TPP05", faculty: "John William P", type: "other" },
  TPC005: { code: "TPC005", name: "Training & Placement Communication 05", short: "TPC05", faculty: "Sowmiya L M", type: "other" },
  TPA005: { code: "TPA005", name: "Training & Placement Aptitude 05", short: "TPA05", faculty: "G. JOTHILAKSHMI", type: "other" },
  Free:   { code: "Free", name: "Free / Study Period", short: "Free", faculty: "-", type: "other" },
};

// ─── Period Timings ───
export const PERIOD_TIMINGS: PeriodTiming[] = [
  { period: 1, start: "09:15", end: "09:35", label: "Period 1" },
  { period: 2, start: "09:35", end: "10:25", label: "Period 2" },
  { period: 3, start: "10:25", end: "11:15", label: "Period 3" },
  // Break: 11:15 - 11:30
  { period: 4, start: "11:30", end: "12:20", label: "Period 4" },
  { period: 5, start: "12:20", end: "13:10", label: "Period 5" },
  // Lunch: 13:10 - 13:55
  { period: 6, start: "13:55", end: "14:45", label: "Period 6" },
  { period: 7, start: "14:45", end: "15:35", label: "Period 7" },
  // Break: 15:35 - 15:50
  { period: 8, start: "15:50", end: "16:30", label: "Period 8" },
];

// Overall attendance window
export const OVERALL_ATTENDANCE_START = "09:00";
export const OVERALL_ATTENDANCE_END = "09:30";

// ─── Weekly Timetable ───
export const TIMETABLE: Record<DayName, TimetableEntry[]> = {
  Monday: [
    { period: 1, subjectCode: "WL005" },
    { period: 2, subjectCode: "CCS341" },
    { period: 3, subjectCode: "CB3491" },
    { period: 4, subjectCode: "CS3501" },
    { period: 5, subjectCode: "CS3591" },
    { period: 6, subjectCode: "CCS341" },
    { period: 7, subjectCode: "CCS341" },
    { period: 8, subjectCode: "TPP005" },
  ],
  Tuesday: [
    { period: 1, subjectCode: "WL005" },
    { period: 2, subjectCode: "CS3551" },
    { period: 3, subjectCode: "CS3501" },
    { period: 4, subjectCode: "CCS375" },
    { period: 5, subjectCode: "CCS375" },
    { period: 6, subjectCode: "TPC005" },
    { period: 7, subjectCode: "CS3501" },
    { period: 8, subjectCode: "TPP005" },
  ],
  Wednesday: [
    { period: 1, subjectCode: "WL005" },
    { period: 2, subjectCode: "CB3491" },
    { period: 3, subjectCode: "CS3591" },
    { period: 4, subjectCode: "CS3591" },
    { period: 5, subjectCode: "CCS375" },
    { period: 6, subjectCode: "CS3501" },
    { period: 7, subjectCode: "CS3501" },
    { period: 8, subjectCode: "TPA005" },
  ],
  Thursday: [
    { period: 1, subjectCode: "WL005" },
    { period: 2, subjectCode: "CS3501" },
    { period: 3, subjectCode: "CS3551" },
    { period: 4, subjectCode: "CS3591" },
    { period: 5, subjectCode: "CS3591" },
    { period: 6, subjectCode: "CB3491" },
    { period: 7, subjectCode: "Free" },
    { period: 8, subjectCode: "MX3081" },
  ],
  Friday: [
    { period: 1, subjectCode: "ICL" },
    { period: 2, subjectCode: "CCS375" },
    { period: 3, subjectCode: "CCS341" },
    { period: 4, subjectCode: "MX3081" },
    { period: 5, subjectCode: "TPA005" },
    { period: 6, subjectCode: "CCS341" },
    { period: 7, subjectCode: "CS3551" },
    { period: 8, subjectCode: "CCS375" },
  ],
  Saturday: [
    { period: 1, subjectCode: "ICL" },
    { period: 2, subjectCode: "CS3591" },
    { period: 3, subjectCode: "CS3551" },
    { period: 4, subjectCode: "CCS375" },
    { period: 5, subjectCode: "CB3491" },
    { period: 6, subjectCode: "CS3501" },
    { period: 7, subjectCode: "CCS341" },
    { period: 8, subjectCode: "MX3081" },
  ],
};

// ─── Helper Functions ───

/** Parse "HH:MM" to minutes since midnight */
function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/** Get current time as minutes since midnight */
function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/** Get current day name (Monday-Saturday). Returns null on Sunday. */
export function getCurrentDayName(): DayName | null {
  const days: (DayName | null)[] = [null, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

/** Check if current time is in the overall attendance window (9:00 - 9:30) */
export function isOverallAttendanceTime(): boolean {
  const now = getCurrentMinutes();
  return now >= parseTime(OVERALL_ATTENDANCE_START) && now <= parseTime(OVERALL_ATTENDANCE_END);
}

export interface CurrentPeriodInfo {
  period: number;
  timing: PeriodTiming;
  subjectCode: string;
  subject: Subject;
  isActive: boolean;
}

/** Get the current active period based on real time and today's timetable */
export function getCurrentPeriod(): CurrentPeriodInfo | null {
  const day = getCurrentDayName();
  if (!day) return null; // Sunday

  const now = getCurrentMinutes();
  const todaySchedule = TIMETABLE[day];

  for (const entry of todaySchedule) {
    const timing = PERIOD_TIMINGS.find(t => t.period === entry.period);
    if (!timing) continue;

    const start = parseTime(timing.start);
    const end = parseTime(timing.end);

    if (now >= start && now <= end) {
      const subject = SUBJECTS[entry.subjectCode];
      if (subject) {
        return {
          period: entry.period,
          timing,
          subjectCode: entry.subjectCode,
          subject,
          isActive: true,
        };
      }
    }
  }

  return null;
}

/** Get a specific subject by code */
export function getSubjectByCode(code: string): Subject | null {
  return SUBJECTS[code] || null;
}

/** Get today's full timetable with subject details */
export function getTodaySchedule(): (TimetableEntry & { timing: PeriodTiming; subject: Subject })[] {
  const day = getCurrentDayName();
  if (!day) return [];

  return TIMETABLE[day].map(entry => {
    const timing = PERIOD_TIMINGS.find(t => t.period === entry.period)!;
    const subject = SUBJECTS[entry.subjectCode];
    return { ...entry, timing, subject };
  }).filter(e => e.timing && e.subject);
}

/** Get timetable for a specific day with subject details */
export function getDaySchedule(day: DayName): (TimetableEntry & { timing: PeriodTiming; subject: Subject })[] {
  return TIMETABLE[day].map(entry => {
    const timing = PERIOD_TIMINGS.find(t => t.period === entry.period)!;
    const subject = SUBJECTS[entry.subjectCode];
    return { ...entry, timing, subject };
  }).filter(e => e.timing && e.subject);
}

/** Get all trackable subject codes (excluding LIB, COUN, SEM) */
export function getTrackableSubjects(): Subject[] {
  return Object.values(SUBJECTS).filter(s => s.type !== "other");
}

/** Get all day names */
export const DAY_NAMES: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Format time string for display: "09:15" → "9:15 AM" */
export function formatTimeDisplay(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Check if a period has ended today */
export function isPeriodOver(period: number): boolean {
  const timing = PERIOD_TIMINGS.find(t => t.period === period);
  if (!timing) return false;
  return getCurrentMinutes() > parseTime(timing.end);
}

/** Check if a period hasn't started yet */
export function isPeriodUpcoming(period: number): boolean {
  const timing = PERIOD_TIMINGS.find(t => t.period === period);
  if (!timing) return false;
  return getCurrentMinutes() < parseTime(timing.start);
}

/** Check if a period has started today */
export function hasPeriodStarted(period: number): boolean {
  const timing = PERIOD_TIMINGS.find(t => t.period === period);
  if (!timing) return false;
  return getCurrentMinutes() >= parseTime(timing.start);
}
