/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowUpRight 
} from 'lucide-react';
import { 
  StudentProfile, 
  AttendanceSubject, 
  LeaveRequest, 
  SemesterGPA 
} from '../types';

interface DashboardTabProps {
  profile: StudentProfile;
  attendanceSubjects: AttendanceSubject[];
  leaveRequests: LeaveRequest[];
  semesters: SemesterGPA[];
  internalAverage: number;
  overallAttendance: number;
  currentCgpa: number;
  setActiveTab: (tab: string) => void;
  onResetDemoData?: () => void;
}

export default function DashboardTab({
  profile,
  attendanceSubjects,
  leaveRequests,
  semesters,
  internalAverage,
  overallAttendance,
  currentCgpa,
  setActiveTab,
  onResetDemoData,
}: DashboardTabProps) {
  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'Pending').length;

  const quickStats = [
    {
      id: 'internal',
      title: 'Internal Marks',
      value: `${internalAverage.toFixed(1)}/100`,
      desc: 'Average overall assessments',
      color: 'text-indigo-600',
      tab: 'Internal Marks',
    },
    {
      id: 'leaves',
      title: 'Pending Leaves',
      value: pendingLeavesCount.toString(),
      desc: 'Active requested leaves',
      color: 'text-amber-600',
      tab: 'Leave Request',
    },
    {
      id: 'attendance',
      title: 'Attendance',
      value: `${overallAttendance.toFixed(1)}%`,
      desc: 'Requirement: Min 75%',
      color: overallAttendance >= 75 ? 'text-green-600' : 'text-rose-600',
      tab: 'Attendance',
    },
    {
      id: 'cgpa',
      title: 'CGPA',
      value: currentCgpa.toFixed(2),
      desc: 'Cumulative over 5 semesters',
      color: 'text-blue-600',
      tab: 'GPA & CGPA',
    },
  ];

  return (
    <div className="space-y-8" id="dashboard-tab-container">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {profile.name}</h2>
          <span className="text-2xl">🎓</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{profile.rollNumber} • {profile.department} (Semester {profile.semester})</p>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <button
            key={stat.id}
            onClick={() => setActiveTab(stat.tab)}
            className="bg-white hover:bg-slate-50/50 transition-all rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] p-6 flex flex-col items-center justify-center border border-gray-100 h-36 cursor-pointer text-center group relative overflow-hidden"
            id={`dashboard-card-${stat.id}`}
          >
            <h3 className="text-[#212c6a] text-lg font-semibold mb-2 group-hover:text-indigo-700 transition-colors">
              {stat.title}
            </h3>
            <p className={`text-3xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </p>
            <span className="text-gray-400 text-xs flex items-center gap-1 group-hover:text-gray-600 transition-colors">
              {stat.desc} <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
