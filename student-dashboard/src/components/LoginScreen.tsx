/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  Users,
  ShieldAlert,
  HeartHandshake
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: 'student' | 'mentor' | 'parent', selectedRollNumber: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [activeRole, setActiveRole] = useState<'student' | 'mentor' | 'parent'>('student');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState('22CSE0408'); // default Syed Ameer R
  const [mentorPassword, setMentorPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mentees = [
    { name: 'Syed Ameer R', rollNo: '22CSE0408', dept: 'CSE (Semester VI)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120' },
    { name: 'Tharun G', rollNo: '22CSE0401', dept: 'CSE (Semester VI)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
    { name: 'Sathya', rollNo: '22CSE0415', dept: 'CSE (Semester VI)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
    { name: 'Logajanani', rollNo: '22CSE0422', dept: 'CSE (Semester VI)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Pass both role and the active/targeted student's roll number to set up profile context correctly
      onLoginSuccess(activeRole, selectedStudentRoll);
    }, 900);
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden" 
      id="login-screen-container"
    >
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-150/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-150/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Banner header */}
        <div className="bg-[#1e285d] p-6 sm:p-8 text-white text-center space-y-3 relative">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-inner">
            <GraduationCap className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase">University Student Portal</h2>
            <p className="text-[11px] text-indigo-200 mt-1 uppercase tracking-wide">Integrated Academic & Mentor Support System</p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50 p-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveRole('student');
              setError('');
            }}
            className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              activeRole === 'student'
                ? 'bg-white text-[#1e285d] shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Mentee</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('mentor');
              setError('');
            }}
            className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              activeRole === 'mentor'
                ? 'bg-white text-[#1e285d] shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Mentor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('parent');
              setError('');
            }}
            className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              activeRole === 'parent'
                ? 'bg-white text-[#1e285d] shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Parent</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            {error && (
              <p className="p-3 bg-rose-50 border border-rose-100 text-rose-700 font-bold rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            {/* MENTEE (STUDENT) ROLE SELECTION */}
            {activeRole === 'student' && (
              <div className="space-y-3">
                <label className="text-[#1e285d] font-black uppercase tracking-wider text-[10px] block">
                  Select Mentee Profile to Log In
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {mentees.map((student) => (
                    <button
                      key={student.rollNo}
                      type="button"
                      onClick={() => setSelectedStudentRoll(student.rollNo)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedStudentRoll === student.rollNo
                          ? 'border-[#1e285d] bg-indigo-50/40 ring-1 ring-[#1e285d]'
                          : 'border-slate-150 hover:bg-slate-50/50'
                      }`}
                    >
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-150"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">{student.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{student.dept} • {student.rollNo}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedStudentRoll === student.rollNo ? 'border-[#1e285d] bg-[#1e285d]' : 'border-slate-300'
                      }`}>
                        {selectedStudentRoll === student.rollNo && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MENTOR ROLE SELECTION */}
            {activeRole === 'mentor' && (
              <div className="space-y-4">
                <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1e285d] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    VR
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Dr. Vimal Raja</h4>
                    <p className="text-[10px] text-slate-500">Chief Academic Mentor & Counselor</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block uppercase tracking-wide text-[10px]">Mentor Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-10 focus:outline-indigo-600 focus:bg-white text-xs font-semibold"
                      placeholder="Enter mentor password"
                      value={mentorPassword}
                      onChange={(e) => setMentorPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PARENT ROLE SELECTION */}
            {activeRole === 'parent' && (
              <div className="space-y-3">
                <label className="text-[#1e285d] font-black uppercase tracking-wider text-[10px] block">
                  Select Your Child to Access Progress Report
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {mentees.map((student) => (
                    <button
                      key={student.rollNo}
                      type="button"
                      onClick={() => setSelectedStudentRoll(student.rollNo)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedStudentRoll === student.rollNo
                          ? 'border-[#1e285d] bg-indigo-50/40 ring-1 ring-[#1e285d]'
                          : 'border-slate-150 hover:bg-slate-50/50'
                      }`}
                    >
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-150"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">Parent of {student.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{student.dept} • {student.rollNo}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedStudentRoll === student.rollNo ? 'border-[#1e285d] bg-[#1e285d]' : 'border-slate-300'
                      }`}>
                        {selectedStudentRoll === student.rollNo && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e285d] hover:bg-indigo-950 disabled:bg-slate-400 transition-colors text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md text-xs mt-2 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authorizing secure session...
                </>
              ) : (
                <>
                  Enter {activeRole === 'student' ? 'Mentee' : activeRole === 'mentor' ? 'Mentor' : 'Parent'} Portal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quickfill Hint Block */}
          <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 text-center text-[10px] text-indigo-900 font-bold mt-6 uppercase tracking-wider">
            <p>💡 Interactive University System</p>
            <p className="mt-0.5 text-slate-500 lowercase normal-case font-medium">Select your role and press the access button to login.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
