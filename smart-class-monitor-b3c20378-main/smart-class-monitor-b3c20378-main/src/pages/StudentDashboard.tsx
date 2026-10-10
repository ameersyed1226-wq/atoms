import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getStudentById,
  getStudents,
  getTodayAttendance,
  type Student,
  getLeaveRequestsByStudent,
  addLeaveRequest,
  type LeaveRequest,
  getSubjectWiseAttendance,
  getTodayPeriodAttendance,
  type SubjectAttendanceStat,
  type PeriodAttendanceRecord,
} from "@/lib/store";
import {
  getTodaySchedule,
  getDaySchedule,
  getCurrentPeriod,
  getCurrentDayName,
  formatTimeDisplay,
  isPeriodOver,
  DAY_NAMES,
  PERIOD_TIMINGS,
  SUBJECTS,
  TIMETABLE,
  type DayName,
  type CurrentPeriodInfo,
} from "@/lib/timetable";
import {
  GraduationCap, TrendingUp, Calendar, LogOut, AlertTriangle, FileText,
  Send, CheckCircle, XCircle, Clock, BookOpen, BarChart3, Table2, Users
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";

type Tab = "overview" | "subjects" | "timetable" | "leaves" | "mentor";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subjectStats, setSubjectStats] = useState<SubjectAttendanceStat[]>([]);
  const [todayPeriods, setTodayPeriods] = useState<PeriodAttendanceRecord[]>([]);
  const [currentPeriodInfo, setCurrentPeriodInfo] = useState<CurrentPeriodInfo | null>(null);

  // Mentee names for Mentor tab (4 students)
  const MENTEE_NAMES = ["SYED AMEER R", "SATHYA PRIYA M", "LOGAJANANI R", "THARUN G"];
  const [mentees, setMentees] = useState<Student[]>([]);
  const [menteeTodayStatus, setMenteeTodayStatus] = useState<Record<string, { status: string; method: string }>>({});

  const loadLeaveRequests = (studentId: string) => {
    const data = getLeaveRequestsByStudent(studentId);
    setLeaveRequests(data);
  };

  // Refresh attendance data (called periodically + on focus)
  const refreshAttendanceData = (userId: string) => {
    const freshStudent = getStudentById(userId);
    if (freshStudent) {
      setStudent(freshStudent);
      setSubjectStats(getSubjectWiseAttendance(freshStudent.id));
      setTodayPeriods(getTodayPeriodAttendance(freshStudent.id));
      setCurrentPeriodInfo(getCurrentPeriod());
    }

    // Refresh mentee data for Mentor tab
    const allStudents = getStudents();
    const menteeStudents = allStudents.filter(s => MENTEE_NAMES.includes(s.name));
    setMentees(menteeStudents);

    const todayRecords = getTodayAttendance();
    const statusMap: Record<string, { status: string; method: string }> = {};
    menteeStudents.forEach(m => {
      const record = todayRecords.find(r => r.student_id === m.id);
      statusMap[m.id] = record
        ? { status: record.status, method: record.method }
        : { status: "not_marked", method: "" };
    });
    setMenteeTodayStatus(statusMap);
  };

  useEffect(() => {
    const role = localStorage.getItem("nc_role");
    const userId = localStorage.getItem("nc_user");
    if (role !== "student" || !userId) { navigate("/"); return; }

    const s = getStudentById(userId);
    if (s) {
      setStudent(s);
      loadLeaveRequests(s.id);
      setSubjectStats(getSubjectWiseAttendance(s.id));
      setTodayPeriods(getTodayPeriodAttendance(s.id));
      setCurrentPeriodInfo(getCurrentPeriod());
    } else {
      navigate("/");
      return;
    }
    setLoading(false);

    // Auto-refresh attendance every 3 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      refreshAttendanceData(userId);
    }, 3000);

    // Also refresh when window gets focus (user switches back from face scan)
    const handleFocus = () => refreshAttendanceData(userId);
    window.addEventListener("focus", handleFocus);

    // Listen for localStorage changes (when face attendance writes data)
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.includes("attendance") || e.key?.includes("period") || e.key?.includes("students")) {
        refreshAttendanceData(userId);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("nc_role");
    localStorage.removeItem("nc_user");
    navigate("/");
  };

  const handleSubmitLeave = () => {
    if (!leaveReason || !leaveDate || !student) {
      toast({ title: "Fill reason and date", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      addLeaveRequest(student.id, leaveReason, leaveDate, leaveEndDate || null);
      toast({ title: "✅ Leave request submitted!" });
      setLeaveReason("");
      setLeaveDate("");
      setLeaveEndDate("");
      setShowLeaveForm(false);
      loadLeaveRequests(student.id);
    } catch (e: any) {
      toast({ title: "Failed to submit", description: e.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );

  if (!student) return null;

  const chartData = [
    { name: "Present", value: student.present_days, color: "hsl(142, 71%, 45%)" },
    { name: "Absent", value: student.total_days - student.present_days, color: "hsl(0, 72%, 51%)" },
  ];

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === "rejected") return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-warning" />;
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/20 text-warning",
      approved: "bg-success/20 text-success",
      rejected: "bg-destructive/20 text-destructive",
    };
    return (
      <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>
        {statusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const todaySchedule = getTodaySchedule();
  const dayName = getCurrentDayName();

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "subjects", label: "Subject Attendance", icon: BarChart3 },
    { id: "timetable", label: "Timetable", icon: Table2 },
    { id: "leaves", label: "Leave Requests", icon: FileText },
    { id: "mentor", label: "Mentor / Mentees", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="icon-box-cyan h-10 w-10"><GraduationCap className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">NetCampus</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Profile */}
        <div className="glass-card flex items-center gap-5 p-6 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-2xl font-bold text-primary overflow-hidden shrink-0">
            {student.face_image ? (
              <img src={student.face_image} className="h-16 w-16 object-cover" alt={student.name} />
            ) : student.name[0]}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.email}</p>
            <p className="text-xs text-muted-foreground">{student.department} · {student.year} · {student.section}</p>
          </div>
          {/* Current Period Quick View */}
          {currentPeriodInfo && (
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-primary">P{currentPeriodInfo.period} · {currentPeriodInfo.subject.short}</p>
                <p className="text-xs text-muted-foreground">{formatTimeDisplay(currentPeriodInfo.timing.start)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto animate-fade-in">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {tab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-primary" /> Attendance</div>
                <p className={`font-display text-3xl font-bold ${student.attendance_percentage < 75 ? 'text-destructive' : 'text-foreground'}`}>{student.attendance_percentage}%</p>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> Present Days</div>
                <p className="font-display text-3xl font-bold text-foreground">{student.present_days} / {student.total_days}</p>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4 text-destructive" /> Absent Days</div>
                <p className="font-display text-3xl font-bold text-foreground">{student.total_days - student.present_days}</p>
              </div>
            </div>

            {/* Low Attendance Warning */}
            {student.attendance_percentage < 75 && (
              <div className="danger-banner flex items-center gap-3 rounded-xl p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <p className="text-sm text-foreground">⚠️ Your attendance is <strong>{student.attendance_percentage}%</strong> — below 75%. Attend classes regularly to avoid debarment.</p>
              </div>
            )}

            {/* Today's Periods — Auto-refreshes every 3s */}
            {dayName && todaySchedule.length > 0 && (
              <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.25s" }}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-lg font-bold text-foreground">Today's Periods — {dayName}</h3>
                  </div>
                  {/* Attendance Summary */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const attendedCount = todaySchedule.filter(e =>
                        todayPeriods.find(p => p.period === e.period && p.status === "present")
                      ).length;
                      const totalPeriods = todaySchedule.filter(e => e.subject.type !== "other").length;
                      return (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          attendedCount === 0 ? "bg-destructive/20 text-destructive" :
                          attendedCount >= totalPeriods ? "bg-success/20 text-success" :
                          "bg-warning/20 text-warning"
                        }`}>
                          ✅ {attendedCount} / {totalPeriods} Periods
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  {todaySchedule.map((entry) => {
                    const isActive = currentPeriodInfo?.period === entry.period;
                    const isDone = isPeriodOver(entry.period);
                    const attended = todayPeriods.find(p => p.period === entry.period && p.status === "present");

                    return (
                      <div
                        key={entry.period}
                        className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all ${
                          isActive
                            ? "bg-primary/15 border-2 border-primary/40 shadow-lg shadow-primary/5"
                            : attended
                              ? "bg-success/8 border border-success/25"
                              : isDone
                                ? "bg-destructive/5 border border-destructive/15"
                                : "bg-secondary/40 border border-transparent"
                        }`}
                      >
                        {/* Period Number Badge */}
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shrink-0 ${
                          isActive
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : attended
                              ? "bg-success text-white"
                              : isDone
                                ? "bg-destructive/20 text-destructive"
                                : "bg-secondary text-muted-foreground"
                        }`}>
                          {attended ? "✓" : isDone ? "✗" : `P${entry.period}`}
                        </div>

                        {/* Subject Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                              {entry.subject.short}
                            </p>
                            <span className="text-xs text-muted-foreground">—</span>
                            <p className="text-xs text-muted-foreground truncate">
                              {entry.subject.name}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatTimeDisplay(entry.timing.start)} – {formatTimeDisplay(entry.timing.end)}
                            {entry.subject.faculty !== "-" && ` · ${entry.subject.faculty}`}
                          </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2 shrink-0">
                          {entry.subject.type === "lab" && (
                            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-400">LAB</span>
                          )}
                          {isActive && (
                            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary animate-pulse">NOW</span>
                          )}
                          {attended && (
                            <span className="flex items-center gap-1 rounded-full bg-success/20 px-3 py-1 text-xs font-bold text-success">
                              <CheckCircle className="h-3 w-3" />
                              {attended.method === "face" ? "Face ✅" : "Manual ✅"}
                            </span>
                          )}
                          {isDone && !attended && entry.subject.type !== "other" && (
                            <span className="flex items-center gap-1 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
                              <XCircle className="h-3 w-3" /> Absent
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attendance Chart */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Attendance Overview</h3>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-muted-foreground">Present:</span>
                    <strong className="text-foreground">{student.present_days} days</strong>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">Absent:</span>
                    <strong className="text-foreground">{student.total_days - student.present_days} days</strong>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Percentage:</span>
                    <strong className={student.attendance_percentage < 75 ? 'text-destructive' : 'text-foreground'}>{student.attendance_percentage}%</strong>
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                    Face: {student.face_registered ? <span className="text-success">✅ Registered</span> : <span className="text-warning">Not registered</span>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ SUBJECT ATTENDANCE TAB ═══ */}
        {tab === "subjects" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">Subject-wise Attendance</h3>
            </div>

            {subjectStats.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No attendance records yet. Attendance will appear here after face recognition scans.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {subjectStats.map((stat) => (
                  <div
                    key={stat.subject_code}
                    className={`glass-card p-5 transition-all hover:border-primary/30 ${
                      stat.percentage < 75 ? "border-destructive/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                            stat.type === "lab" ? "bg-violet-500/20 text-violet-400" : "bg-primary/15 text-primary"
                          }`}>
                            {stat.short}
                          </span>
                          <span className="text-xs text-muted-foreground">{stat.subject_code}</span>
                        </div>
                        <p className="font-display text-sm font-semibold text-foreground">{stat.subject_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">👨‍🏫 {stat.faculty}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-display text-2xl font-bold ${
                          stat.percentage < 75 ? "text-destructive" : stat.percentage >= 90 ? "text-success" : "text-foreground"
                        }`}>
                          {stat.percentage}%
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.present_periods}/{stat.total_periods} hrs</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          stat.percentage < 75
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : stat.percentage >= 90
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500"
                        }`}
                        style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                      />
                    </div>

                    {stat.percentage < 75 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" /> Below 75% threshold
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TIMETABLE TAB ═══ */}
        {tab === "timetable" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Table2 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">Weekly Timetable</h3>
              <span className="text-xs text-muted-foreground">III Year CSE · B-207</span>
            </div>

            {/* Desktop Timetable */}
            <div className="glass-card overflow-x-auto hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-3 text-left text-primary font-semibold text-xs">Day</th>
                    {PERIOD_TIMINGS.map(t => (
                      <th key={t.period} className="px-2 py-3 text-center text-primary font-semibold text-xs">
                        <div>P{t.period}</div>
                        <div className="text-muted-foreground font-normal">{formatTimeDisplay(t.start)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAY_NAMES.map(day => {
                    const isToday = day === dayName;
                    const schedule = getDaySchedule(day);
                    return (
                      <tr key={day} className={`border-b border-border/30 transition-colors ${isToday ? "bg-primary/5" : "hover:bg-secondary/50"}`}>
                        <td className={`px-3 py-3 font-semibold text-xs whitespace-nowrap ${isToday ? "text-primary" : "text-foreground"}`}>
                          {isToday && <span className="mr-1">📍</span>}
                          {day.slice(0, 3)}
                        </td>
                        {schedule.map(entry => {
                          const isActivePeriod = isToday && currentPeriodInfo?.period === entry.period;
                          return (
                            <td key={entry.period} className="px-1 py-2 text-center">
                              <div className={`rounded-lg px-2 py-2 text-xs transition-all ${
                                isActivePeriod
                                  ? "bg-primary/20 border border-primary/40 text-primary font-bold animate-pulse"
                                  : entry.subject.type === "lab"
                                    ? "bg-violet-500/10 text-violet-400"
                                    : entry.subject.type === "other"
                                      ? "bg-zinc-500/10 text-muted-foreground"
                                      : "bg-secondary/50 text-foreground"
                              }`}>
                                <div className="font-semibold">{entry.subject.short}</div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Timetable — Day cards */}
            <div className="sm:hidden space-y-4">
              {DAY_NAMES.map(day => {
                const isToday = day === dayName;
                const schedule = getDaySchedule(day);
                return (
                  <div key={day} className={`glass-card p-4 ${isToday ? "border-primary/30" : ""}`}>
                    <p className={`font-display font-bold mb-3 ${isToday ? "text-primary" : "text-foreground"}`}>
                      {isToday && "📍 "}{day}
                    </p>
                    <div className="grid grid-cols-7 gap-1">
                      {schedule.map(entry => {
                        const isActivePeriod = isToday && currentPeriodInfo?.period === entry.period;
                        return (
                          <div
                            key={entry.period}
                            className={`rounded-lg p-2 text-center text-xs ${
                              isActivePeriod
                                ? "bg-primary/20 text-primary font-bold border border-primary/40"
                                : entry.subject.type === "lab"
                                  ? "bg-violet-500/10 text-violet-400"
                                  : "bg-secondary/50 text-foreground"
                            }`}
                          >
                            <div className="font-semibold text-[10px]">{entry.subject.short}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Period Timings Legend */}
            <div className="glass-card p-4">
              <p className="text-xs font-semibold text-foreground mb-2">⏰ Period Timings</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PERIOD_TIMINGS.map(t => (
                  <div key={t.period} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-bold text-foreground">P{t.period}</span>
                    {formatTimeDisplay(t.start)} – {formatTimeDisplay(t.end)}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-primary" /> Theory</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-violet-500" /> Lab</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-zinc-500" /> Other</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ LEAVE REQUESTS TAB ═══ */}
        {tab === "leaves" && (
          <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Leave Requests</h3>
              </div>
              <button
                onClick={() => setShowLeaveForm(!showLeaveForm)}
                className="flex items-center gap-2 rounded-lg gradient-cyan px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Send className="h-4 w-4" /> {showLeaveForm ? "Cancel" : "New Request"}
              </button>
            </div>

            {/* Leave Form */}
            {showLeaveForm && (
              <div className="mb-6 space-y-3 rounded-xl bg-secondary p-4 animate-fade-in">
                <textarea
                  placeholder="Reason for leave (e.g., Medical, Family emergency, Personal)..."
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">From Date *</label>
                    <input
                      type="date"
                      value={leaveDate}
                      onChange={e => setLeaveDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">To Date (optional)</label>
                    <input
                      type="date"
                      value={leaveEndDate}
                      onChange={e => setLeaveEndDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmitLeave}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg gradient-cyan py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Leave Request"}
                </button>
              </div>
            )}

            {/* Leave Request History */}
            {leaveRequests.length > 0 ? (
              <div className="space-y-3">
                {leaveRequests.map(lr => (
                  <div key={lr.id} className={`rounded-xl border p-4 transition-all ${
                    lr.status === "approved" ? "border-success/30 bg-success/5" :
                    lr.status === "rejected" ? "border-destructive/30 bg-destructive/5" :
                    "border-border bg-secondary/50"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{lr.reason}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          📅 {lr.leave_date}{lr.leave_end_date ? ` → ${lr.leave_end_date}` : ""}
                        </p>
                        {lr.teacher_remark && (
                          <p className="mt-2 rounded-lg bg-background/50 px-3 py-2 text-xs text-muted-foreground">
                            💬 Teacher: <span className="text-foreground">{lr.teacher_remark}</span>
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {statusBadge(lr.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-6">No leave requests yet. Click "New Request" to submit one.</p>
            )}
          </div>
        )}

        {/* ═══ MENTOR / MENTEES TAB ═══ */}
        {tab === "mentor" && (
          <div className="space-y-6 animate-fade-in">
            {/* Mentor Info */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Mrs. S. Radhika, M.E.</h3>
                  <p className="text-sm text-muted-foreground">Assistant Professor · CSE Department · CKCET</p>
                  <p className="text-xs text-muted-foreground mt-0.5">📧 s.radhika@ckcet.edu.in · Mentor Hours: Tue & Thu 3:30-5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Mentee Summary Stats */}
            {mentees.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4 text-primary" /> Total Mentees</div>
                  <p className="font-display text-3xl font-bold text-foreground">{mentees.length}</p>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-primary" /> Avg Attendance</div>
                  <p className="font-display text-3xl font-bold text-foreground">
                    {mentees.length > 0 ? Math.round(mentees.reduce((a, m) => a + m.attendance_percentage, 0) / mentees.length) : 0}%
                  </p>
                </div>
                <div className="stat-card">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><AlertTriangle className="h-4 w-4 text-destructive" /> Below 75%</div>
                  <p className="font-display text-3xl font-bold text-destructive">
                    {mentees.filter(m => m.attendance_percentage < 75).length}
                  </p>
                </div>
              </div>
            )}

            {/* Mentee Cards */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Mentee Dashboard</h3>
                <span className="text-xs text-muted-foreground ml-auto">🔄 Live — auto-refreshes every 3s</span>
              </div>

              {mentees.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Loading mentee data...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {mentees.map(mentee => {
                    const todayStatus = menteeTodayStatus[mentee.id] || { status: "not_marked", method: "" };
                    const absentDays = mentee.total_days - mentee.present_days;
                    const isLow = mentee.attendance_percentage < 75;

                    return (
                      <div
                        key={mentee.id}
                        className={`glass-card p-5 transition-all hover:border-primary/30 ${
                          isLow ? "border-destructive/30" : ""
                        }`}
                      >
                        {/* Student Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-primary overflow-hidden shrink-0">
                            {mentee.face_image ? (
                              <img src={mentee.face_image} className="h-12 w-12 object-cover" alt={mentee.name} />
                            ) : mentee.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-sm font-bold text-foreground truncate">{mentee.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{mentee.email}</p>
                            <p className="text-xs text-muted-foreground">{mentee.section} · {mentee.year}</p>
                          </div>
                        </div>

                        {/* Attendance Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="rounded-xl bg-secondary/50 p-3 text-center">
                            <p className={`font-display text-xl font-bold ${
                              isLow ? "text-destructive" : mentee.attendance_percentage >= 90 ? "text-success" : "text-foreground"
                            }`}>
                              {mentee.attendance_percentage}%
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Overall</p>
                          </div>
                          <div className="rounded-xl bg-success/10 p-3 text-center">
                            <p className="font-display text-xl font-bold text-success">{mentee.present_days}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Present</p>
                          </div>
                          <div className="rounded-xl bg-destructive/10 p-3 text-center">
                            <p className="font-display text-xl font-bold text-destructive">{absentDays}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Absent</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2.5 rounded-full bg-secondary overflow-hidden mb-3">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isLow
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : mentee.attendance_percentage >= 90
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : "bg-gradient-to-r from-cyan-500 to-blue-500"
                            }`}
                            style={{ width: `${Math.min(mentee.attendance_percentage, 100)}%` }}
                          />
                        </div>

                        {/* Today's Status + Face Status */}
                        <div className="flex items-center justify-between">
                          <div>
                            {todayStatus.status === "present" ? (
                              <span className="flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1 text-xs font-bold text-success">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Today: Present {todayStatus.method === "face" ? "(Face ✅)" : "(Manual)"}
                              </span>
                            ) : todayStatus.status === "absent" ? (
                              <span className="flex items-center gap-1.5 rounded-full bg-destructive/20 px-3 py-1 text-xs font-bold text-destructive">
                                <XCircle className="h-3.5 w-3.5" />
                                Today: Absent
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 rounded-full bg-warning/20 px-3 py-1 text-xs font-bold text-warning">
                                <Clock className="h-3.5 w-3.5" />
                                Today: Not Marked Yet
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-semibold ${
                            mentee.face_registered ? "text-success" : "text-muted-foreground"
                          }`}>
                            {mentee.face_registered ? "🤖 Face Registered" : "No Face"}
                          </span>
                        </div>

                        {/* Warning */}
                        {isLow && (
                          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            ⚠️ Below 75% — needs immediate improvement
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
