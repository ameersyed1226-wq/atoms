/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  ClipboardCheck, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Wallet, 
  Award, 
  Briefcase, 
  BarChart3, 
  FileSpreadsheet, 
  HelpCircle, 
  MessageSquare, 
  Search, 
  UserCheck, 
  Send, 
  Check, 
  X, 
  Plus, 
  RefreshCw, 
  GraduationCap, 
  Download, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  AttendanceSubject, 
  LeaveRequest, 
  StudentCertificate, 
  InternalMarkEntry,
  SemesterGPA,
  FeeItem,
  Transaction,
  InternshipEntry
} from '../types';

interface MentorPortalProps {
  // Live states passed from App.tsx so changes in mentor dashboard reflect on student dashboard!
  studentProfile: { name: string; rollNumber: string; department: string; email: string };
  attendanceSubjects: AttendanceSubject[];
  setAttendanceSubjects: React.Dispatch<React.SetStateAction<AttendanceSubject[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  certificates: StudentCertificate[];
  setCertificates: React.Dispatch<React.SetStateAction<StudentCertificate[]>>;
  internalMarks: InternalMarkEntry[];
  setInternalMarks: React.Dispatch<React.SetStateAction<InternalMarkEntry[]>>;
  semesters: SemesterGPA[];
  setSemesters: React.Dispatch<React.SetStateAction<SemesterGPA[]>>;
  fees: FeeItem[];
  setFees: React.Dispatch<React.SetStateAction<FeeItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  internships: InternshipEntry[];
  setInternships: React.Dispatch<React.SetStateAction<InternshipEntry[]>>;
}

export default function MentorPortal({
  studentProfile,
  attendanceSubjects,
  setAttendanceSubjects,
  leaveRequests,
  setLeaveRequests,
  certificates,
  setCertificates,
  internalMarks,
  setInternalMarks,
  semesters,
  setSemesters,
  fees,
  setFees,
  transactions,
  setTransactions,
  internships,
  setInternships
}: MentorPortalProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states for Internship Tracker
  const [formStudent, setFormStudent] = useState('Ameer Syed');
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formStatus, setFormStatus] = useState<'Offered' | 'Ongoing' | 'Completed'>('Completed');

  // Help Request form
  const [helpConcern, setHelpConcern] = useState('');
  const [helpRequests, setHelpRequests] = useState([
    { id: 'HR001', studentName: 'Syed Ameer R', concern: 'Need academic guidance', status: 'Pending' },
    { id: 'HR002', studentName: 'Sathya', concern: 'Personal counseling support', status: 'Reviewed' }
  ]);

