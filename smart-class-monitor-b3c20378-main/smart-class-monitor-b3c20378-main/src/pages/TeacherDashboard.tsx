import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addStudent, registerFace, updateStudent, type Student, getStudents,
  getAllLeaveRequests, updateLeaveRequest, type LeaveRequest,
  getDatePeriodAttendance, type PeriodAttendanceRecord,
  getStudentAttendanceHistory,
} from "@/lib/store";
import { loadModels, extractEmbeddingFromImageUrl, areModelsLoaded } from "@/lib/faceRecognition";
import {
  getCurrentDayName, getCurrentPeriod, getDaySchedule, formatTimeDisplay,
  DAY_NAMES, PERIOD_TIMINGS, SUBJECTS, type DayName, type CurrentPeriodInfo,
} from "@/lib/timetable";
import {
  BookOpen, Users, AlertTriangle, FileText, TrendingUp, LogOut,
  Mail, Camera, Plus, X, Eye, CheckCircle, Search, Clock,
  XCircle, Loader2, Table2, Calendar,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Tab = "students" | "timetable" | "low" | "faceRegister" | "leaves";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [tab, setTab] = useState<Tab>("students");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDept, setNewDept] = useState("CSE");
  const [newYear, setNewYear] = useState("2nd Year");
  const [newSection, setNewSection] = useState("I CSE");
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingReport, setSendingReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<(LeaveRequest & { studentName?: string; studentEmail?: string })[]>([]);
  const [remarkText, setRemarkText] = useState("");
  const [remarkId, setRemarkId] = useState<string | null>(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [registeringFaceId, setRegisteringFaceId] = useState<string | null>(null);
  const [currentPeriodInfo, setCurrentPeriodInfo] = useState<CurrentPeriodInfo | null>(null);
  const [todayPeriodRecords, setTodayPeriodRecords] = useState<PeriodAttendanceRecord[]>([]);

  const loadStudents = () => {
    try {
      const data = getStudents();
      setStudents(data);
    } catch (e) {
      toast({ title: "Error loading students", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadLeaveRequests = () => {
    const allLeaves = getAllLeaveRequests();
    const studentsData = getStudents();
    const enriched = allLeaves.map(lr => {
      const student = studentsData.find(s => s.id === lr.student_id);
      return {
        ...lr,
        studentName: student?.name || lr.student_id,
        studentEmail: student?.email || "",
      };
    });
    setLeaveRequests(enriched);
  };

  useEffect(() => {
    const role = localStorage.getItem("nc_role");
    if (role !== "teacher") { navigate("/"); return; }
    loadStudents();
    loadLeaveRequests();
    setCurrentPeriodInfo(getCurrentPeriod());

    // Load today's period attendance
    const today = new Date().toISOString().split("T")[0];
    setTodayPeriodRecords(getDatePeriodAttendance(today));

    // Load AI face recognition models
    loadModels().then(() => {
      setModelsReady(true);
      console.log('✅ Face recognition models ready');
    }).catch(() => {
      toast({ title: "⚠️ AI models failed to load", description: "Face registration may not work. Refresh to retry.", variant: "destructive" });
    });

    // Refresh period info
    const interval = setInterval(() => {
      setCurrentPeriodInfo(getCurrentPeriod());
    }, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const lowAttendance = students.filter(s => s.attendance_percentage < 75);
  const avgAttendance = students.length ? Math.round(students.reduce((a, s) => a + s.attendance_percentage, 0) / students.length) : 0;

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logout = () => {
    localStorage.removeItem("nc_role");
    localStorage.removeItem("nc_user");
    navigate("/");
  };

  const handleAddStudent = () => {
    if (!newName || !newEmail || !newPassword) {
      toast({ title: "Fill all required fields", variant: "destructive" });
      return;
    }
    try {
      const student = addStudent({
        name: newName,
        email: newEmail,
        password: newPassword,
        department: newDept,
        year: newYear,
        section: newSection,
        face_registered: false,
        face_image: null,
      });

      if (faceFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          await registerFace(student.id, e.target?.result as string);
          loadStudents();
        };
        reader.readAsDataURL(faceFile);
      } else {
        loadStudents();
      }

      setShowAddForm(false);
      setNewName(""); setNewEmail(""); setNewPassword(""); setFaceFile(null);
      toast({ title: "✅ Student added successfully!" });
    } catch (e: any) {
      toast({ title: "Error adding student", description: e.message, variant: "destructive" });
    }
  };

  const handleSendWarning = (student: Student) => {
    updateStudent(student.id, { warning_sent: true });
    loadStudents();
    toast({ title: `✅ Warning sent to ${student.name}`, description: "Warning has been recorded." });
  };

  const handleSendDailyReport = () => {
    setSendingReport(true);
    const absentCount = students.filter(s => s.attendance_percentage < 75).length;
    setTimeout(() => {
      toast({ title: `✅ Daily report generated!`, description: `${absentCount} students below 75% attendance.` });
      setSendingReport(false);
    }, 1000);
  };

  const handleRegisterFace = async (studentId: string, file: File) => {
    setRegisteringFaceId(studentId);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      try {
        if (!areModelsLoaded()) {
          toast({ title: "⏳ AI models still loading...", description: "Please wait a moment and try again." });
          setRegisteringFaceId(null);
          return;
        }
        // Extract 128D face embedding from the uploaded image
        const embedding = await extractEmbeddingFromImageUrl(imageUrl);
        if (!embedding) {
          toast({ title: "❌ No face detected", description: "Please upload a clear photo with a visible face.", variant: "destructive" });
          setRegisteringFaceId(null);
          return;
        }
        // Upload to Firebase Storage + save embedding
        await registerFace(studentId, imageUrl, embedding);
        loadStudents();
        toast({ title: "✅ Face registered & uploaded to Firebase!", description: "128D face vector + cloud image stored." });
      } catch (err: any) {
        console.error('Face registration error:', err);
        toast({ title: "Face registration failed", description: err.message || "Unknown error", variant: "destructive" });
      } finally {
        setRegisteringFaceId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLeaveAction = (leaveId: string, status: "approved" | "rejected") => {
    try {
      updateLeaveRequest(leaveId, {
        status,
        teacher_remark: remarkId === leaveId ? remarkText : null,
      });
      toast({ title: `✅ Leave ${status}!` });
      setRemarkId(null);
      setRemarkText("");
      loadLeaveRequests();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const pendingLeaves = leaveRequests.filter(l => l.status === "pending");
  const dayName = getCurrentDayName();

  const tabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "students", label: "Students", icon: Users },
    { id: "timetable", label: "Timetable", icon: Table2 },
    { id: "low", label: "Low Attendance", icon: AlertTriangle, badge: lowAttendance.length },
    { id: "leaves", label: "Leave Requests", icon: FileText, badge: pendingLeaves.length },
    { id: "faceRegister", label: "Face Register", icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="icon-box-cyan h-10 w-10"><BookOpen className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">NetCampus</h1>
            <p className="text-xs text-muted-foreground">Teacher Dashboard · I CSE</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* Current Period Quick Info */}
          {currentPeriodInfo && (
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-primary">P{currentPeriodInfo.period} · {currentPeriodInfo.subject.short}</span>
            </div>
          )}
          <button
            onClick={handleSendDailyReport}
            disabled={sendingReport}
            className="flex items-center gap-2 rounded-lg gradient-cyan px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Mail className="h-4 w-4" /> {sendingReport ? "Sending..." : "Daily Report"}
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-in">
          <div className="stat-card">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">Total Students</p>
            <p className="font-display text-3xl font-bold text-foreground">{students.length}</p>
          </div>
          <div className="stat-card">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-xs text-muted-foreground">Low Attendance</p>
            <p className="font-display text-3xl font-bold text-destructive">{lowAttendance.length}</p>
          </div>
          <div className="stat-card">
            <CheckCircle className="h-5 w-5 text-success" />
            <p className="text-xs text-muted-foreground">Face Registered</p>
            <p className="font-display text-3xl font-bold text-foreground">{students.filter(s => s.face_registered).length}</p>
          </div>
          <div className="stat-card">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">Avg Attendance</p>
            <p className="font-display text-3xl font-bold text-foreground">{avgAttendance}%</p>
          </div>
        </div>

        {lowAttendance.length > 0 && (
          <div className="danger-banner rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-2 font-display font-semibold text-warning">
              <AlertTriangle className="h-5 w-5" /> Low Attendance Alert
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {lowAttendance.slice(0, 3).map(s => s.name).join(", ")}
              {lowAttendance.length > 3 && ` +${lowAttendance.length - 3} more`} — below 75%.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto animate-fade-in">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Students Tab */}
        {tab === "students" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 rounded-lg gradient-cyan px-4 py-2 text-sm font-semibold text-primary-foreground whitespace-nowrap">
                <Plus className="h-4 w-4" /> Add Student
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">Loading students...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map(s => (
                  <div key={s.id} className={`glass-card p-4 ${s.attendance_percentage < 75 ? "border-destructive/30" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary font-display font-bold text-primary overflow-hidden">
                        {s.face_image ? <img src={s.face_image} className="h-12 w-12 object-cover" alt={s.name} /> : s.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold text-foreground truncate text-sm">{s.name}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold shrink-0 ${s.attendance_percentage < 75 ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>
                            {s.attendance_percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                      </div>
                      <button onClick={() => setViewStudent(s)} className="shrink-0 p-1 rounded text-muted-foreground hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                    {s.attendance_percentage < 75 && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Weekly Timetable</h3>
                <span className="text-xs text-muted-foreground">III Year CSE · B-207</span>
              </div>
              {currentPeriodInfo && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Now: P{currentPeriodInfo.period} · {currentPeriodInfo.subject.short}
                  </span>
                </div>
              )}
            </div>

            {/* Full Timetable Grid */}
            <div className="glass-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-primary font-semibold text-xs sticky left-0 bg-card z-10">Day</th>
                    {PERIOD_TIMINGS.map(t => (
                      <th key={t.period} className="px-3 py-3 text-center text-primary font-semibold text-xs min-w-[100px]">
                        <div className="font-bold">P{t.period}</div>
                        <div className="text-muted-foreground font-normal text-[10px]">
                          {formatTimeDisplay(t.start)} – {formatTimeDisplay(t.end)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAY_NAMES.map(day => {
                    const isToday = day === dayName;
                    const schedule = getDaySchedule(day);
                    return (
                      <tr key={day} className={`border-b border-border/30 ${isToday ? "bg-primary/5" : "hover:bg-secondary/50"} transition-colors`}>
                        <td className={`px-4 py-3 font-semibold text-sm whitespace-nowrap sticky left-0 z-10 ${isToday ? "text-primary bg-primary/5" : "text-foreground bg-card"}`}>
                          {isToday && <span className="mr-1">📍</span>}
                          {day}
                        </td>
                        {schedule.map(entry => {
                          const isActivePeriod = isToday && currentPeriodInfo?.period === entry.period;
                          // Count students present for this period today
                          const presentCount = isToday
                            ? todayPeriodRecords.filter(r => r.period === entry.period && r.status === "present").length
                            : 0;

                          return (
                            <td key={entry.period} className="px-2 py-2 text-center">
                              <div className={`rounded-xl px-2 py-2.5 transition-all ${
                                isActivePeriod
                                  ? "bg-primary/20 border-2 border-primary/50 shadow-lg shadow-primary/10"
                                  : entry.subject.type === "lab"
                                    ? "bg-violet-500/10 border border-violet-500/20"
                                    : entry.subject.type === "other"
                                      ? "bg-zinc-500/10 border border-zinc-500/10"
                                      : "bg-secondary/60 border border-transparent"
                              }`}>
                                <div className={`font-bold text-sm ${
                                  isActivePeriod ? "text-primary" :
                                  entry.subject.type === "lab" ? "text-violet-400" :
                                  entry.subject.type === "other" ? "text-muted-foreground" :
                                  "text-foreground"
                                }`}>
                                  {entry.subject.short}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                  {entry.subject.faculty !== "-" ? entry.subject.faculty.split(" ").pop() : ""}
                                </div>
                                {isToday && presentCount > 0 && (
                                  <div className="mt-1 text-[10px] text-success font-semibold">
                                    {presentCount} ✓
                                  </div>
                                )}
                                {isActivePeriod && (
                                  <div className="mt-1 text-[10px] text-primary font-bold animate-pulse">
                                    🔴 LIVE
                                  </div>
                                )}
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

            {/* Subject Legend */}
            <div className="glass-card p-5">
              <p className="text-xs font-semibold text-foreground mb-3">📚 Subject Legend</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.values(SUBJECTS).map(s => (
                  <div key={s.code} className="flex items-center gap-2 text-xs">
                    <span className={`rounded px-2 py-0.5 font-bold ${
                      s.type === "lab" ? "bg-violet-500/20 text-violet-400" :
                      s.type === "other" ? "bg-zinc-500/20 text-muted-foreground" :
                      "bg-primary/15 text-primary"
                    }`}>
                      {s.short}
                    </span>
                    <span className="text-foreground">{s.name}</span>
                    {s.faculty !== "-" && <span className="text-muted-foreground">· {s.faculty}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Period Timings */}
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
            </div>
          </div>
        )}

        {/* Low Attendance Tab */}
        {tab === "low" && (
          <div className="space-y-4 animate-fade-in">
            <div className="overflow-x-auto glass-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-4 text-left text-primary font-semibold">Name</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Email</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">%</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Warning</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowAttendance.map(s => (
                    <tr key={s.id} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-display font-bold text-primary overflow-hidden shrink-0">
                            {s.face_image ? <img src={s.face_image} className="h-10 w-10 object-cover" alt={s.name} /> : s.name[0]}
                          </div>
                          <p className="font-semibold text-foreground">{s.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{s.email}</td>
                      <td className="px-5 py-4 text-destructive font-bold text-base">{s.attendance_percentage}%</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.warning_sent ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                          {s.warning_sent ? "Sent" : "Not Sent"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleSendWarning(s)}
                          disabled={s.warning_sent}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${s.warning_sent ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-cyan text-primary-foreground hover:opacity-90 glow-cyan"}`}
                        >
                          <Mail className="h-4 w-4" /> {s.warning_sent ? "Warning Sent" : "Send Warning"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lowAttendance.length === 0 && (
                <div className="flex items-center justify-center p-12 text-muted-foreground">
                  All students above 75% 🎉
                </div>
              )}
            </div>
          </div>
        )}

        {/* Face Register Tab */}
        {tab === "faceRegister" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Upload face photos to enable AI face-based attendance.</p>
              <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${modelsReady ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                {modelsReady ? <><CheckCircle className="h-3 w-3" /> AI Models Ready</> : <><Loader2 className="h-3 w-3 animate-spin" /> Loading AI Models...</>}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {students.map(s => (
                <div key={s.id} className={`glass-card p-4 ${registeringFaceId === s.id ? "border-primary/50" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary font-display font-bold text-primary overflow-hidden">
                      {s.face_image ? <img src={s.face_image} className="h-12 w-12 object-cover" alt={s.name} /> : s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-foreground text-sm truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    </div>
                  </div>
                  {registeringFaceId === s.id ? (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" /> Extracting AI face embedding...
                    </div>
                  ) : s.face_registered ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-success flex items-center gap-1"><Camera className="h-3 w-3" /> Registered</span>
                        <label className="cursor-pointer text-xs text-muted-foreground hover:text-primary underline">
                          Update
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleRegisterFace(s.id, file);
                          }} />
                        </label>
                      </div>
                      {s.face_embedding ? (
                        <span className="flex items-center gap-1 text-xs text-success/70">🧠 128D AI embedding stored</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-warning">⚠️ Photo only — re-upload for AI embedding</span>
                      )}
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                      <Camera className="h-4 w-4" /> Upload Face Image
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleRegisterFace(s.id, file);
                      }} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave Requests Tab */}
        {tab === "leaves" && (
          <div className="space-y-4 animate-fade-in">
            <div className="overflow-x-auto glass-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-4 text-left text-primary font-semibold">Student</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Reason</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Date</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Status</th>
                    <th className="px-5 py-4 text-left text-primary font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map(lr => (
                    <tr key={lr.id} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">{lr.studentName}</p>
                        <p className="text-xs text-muted-foreground">{lr.studentEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-foreground max-w-[200px]">
                        <p className="truncate">{lr.reason}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                        {lr.leave_date}{lr.leave_end_date ? ` → ${lr.leave_end_date}` : ""}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold w-fit ${
                          lr.status === "approved" ? "bg-success/20 text-success" :
                          lr.status === "rejected" ? "bg-destructive/20 text-destructive" :
                          "bg-warning/20 text-warning"
                        }`}>
                          {lr.status === "approved" ? <CheckCircle className="h-3 w-3" /> :
                           lr.status === "rejected" ? <XCircle className="h-3 w-3" /> :
                           <Clock className="h-3 w-3" />}
                          {lr.status.charAt(0).toUpperCase() + lr.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {lr.status === "pending" ? (
                          <div className="space-y-2">
                            {remarkId === lr.id ? (
                              <input
                                placeholder="Add remark (optional)..."
                                value={remarkText}
                                onChange={e => setRemarkText(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                              />
                            ) : (
                              <button onClick={() => setRemarkId(lr.id)} className="text-xs text-muted-foreground hover:text-primary underline">
                                + Add remark
                              </button>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleLeaveAction(lr.id, "approved")}
                                className="flex items-center gap-1 rounded-lg bg-success/20 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/30 transition-colors"
                              >
                                <CheckCircle className="h-3 w-3" /> Approve
                              </button>
                              <button
                                onClick={() => handleLeaveAction(lr.id, "rejected")}
                                className="flex items-center gap-1 rounded-lg bg-destructive/20 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/30 transition-colors"
                              >
                                <XCircle className="h-3 w-3" /> Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {lr.teacher_remark ? `"${lr.teacher_remark}"` : "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leaveRequests.length === 0 && (
                <div className="flex items-center justify-center p-12 text-muted-foreground">
                  No leave requests yet 📋
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Add New Student</h3>
              <button onClick={() => setShowAddForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Full Name *" value={newName} onChange={e => setNewName(e.target.value)} className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              <input placeholder="Email *" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              <input type="password" placeholder="Password *" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              <div className="grid grid-cols-3 gap-2">
                <select value={newDept} onChange={e => setNewDept(e.target.value)} className="rounded-lg border border-border bg-secondary px-2 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option>CSE</option><option>ECE</option><option>EEE</option><option>MECH</option>
                </select>
                <select value={newYear} onChange={e => setNewYear(e.target.value)} className="rounded-lg border border-border bg-secondary px-2 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                </select>
                <select value={newSection} onChange={e => setNewSection(e.target.value)} className="rounded-lg border border-border bg-secondary px-2 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option>I CSE</option><option>II CSE</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary">
                <Camera className="h-5 w-5" /> {faceFile ? faceFile.name : "Upload Face Image (optional)"}
                <input type="file" accept="image/*" className="hidden" onChange={e => setFaceFile(e.target.files?.[0] || null)} />
              </label>
              <button onClick={handleAddStudent} className="w-full rounded-lg gradient-cyan py-2 font-semibold text-primary-foreground">
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold text-foreground">Student Profile</h3>
              <button onClick={() => setViewStudent(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-2xl font-bold text-primary overflow-hidden shrink-0">
                {viewStudent.face_image ? <img src={viewStudent.face_image} className="h-16 w-16 object-cover" alt={viewStudent.name} /> : viewStudent.name[0]}
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-foreground">{viewStudent.name}</h4>
                <p className="text-sm text-muted-foreground">{viewStudent.email}</p>
                <p className="text-xs text-muted-foreground">{viewStudent.department} · {viewStudent.year} · {viewStudent.section}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="stat-card text-center">
                <p className={`font-display text-2xl font-bold ${viewStudent.attendance_percentage < 75 ? 'text-destructive' : 'text-success'}`}>{viewStudent.attendance_percentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">Attendance</p>
              </div>
              <div className="stat-card text-center">
                <p className="font-display text-2xl font-bold text-foreground">{viewStudent.present_days}</p>
                <p className="text-xs text-muted-foreground mt-1">Present</p>
              </div>
              <div className="stat-card text-center">
                <p className="font-display text-2xl font-bold text-foreground">{viewStudent.total_days - viewStudent.present_days}</p>
                <p className="text-xs text-muted-foreground mt-1">Absent</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2 text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-foreground">{viewStudent.id}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2 text-sm">
                <span className="text-muted-foreground">Face Status</span>
                <span className={viewStudent.face_registered ? "text-success" : "text-muted-foreground"}>
                  {viewStudent.face_registered ? "✅ Registered" : "Not registered"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2 text-sm">
                <span className="text-muted-foreground">Warning Sent</span>
                <span className={viewStudent.warning_sent ? "text-warning" : "text-muted-foreground"}>
                  {viewStudent.warning_sent ? "⚠️ Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Scrollable Attendance History Log */}
            <div className="mt-5 border-t border-border pt-4">
              <h5 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Attendance Log (Date-wise)
              </h5>
              <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {getStudentAttendanceHistory(viewStudent.id).map(log => (
                  <div key={log.date} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2 text-xs border border-border/20">
                    <div>
                      <span className="font-semibold text-foreground">{log.date}</span>
                      <span className="text-muted-foreground ml-1 font-medium">· {log.dayName.slice(0, 3)}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      log.status === "present" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    }`}>
                      {log.status === "present" ? `Present (${log.method === "face" ? "Face" : "Manual"})` : "Absent"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {viewStudent.attendance_percentage < 75 && !viewStudent.warning_sent && (
              <button
                onClick={() => { handleSendWarning(viewStudent); setViewStudent(null); }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg gradient-cyan py-2 text-sm font-semibold text-primary-foreground"
              >
                <Mail className="h-4 w-4" /> Send Warning
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
