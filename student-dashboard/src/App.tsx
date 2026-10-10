/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ClipboardCheck, 
  FileText, 
  TrendingUp, 
  CalendarDays, 
  Wallet, 
  Award, 
  Briefcase, 
  Target, 
  HelpCircle, 
  Medal, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap 
} from 'lucide-react';

import { 
  initialStudentProfile,
  initialAttendanceSubjects,
  initialAttendanceLogs,
  initialInternalMarks,
  initialSemesters,
  initialLeaves,
  initialFees,
  initialTransactions,
  initialCertificates,
  initialInternships,
  initialGoals,
  initialTickets,
  badgesList
} from './data';

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
  AchievementBadge,
  AssessmentMarks
} from './types';

// Subcomponents
import DashboardTab from './components/DashboardTab';
import AttendanceTab from './components/AttendanceTab';
import InternalMarksTab from './components/InternalMarksTab';
import GpaCalculatorTab, { gradePointsMap } from './components/GpaCalculatorTab';
import LeaveRequestTab from './components/LeaveRequestTab';
import FeeStatusTab from './components/FeeStatusTab';
import UploadTabs from './components/UploadTabs';
import GoalTrackingTab from './components/GoalTrackingTab';
import HelpRequestTab from './components/HelpRequestTab';
import BadgesTab from './components/BadgesTab';
import LoginScreen from './components/LoginScreen';
import MentorPortal from './components/MentorPortal';
import ParentPortal from './components/ParentPortal';
import { studentsDatabase } from './studentData';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const stored = localStorage.getItem('is_logged_in');
    return stored ? JSON.parse(stored) : true;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('active_tab') || 'Dashboard';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Self-healing function to upgrade any stale "Student" profile to the rich "Ameer Syed" demo profile
  const checkAndResetStaleData = () => {
    const stored = localStorage.getItem('profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.name === "Student" || !parsed.name || parsed.name.toLowerCase() === "student") {
          localStorage.clear();
        }
      } catch (e) {
        localStorage.clear();
      }
    }
  };

  // Run the self-healing check before states are initialized
  checkAndResetStaleData();

  // Core application states loaded from localStorage or fallback defaults
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const stored = localStorage.getItem('profile');
    try {
      return stored ? JSON.parse(stored) : initialStudentProfile;
    } catch (e) {
      return initialStudentProfile;
    }
  });

  const [attendanceSubjects, setAttendanceSubjects] = useState<AttendanceSubject[]>(() => {
    const stored = localStorage.getItem('attendance_subjects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialAttendanceSubjects;
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogEntry[]>(() => {
    const stored = localStorage.getItem('attendance_logs');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialAttendanceLogs;
  });

  const [internalMarks, setInternalMarks] = useState<InternalMarkEntry[]>(() => {
    const stored = localStorage.getItem('internal_marks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialInternalMarks;
  });

  const [semesters, setSemesters] = useState<SemesterGPA[]>(() => {
    const stored = localStorage.getItem('semesters');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialSemesters;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const stored = localStorage.getItem('leave_requests');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialLeaves;
  });

  const [fees, setFees] = useState<FeeItem[]>(() => {
    const stored = localStorage.getItem('fees');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialFees;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialTransactions;
  });

  const [certificates, setCertificates] = useState<StudentCertificate[]>(() => {
    const stored = localStorage.getItem('certificates');
    return stored ? JSON.parse(stored) : initialCertificates;
  });

  const [internships, setInternships] = useState<InternshipEntry[]>(() => {
    const stored = localStorage.getItem('internships');
    return stored ? JSON.parse(stored) : initialInternships;
  });

  const [goals, setGoals] = useState<StudentGoal[]>(() => {
    const stored = localStorage.getItem('goals');
    return stored ? JSON.parse(stored) : initialGoals;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const stored = localStorage.getItem('tickets');
    return stored ? JSON.parse(stored) : initialTickets;
  });

  const [badges] = useState<AchievementBadge[]>(badgesList);

  const [userRole, setUserRole] = useState<'student' | 'mentor' | 'parent'>(() => {
    return (localStorage.getItem('user_role') as 'student' | 'mentor' | 'parent') || 'student';
  });

  useEffect(() => {
    localStorage.setItem('user_role', userRole);
  }, [userRole]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('attendance_subjects', JSON.stringify(attendanceSubjects));
  }, [attendanceSubjects]);

  useEffect(() => {
    localStorage.setItem('attendance_logs', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem('internal_marks', JSON.stringify(internalMarks));
  }, [internalMarks]);

  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem('leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Handle logout trigger
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('is_logged_in');
  };

  const handleLoginSuccess = (role: 'student' | 'mentor' | 'parent', selectedRollNo: string) => {
    setUserRole(role);
    if (role === 'student' || role === 'parent') {
      const studentData = studentsDatabase[selectedRollNo as keyof typeof studentsDatabase];
      if (studentData) {
        setProfile(studentData.profile);
        setAttendanceSubjects(studentData.attendance);
        setInternalMarks(studentData.internals);
        setSemesters(studentData.semesters);

        localStorage.setItem('profile', JSON.stringify(studentData.profile));
        localStorage.setItem('attendance_subjects', JSON.stringify(studentData.attendance));
        localStorage.setItem('internal_marks', JSON.stringify(studentData.internals));
        localStorage.setItem('semesters', JSON.stringify(studentData.semesters));
      }
    }
    setIsLoggedIn(true);
  };

  // Dynamic calculations based on active state updates
  const totalAttended = attendanceSubjects.reduce((sum, s) => sum + s.attended, 0);
  const totalConducted = attendanceSubjects.reduce((sum, s) => sum + s.total, 0);
  const overallAttendance = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  const calculateSubjectTotal = (assessments: AssessmentMarks) => {
    return (
      assessments.quiz1 +
      assessments.midterm +
      assessments.quiz2 +
      assessments.assignment +
      assessments.project
    );
  };

  const internalAverage = internalMarks.reduce((sum, m) => sum + calculateSubjectTotal(m.assessments), 0) / internalMarks.length;

  const totalCredits = semesters.reduce((sum, sem) => {
    return sum + sem.courses.reduce((s, c) => s + c.credits, 0);
  }, 0);

  const totalPoints = semesters.reduce((sum, sem) => {
    return sum + sem.courses.reduce((s, c) => s + (c.credits * gradePointsMap[c.grade]), 0);
  }, 0);

  const currentCgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  const handleResetDemoData = () => {
    localStorage.clear();
    setProfile(initialStudentProfile);
    setAttendanceSubjects(initialAttendanceSubjects);
    setAttendanceLogs(initialAttendanceLogs);
    setInternalMarks(initialInternalMarks);
    setSemesters(initialSemesters);
    setLeaveRequests(initialLeaves);
    setFees(initialFees);
    setTransactions(initialTransactions);
    setCertificates(initialCertificates);
    setInternships(initialInternships);
    setGoals(initialGoals);
    setTickets(initialTickets);
    setActiveTab('Dashboard');
  };

  // Sidebar Menu mapping
  const menuItems = [
    { name: 'Dashboard', icon: Home, color: 'text-orange-400' },
    { name: 'Attendance', icon: ClipboardCheck, color: 'text-green-400' },
    { name: 'Internal Marks', icon: FileText, color: 'text-red-300' },
    { name: 'GPA & CGPA', icon: TrendingUp, color: 'text-red-500' },
    { name: 'Leave Request', icon: CalendarDays, color: 'text-blue-300' },
    { name: 'Fee Status', icon: Wallet, color: 'text-yellow-500' },
    { name: 'Certificate Upload', icon: Award, color: 'text-yellow-400' },
    { name: 'Internship Upload', icon: Briefcase, color: 'text-amber-700' },
    { name: 'Goal Tracking', icon: Target, color: 'text-red-400' },
    { name: 'Help Request', icon: HelpCircle, color: 'text-pink-300' },
    { name: 'Achievement Badges', icon: Medal, color: 'text-yellow-500' },
  ];

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (userRole === 'parent') {
    return (
      <ParentPortal
        studentProfile={profile}
        attendanceSubjects={attendanceSubjects}
        internalMarks={internalMarks}
        semesters={semesters}
        fees={fees}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col font-sans" id="portal-app-root">
      {/* HEADER BAR (Match colors and visual weight of the mockup) */}
      <header className="bg-[#1e285d] text-white shadow-md flex-shrink-0 z-20" id="portal-main-header">
        <div className="mx-auto px-6 py-4 flex justify-between items-center relative">
          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-slate-200 cursor-pointer p-1 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center space-x-3 mx-auto md:mx-0">
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 hidden md:flex">
              <GraduationCap className="w-5 h-5 text-indigo-300" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-center md:text-left">
              {userRole === 'mentor' ? 'Mentor Workspace' : 'Student Portal'}
            </h1>
          </div>

          {/* Premium Role Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 hidden sm:inline">Role:</span>
            <div className="bg-white/10 p-0.5 rounded-lg border border-white/10 flex">
              <button 
                onClick={() => setUserRole('student')}
                className={`px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md transition-all cursor-pointer ${
                  userRole === 'student' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-200 hover:text-white'
                }`}
              >
                Student
              </button>
              <button 
                onClick={() => setUserRole('mentor')}
                className={`px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md transition-all cursor-pointer ${
                  userRole === 'mentor' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-200 hover:text-white'
                }`}
              >
                Mentor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      {userRole === 'mentor' ? (
        <MentorPortal
          studentProfile={profile}
          attendanceSubjects={attendanceSubjects}
          setAttendanceSubjects={setAttendanceSubjects}
          leaveRequests={leaveRequests}
          setLeaveRequests={setLeaveRequests}
          certificates={certificates}
          setCertificates={setCertificates}
          internalMarks={internalMarks}
          setInternalMarks={setInternalMarks}
          semesters={semesters}
          setSemesters={setSemesters}
          fees={fees}
          setFees={setFees}
          transactions={transactions}
          setTransactions={setTransactions}
          internships={internships}
          setInternships={setInternships}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden" id="portal-frame-layout">
        {/* SIDEBAR NAVIGATION (Desktop) */}
        {activeTab === 'Attendance' ? (
          <>
            {/* Hover Trigger Zone and handle */}
            {!isSidebarHovered && (
              <div 
                className="fixed left-0 top-[72px] bottom-0 w-5 bg-gradient-to-r from-[#212c6a]/15 to-transparent hover:from-[#212c6a]/30 transition-all duration-200 cursor-pointer flex items-center justify-start pl-0.5 z-40"
                onMouseEnter={() => setIsSidebarHovered(true)}
              >
                {/* Elegant, subtle vertical capsule handle to indicate hover-activation */}
                <div className="w-1.5 h-20 rounded-r-md bg-[#212c6a] opacity-50 group-hover:opacity-100 transition-all duration-200" />
              </div>
            )}

            {/* The actual sliding drawer sidebar */}
            <aside 
              className={`fixed left-0 top-[72px] bottom-0 w-64 bg-[#212c6a] text-white z-50 shadow-[5px_0_25px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
                isSidebarHovered ? 'translate-x-0' : '-translate-x-full'
              }`}
              onMouseLeave={() => setIsSidebarHovered(false)}
            >
              <nav className="py-4 flex-1">
                <div className="px-6 py-2 pb-4 mb-2 border-b border-white/5">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300">Navigation Menu</p>
                </div>
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.name;
                    const Icon = item.icon;

                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            setActiveTab(item.name);
                            setIsSidebarHovered(false);
                          }}
                          className={`w-full text-left flex items-center px-6 py-3.5 text-xs font-bold border-l-4 transition-all cursor-pointer ${
                            isActive
                              ? 'border-white bg-white/10 text-white font-black'
                              : 'border-transparent text-slate-200 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4.5 h-4.5 text-center mr-3.5 shrink-0 ${item.color}`} />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}

                  {/* Logout button */}
                  <li className="mt-8 border-t border-white/10 pt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-6 py-3.5 text-xs font-bold border-l-4 border-transparent text-slate-200 hover:bg-white/5 hover:text-white cursor-pointer"
                    >
                      <LogOut className="w-4.5 h-4.5 text-center mr-3.5 shrink-0 text-orange-400" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          </>
        ) : (
          <aside className="bg-[#212c6a] w-64 flex-shrink-0 text-white overflow-y-auto hidden md:block" id="portal-desktop-sidebar">
            <nav className="py-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.name;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setActiveTab(item.name)}
                        className={`w-full text-left flex items-center px-6 py-3.5 text-xs font-bold border-l-4 transition-all cursor-pointer ${
                          isActive
                            ? 'border-white bg-white/10 text-white font-black'
                            : 'border-transparent text-slate-200 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 text-center mr-3.5 shrink-0 ${item.color}`} />
                        {item.name}
                      </button>
                    </li>
                  );
                })}

                {/* Logout button */}
                <li className="mt-8 border-t border-white/10 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-6 py-3.5 text-xs font-bold border-l-4 border-transparent text-slate-200 hover:bg-white/5 hover:text-white cursor-pointer"
                  >
                    <LogOut className="w-4.5 h-4.5 text-center mr-3.5 shrink-0 text-orange-400" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </aside>
        )}

        {/* SIDEBAR NAVIGATION (Mobile Overlays) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden" id="portal-mobile-sidebar-overlay">
            {/* Backdrop click closer */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="bg-[#212c6a] w-64 text-white overflow-y-auto z-50 flex flex-col justify-between">
              <nav className="py-6">
                <div className="px-6 pb-6 border-b border-white/10 flex items-center justify-between">
                  <span className="font-extrabold uppercase tracking-widest text-sm text-indigo-300">Quick Portal</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                    <X className="w-5 h-5 text-slate-300 hover:text-white" />
                  </button>
                </div>

                <ul className="space-y-1 mt-4">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.name;
                    const Icon = item.icon;

                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            setActiveTab(item.name);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-center px-6 py-3.5 text-xs font-bold border-l-4 transition-all cursor-pointer ${
                            isActive
                              ? 'border-white bg-white/10 text-white font-black'
                              : 'border-transparent text-slate-200 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4.5 h-4.5 text-center mr-3.5 shrink-0 ${item.color}`} />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                  <li className="mt-8 border-t border-white/10 pt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-6 py-3.5 text-xs font-bold border-l-4 border-transparent text-slate-200 hover:bg-white/5 hover:text-white cursor-pointer"
                    >
                      <LogOut className="w-4.5 h-4.5 text-center mr-3.5 shrink-0 text-orange-400" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN PANEL CONTENT WINDOW */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8" id="portal-main-content-window">
          <div className="max-w-7xl mx-auto">
            {/* Conditional Subcomponents Router */}
            {activeTab === 'Dashboard' && (
              <DashboardTab
                profile={profile}
                attendanceSubjects={attendanceSubjects}
                leaveRequests={leaveRequests}
                semesters={semesters}
                internalAverage={internalAverage}
                overallAttendance={overallAttendance}
                currentCgpa={currentCgpa}
                setActiveTab={setActiveTab}
                onResetDemoData={handleResetDemoData}
              />
            )}

            {activeTab === 'Attendance' && (
              <AttendanceTab
                subjects={attendanceSubjects}
                logs={attendanceLogs}
                overallAttendance={overallAttendance}
                totalAttended={totalAttended}
                totalConducted={totalConducted}
                onUpdateLogs={setAttendanceLogs}
                onUpdateSubjects={setAttendanceSubjects}
              />
            )}

            {activeTab === 'Internal Marks' && (
              <InternalMarksTab
                internalMarks={internalMarks}
                overallAverage={internalAverage}
                onUpdateInternalMarks={setInternalMarks}
              />
            )}

            {activeTab === 'GPA & CGPA' && (
              <GpaCalculatorTab
                semesters={semesters}
                currentCgpa={currentCgpa}
                onUpdateSemesters={setSemesters}
              />
            )}

            {activeTab === 'Leave Request' && (
              <LeaveRequestTab
                leaves={leaveRequests}
                onUpdateLeaves={setLeaveRequests}
              />
            )}

            {activeTab === 'Fee Status' && (
              <FeeStatusTab
                fees={fees}
                transactions={transactions}
                onUpdateFees={setFees}
                onUpdateTransactions={setTransactions}
              />
            )}

            {activeTab === 'Certificate Upload' && (
              <UploadTabs
                mode="certificates"
                certificates={certificates}
                internships={internships}
                onUpdateCertificates={setCertificates}
                onUpdateInternships={setInternships}
              />
            )}

            {activeTab === 'Internship Upload' && (
              <UploadTabs
                mode="internships"
                certificates={certificates}
                internships={internships}
                onUpdateCertificates={setCertificates}
                onUpdateInternships={setInternships}
              />
            )}

            {activeTab === 'Goal Tracking' && (
              <GoalTrackingTab
                goals={goals}
                onUpdateGoals={setGoals}
              />
            )}

            {activeTab === 'Help Request' && (
              <HelpRequestTab
                tickets={tickets}
                onUpdateTickets={setTickets}
              />
            )}

            {activeTab === 'Achievement Badges' && (
              <BadgesTab
                badges={badges}
                currentCgpa={currentCgpa}
                overallAttendance={overallAttendance}
                certificates={certificates}
                goals={goals}
                fees={fees}
              />
            )}
          </div>
        </main>
      </div>)}
    </div>
  );
}
