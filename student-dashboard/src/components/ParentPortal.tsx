/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  ClipboardCheck, 
  FileText, 
  Wallet, 
  Download, 
  LogOut, 
  CheckCircle, 
  AlertTriangle,
  Printer,
  ChevronRight,
  User,
  ShieldAlert,
  MapPin,
  Calendar
} from 'lucide-react';
import { 
  StudentProfile, 
  AttendanceSubject, 
  InternalMarkEntry, 
  SemesterGPA, 
  FeeItem 
} from '../types';

interface ParentPortalProps {
  studentProfile: StudentProfile;
  attendanceSubjects: AttendanceSubject[];
  internalMarks: InternalMarkEntry[];
  semesters: SemesterGPA[];
  fees: FeeItem[];
  onLogout: () => void;
}

export default function ParentPortal({
  studentProfile,
  attendanceSubjects,
  internalMarks,
  semesters,
  fees,
  onLogout
}: ParentPortalProps) {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Stats calculation
  const totalAttended = attendanceSubjects.reduce((sum, s) => sum + s.attended, 0);
  const totalConducted = attendanceSubjects.reduce((sum, s) => sum + s.total, 0);
  const attendancePercentage = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  const calculateSubjectTotal = (assessments: any) => {
    return (
      assessments.quiz1 +
      assessments.midterm +
      assessments.quiz2 +
      assessments.assignment +
      assessments.project
    );
  };

  const internalAverage = internalMarks.length > 0
    ? internalMarks.reduce((sum, m) => sum + calculateSubjectTotal(m.assessments), 0) / internalMarks.length
    : 0;

  const cgpa = semesters.length > 0
    ? semesters.reduce((sum, s) => sum + s.gpa, 0) / semesters.length
    : 0;

  const totalDues = fees.reduce((sum, f) => sum + (f.total - f.paid), 0);

  const handlePrint = () => {
    const printContent = reportRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const win = window.open('', '', 'height=800,width=1000');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Official_Progress_Report_${studentProfile.name}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  body { padding: 20px; font-size: 12px; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body class="bg-white text-slate-900 p-8">
              ${printContent}
              <div class="mt-12 text-center no-print">
                <button onclick="window.print();window.close();" class="bg-blue-900 text-white px-6 py-2 rounded font-bold uppercase tracking-wider text-xs cursor-pointer">
                  Confirm Print / Save PDF
                </button>
              </div>
            </body>
          </html>
        `);
        win.document.close();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="parent-portal-root">
      
      {/* Top Header Bar for Parents */}
      <header className="bg-[#101935] text-white shadow-lg flex-shrink-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-emerald-400">Parent Dashboard</h1>
              <p className="text-[10px] text-slate-300 font-semibold tracking-wide">University Academic Records Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Logged In As</span>
              <span className="text-xs font-black text-white">Guardian of {studentProfile.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg px-3 py-1.5 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Child Profile Overview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={studentProfile.avatarUrl}
              alt={studentProfile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-700 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded">Active Ward</span>
                <span className="text-slate-400 text-xs font-bold">{studentProfile.rollNumber}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">{studentProfile.name}</h2>
              <p className="text-xs text-slate-500 font-semibold">{studentProfile.department} (Semester {studentProfile.semester})</p>
            </div>
          </div>

          {/* Quick Generate Report Card Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="bg-gradient-to-r from-[#101935] to-[#1e285d] hover:brightness-110 text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-400" /> Generate Official Report Card
          </button>
        </div>

        {/* Dashboard Grid for Parents */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Attendance */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Attendance Status</span>
              <ClipboardCheck className={`w-5 h-5 ${attendancePercentage >= 75 ? 'text-emerald-500' : 'text-rose-500'}`} />
            </div>
            <div className="my-4">
              <h3 className="text-3xl font-black text-slate-900">{attendancePercentage.toFixed(1)}%</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {totalAttended} of {totalConducted} classes attended
              </p>
            </div>
            <div>
              {attendancePercentage >= 75 ? (
                <span className="text-[9px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded flex items-center gap-1 w-fit">
                  <CheckCircle className="w-3 h-3" /> Safe Attendance
                </span>
              ) : (
                <span className="text-[9px] font-extrabold uppercase text-rose-700 bg-rose-50 px-2.5 py-1 rounded flex items-center gap-1 w-fit">
                  <AlertTriangle className="w-3 h-3 animate-pulse" /> At Risk (Min 75% req.)
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Cumulative GPA */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Academic CGPA</span>
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="my-4">
              <h3 className="text-3xl font-black text-indigo-950">{cgpa.toFixed(2)}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Based on previous completed terms
              </p>
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded w-fit block">
                Class Rank: Top 15%
              </span>
            </div>
          </div>

          {/* Card 3: Internal Assessment */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Internal Marks Avg</span>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="my-4">
              <h3 className="text-3xl font-black text-slate-900">{internalAverage.toFixed(1)}/100</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Continuous internal assessments
              </p>
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded w-fit block">
                Average across 5 courses
              </span>
            </div>
          </div>

          {/* Card 4: Fee Dues */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Pending Fee Dues</span>
              <Wallet className={`w-5 h-5 ${totalDues > 0 ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`} />
            </div>
            <div className="my-4">
              <h3 className="text-3xl font-black text-slate-900">₹ {totalDues.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Total outstanding balance
              </p>
            </div>
            <div>
              {totalDues > 0 ? (
                <span className="text-[9px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded w-fit block">
                  Payment Overdue
                </span>
              ) : (
                <span className="text-[9px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded w-fit block">
                  Fully Settled
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Records Accordion Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: Subject Attendance */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">Class Attendance Sheet</h3>
              <p className="text-xs text-slate-500">Monitor course-specific attendance lectures.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {attendanceSubjects.map((sub) => {
                const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
                return (
                  <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-indigo-700 tracking-wider block">{sub.code}</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{sub.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Instructor: {sub.teacher}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black block ${pct >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {pct.toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {sub.attended}/{sub.total} classes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Internal Mark Sheet */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">Internal Mark Sheet</h3>
              <p className="text-xs text-slate-500">Mid-term assessments, projects, and assignments.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {internalMarks.map((mark) => {
                const total = calculateSubjectTotal(mark.assessments);
                return (
                  <div key={mark.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-indigo-700 tracking-wider block">{mark.subjectCode}</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{mark.subjectName}</h4>
                      <div className="flex gap-2 text-[9px] text-slate-400 font-bold mt-1">
                        <span>Q1: {mark.assessments.quiz1}</span>
                        <span>MT: {mark.assessments.midterm}</span>
                        <span>Q2: {mark.assessments.quiz2}</span>
                        <span>AS: {mark.assessments.assignment}</span>
                        <span>PR: {mark.assessments.project}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-950 block">
                        {total.toFixed(1)} / 100
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        total >= 75 ? 'bg-emerald-50 text-emerald-700' : total >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {total >= 75 ? 'First Class' : total >= 50 ? 'Pass' : 'Low Score'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      {/* PRINT PREVIEW / REPORT GENERATION MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Actions Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Official Progress Report Preview</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Ready to print or save as PDF document</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-lg text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold px-3 py-2 rounded-lg text-xs uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Document Content Wrapper */}
            <div className="p-8 overflow-y-auto flex-1 bg-white" ref={reportRef}>
              
              {/* Formal Academic Letterhead */}
              <div className="border-b-4 border-double border-slate-900 pb-6 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-8 h-8 text-[#101935]" />
                  <span className="text-xl font-black tracking-widest text-[#101935] uppercase">UNIVERSITY ACADEMIC CELL</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Affiliated to National Board of Accreditation • ISO 9001 Certified</p>
                <p className="text-[10px] text-slate-400">Campus: OMR Road, Sholinganallur, Chennai, Tamil Nadu - 600119</p>
              </div>

              {/* Title */}
              <div className="my-6 text-center">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 w-fit mx-auto">
                  OFFICIAL WARD PERFORMANCE REPORT CARD
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Generated on: {new Date().toLocaleDateString()}</p>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs my-6">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Student Name</span>
                  <span className="font-extrabold text-slate-900">{studentProfile.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Enrollment Roll Number</span>
                  <span className="font-extrabold text-slate-900">{studentProfile.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Department / Major</span>
                  <span className="font-extrabold text-slate-900">{studentProfile.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase font-black tracking-wider block">Academic Semester & Batch</span>
                  <span className="font-extrabold text-slate-900">Semester {studentProfile.semester} (Batch of 2023 - 2027)</span>
                </div>
              </div>

              {/* Performance Metrics Block */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-l-2 border-slate-900 pl-2 mb-3">1. Attendance Report</h3>
                  <table className="w-full text-left border border-slate-150 text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 font-black uppercase">Subject Code</th>
                        <th className="px-3 py-2 font-black uppercase">Subject Name</th>
                        <th className="px-3 py-2 font-black uppercase text-center">Attended / Total</th>
                        <th className="px-3 py-2 font-black uppercase text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {attendanceSubjects.map((sub) => {
                        const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
                        return (
                          <tr key={sub.id}>
                            <td className="px-3 py-2 font-bold text-slate-800">{sub.code}</td>
                            <td className="px-3 py-2 text-slate-600">{sub.name}</td>
                            <td className="px-3 py-2 text-center text-slate-600">{sub.attended} / {sub.total}</td>
                            <td className={`px-3 py-2 text-right font-black ${pct >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>{pct.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-slate-50 font-black border-t border-slate-200">
                        <td colSpan={2} className="px-3 py-2 uppercase">Overall Student Attendance</td>
                        <td className="px-3 py-2 text-center">{totalAttended} / {totalConducted}</td>
                        <td className={`px-3 py-2 text-right text-xs ${attendancePercentage >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>{attendancePercentage.toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-l-2 border-slate-900 pl-2 mb-3">2. Continuous Internal Assessment (CIA)</h3>
                  <table className="w-full text-left border border-slate-150 text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 font-black uppercase">Subject Name</th>
                        <th className="px-3 py-2 font-black uppercase text-center">Q1 (10)</th>
                        <th className="px-3 py-2 font-black uppercase text-center">Mid (30)</th>
                        <th className="px-3 py-2 font-black uppercase text-center">Q2 (10)</th>
                        <th className="px-3 py-2 font-black uppercase text-center">Asg (10)</th>
                        <th className="px-3 py-2 font-black uppercase text-center">Proj (40)</th>
                        <th className="px-3 py-2 font-black uppercase text-right">Total Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {internalMarks.map((mark) => {
                        const total = calculateSubjectTotal(mark.assessments);
                        return (
                          <tr key={mark.id}>
                            <td className="px-3 py-2 font-bold text-slate-800">{mark.subjectName}</td>
                            <td className="px-3 py-2 text-center text-slate-600">{mark.assessments.quiz1}</td>
                            <td className="px-3 py-2 text-center text-slate-600">{mark.assessments.midterm}</td>
                            <td className="px-3 py-2 text-center text-slate-600">{mark.assessments.quiz2}</td>
                            <td className="px-3 py-2 text-center text-slate-600">{mark.assessments.assignment}</td>
                            <td className="px-3 py-2 text-center text-slate-600">{mark.assessments.project}</td>
                            <td className="px-3 py-2 text-right font-black text-slate-900">{total.toFixed(1)} / 100</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-slate-50 font-black border-t border-slate-200">
                        <td colSpan={6} className="px-3 py-2 uppercase">Continuous Internal Assessment Average</td>
                        <td className="px-3 py-2 text-right text-xs text-indigo-950">{internalAverage.toFixed(1)} / 100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Academic CGPA overview */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-black text-slate-900 uppercase">CUMULATIVE GRADE POINT AVERAGE (CGPA)</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Aggregated overall semesters score tracker</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-950 block">{cgpa.toFixed(2)} / 10.0</span>
                    <span className="text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">First Class with Distinction</span>
                  </div>
                </div>
              </div>

              {/* Institutional Signatures */}
              <div className="mt-16 grid grid-cols-2 pt-12 border-t border-dashed border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="w-36 border-b border-slate-400 h-8 flex items-end font-serif italic text-slate-600 text-[13px]">Dr. Vimal Raja</div>
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Academic Counselor & Mentor</span>
                  <span className="text-[9px] text-slate-500 font-semibold block">University Student Cell</span>
                </div>
                <div className="space-y-1 text-right">
                  <div className="w-36 border-b border-slate-400 h-8 ml-auto flex items-end justify-end font-serif italic text-slate-600 text-[13px]">[Digital Verification]</div>
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Controller of Examinations</span>
                  <span className="text-[9px] text-slate-500 font-semibold block">University Administration</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
