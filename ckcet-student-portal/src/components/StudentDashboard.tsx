import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, BookOpen, Calendar, Clock, LogOut, Bell, BarChart3,
  MessageSquare, User, FileText, Send, CalendarDays, CheckCircle, AlertCircle,
  FileCheck, Shield, ChevronRight, HelpCircle, ArrowUpRight, Calculator, Plus, Info,
  Menu, Megaphone, Download, Briefcase, Book, FileQuestion, CreditCard, Check, X, Sparkles, ClipboardList, ChevronDown, ChevronUp,
  LayoutGrid, CheckSquare, IndianRupee, Library, Award, Users, MapPin
} from 'lucide-react';
import { Student, Course, DayTimetable, TimetablePeriod, Announcement, SupportTicket, TicketReply } from '../types';
import { MOCK_COURSES, MOCK_TIMETABLE, MOCK_ANNOUNCEMENTS, INITIAL_TICKETS } from '../data';

// Import our modular custom sub-views
import {
  ProfileView,
  FeesView,
  SyllabusView,
  QPapersView,
  CalendarView,
  RegistrationView,
  LibraryView,
  PlacementView,
  DownloadsView,
  StepActivityView,
  MentorView,
  CircularsView
} from './SubViews';

const ATTENDANCE_SUBJECTS = [
  { code: 'CB3491', name: 'CRYPTOGRAPHY AND CYBER SECURITY', faculty: 'Varalakshmi.K', total: 16, attended: 14, od: 0, percentage: 87.5, odPercentage: 0.0 },
  { code: 'CCS341', name: 'DATA WAREHOUSING', faculty: 'Ranjani K', total: 20, attended: 16, od: 0, percentage: 80.0, odPercentage: 0.0 },
  { code: 'CCS375', name: 'WEB TECHNOLOGIES', faculty: 'MALATHI R', total: 18, attended: 17, od: 0, percentage: 94.4, odPercentage: 0.0 },
  { code: 'CS3501', name: 'COMPILER DESIGN', faculty: 'Vimal Raja', total: 18, attended: 15, od: 0, percentage: 83.3, odPercentage: 0.0 },
  { code: 'CS3551', name: 'Distributed Computing', faculty: 'sivaprakash', total: 8, attended: 7, od: 0, percentage: 87.5, odPercentage: 0.0 },
  { code: 'CS3591', name: 'Computer Networks', faculty: 'Elakiya V', total: 18, attended: 15, od: 0, percentage: 83.3, odPercentage: 0.0 },
  { code: 'ICL', name: 'IIY/Counselling/Library', faculty: 'sivaprakash', total: 1, attended: 1, od: 0, percentage: 100.0, odPercentage: 0.0 },
  { code: 'MX3081', name: 'Introduction to Women and Gender S...', faculty: 'Varalakshmi.K', total: 7, attended: 6, od: 0, percentage: 85.7, odPercentage: 0.0 },
  { code: 'PET', name: 'Physical Education Training', faculty: 'Janagi A', total: 3, attended: 3, od: 0, percentage: 100.0, odPercentage: 0.0 },
  { code: 'TPA005', name: 'Training & Placement Aptitude 05', faculty: 'G. JOTHILAKSHMI', total: 1, attended: 1, od: 0, percentage: 100.0, odPercentage: 0.0 },
  { code: 'TPC005', name: 'Training & Placement Communication...', faculty: 'Sowmiya L M', total: 4, attended: 4, od: 0, percentage: 100.0, odPercentage: 0.0 },
  { code: 'TPP005', name: 'Training & Placement Programing 05', faculty: 'John William P', total: 4, attended: 3, od: 0, percentage: 75.0, odPercentage: 0.0 },
  { code: 'WL005', name: 'Win@Life 05', faculty: 'sivaprakash', total: 11, attended: 10, od: 0, percentage: 90.9, odPercentage: 0.0 },
];

const ATTENDANCE_DATES = [
  { date: '4 Aug 2026', periods: '1/1 periods', percentage: 100 },
  { date: '3 Aug 2026', periods: '5/5 periods', percentage: 100 },
  { date: '31 Jul 2026', periods: '5/5 periods', percentage: 100 },
  { date: '30 Jul 2026', periods: '5/5 periods', percentage: 100 },
  { date: '29 Jul 2026', periods: '7/7 periods', percentage: 100 },
  { date: '28 Jul 2026', periods: '6/6 periods', percentage: 100 },
  { date: '27 Jul 2026', periods: '6/6 periods', percentage: 100 },
  { date: '24 Jul 2026', periods: '7/7 periods', percentage: 100 },
  { date: '23 Jul 2026', periods: '8/8 periods', percentage: 100 },
  { date: '22 Jul 2026', periods: '7/7 periods', percentage: 100 },
  { date: '21 Jul 2026', periods: '8/8 periods', percentage: 100 },
  { date: '20 Jul 2026', periods: '0/8 periods', percentage: 0 },
  { date: '18 Jul 2026', periods: '8/8 periods', percentage: 100 },
  { date: '17 Jul 2026', periods: '7/7 periods', percentage: 100 },
  { date: '16 Jul 2026', periods: '7/7 periods', percentage: 100 },
  { date: '15 Jul 2026', periods: '5/6 periods', percentage: 83 },
  { date: '14 Jul 2026', periods: '8/8 periods', percentage: 100 },
  { date: '13 Jul 2026', periods: '8/8 periods', percentage: 100 },
  { date: '11 Jul 2026', periods: '0/8 periods', percentage: 0 },
  { date: '10 Jul 2026', periods: '5/5 periods', percentage: 100 },
];