  // AI Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Assistant for Mentor Support. How can I help you today?' }
  ]);

  // Dynamic calculations based on live student data
  const studentAttended = attendanceSubjects.reduce((sum, s) => sum + s.attended, 0);
  const studentTotal = attendanceSubjects.reduce((sum, s) => sum + s.total, 0);
  const studentAttendancePct = studentTotal > 0 ? (studentAttended / studentTotal) * 100 : 0;

  const calculateTotalMarks = (entry: InternalMarkEntry) => {
    return (
      entry.assessments.quiz1 +
      entry.assessments.midterm +
      entry.assessments.quiz2 +
      entry.assessments.assignment +
      entry.assessments.project
    );
  };
  const studentInternalAvg = internalMarks.length > 0 
    ? internalMarks.reduce((sum, m) => sum + calculateTotalMarks(m), 0) / internalMarks.length 
    : 0;

  const studentCgpa = semesters.length > 0 
    ? semesters.reduce((sum, s) => sum + s.gpa, 0) / semesters.length 
    : 0;

  // Let's model the 4 requested students (including live states for the active one!)
  const students = [
    {
      name: 'Syed Ameer R',
      rollNo: '22CSE0408',
      department: 'Computer Science & Engineering',
      year: 'III',
      attendance: studentProfile.rollNumber === '22CSE0408' ? studentAttendancePct : 86.2,
      cgpa: studentProfile.rollNumber === '22CSE0408' ? studentCgpa : 8.98,
      internalAvg: studentProfile.rollNumber === '22CSE0408' ? studentInternalAvg : 83.4,
      feeStatus: studentProfile.rollNumber === '22CSE0408' ? (fees.some(f => f.paid < f.total) ? 'Pending' : 'Paid') : 'Paid',
      leaves: studentProfile.rollNumber === '22CSE0408' ? leaveRequests.length : 1,
      certificates: studentProfile.rollNumber === '22CSE0408' ? certificates.length : 2,
      status: (studentProfile.rollNumber === '22CSE0408' ? studentAttendancePct : 86.2) >= 75 ? 'Good' : 'At Risk'
    },
    {
      name: 'Tharun G',
      rollNo: '22CSE0401',
      department: 'Computer Science & Engineering',
      year: 'III',
      attendance: studentProfile.rollNumber === '22CSE0401' ? studentAttendancePct : 95.0,
      cgpa: studentProfile.rollNumber === '22CSE0401' ? studentCgpa : 9.52,
      internalAvg: studentProfile.rollNumber === '22CSE0401' ? studentInternalAvg : 92.5,
      feeStatus: studentProfile.rollNumber === '22CSE0401' ? (fees.some(f => f.paid < f.total) ? 'Pending' : 'Paid') : 'Paid',
      leaves: studentProfile.rollNumber === '22CSE0401' ? leaveRequests.length : 0,
      certificates: studentProfile.rollNumber === '22CSE0401' ? certificates.length : 3,
      status: 'Excellent'
    },
    {
      name: 'Sathya',
      rollNo: '22CSE0415',
      department: 'Computer Science & Engineering',
      year: 'III',
      attendance: studentProfile.rollNumber === '22CSE0415' ? studentAttendancePct : 63.0,
      cgpa: studentProfile.rollNumber === '22CSE0415' ? studentCgpa : 7.31,
      internalAvg: studentProfile.rollNumber === '22CSE0415' ? studentInternalAvg : 60.5,
      feeStatus: studentProfile.rollNumber === '22CSE0415' ? (fees.some(f => f.paid < f.total) ? 'Pending' : 'Paid') : 'Pending',
      leaves: studentProfile.rollNumber === '22CSE0415' ? leaveRequests.length : 3,
      certificates: studentProfile.rollNumber === '22CSE0415' ? certificates.length : 0,
      status: 'At Risk'
    },
    {
      name: 'Logajanani',
      rollNo: '22CSE0422',
      department: 'Computer Science & Engineering',
      year: 'III',
      attendance: studentProfile.rollNumber === '22CSE0422' ? studentAttendancePct : 97.0,
      cgpa: studentProfile.rollNumber === '22CSE0422' ? studentCgpa : 9.71,
      internalAvg: studentProfile.rollNumber === '22CSE0422' ? studentInternalAvg : 97.6,
      feeStatus: studentProfile.rollNumber === '22CSE0422' ? (fees.some(f => f.paid < f.total) ? 'Pending' : 'Paid') : 'Paid',
      leaves: studentProfile.rollNumber === '22CSE0422' ? leaveRequests.length : 0,
      certificates: studentProfile.rollNumber === '22CSE0422' ? certificates.length : 4,
      status: 'Excellent'
    }
  ];

  // Search filter
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle handlers that directly update Student's state
  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(lr => lr.id === leaveId ? { ...lr, status: 'Approved' } : lr));
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(lr => lr.id === leaveId ? { ...lr, status: 'Rejected' } : lr));
  };

  const handleVerifyCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => c.id === certId ? { ...c, status: 'Verified' } : c));
  };

  const handleRejectCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => c.id === certId ? { ...c, status: 'Rejected' } : c));
  };

  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole) return;
    const newEntry: InternshipEntry = {
      id: 'int' + (internships.length + 1),
      companyName: formCompany,
      role: formRole,
      startDate: new Date().toISOString().split('T')[0],
      duration: '3 Months',
      status: formStatus,
      description: 'Internship verified and tracked by Mentor.'
    };
    setInternships(prev => [newEntry, ...prev]);
    setFormCompany('');
    setFormRole('');
  };

  const handleAddHelpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpConcern) return;
    const newReq = {
      id: 'HR00' + (helpRequests.length + 1),
      studentName: 'Ameer Syed',
      concern: helpConcern,
      status: 'Pending'
    };
    setHelpRequests([newReq, ...helpRequests]);
    setHelpConcern('');
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);

    const prompt = chatInput.toLowerCase();
    let replyText = "I see. As a mentor, you can monitor this student's attendance and academic logs in real-time under Student Management.";
    if (prompt.includes('hi') || prompt.includes('hello')) {
      replyText = "Hello! I can analyze class statistics, identify at-risk students, or help you generate progress reports.";
    } else if (prompt.includes('risk') || prompt.includes('low')) {
      replyText = "Based on current data, Priya Nair is currently 'At Risk' because her overall attendance is 72.5% (below the required 75%).";
    } else if (prompt.includes('leave') || prompt.includes('approve')) {
      replyText = "You can instantly review, approve, or decline student leave requests in the 'Leave Approval' tab.";
    }

    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: replyText }]);
    }, 600);
  };

  // Sidebar navigation menu items
  const sidebarItems = [
    { name: 'Dashboard', icon: Home, color: 'text-[#e58a2d]' },
    { name: 'Student Management', icon: Users, color: 'text-sky-400' },
    { name: 'Attendance', icon: ClipboardCheck, color: 'text-green-400' },
    { name: 'Internal Marks', icon: FileText, color: 'text-red-300' },
    { name: 'GPA & CGPA', icon: TrendingUp, color: 'text-pink-400' },
    { name: 'AI Risk Prediction', icon: AlertTriangle, color: 'text-amber-400' },
    { name: 'Leave Approval', icon: CheckCircle2, color: 'text-teal-400' },
    { name: 'Fee Verification', icon: Wallet, color: 'text-yellow-400' },
    { name: 'Certificates', icon: Award, color: 'text-indigo-300' },
    { name: 'Internship Tracker', icon: Briefcase, color: 'text-amber-600' },
    { name: 'Analytics', icon: BarChart3, color: 'text-violet-400' },
    { name: 'Parent Reports', icon: FileSpreadsheet, color: 'text-emerald-400' },
    { name: 'Help Requests', icon: HelpCircle, color: 'text-pink-300' },
    { name: 'AI Chatbot', icon: MessageSquare, color: 'text-indigo-400' }
  ];

  return (
    <div className="bg-slate-50 flex h-full overflow-hidden" id="mentor-portal-root">
      
      {/* Sidebar Navigation */}
      <aside className="bg-[#1a2353] w-68 flex-shrink-0 text-white flex flex-col hidden md:flex border-r border-[#151c42]">
        <div className="p-5 border-b border-white/5 bg-[#151c42]">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-sky-300">University Admin</p>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-1">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Mentor Workspace
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5">
            {sidebarItems.map(item => {
              const isActive = activeTab === item.name;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full text-left flex items-center px-5 py-2.5 text-xs font-bold border-l-4 transition-all cursor-pointer ${
                      isActive
                        ? 'border-sky-400 bg-white/10 text-white font-extrabold'
                        : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 shrink-0 ${item.color}`} />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Sub-header inside main portal */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <Users className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-[#1a2353] uppercase tracking-wider px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md">
                Active Mentor Portal
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">{activeTab} Overview</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search mentees..."
                className="bg-slate-100/80 border border-slate-200 rounded-lg py-1.5 pl-8 pr-4 text-[11px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white w-48"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center border border-indigo-100">
                M
              </div>
              <div className="hidden lg:block text-left leading-none">
                <p className="text-[11px] font-bold text-slate-800">Dr. Sarah Connor</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Senior Faculty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Work Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8" id="mentor-workspace-content">
          
          {/* =========================================
              DASHBOARD VIEW
              ========================================= */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              {/* Welcome banner as shown in video */}
              <div className="bg-gradient-to-r from-[#1a2353] to-[#2a3782] text-white p-6 rounded-xl border border-[#1a2353]/10 shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <h3 className="text-xl md:text-2xl font-black flex items-center gap-2">
                    Welcome Mentor 🎓
                  </h3>
                  <p className="text-xs text-sky-200/90 mt-2 leading-relaxed">
                    You have active oversight of <strong>4 Mentees</strong> this semester. All system parameters like leaves, fee approvals, and certificates can be actioned instantly.
                  </p>
                </div>
                <div className="absolute right-6 bottom-4 text-[#1a2353]/10 pointer-events-none hidden md:block">
                  <GraduationCap className="w-40 h-40" />
                </div>
              </div>

              {/* Six KPI Cards precisely like the video */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col justify-between text-center min-h-[110px]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Total Mentees</p>
                  <p className="text-2xl font-black text-[#1a2353] my-1">4</p>
                  <div className="text-[9px] font-bold text-slate-400">Class strength</div>
                </div>
                
                <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col justify-between text-center min-h-[110px]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Attendance Average</p>
                  <p className="text-2xl font-black text-[#1a2353] my-1">
                    {(students.reduce((sum, s) => sum + s.attendance, 0) / 4).toFixed(0)}%
                  </p>
                  <div className="text-[9px] font-bold text-emerald-600">Overall average</div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col justify-between text-center min-h-[110px]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">At Risk Students</p>
                  <p className="text-2xl font-black text-rose-600 my-1">
                    {students.filter(s => s.status === 'At Risk').length}
                  </p>
                  <div className="text-[9px] font-bold text-rose-500">Needs attention</div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col justify-between text-center min-h-[110px]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Pending Leaves</p>
                  <p className="text-2xl font-black text-amber-600 my-1">
                    {leaveRequests.filter(l => l.status === 'Pending').length}
                  </p>
                  <div className="text-[9px] font-bold text-amber-500">Pending review</div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col justify-between text-center min-h-[110px]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Fee Requests</p>
                  <p className="text-2xl font-black text-[#1a2353] my-1">
                    {students.filter(s => s.feeStatus === 'Pending').length}
                  </p>
                  <div className="text-[9px] font-bold text-slate-400">Outstanding dues</div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col justify-between text-center min-h-[110px]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Certificates Submitted</p>
                  <p className="text-2xl font-black text-indigo-600 my-1">
                    {certificates.filter(c => c.status === 'Pending Verification').length}
                  </p>
                  <div className="text-[9px] font-bold text-indigo-500">Need approval</div>
                </div>
              </div>

              {/* Recent Student Activities Table */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="text-sm font-extrabold text-slate-900">Recent Student Activities</h4>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">Live Records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">CGPA</th>
                        <th className="px-6 py-3.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-extrabold text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.attendance.toFixed(1)}%</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.cgpa.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              student.status === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              student.status === 'Good' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                              'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              STUDENT MANAGEMENT VIEW
              ========================================= */}
          {activeTab === 'Student Management' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Student Records</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Track, search and view individual profile details</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSearchQuery('')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer">
                      Reset Filters
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Register No</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">CGPA</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredStudents.map((student, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.rollNo}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">{student.department}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.year}</td>
                          <td className="px-6 py-4 text-xs font-extrabold text-[#1a2353]">{student.cgpa.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              student.status === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              student.status === 'Good' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                              'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-center">
                            <button className="bg-[#1a2353] hover:bg-[#151c42] text-white font-bold px-3 py-1.5 rounded text-[10px] tracking-wider uppercase shadow-xs cursor-pointer transition-transform active:scale-95">
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              ATTENDANCE VIEW
              ========================================= */}
          {activeTab === 'Attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Students</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">4</p>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Average Attendance</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {(students.reduce((sum, s) => sum + s.attendance, 0) / 4).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Low Attendance Students</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">1</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Student Attendance Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Register No</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Present Days</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Absent Days</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Attendance %</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {students.map((student, idx) => {
                        const total = 40;
                        const present = Math.round((student.attendance / 100) * total);
                        const absent = total - present;
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{student.rollNo}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-700 text-center">{present}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-700 text-center">{absent}</td>
                            <td className="px-6 py-4 text-xs font-extrabold text-indigo-950">{student.attendance.toFixed(1)}%</td>
                            <td className="px-6 py-4 text-xs">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                student.attendance >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {student.attendance >= 75 ? 'Normal' : 'Shortage'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              INTERNAL MARKS VIEW
              ========================================= */}
          {activeTab === 'Internal Marks' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Students</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">4</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Average Internal Mark</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {(students.reduce((sum, s) => sum + s.internalAvg, 0) / 4).toFixed(1)}/100
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Top Performers</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">2</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Student Internal Marks</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Register No</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Quiz 1 (10)</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Midterm (30)</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Quiz 2 (10)</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center font-black">Average (100)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {students.map((student, idx) => {
                        const q1 = student.internalAvg > 85 ? 9.5 : student.internalAvg > 75 ? 8.0 : 6.5;
                        const mid = student.internalAvg > 85 ? 28.0 : student.internalAvg > 75 ? 24.0 : 19.5;
                        const q2 = student.internalAvg > 85 ? 9.0 : student.internalAvg > 75 ? 8.5 : 7.0;
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{student.rollNo}</td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 text-center">{q1}</td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 text-center">{mid}</td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-600 text-center">{q2}</td>
                            <td className="px-6 py-4 text-xs font-extrabold text-[#1a2353] text-center bg-indigo-50/20">{student.internalAvg.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              GPA & CGPA VIEW
              ========================================= */}
          {activeTab === 'GPA & CGPA' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Top CGPA</p>
                  <p className="text-xl font-black text-emerald-600 mt-1">9.20</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Average GPA</p>
                  <p className="text-xl font-black text-slate-900 mt-1">8.82</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Average CGPA</p>
                  <p className="text-xl font-black text-slate-900 mt-1">8.67</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Low CGPA Students</p>
                  <p className="text-xl font-black text-slate-400 mt-1">0</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Student GPA & CGPA Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Register No</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Semester GPA</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">CGPA</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{student.rollNo}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700 text-center">{(student.cgpa * 0.98).toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs font-black text-[#1a2353] text-center">{student.cgpa.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              student.cgpa >= 9.0 ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                            }`}>
                              {student.cgpa >= 9.0 ? 'Outstanding' : 'Very Good'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              AI RISK PREDICTION VIEW
              ========================================= */}
          {activeTab === 'AI Risk Prediction' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Students</p>
                  <p className="text-xl font-black text-slate-900 mt-1">4</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center bg-emerald-50/30 border-emerald-100">
                  <p className="text-[10px] uppercase font-extrabold text-emerald-600">Low Risk</p>
                  <p className="text-xl font-black text-emerald-700 mt-1">3</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-[10px] uppercase font-extrabold text-amber-500">Medium Risk</p>
                  <p className="text-xl font-black text-amber-600 mt-1">0</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-center bg-rose-50/30 border-rose-100 animate-pulse">
                  <p className="text-[10px] uppercase font-extrabold text-rose-600">High Risk</p>
                  <p className="text-xl font-black text-rose-700 mt-1">1</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-bounce" />
                  <h3 className="text-base font-black text-slate-900">Student Risk Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Attendance %</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">CGPA</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Internal Average</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600 text-center">{student.attendance.toFixed(1)}%</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600 text-center">{student.cgpa.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600 text-center">{student.internalAvg.toFixed(1)}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              student.status === 'At Risk' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {student.status === 'At Risk' ? '⚠️ High Risk' : '🟢 Safe'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              LEAVE APPROVAL VIEW
              ========================================= */}
          {activeTab === 'Leave Approval' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Pending Requests</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {leaveRequests.filter(l => l.status === 'Pending').length}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Approved Leaves</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {leaveRequests.filter(l => l.status === 'Approved').length}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400">Rejected Leaves</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {leaveRequests.filter(l => l.status === 'Rejected').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Leave Requests</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Leave Date</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {leaveRequests.map((leave, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{studentProfile.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{leave.startDate} to {leave.endDate}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs truncate">{leave.reason}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                              leave.status === 'Pending' ? 'bg-amber-50 text-amber-700 animate-pulse' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-center">
                            {leave.status === 'Pending' ? (
                              <div className="flex gap-2 justify-center">
                                <button 
                                  onClick={() => handleApproveLeave(leave.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded text-[10px] uppercase cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectLeave(leave.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1.5 rounded text-[10px] uppercase cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-bold text-[10px] uppercase">Decision Logged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              FEE VERIFICATION VIEW
              ========================================= */}
          {activeTab === 'Fee Verification' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs text-center">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Paid Students</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">3</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs text-center">
                  <p className="text-[10px] uppercase font-extrabold text-amber-500">Pending Fee Students</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">1</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Fee Status Overview</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Register No</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Fee Status</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Receipt</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Extension Request</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{student.rollNo}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              student.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {student.feeStatus === 'Paid' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                            {student.feeStatus === 'Paid' ? '✓ Uploaded' : '✗ Not Uploaded'}
                          </td>
                          <td className="px-6 py-4 text-xs text-center font-bold text-slate-500">
                            {idx === 0 ? 'Yes' : 'No'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              CERTIFICATES VIEW
              ========================================= */}
          {activeTab === 'Certificates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs">
                <h3 className="text-base font-black text-slate-900">Certificate Overview</h3>
                <p className="text-xs text-slate-500 mt-1">Review student credentials uploaded from global learning platforms.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Certificate Title</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {certificates.map((cert, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{studentProfile.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-700">{cert.title}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">{cert.category}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              cert.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                              cert.status === 'Pending Verification' ? 'bg-amber-50 text-amber-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {cert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-center">
                            {cert.status === 'Pending Verification' ? (
                              <div className="flex gap-1.5 justify-center">
                                <button 
                                  onClick={() => handleVerifyCertificate(cert.id)}
                                  className="bg-[#1a2353] hover:bg-[#151c42] text-white font-bold px-2.5 py-1.5 rounded text-[10px] uppercase cursor-pointer"
                                >
                                  Verify
                                </button>
                                <button 
                                  onClick={() => handleRejectCertificate(cert.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1.5 rounded text-[10px] uppercase cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-bold text-[10px] uppercase">Logged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              INTERNSHIP TRACKER VIEW
              ========================================= */}
          {activeTab === 'Internship Tracker' && (
            <div className="space-y-6">
              
              {/* Submission Form */}
              <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs">
                <h3 className="text-base font-black text-slate-900 mb-4">Internship Details</h3>
                <form onSubmit={handleAddInternship} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Student Name</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold"
                      value={formStudent}
                      onChange={e => setFormStudent(e.target.value)}
                    >
                      <option value="Ameer Syed">Ameer Syed</option>
                      <option value="Priya Nair">Priya Nair</option>
                      <option value="Sathya Murthy">Sathya Murthy</option>
                      <option value="Kavya Ram">Kavya Ram</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon India"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold"
                      value={formCompany}
                      onChange={e => setFormCompany(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Role Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SWE Intern"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold"
                      value={formRole}
                      onChange={e => setFormRole(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold"
                        value={formStatus}
                        onChange={e => setFormStatus(e.target.value as any)}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Offered">Offered</option>
                      </select>
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#1a2353] hover:bg-[#151c42] text-white font-extrabold px-5 py-3 rounded-lg text-xs uppercase cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {/* Records table */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Internship Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {/* Active student internships */}
                      {internships.map((int, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{studentProfile.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-700">{int.companyName}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">{int.role}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              int.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {int.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {/* Fallback mock internship */}
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-black text-slate-900">Sathya Murthy</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">Microsoft India</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">Research Intern</td>
                        <td className="px-6 py-4 text-xs">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                            Completed
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              ANALYTICS VIEW
              ========================================= */}
          {activeTab === 'Analytics' && (
            <div className="space-y-6">
              
              {/* Analytics dashboard title card */}
              <div className="bg-[#1a2353] text-white p-5 rounded-xl border border-white/5 shadow-xs">
                <h3 className="text-base font-black text-slate-100">Analytics Dashboard</h3>
                <p className="text-xs text-sky-200 mt-1">Global aggregates, visual trends and performance indexing.</p>
              </div>

              {/* Aggregates row */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Students</p>
                  <p className="text-xl font-black text-indigo-950 mt-1">4</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Average Attendance</p>
                  <p className="text-xl font-black text-indigo-950 mt-1">83.9%</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Average CGPA</p>
                  <p className="text-xl font-black text-indigo-950 mt-1">8.67</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Certificates</p>
                  <p className="text-xl font-black text-indigo-950 mt-1">{certificates.length}</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Internships</p>
                  <p className="text-xl font-black text-indigo-950 mt-1">{internships.length}</p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Pending Leaves</p>
                  <p className="text-xl font-black text-rose-600 mt-1">
                    {leaveRequests.filter(l => l.status === 'Pending').length}
                  </p>
                </div>
              </div>

              {/* Category summary card exactly like the video */}
              <div className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Performance Summary</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="p-4 flex justify-between text-xs font-bold">
                    <span className="text-slate-600 uppercase">attendance</span>
                    <span className="text-[#1a2353]">83.9%</span>
                  </div>
                  <div className="p-4 flex justify-between text-xs font-bold">
                    <span className="text-slate-600 uppercase">CGPA</span>
                    <span className="text-[#1a2353]">8.67</span>
                  </div>
                  <div className="p-4 flex justify-between text-xs font-bold">
                    <span className="text-slate-600 uppercase">certificates</span>
                    <span className="text-[#1a2353]">{certificates.length}</span>
                  </div>
                  <div className="p-4 flex justify-between text-xs font-bold">
                    <span className="text-slate-600 uppercase">internships</span>
                    <span className="text-[#1a2353]">{internships.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              PARENT REPORTS VIEW
              ========================================= */}
          {activeTab === 'Parent Reports' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">Parent Progress Report</h3>
                  <p className="text-xs text-slate-500 mt-1">Export, review and sync structural report cards with parents.</p>
                </div>
                <button 
                  onClick={() => alert("Progress Report Card PDF compiled successfully and sent to registered Parent emails.")}
                  className="bg-[#1a2353] hover:bg-[#151c42] text-white font-extrabold px-5 py-2.5 rounded-lg text-xs uppercase cursor-pointer flex items-center gap-1.5 self-start"
                >
                  <Download className="w-4 h-4" /> Generate Report
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Internal Marks</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">CGPA</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Fee Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {students.map((student, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-slate-900">{student.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.attendance.toFixed(1)}%</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.internalAvg.toFixed(1)}/100</td>
                          <td className="px-6 py-4 text-xs font-black text-indigo-950">{student.cgpa.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              student.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {student.feeStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              HELP REQUESTS VIEW
              ========================================= */}
          {activeTab === 'Help Requests' && (
            <div className="space-y-6">
              
              {/* Submission Form */}
              <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs">
                <h3 className="text-base font-black text-slate-900 mb-2">Anonymous Help Request</h3>
                <p className="text-xs text-slate-500 mb-4">Mentees can submit personal, mental health or academic requests here anonymously.</p>
                <form onSubmit={handleAddHelpRequest} className="space-y-3">
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter your concern here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-semibold focus:outline-indigo-600 focus:bg-white"
                    value={helpConcern}
                    onChange={e => setHelpConcern(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="bg-[#1a2353] hover:bg-[#151c42] text-white font-extrabold px-6 py-2.5 rounded text-xs uppercase cursor-pointer"
                  >
                    Submit Request
                  </button>
                </form>
              </div>

              {/* Submitted Requests List */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-base font-black text-slate-900">Submitted Requests</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a2353] text-white border-b border-[#151c42]">
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Request ID</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Concern</th>
                        <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {helpRequests.map((req, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{req.id}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-700">{req.concern}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                              req.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              AI CHATBOT VIEW
              ========================================= */}
          {activeTab === 'AI Chatbot' && (
            <div className="bg-white border border-slate-150 rounded-xl h-[460px] flex flex-col shadow-xs overflow-hidden" id="mentor-ai-chatbot">
              
              {/* Chatbot Header */}
              <div className="bg-[#1a2353] text-white p-4 border-b border-[#151c42] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold">AI Chatbot</h4>
                    <p className="text-[9px] text-sky-200">Powered by Mentor Insights AI</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatMessages([{ sender: 'bot', text: 'Hello! I am your AI Assistant for Mentor Support. How can I help you today?' }])}
                  className="p-1.5 hover:bg-white/10 rounded text-slate-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#1a2353] text-white rounded-tr-none'
                        : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none shadow-xs'
                    }`}>
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-150 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about class performance or risks..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-[#1a2353] hover:bg-[#151c42] text-white p-2.5 rounded-lg cursor-pointer"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="mentor-mobile-drawer">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <aside className="bg-[#1a2353] w-64 text-white z-50 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 border-b border-white/5 bg-[#151c42] flex items-center justify-between">
                <span className="font-extrabold uppercase tracking-widest text-xs text-sky-300">Workspace</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-300 hover:text-white cursor-pointer" />
                </button>
              </div>
              <nav className="py-4">
                <ul className="space-y-0.5">
                  {sidebarItems.map(item => {
                    const isActive = activeTab === item.name;
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            setActiveTab(item.name);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-center px-5 py-2.5 text-xs font-bold border-l-4 transition-all cursor-pointer ${
                            isActive
                              ? 'border-sky-400 bg-white/10 text-white font-extrabold'
                              : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mr-3 shrink-0 ${item.color}`} />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}