function getLiveAttendanceData(studentName: string) {
  const studentsStr = localStorage.getItem("netcampus_students_v3");
  const attendanceStr = localStorage.getItem("netcampus_attendance_v3");
  const periodAttendanceStr = localStorage.getItem("netcampus_period_attendance_v1");

  if (!studentsStr || !attendanceStr || !periodAttendanceStr) {
    return null;
  }

  try {
    const students = JSON.parse(studentsStr);
    const matchedStudent = students.find(
      (s: any) => s.name.toUpperCase().trim() === studentName.toUpperCase().trim()
    );
    if (!matchedStudent) return null;

    const studentId = matchedStudent.id;
    const attendance = JSON.parse(attendanceStr).filter((r: any) => r.student_id === studentId);
    const periodAttendance = JSON.parse(periodAttendanceStr).filter((r: any) => r.student_id === studentId);

    // Group periods by date and calculate subject stats
    const dates = Array.from(new Set(attendance.map((r: any) => r.date))).sort((a: any, b: any) => b.localeCompare(a));

    const subjectMap: Record<string, { name: string; faculty: string }> = {
      CB3491: { name: "CRYPTOGRAPHY AND CYBER SECURITY", faculty: "Varalakshmi.K" },
      CCS341: { name: "DATA WAREHOUSING", faculty: "Ranjani K" },
      CCS375: { name: "WEB TECHNOLOGIES", faculty: "MALATHI R" },
      CS3501: { name: "COMPILER DESIGN", faculty: "Vimal Raja" },
      CS3551: { name: "Distributed Computing", faculty: "sivaprakash" },
      CS3591: { name: "Computer Networks", faculty: "Elakiya V" },
      WL005:  { name: "Win@Life 05", faculty: "sivaprakash" },
      TPP005: { name: "Training & Placement Programing 05", faculty: "John William P" },
      TPC005: { name: "Training & Placement Communication 05", faculty: "Sowmiya L M" },
      TPA005: { name: "Training & Placement Aptitude 05", faculty: "G. JOTHILAKSHMI" },
      ICL:    { name: "IIY/Counselling/Library", faculty: "sivaprakash" },
      MX3081: { name: "Introduction to Women and Gender Studies", faculty: "Varalakshmi.K" },
      PET:    { name: "Physical Education Training", faculty: "Janagi A" }
    };

    const subjectStats: Record<string, { total: number; attended: number }> = {};
    Object.keys(subjectMap).forEach(code => {
      subjectStats[code] = { total: 0, attended: 0 };
    });

    periodAttendance.forEach((r: any) => {
      const code = r.subject_code;
      if (subjectStats[code]) {
        subjectStats[code].total += 1;
        if (r.status === "present") {
          subjectStats[code].attended += 1;
        }
      } else {
        subjectStats[code] = {
          total: 1,
          attended: r.status === "present" ? 1 : 0
        };
        subjectMap[code] = {
          name: r.subject_name || code,
          faculty: r.faculty || "—"
        };
      }
    });

    const subjectsList = Object.keys(subjectStats).map(code => {
      const stats = subjectStats[code];
      const total = stats.total;
      const attended = stats.attended;
      const percentage = total > 0 ? (attended / total) * 100 : 0;
      
      return {
        code,
        name: subjectMap[code]?.name || code,
        faculty: subjectMap[code]?.faculty || "—",
        total,
        attended,
        od: 0,
        percentage,
        odPercentage: 0.0
      };
    }).filter(s => s.total > 0);

    const datesList = dates.map((dateStr: string) => {
      const dayPeriods = periodAttendance.filter((p: any) => p.date === dateStr);
      const attended = dayPeriods.filter((p: any) => p.status === "present").length;
      const total = dayPeriods.length;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
      
      const d = new Date(dateStr);
      const formattedDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/,/g, '');

      return {
        date: formattedDate,
        periods: `${attended}/${total} periods`,
        percentage
      };
    });

    return {
      subjects: subjectsList,
      dates: datesList,
      periodAttendance: periodAttendance
    };
  } catch (e) {
    console.error("Error processing live attendance:", e);
    return null;
  }
}

interface StudentDashboardProps {
  student: Student;
  onLogout: () => void;
}

type TabType = 
  | 'overview' 
  | 'profile' 
  | 'attendance' 
  | 'academics' 
  | 'timetable' 
  | 'fees' 
  | 'syllabus' 
  | 'question_papers' 
  | 'calendar' 
  | 'registration' 
  | 'library' 
  | 'placement' 
  | 'step_activity'
  | 'mentor'
  | 'downloads' 
  | 'notifications' 
  | 'circulars'
  | 'helpdesk';

export default function StudentDashboard({ student, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [expandedDateIndex, setExpandedDateIndex] = useState<number | null>(null);
  
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const stored = localStorage.getItem(`ckcet_tickets_${student.regNo}`);
    return stored ? JSON.parse(stored) : INITIAL_TICKETS;
  });

  const [attendanceSubjects, setAttendanceSubjects] = useState<any[]>(ATTENDANCE_SUBJECTS);
  const [attendanceDates, setAttendanceDates] = useState<any[]>(ATTENDANCE_DATES);
  const [livePeriodRecords, setLivePeriodRecords] = useState<any[]>([]);

  const refreshLiveAttendance = () => {
    const liveData = getLiveAttendanceData(student.name);
    if (liveData) {
      setAttendanceSubjects(liveData.subjects);
      setAttendanceDates(liveData.dates);
      setLivePeriodRecords(liveData.periodAttendance);
    } else {
      setAttendanceSubjects(ATTENDANCE_SUBJECTS);
      setAttendanceDates(ATTENDANCE_DATES);
      setLivePeriodRecords([]);
    }
  };

  useEffect(() => {
    refreshLiveAttendance();
    
    window.addEventListener('focus', refreshLiveAttendance);
    window.addEventListener('storage', refreshLiveAttendance);
    
    const interval = setInterval(refreshLiveAttendance, 2500);
    
    return () => {
      window.removeEventListener('focus', refreshLiveAttendance);
      window.removeEventListener('storage', refreshLiveAttendance);
      clearInterval(interval);
    };
  }, [student.name]);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timetable selection state
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const [selectedDay, setSelectedDay] = useState<typeof daysOfWeek[number]>('Monday');

  useEffect(() => {
    const todayNum = new Date().getDay();
    if (todayNum >= 1 && todayNum <= 6) {
      setSelectedDay(daysOfWeek[todayNum - 1]);
    }
  }, []);

  const [selectedPeriodModal, setSelectedPeriodModal] = useState<TimetablePeriod | null>(null);

  const getSubjectStyle = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode.includes('WL005')) {
      return 'bg-violet-50 text-violet-700 border-violet-200';
    } else if (cleanCode.includes('CCS341')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (cleanCode.includes('CB3491')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (cleanCode.includes('CS3501')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    } else if (cleanCode.includes('CS3591')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (cleanCode.includes('CS3551')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (cleanCode.includes('CCS375')) {
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
    } else if (cleanCode.includes('ICL')) {
      return 'bg-slate-100 text-slate-700 border-slate-200';
    } else if (cleanCode.includes('MX3081')) {
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    } else if (cleanCode.includes('TP')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (cleanCode.includes('FREE')) {
      return 'bg-slate-50 text-slate-400 border-slate-100 border-dashed';
    }
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const renderPeriodCell = (period: TimetablePeriod | undefined) => {
    if (!period) return <span className="text-slate-300">—</span>;
    if (period.code === 'Free') {
      return (
        <button 
          onClick={() => setSelectedPeriodModal(period)}
          className="w-full py-2.5 px-1.5 rounded-xl border border-dashed border-slate-200 text-slate-400 hover:bg-slate-50 transition-all font-semibold font-sans uppercase text-[10px]"
        >
          Free
        </button>
      );
    }

    const hasSpan = period.room.toLowerCase().includes('span') || period.subject.toLowerCase().includes('span') || period.code.toLowerCase().includes('span');
    const displayCode = period.code.replace(' (span)', '').replace(' span', '').trim();
    const styleClasses = getSubjectStyle(displayCode);

    return (
      <button
        onClick={() => setSelectedPeriodModal(period)}
        className={`w-full py-2 px-1.5 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-xs text-center flex flex-col items-center justify-center gap-0.5 min-h-[48px] ${styleClasses}`}
      >
        <span className="font-extrabold text-[11px] tracking-tight">{displayCode}</span>
        {hasSpan && (
          <span className="text-[8px] px-1 bg-white/70 border border-current/10 rounded-sm font-extrabold uppercase scale-90 tracking-wide">
            span
          </span>
        )}
      </button>
    );
  };

  // Save tickets to local storage on change
  useEffect(() => {
    localStorage.setItem(`ckcet_tickets_${student.regNo}`, JSON.stringify(tickets));
  }, [tickets, student.regNo]);

  // Attendance calculator state
  const [selectedCalcCourse, setSelectedCalcCourse] = useState<string>(MOCK_COURSES[0].code);
  const [calcTarget, setCalcTarget] = useState<number>(75);
  const [calcResult, setCalcResult] = useState<{ status: 'safe' | 'needs-more', classesNeeded?: number }>({ status: 'safe' });

  // Run attendance calculator
  useEffect(() => {
    const targetCourse = courses.find(c => c.code === selectedCalcCourse);
    if (!targetCourse) return;

    const present = targetCourse.attendancePresent;
    const total = targetCourse.attendanceTotal;
    const currentPercent = (present / total) * 100;

    if (currentPercent >= calcTarget) {
      setCalcResult({ status: 'safe' });
    } else {
      const targetFrac = calcTarget / 100;
      const numerator = targetFrac * total - present;
      const denominator = 1 - targetFrac;
      const classesNeeded = Math.ceil(numerator / denominator);
      
      setCalcResult({
        status: 'needs-more',
        classesNeeded: classesNeeded > 0 ? classesNeeded : 0
      });
    }
  }, [selectedCalcCourse, calcTarget, courses]);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('academic');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      message: ticketMessage.trim(),
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      replies: []
    };

    setTickets([newTicket, ...tickets]);
    setTicketSubject('');
    setTicketMessage('');
    setActiveTicketId(newTicket.id);
  };

  const handlePostReply = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: TicketReply = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      sender: 'student',
      message: replyText.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setTickets(prevTickets => prevTickets.map(tkt => {
      if (tkt.id === ticketId) {
        const updatedTicket = {
          ...tkt,
          replies: [...tkt.replies, newReply]
        };
        
        setTimeout(() => {
          const autoReply: TicketReply = {
            id: `rep-admin-${Date.now().toString().slice(-4)}`,
            sender: 'admin',
            message: `Vanakkam. We have logged your reply regarding "${tkt.subject}". Our department officer is checking your records.`,
            date: new Date().toISOString().split('T')[0]
          };
          setTickets(curr => curr.map(c => {
            if (c.id === ticketId) {
              return {
                ...c,
                status: 'In Progress',
                replies: [...c.replies, autoReply]
              };
            }
            return c;
          }));
        }, 2000);

        return updatedTicket;
      }
      return tkt;
    }));

    setReplyText('');
  };

  // Quick stats summary
  const overallAttendance = (() => {
    const totalClasses = attendanceSubjects.reduce((acc, s) => acc + s.total, 0);
    const totalPresent = attendanceSubjects.reduce((acc, s) => acc + s.attended, 0);
    return totalClasses > 0 ? parseFloat(((totalPresent / totalClasses) * 100).toFixed(1)) : 86.8;
  })();

  const selectedTicket = tickets.find(t => t.id === activeTicketId);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'attendance': return 'ATTENDANCE';
      case 'profile': return 'STUDENT PROFILE';
      case 'academics': return 'ACADEMICS';
      case 'timetable': return 'TIMETABLE';
      case 'fees': return 'FEE LEDGER';
      case 'helpdesk': return 'SUPPORT';
      case 'syllabus': return 'SYLLABUS';
      case 'question_papers': return 'QUESTION PAPERS';
      case 'calendar': return 'CALENDAR';
      case 'registration': return 'REGISTRATION';
      case 'library': return 'LIBRARY';
      case 'placement': return 'PLACEMENT';
      case 'downloads': return 'DOWNLOADS';
      case 'notifications': return 'NOTIFICATIONS';
      case 'step_activity': return 'STEP ACTIVITY PORTAL';
      case 'mentor': return 'MY MENTOR';
      case 'circulars': return 'CIRCULARS';
      default: return 'DASHBOARD';
    }
  };

  // Helper to extract student's name initials
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: LayoutGrid },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'attendance', name: 'Attendance', icon: CheckSquare },
    { id: 'academics', name: 'Marks & Results', icon: BarChart3 },
    { id: 'timetable', name: 'Timetable', icon: Clock },
    { id: 'fees', name: 'Fee Details', icon: CreditCard },
    { id: 'syllabus', name: 'Syllabus', icon: Book },
    { id: 'question_papers', name: 'Question Papers', icon: FileQuestion },
    { id: 'calendar', name: 'Academic Calen...', icon: Calendar },
    { id: 'registration', name: 'Course Registra...', icon: ClipboardList },
    { id: 'library', name: 'Library', icon: Library },
    { id: 'placement', name: 'Placement', icon: Briefcase },
    { id: 'step_activity', name: 'STEP Activity Po...', icon: Award },
    { id: 'mentor', name: 'My Mentor', icon: Users },
    { id: 'downloads', name: 'Downloads', icon: Download },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'circulars', name: 'Circulars', icon: Megaphone }
  ];

  const renderSidebarContent = (isMobile: boolean = false) => {
    return (
      <div className="flex flex-col h-full bg-[#0a0952] text-white overflow-hidden select-none">
        {/* Logo block */}
        <div className="p-4 flex items-center justify-between shrink-0 gap-2.5">
          <div className="bg-white px-2.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs flex-1 min-w-0">
            {/* Left circular emblem */}
            <div className="w-8 h-8 rounded-full bg-[#0d0c63] flex items-center justify-center shrink-0 border border-slate-100">
              <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
                <circle cx="50" cy="50" r="45" className="fill-none stroke-white/20" strokeWidth="2" />
                <path d="M50 20 A30 30 0 1 0 80 50 A24 24 0 1 1 50 26 Z" className="fill-white" />
                <polygon points="50,28 53,35 60,35 55,40 57,47 50,42 43,47 45,40 40,35 47,35" className="fill-indigo-300" />
                <circle cx="50" cy="50" r="15" className="fill-none stroke-white/45" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>
            {/* Right text details */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[#0d0c63] font-black text-lg tracking-tighter leading-none font-display">CK</span>
                <div className="flex flex-col">
                  <span className="text-[6px] font-black text-[#0d0c63] tracking-wide leading-none uppercase">College Of</span>
                  <span className="text-[6px] font-black text-[#0d0c63] tracking-wide leading-none uppercase">Engineering &amp;</span>
                  <span className="text-[6px] font-black text-[#0d0c63] tracking-wide leading-none uppercase">Technology</span>
                </div>
              </div>
              <div className="mt-0.5 bg-[#0d0c63] text-white text-[4.5px] font-extrabold py-0.5 px-1 rounded-xs tracking-wider text-center uppercase leading-none">
                An Autonomous Institution
              </div>
            </div>
          </div>

          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-indigo-200 hover:text-white p-1.5 shrink-0 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-indigo-950">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 py-1.5 px-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white font-black shadow-xs'
                    : 'text-indigo-200/85 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-[#24228c] text-white animate-pulse' : 'bg-[#121160]/85 text-indigo-300'
                }`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-[#121160]/55 bg-indigo-950/20 shrink-0">
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-300 hover:text-white font-bold flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="student_portal_root" className="min-h-screen bg-[#f1f5f9] flex flex-row text-slate-800 font-sans antialiased overflow-hidden h-screen w-screen">
      
      {/* PERSISTENT SIDEBAR ON DESKTOP */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0 h-full border-r border-[#12115e] overflow-hidden">
        {renderSidebarContent(false)}
      </aside>

      {/* RIGHT SIDE CONTAINER: HEADER + CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* 1. TOP HEADER */}
        <header className="bg-[#0d0c63] h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-md">
          {/* Left Side: Hamburger and College Info (Hamburger visible only <lg) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors focus:outline-none lg:hidden"
              title="Menu Drawer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:block lg:hidden">
              <h1 className="text-white font-extrabold tracking-wide text-xs uppercase leading-tight font-display">
                CK College
              </h1>
              <p className="text-[9px] tracking-widest text-indigo-300 font-bold uppercase">
                Of Engineering and Technology
              </p>
            </div>
          </div>

          {/* Centered Heading */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
            <span className="text-white font-black tracking-[0.2em] text-xs sm:text-sm uppercase font-display block">
              {getHeaderTitle()}
            </span>
          </div>

          {/* Right Side Tools: Megaphone, Bell, Student Initials avatar */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <button 
              onClick={() => setActiveTab('notifications')}
              className="text-indigo-200 hover:text-white transition-colors relative p-1 rounded-full focus:outline-none"
              title="Bulletin Announcements"
            >
              <Megaphone className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setActiveTab('notifications')}
              className="text-indigo-200 hover:text-white transition-colors relative p-1 rounded-full focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0d0c63]" title="Unread Notice"></span>
            </button>

            {/* Student Profile Dropdown Trigger */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-indigo-50 border-2 border-indigo-200 text-[#0d0c63] font-black text-xs flex items-center justify-center hover:bg-white transition-all shadow-sm focus:outline-none"
              >
                {initials}
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-xs z-50 py-1"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                      <p className="font-extrabold text-slate-800 truncate">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{student.regNo}</p>
                    </div>
                    
                    <button 
                      onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-slate-600 font-bold flex items-center gap-2 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('helpdesk'); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-slate-600 font-bold flex items-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>Academic Helpdesk</span>
                    </button>
                    <hr className="border-slate-100" />
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 2. BODY LAYOUT - MOBILE/TABLET DRAWERS */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* SIDEBAR NAVIGATION - Slidout drawer (on mobile/tablet) */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Overlay background */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="absolute inset-0 bg-slate-900 z-30"
                />
                {/* Drawer Container */}
                <motion.aside 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute top-0 bottom-0 left-0 w-72 bg-[#0d0c63] text-white flex flex-col z-40 shadow-2xl h-full overflow-hidden"
                >
                  {renderSidebarContent(true)}
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* MAIN WORKSPACE - SCROLLABLE PANEL */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc]">
            <div className="max-w-6xl mx-auto space-y-6">

              <AnimatePresence mode="wait">
              
              {/* ==========================================
                  1. OVERVIEW TAB (THE SCREENSHOT LAYOUT)
                  ========================================== */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview_pane"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  
                  {/* WELCOME GRADIENT BANNER */}
                  <div className="bg-gradient-to-r from-[#0d0c63] via-[#0f0e75] to-[#161494] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mt-20 -mr-20 blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                      {/* Circular icon in gradient welcome banner */}
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      
                      <div className="text-center md:text-left">
                        <span className="inline-block bg-white/10 text-indigo-200 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/5 mb-2">
                          Active Session • Semester IV
                        </span>
                        <h2 className="text-xl md:text-2xl font-black font-display text-white uppercase tracking-tight">
                          Welcome, {student.name}
                        </h2>
                        <p className="text-indigo-200/90 text-xs mt-1.5 font-medium leading-relaxed max-w-2xl font-mono">
                          {student.regNo} • UG • {student.department} • Batch {student.joinedYear}-{student.joinedYear + 4}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 HIGH-LEVEL METRICS CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Attendance % */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
                        <h3 className="text-xl font-extrabold text-slate-800 font-mono">{overallAttendance}%</h3>
                        <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">Satisfies 75% limit</span>
                      </div>
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Exams</p>
                        <h3 className="text-xl font-extrabold text-slate-800 font-mono">02</h3>
                        <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-0.5">Model Exam: May 15</span>
                      </div>
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Today's Classes */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Today's Classes</p>
                        <h3 className="text-xl font-extrabold text-slate-800 font-mono">06</h3>
                        <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5">3 theoretical + 3 lab hrs</span>
                      </div>
                      <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Notifications</p>
                        <h3 className="text-xl font-extrabold text-slate-800 font-mono">04</h3>
                        <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5">Anna Univ Hall ticket</span>
                      </div>
                      <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* QUICK ACCESS SECTION */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-800 font-display uppercase tracking-wider">
                      Quick Access
                    </h3>
                    
                    {/* Grid of 13 cards matching screenshot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {[
                        { id: 'profile', name: 'My Profile', color: 'bg-emerald-500', icon: User },
                        { id: 'attendance', name: 'Attendance', color: 'bg-emerald-600', icon: CalendarDays },
                        { id: 'academics', name: 'Marks & Results', color: 'bg-indigo-600', icon: BarChart3 },
                        { id: 'timetable', name: 'Timetable', color: 'bg-amber-500', icon: Clock },
                        { id: 'fees', name: 'Fee Details', color: 'bg-rose-500', icon: CreditCard },
                        { id: 'syllabus', name: 'Syllabus', color: 'bg-sky-500', icon: Book },
                        { id: 'question_papers', name: 'Question Papers', color: 'bg-blue-600', icon: FileQuestion },
                        { id: 'calendar', name: 'Academic Calendar', color: 'bg-pink-500', icon: Calendar },
                        { id: 'registration', name: 'Course Registration', color: 'bg-violet-600', icon: ClipboardList },
                        { id: 'library', name: 'Library', color: 'bg-indigo-700', icon: BookOpen },
                        { id: 'placement', name: 'Placement', color: 'bg-blue-800', icon: Briefcase },
                        { id: 'downloads', name: 'Downloads', color: 'bg-amber-600', icon: Download },
                        { id: 'notifications', name: 'Notifications', color: 'bg-amber-500', icon: Bell }
                      ].map(card => {
                        const IconComp = card.icon;
                        return (
                          <div 
                            key={card.id}
                            onClick={() => setActiveTab(card.id as TabType)}
                            className="bg-white p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <span className="font-extrabold text-[#0d0c63] text-xs uppercase tracking-wide group-hover:text-indigo-800 transition-colors">
                                {card.name}
                              </span>
                            </div>
                            
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0d0c63] transition-colors flex items-center gap-0.5">
                              <span>View</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* TWO COLUMN SUB-SECTION: DEPT CIRCULARS BOARD & ACTIVE TICKETS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Department circular bulletin */}
                    <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col max-h-[380px]">
                      <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-3">
                        <Megaphone className="w-4.5 h-4.5 text-[#0d0c63]" />
                        <h4 className="font-bold text-slate-800 font-display text-xs uppercase tracking-wider">Department Circulars</h4>
                      </div>
                      <div className="space-y-3.5 overflow-y-auto flex-1 pr-1 text-xs">
                        {announcements.slice(0, 3).map(ann => (
                          <div key={ann.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/80 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-center text-[9px] mb-1 font-mono">
                              <span className="bg-indigo-50 text-[#0d0c63] px-2 py-0.5 rounded uppercase font-bold">{ann.category}</span>
                              <span className="text-slate-400 font-medium">{ann.date}</span>
                            </div>
                            <h5 className="font-extrabold text-slate-800">{ann.title}</h5>
                            <p className="text-slate-500 font-light mt-1.5 leading-relaxed line-clamp-2">{ann.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Quick support card */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-1">
                          <MessageSquare className="w-4.5 h-4.5 text-[#0d0c63]" />
                          <h4 className="font-bold text-slate-800 font-display text-xs uppercase tracking-wider">Campus Support Helpdesk</h4>
                        </div>
                        <p className="text-slate-500 text-xs font-light leading-relaxed">
                          Need help with hostel occupancy, exam schedules, tuition payment receipts, or Wi-Fi login issues inside block premises? Our office is here.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Pending Desk Queries</p>
                          <p className="text-sm font-extrabold text-slate-700 mt-0.5 font-mono">{tickets.filter(t => t.status !== 'Resolved').length} Active Tickets</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('helpdesk')}
                          className="bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-2 px-5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
                        >
                          Open Desk
                        </button>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ==========================================
                  2. DETAILED TAB SUB-VIEWS (USING MODULAR COMPONENTS)
                  ========================================== */}
              {activeTab === 'profile' && (
                <ProfileView student={student} onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'fees' && (
                <FeesView student={student} onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'syllabus' && (
                <SyllabusView onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'question_papers' && (
                <QPapersView onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'calendar' && (
                <CalendarView onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'registration' && (
                <RegistrationView student={student} onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'library' && (
                <LibraryView onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'placement' && (
                <PlacementView student={student} onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'downloads' && (
                <DownloadsView student={student} onBack={() => setActiveTab('overview')} />
              )}

              {/* ==========================================
                  3. ATTENDANCE COMPLIANCE WITH CALCULATOR
                  ========================================== */}
              {activeTab === 'attendance' && (
                <motion.div key="attendance_tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-xs">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
                      &larr; Back to Dashboard
                    </button>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">CKCET Attendance Registry</span>
                  </div>

                  {/* 5 metrics cards in a row */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Subjects</p>
                      <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">{attendanceSubjects.length}</h4>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</p>
                      <h4 className="text-2xl font-black text-[#0d0c63] font-display mt-2 font-mono">{overallAttendance}%</h4>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Classes</p>
                      <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">
                        {attendanceSubjects.reduce((acc, s) => acc + s.total, 0)}
                      </h4>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attended</p>
                      <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">
                        {attendanceSubjects.reduce((acc, s) => acc + s.attended, 0)}
                      </h4>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OD</p>
                      <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">0</h4>
                    </div>
                  </div>

                  {/* Subject-wise Attendance */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-[#0d0c63] p-5 text-white">
                      <h3 className="text-base font-extrabold font-display">Subject-wise Attendance</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/85 border-b border-slate-100 text-slate-400 font-bold tracking-wider text-[10px]">
                            <th className="py-4 px-6 uppercase">Subject</th>
                            <th className="py-4 px-4 uppercase">Faculty</th>
                            <th className="py-4 px-4 uppercase text-center">Total</th>
                            <th className="py-4 px-4 uppercase text-center">Attended</th>
                            <th className="py-4 px-4 uppercase text-center text-indigo-600">OD</th>
                            <th className="py-4 px-4 uppercase text-center">%</th>
                            <th className="py-4 px-6 uppercase text-center text-indigo-600">OD%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {attendanceSubjects.map((sub, idx) => {
                            const isGreen = sub.percentage >= 85;
                            return (
                              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-extrabold text-slate-800 text-[13px]">{sub.code}</div>
                                  <div className="text-[10px] text-slate-400 uppercase mt-0.5 tracking-wider font-normal">{sub.name}</div>
                                </td>
                                <td className="py-4 px-4 text-slate-600 font-medium">
                                  {sub.faculty}
                                </td>
                                <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                                  {sub.total}
                                </td>
                                <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                                  {sub.attended}
                                </td>
                                <td className="py-4 px-4 text-center font-mono font-bold text-indigo-600">
                                  {sub.od}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3 justify-center">
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                      <div 
                                        className={`h-full rounded-full ${isGreen ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                        style={{ width: `${sub.percentage}%` }}
                                      />
                                    </div>
                                    <span className={`font-mono font-extrabold text-right w-12 ${isGreen ? 'text-emerald-500' : 'text-amber-500'}`}>
                                      {sub.percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-center font-mono font-bold text-indigo-600">
                                  {sub.odPercentage.toFixed(1)}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Date-wise Attendance */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-[#0d0c63] p-5 text-white">
                      <h3 className="text-base font-extrabold font-display">Date-wise Attendance</h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {attendanceDates.map((dt, idx) => {
                        const isExpanded = expandedDateIndex === idx;
                        const is100 = dt.percentage === 100;
                        const is0 = dt.percentage === 0;

                        const getPeriodsForDate = (dateStr: string) => {
                          if (livePeriodRecords && livePeriodRecords.length > 0) {
                            try {
                              const d = new Date(dateStr);
                              const year = d.getFullYear();
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const day = String(d.getDate()).padStart(2, '0');
                              const ymd = `${year}-${month}-${day}`;
                              
                              const dayPeriods = livePeriodRecords.filter((p: any) => p.date === ymd);
                              if (dayPeriods.length > 0) {
                                const timings: Record<number, string> = {
                                  1: '09:15 AM - 09:35 AM',
                                  2: '09:35 AM - 10:25 AM',
                                  3: '10:25 AM - 11:15 AM',
                                  4: '11:30 AM - 12:20 PM',
                                  5: '12:20 PM - 01:10 PM',
                                  6: '01:55 PM - 02:45 PM',
                                  7: '02:45 PM - 03:35 PM',
                                  8: '03:50 PM - 04:30 PM'
                                };
                                return dayPeriods.map((p: any) => ({
                                  period: p.period,
                                  subject: p.subject_code,
                                  name: p.subject_name,
                                  status: p.status === 'present' ? 'Present' : 'Absent',
                                  time: timings[p.period] || '—'
                                })).sort((a: any, b: any) => a.period - b.period);
                              }
                            } catch (err) {
                              console.error("Failed to parse period date:", err);
                            }
                          }
                          
                          if (dateStr === '4 Aug 2026') {
                            return [
                              { period: 1, subject: 'CB3491', name: 'Cryptography & Cyber Security', status: 'Present', time: '09:15 AM - 09:35 AM' }
                            ];
                          }
                          if (dateStr === '20 Jul 2026' || dateStr === '11 Jul 2026') {
                            return [
                              { period: 1, subject: 'WL005', name: 'Win@Life 05', status: 'Absent', time: '09:15 AM - 09:35 AM' },
                              { period: 2, subject: 'CCS341', name: 'Data Warehousing', status: 'Absent', time: '09:35 AM - 10:25 AM' },
                              { period: 3, subject: 'CB3491', name: 'Cryptography & Cyber Security', status: 'Absent', time: '10:25 AM - 11:15 AM' },
                              { period: 4, subject: 'CS3501', name: 'Compiler Design', status: 'Absent', time: '11:30 AM - 12:20 PM' },
                              { period: 5, subject: 'CS3591', name: 'Computer Networks', status: 'Absent', time: '12:20 PM - 01:10 PM' },
                              { period: 6, subject: 'CCS341', name: 'Data Warehousing', status: 'Absent', time: '01:55 PM - 02:45 PM' },
                              { period: 7, subject: 'CCS341', name: 'Data Warehousing', status: 'Absent', time: '02:45 PM - 03:35 PM' },
                              { period: 8, subject: 'TPP005', name: 'Training & Placement Programing 05', status: 'Absent', time: '03:50 PM - 04:30 PM' }
                            ];
                          }
                          return [
                            { period: 1, subject: 'WL005', name: 'Win@Life 05', status: 'Present', time: '09:15 AM - 09:35 AM' },
                            { period: 2, subject: 'CCS341', name: 'Data Warehousing', status: 'Present', time: '09:35 AM - 10:25 AM' },
                            { period: 3, subject: 'CB3491', name: 'Cryptography & Cyber Security', status: 'Present', time: '10:25 AM - 11:15 AM' },
                            { period: 4, subject: 'CS3501', name: 'Compiler Design', status: 'Present', time: '11:30 AM - 12:20 PM' },
                            { period: 5, subject: 'CS3591', name: 'Computer Networks', status: 'Present', time: '12:20 PM - 01:10 PM' }
                          ];
                        };

                        return (
                          <div key={idx} className="transition-all">
                            {/* Accordion Header */}
                            <button
                              onClick={() => setExpandedDateIndex(isExpanded ? null : idx)}
                              className="w-full py-4 px-6 flex items-center justify-between hover:bg-slate-50/40 transition-colors text-left focus:outline-none"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-extrabold text-slate-800 text-[13px]">{dt.date}</span>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                                  is100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/60' :
                                  is0 ? 'bg-rose-50 text-rose-600 border border-rose-100/60' :
                                  'bg-amber-50 text-amber-600 border border-amber-100/60'
                                }}`}>
                                  {dt.periods} - {dt.percentage}%
                                </span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} />
                            </button>

                            {/* Accordion Body */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden bg-slate-50/50 px-6 pb-4 border-t border-slate-100/60"
                                >
                                  <div className="pt-3 space-y-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Period Breakdown</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {getPeriodsForDate(dt.date).map((p, pIdx) => (
                                        <div key={pIdx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex items-center justify-between">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="font-bold text-slate-700 text-xs">Period {p.period}</span>
                                              <span className="text-[10px] text-slate-400 font-mono">{p.subject}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{p.name}</div>
                                            <div className="text-[9px] text-slate-400 font-light mt-0.5">{p.time}</div>
                                          </div>
                                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            p.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/60' : 'bg-rose-50 text-rose-600 border border-rose-100/60'
                                          }`}>
                                            {p.status}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==========================================
                  4. INTERNAL MARKS & EXAMINATION RESULTS
                  ========================================== */}
              {activeTab === 'academics' && (
                <motion.div key="academics_tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-xs">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
                      &larr; Back to Dashboard
                    </button>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Academic Session: 2025-26</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Session</p>
                      <h4 className="text-xl font-black text-[#0d0c63] font-display mt-1">Semester IV</h4>
                      <p className="text-[10px] text-slate-400 mt-1">April - June 2026 Session</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Internal Assessment Avg</p>
                      <h4 className="text-xl font-black text-slate-800 font-display mt-1">84.2%</h4>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1">Exceeds department boundaries</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pending Arrears</p>
                      <h4 className="text-xl font-black text-slate-800 font-display mt-1">0</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Academic Standing: Outstanding</p>
                    </div>
                  </div>

                  {/* Marksheet table */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 font-display text-sm">Internal Assessment Marks Ledger</h4>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Info className="w-4 h-4 text-indigo-400" />
                        <span>Weightages: IA1 (20) • IA2 (20) • Model (50)</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/85 border-b border-slate-100 text-slate-500 font-bold">
                            <th className="py-3 px-5">Curriculum Course Details</th>
                            <th className="py-3 px-3 text-center">IA-1 (20)</th>
                            <th className="py-3 px-3 text-center">IA-2 (20)</th>
                            <th className="py-3 px-3 text-center">Model (50)</th>
                            <th className="py-3 px-3 text-center">Total (50)</th>
                            <th className="py-3 px-5 text-center">Current Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {courses.map(c => (
                            <tr key={c.code} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3 px-5">
                                <p className="font-bold text-slate-800">{c.name}</p>
                                <span className="text-[9px] text-slate-400 font-mono tracking-wider">{c.code} • {c.faculty}</span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{c.ia1Marks ?? '--'}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{c.ia2Marks ?? '--'}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{c.modelMarks ?? '--'}</td>
                              <td className="py-3 px-3 text-center font-mono font-extrabold text-[#0d0c63]">
                                {c.internalTotal ?? '--'}
                              </td>
                              <td className="py-3 px-5 text-center">
                                <span className={`inline-block font-black font-mono text-[10px] px-2.5 py-0.5 rounded-full ${
                                  c.currentGrade === 'O' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  c.currentGrade === 'A+' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {c.currentGrade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==========================================
                  5. TIMETABLE
                  ========================================== */}
              {activeTab === 'timetable' && (
                <motion.div key="timetable_tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-xs">
                  {/* Back button and title */}
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
                      &larr; Back to Dashboard
                    </button>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Class Hours Scheduler</span>
                  </div>

                  {/* Student & Date Header Box */}
                  <div className="bg-gradient-to-r from-[#0d0c63] to-[#141270] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm tracking-wide uppercase font-display">{student.name}</h3>
                      <p className="text-[11px] text-indigo-200 mt-1 font-medium">
                        24 Batch (2024-28) &middot; B.E. Computer Science and Engineering
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-950/40 py-2 px-3.5 rounded-xl border border-indigo-500/20 text-xs font-bold font-mono">
                      <CalendarDays className="w-4 h-4 text-indigo-300" />
                      <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0d0c63] p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-white">
                      <div className="bg-white/10 p-2.5 rounded-xl">
                        <BookOpen className="w-5 h-5 text-indigo-200" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider">TEMPLATE</p>
                        <h4 className="text-xs font-black mt-0.5">2026 II &amp; III Yr</h4>
                      </div>
                    </div>

                    <div className="bg-[#4f46e5] p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-white">
                      <div className="bg-white/10 p-2.5 rounded-xl">
                        <Calendar className="w-5 h-5 text-indigo-100" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-indigo-100 uppercase tracking-wider">WORKING DAYS</p>
                        <h4 className="text-xs font-black mt-0.5">6 Days</h4>
                      </div>
                    </div>

                    <div className="bg-[#009b9e] p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-white">
                      <div className="bg-white/10 p-2.5 rounded-xl">
                        <Clock className="w-5 h-5 text-teal-100" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-teal-100 uppercase tracking-wider">PERIODS / DAY</p>
                        <h4 className="text-xs font-black mt-0.5">8 Periods</h4>
                      </div>
                    </div>

                    <div className="bg-[#f05c00] p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 text-white">
                      <div className="bg-white/10 p-2.5 rounded-xl">
                        <CalendarDays className="w-5 h-5 text-orange-100" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-orange-100 uppercase tracking-wider">TIMING</p>
                        <h4 className="text-xs font-black mt-0.5">9:15 AM - 4:30 PM</h4>
                      </div>
                    </div>
                  </div>

                  {/* Main Weekly Timetable Grid Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-[#0d0c63] text-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-200" />
                        <h4 className="font-extrabold text-xs tracking-wider uppercase">Weekly Schedule</h4>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-lg font-mono text-indigo-200">
                        Interactive Matrix View
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[9px] uppercase tracking-wider font-extrabold">
                            <th className="py-4 px-4 min-w-[120px] border-r border-slate-100">DAY</th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P1</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">9:15 AM - 9:35 AM</div>
                            </th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P2</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">9:35 AM - 10:25 AM</div>
                            </th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P3</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">10:25 AM - 11:15 AM</div>
                            </th>
                            <th className="py-4 px-2 text-center bg-amber-50/50 text-amber-800 border-r border-slate-100 min-w-[60px]">
                              <div>BREAK</div>
                              <div className="text-[8px] font-mono font-semibold text-amber-500 mt-0.5">15 min</div>
                            </th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P4</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">11:30 AM - 12:20 PM</div>
                            </th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P5</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">12:20 PM - 1:10 PM</div>
                            </th>
                            <th className="py-4 px-2 text-center bg-emerald-50/50 text-emerald-800 border-r border-slate-100 min-w-[70px]">
                              <div>LUNCH</div>
                              <div className="text-[8px] font-mono font-semibold text-emerald-500 mt-0.5">45 min</div>
                            </th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P6</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">1:55 PM - 2:45 PM</div>
                            </th>
                            <th className="py-4 px-3 text-center border-r border-slate-100">
                              <div>P7</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">2:45 PM - 3:35 PM</div>
                            </th>
                            <th className="py-4 px-2 text-center bg-amber-50/50 text-amber-800 border-r border-slate-100 min-w-[60px]">
                              <div>BREAK</div>
                              <div className="text-[8px] font-mono font-semibold text-amber-500 mt-0.5">15 min</div>
                            </th>
                            <th className="py-4 px-3 text-center">
                              <div>P8</div>
                              <div className="text-[8px] font-mono font-medium lowercase text-slate-400 mt-0.5">3:50 PM - 4:30 PM</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {MOCK_TIMETABLE.map((dayData, dIdx) => {
                            const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                            const isCurrentDay = currentDayName === dayData.day;
                            return (
                              <tr 
                                key={dayData.day} 
                                className={`transition-colors hover:bg-slate-50/30 ${isCurrentDay ? 'bg-indigo-50/30 font-semibold' : ''}`}
                              >
                                <td className="py-4 px-4 font-bold text-slate-800 border-r border-slate-100 flex items-center justify-between gap-1.5 min-h-[64px]">
                                  <span>{dayData.day}</span>
                                  {isCurrentDay && (
                                    <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-extrabold uppercase animate-pulse">
                                      TODAY
                                    </span>
                                  )}
                                </td>
                                
                                {/* Period 1 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[0])}
                                </td>

                                {/* Period 2 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[1])}
                                </td>

                                {/* Period 3 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[2])}
                                </td>

                                {/* BREAK 1 */}
                                <td className="p-2 text-center bg-amber-50/20 border-r border-slate-100">
                                  <span className="text-[9px] font-bold text-amber-600 tracking-wider">BREAK</span>
                                </td>

                                {/* Period 4 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[3])}
                                </td>

                                {/* Period 5 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[4])}
                                </td>

                                {/* LUNCH */}
                                <td className="p-2 text-center bg-emerald-50/20 border-r border-slate-100">
                                  <span className="text-[9px] font-black text-emerald-600 tracking-wider">LUNCH</span>
                                </td>

                                {/* Period 6 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[5])}
                                </td>

                                {/* Period 7 */}
                                <td className="p-2 border-r border-slate-100 text-center">
                                  {renderPeriodCell(dayData.periods[6])}
                                </td>

                                {/* BREAK 2 */}
                                <td className="p-2 text-center bg-amber-50/20 border-r border-slate-100">
                                  <span className="text-[9px] font-bold text-amber-600 tracking-wider">BREAK</span>
                                </td>

                                {/* Period 8 */}
                                <td className="p-2 text-center">
                                  {renderPeriodCell(dayData.periods[7])}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Interactive Details Modal when a Period is clicked */}
                  {selectedPeriodModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-sm w-full overflow-hidden text-xs"
                      >
                        <div className="bg-[#0d0c63] p-4 text-white flex justify-between items-center">
                          <span className="font-extrabold uppercase tracking-wider">Class Session Details</span>
                          <button 
                            onClick={() => setSelectedPeriodModal(null)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 space-y-4">
                          <div>
                            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {selectedPeriodModal.code}
                            </span>
                            <h4 className="text-sm font-black text-slate-800 mt-1.5 leading-snug">{selectedPeriodModal.subject}</h4>
                          </div>

                          <div className="space-y-2.5 border-t border-b border-slate-100 py-3.5">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              <div>
                                <p className="text-[9px] font-bold uppercase text-slate-400">Class Hours Timing</p>
                                <p className="font-semibold text-slate-700 mt-0.5">{selectedPeriodModal.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400 shrink-0" />
                              <div>
                                <p className="text-[9px] font-bold uppercase text-slate-400">Designated Instructor</p>
                                <p className="font-semibold text-slate-700 mt-0.5">{selectedPeriodModal.faculty}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                              <div>
                                <p className="text-[9px] font-bold uppercase text-slate-400">Class Room Location</p>
                                <p className="font-semibold text-slate-700 mt-0.5">{selectedPeriodModal.room}</p>
                              </div>
                            </div>
                          </div>

                          {/* Linked Course Attendance Insight */}
                          {(() => {
                            const courseAttendance = ATTENDANCE_SUBJECTS.find(
                              s => s.code.toUpperCase().trim() === selectedPeriodModal.code.toUpperCase().trim()
                            );
                            if (courseAttendance) {
                              return (
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-500">Attendance Tracker</span>
                                    <span className={`font-black ${courseAttendance.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {courseAttendance.percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${courseAttendance.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                      style={{ width: `${courseAttendance.percentage}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-[9px] text-slate-400 mt-2">
                                    Attended {courseAttendance.attended} of {courseAttendance.total} overall periods.
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          <button
                            onClick={() => setSelectedPeriodModal(null)}
                            className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-center uppercase tracking-wider text-[10px]"
                          >
                            Close Details
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Desktop view tip */}
                  <p className="text-center text-[10px] text-slate-400 italic">
                    Tip: Click any subject cell to view comprehensive session details, faculty assignments, and linked attendance tracker.
                  </p>
                </motion.div>
              )}

              {/* ==========================================
                  6. NOTIFICATIONS ARCHIVE LISTING
                  ========================================== */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications_tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 text-xs">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveTab('overview')} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
                      &larr; Back to Dashboard
                    </button>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">College Bulletins Board</span>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-800 font-display text-sm">Circular Circular Announcements</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Filter and review official circular notifications released by the academic office.</p>
                    </div>

                    <div className="space-y-4">
                      {announcements.map(ann => (
                        <div key={ann.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-colors space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                              ann.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {ann.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">{ann.date}</span>
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{ann.title}</h4>
                          <p className="text-slate-500 font-light leading-relaxed">{ann.content}</p>
                          <p className="text-[10px] text-slate-400 font-mono pt-1 italic">Released by: {ann.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ==========================================
                  7. HELPDESK & SUPPORT TICKETS SYSTEM
                  ========================================== */}
              {activeTab === 'helpdesk' && (
                <motion.div key="helpdesk_tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  
                  {/* Left Column: List of existing tickets */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px]">
                      
                      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                        <h4 className="font-bold text-slate-800 font-display text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-4.5 h-4.5 text-[#0d0c63]" />
                          <span>Active Queries</span>
                        </h4>
                        <button
                          onClick={() => setActiveTicketId(null)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-[#0d0c63] font-bold py-1 px-2.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>New Ticket</span>
                        </button>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {tickets.length === 0 ? (
                          <div className="text-center py-12 text-slate-400">
                            <p>No active tickets found.</p>
                          </div>
                        ) : (
                          tickets.map(tkt => (
                            <button
                              key={tkt.id}
                              onClick={() => setActiveTicketId(tkt.id)}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-2 block ${
                                activeTicketId === tkt.id 
                                  ? 'bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-50' 
                                  : 'bg-slate-50/20 border-slate-100 hover:bg-slate-50/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-400 font-bold">{tkt.id}</span>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                  tkt.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  tkt.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                }`}>
                                  {tkt.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 line-clamp-1 leading-snug">{tkt.subject}</h4>
                              <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1">
                                <span className="capitalize">{tkt.category} Support</span>
                                <span className="font-mono">{tkt.date}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Chat view or intake form */}
                  <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                      {selectedTicket ? (
                        <motion.div
                          key="chat_pane"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden"
                        >
                          <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-slate-400">{selectedTicket.id}</span>
                                <span className="text-[8px] bg-amber-50 text-amber-700 font-black uppercase px-2 py-0.5 rounded-full">
                                  {selectedTicket.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 mt-1">{selectedTicket.subject}</h4>
                            </div>
                            <button
                              onClick={() => {
                                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'Resolved' } : t));
                              }}
                              disabled={selectedTicket.status === 'Resolved'}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white font-bold py-1 px-3 rounded-lg text-[9px] uppercase tracking-wider transition-all"
                            >
                              Mark Solved
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/10">
                            <div className="flex justify-end">
                              <div className="bg-[#0d0c63] text-white p-3.5 rounded-2xl rounded-tr-none max-w-sm">
                                <span className="text-[8px] text-indigo-200 uppercase font-black">Student Query</span>
                                <p className="font-light mt-1">{selectedTicket.message}</p>
                                <p className="text-[8px] text-indigo-300 font-mono text-right mt-1.5">{selectedTicket.date}</p>
                              </div>
                            </div>

                            {selectedTicket.replies.map(rep => (
                              <div key={rep.id} className={`flex ${rep.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3.5 rounded-2xl max-w-sm ${
                                  rep.sender === 'student' 
                                    ? 'bg-[#0d0c63] text-white rounded-tr-none' 
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                                }`}>
                                  <span className={`text-[8px] uppercase font-black ${rep.sender === 'student' ? 'text-indigo-200' : 'text-[#0d0c63]'}`}>
                                    {rep.sender === 'student' ? 'Student' : 'College Desk Officer'}
                                  </span>
                                  <p className="font-light mt-1">{rep.message}</p>
                                  <p className="text-[8px] text-slate-400 font-mono text-right mt-1.5">{rep.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={(e) => handlePostReply(e, selectedTicket.id)} className="p-3 border-t border-slate-100 flex gap-2 items-center bg-white">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a message reply to administrative officer..."
                              className="flex-1 bg-slate-50 text-slate-800 placeholder-slate-400 font-medium py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
                              required
                            />
                            <button type="submit" className="p-2.5 bg-[#0d0c63] text-white rounded-xl shadow-sm active:scale-95">
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="form_pane"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px] justify-between"
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-slate-800 font-display text-sm">Submit Query Ticket</h4>
                              <p className="text-xs text-slate-400 mt-0.5">File official queries directly to college administrative cells.</p>
                            </div>

                            <div className="space-y-3.5">
                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subject</label>
                                <input
                                  type="text"
                                  value={ticketSubject}
                                  onChange={(e) => setTicketSubject(e.target.value)}
                                  placeholder="e.g. Error in Tuition Fee receipts synchronization"
                                  className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 font-medium py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                                <select
                                  value={ticketCategory}
                                  onChange={(e) => setTicketCategory(e.target.value as SupportTicket['category'])}
                                  className="w-full bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs cursor-pointer"
                                >
                                  <option value="academic">Academic &amp; Marks Desk</option>
                                  <option value="exams">Anna University Examinations</option>
                                  <option value="fees">Fees &amp; Receipts Audit</option>
                                  <option value="hostel">Hostel &amp; Mess Accommodation</option>
                                  <option value="it-support">IT Lab &amp; Wi-Fi Credentials</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Enquiry Details</label>
                                <textarea
                                  rows={4}
                                  value={ticketMessage}
                                  onChange={(e) => setTicketMessage(e.target.value)}
                                  placeholder="Provide comprehensive details of your inquiry so that administrative desks can look up records."
                                  className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 font-light py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs resize-none"
                                  required
                                ></textarea>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleCreateTicket}
                            className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md uppercase tracking-wider"
                          >
                            Submit Official Ticket
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {activeTab === 'step_activity' && (
                <StepActivityView onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'mentor' && (
                <MentorView onBack={() => setActiveTab('overview')} />
              )}

              {activeTab === 'circulars' && (
                <CircularsView onBack={() => setActiveTab('overview')} />
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>

    </div>
  );
}
