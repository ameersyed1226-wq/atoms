import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Eye, EyeOff, User, Lock, IdCard, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, BookOpen, GraduationCap, Calendar, Search, Copy, Check, X, LockKeyhole } from 'lucide-react';
import { Student } from '../types';
import { MOCK_STUDENTS } from '../data';

interface LoginScreenProps {
  onLoginSuccess: (student: Student) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState<boolean>(false);
  
  // Form fields
  const [email, setEmail] = useState<string>('abarna.k@ckcet.ac.in');
  const [password, setPassword] = useState<string>('bzKSyPyoMA');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Registration fields
  const [regRole, setRegRole] = useState<'faculty' | 'student'>('faculty');
  const [regSalutation, setRegSalutation] = useState<string>('Mr.');
  const [regName, setRegName] = useState<string>('');
  const [regNo, setRegNo] = useState<string>('ameersyed1226');
  const [regDateOfJoining, setRegDateOfJoining] = useState<string>('');
  const [regDesignation, setRegDesignation] = useState<string>('');
  const [regProgramme, setRegProgramme] = useState<string>('B.E.');
  const [regDept, setRegDept] = useState<string>('Computer Science and Engineering');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  
  // Forgot Password fields
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  // General state
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Credentials Registry Modal states
  const [showRegistryModal, setShowRegistryModal] = useState<boolean>(false);
  const [registrySearch, setRegistrySearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCredentials = (student: Student) => {
    const text = `Email: ${student.email}\nPassword: ${student.password || 'bzKSyPyoMA'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(student.regNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMockStudents = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(registrySearch.toLowerCase()) ||
    s.regNo.toLowerCase().includes(registrySearch.toLowerCase())
  );

  // Local storage lists
  const getRegisteredStudents = (): Student[] => {
    const stored = localStorage.getItem('ckcet_registered_students');
    let parsed: Student[] = [];
    let needsReset = false;
    try {
      if (stored) {
        parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length < MOCK_STUDENTS.length) {
          needsReset = true;
        } else {
          // Check if first student email is in the list to verify sync
          const hasFirstEmail = parsed.some(s => s.email.toLowerCase() === MOCK_STUDENTS[0].email.toLowerCase());
          if (!hasFirstEmail) {
            needsReset = true;
          }
        }
      } else {
        needsReset = true;
      }
    } catch (e) {
      needsReset = true;
    }

    if (needsReset) {
      localStorage.setItem('ckcet_registered_students', JSON.stringify(MOCK_STUDENTS));
      return MOCK_STUDENTS;
    }
    return parsed;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    const students = getRegisteredStudents();
    
    // Find matching student
    const foundStudent = students.find(s => s.email.toLowerCase() === cleanedEmail);
    
    if (foundStudent) {
      // Validate password if it exists
      if (foundStudent.password && password !== foundStudent.password && password !== 'demoPassword123') {
        setError('Incorrect password. Please try again.');
        return;
      }
      // Simulate login success
      onLoginSuccess(foundStudent);
    } else {
      setError('Student record not found. Please check your Registration/Admission Email.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regRole === 'faculty') {
      if (!regName || !regNo || !regEmail || !regPassword) {
        setError('Please fill out all fields.');
        return;
      }
      setSuccessMsg(`Faculty registration requested successfully! Welcome, ${regSalutation} ${regName}. Your account is pending administrator approval.`);
      setTimeout(() => {
        setIsLoginView(true);
        setSuccessMsg('');
      }, 3500);
      return;
    }

    // Student Registration flow
    if (!regName || !regNo || !regEmail || !regPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (!regEmail.endsWith('@student.ckcet.edu.in') && !regEmail.endsWith('@ckcet.edu.in') && !regEmail.includes('@')) {
      setError('Please use a valid college email ending with @student.ckcet.edu.in');
      return;
    }

    const students = getRegisteredStudents();
    const emailExists = students.some(s => s.email.toLowerCase() === regEmail.trim().toLowerCase());
    const regNoExists = students.some(s => s.regNo === regNo.trim());

    if (emailExists) {
      setError('A student with this email is already registered.');
      return;
    }

    if (regNoExists) {
      setError('A student with this Register Number is already registered.');
      return;
    }

    const newStudent: Student = {
      name: `${regSalutation} ${regName.trim()}`,
      email: regEmail.trim().toLowerCase(),
      regNo: regNo.trim(),
      department: `${regProgramme} ${regDept}`,
      semester: 4, // default for demo
      cgpa: parseFloat((7.8 + Math.random() * 1.8).toFixed(2)), // generate a random nice cgpa
      joinedYear: regDateOfJoining ? parseInt(regDateOfJoining.substring(0, 4)) : 2024
    };

    const updatedStudents = [...students, newStudent];
    localStorage.setItem('ckcet_registered_students', JSON.stringify(updatedStudents));
    
    setSuccessMsg('Registration successful! You can now log in.');
    
    // Switch to login view and prefill email
    setTimeout(() => {
      setEmail(newStudent.email);
      setPassword('');
      setIsLoginView(true);
      setSuccessMsg('');
    }, 2500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!forgotEmail.endsWith('@student.ckcet.edu.in') && !forgotEmail.endsWith('@ckcet.edu.in')) {
      setError('Please enter a valid @student.ckcet.edu.in email.');
      return;
    }

    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setIsForgotPasswordView(false);
      setForgotEmail('');
    }, 4000);
  };

  // Prefill helper for demo testing
  const selectDemoAccount = (student: Student) => {
    setEmail(student.email);
    setPassword(student.password || 'demoPassword123');
    setError('');
  };

  return (
    <div id="login_portal_wrapper" className="min-h-screen flex flex-col justify-center items-center px-4 py-8 md:p-12 selection:bg-[#0d0c63]/20">
      {/* College Logo/Header above the login card */}
      <div id="college_brand" className="text-center mb-8 flex flex-col items-center">
        <div className="bg-[#0d0c63] text-white p-3 rounded-2xl shadow-md mb-3 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d0c63] tracking-wide text-center uppercase font-display max-w-lg leading-tight">
          CK College
        </h1>
        <p className="text-xs md:text-sm font-semibold tracking-widest text-slate-500 uppercase mt-1">
          Of Engineering and Technology
        </p>
      </div>

      {/* Main Login / Register Card Container */}
      <div 
        id="login_card_container" 
        className="w-full max-w-5xl bg-white rounded-[24px] shadow-[0_20px_50px_rgba(13,12,99,0.12)] border border-slate-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]"
      >
        {/* LEFT PANEL: Welcome Banner / Action Switcher */}
        <div 
          id="visual_sidebar" 
          className="md:col-span-5 bg-[#0d0c63] text-white flex flex-col justify-center items-center p-8 md:p-12 text-center relative overflow-hidden order-last md:order-first"
          style={{
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
          }}
        >
          {/* Custom curvy divider shape on the right edge using border radii for clean responsive layout */}
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-[#0d0c63] rounded-r-[120px] hidden md:block -mr-12 z-10"></div>
          
          {/* Absolute decorative glow details */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full -mt-24 -ml-24 blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full -mb-24 -mr-24 blur-xl"></div>

          <AnimatePresence mode="wait">
            {isLoginView ? (
              <motion.div
                key="welcome_login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center h-full relative z-20"
              >
                <Sparkles className="w-12 h-12 mb-6 text-indigo-300 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide font-display text-white mb-4">
                  Hello, Welcome!
                </h2>
                <p className="text-slate-300 text-sm max-w-[260px] leading-relaxed mb-8 font-light">
                  Don't have an account? Sign up to access your marks, attendance, and exam schedule.
                </p>
                <button
                  id="switch_to_register_btn"
                  onClick={() => {
                    setIsLoginView(false);
                    setIsForgotPasswordView(false);
                    setError('');
                  }}
                  className="border-2 border-white/85 hover:border-white text-white font-medium py-2 px-10 rounded-full bg-transparent hover:bg-white hover:text-[#0d0c63] transition-all duration-300 uppercase tracking-wider text-xs active:scale-95 shadow-lg shadow-black/10"
                >
                  Register
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="welcome_register"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center h-full relative z-20"
              >
                <Sparkles className="w-12 h-12 mb-6 text-indigo-300 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide font-display text-white mb-4">
                  Welcome Back!
                </h2>
                <p className="text-slate-300 text-sm max-w-[260px] leading-relaxed mb-8 font-light">
                  To keep connected with your department, please login with your student credentials.
                </p>
                <button
                  id="switch_to_login_btn"
                  onClick={() => {
                    setIsLoginView(true);
                    setIsForgotPasswordView(false);
                    setError('');
                  }}
                  className="border-2 border-white/85 hover:border-white text-white font-medium py-2 px-10 rounded-full bg-transparent hover:bg-white hover:text-[#0d0c63] transition-all duration-300 uppercase tracking-wider text-xs active:scale-95 shadow-lg shadow-black/10"
                >
                  Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Dynamic Form Inputs (Login, Register, or Forgot Password) */}
        <div id="form_container" className="md:col-span-7 bg-white p-8 md:p-14 flex flex-col justify-center relative z-20 min-h-[480px]">
          <AnimatePresence mode="wait">
            {isForgotPasswordView ? (
              // FORGOT PASSWORD SCREEN
              <motion.div
                key="forgot_password_form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md mx-auto"
              >
                <button
                  onClick={() => {
                    setIsForgotPasswordView(false);
                    setError('');
                  }}
                  className="inline-flex items-center text-[#0d0c63] hover:text-indigo-800 text-sm font-semibold mb-6 transition-all group"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </button>

                <h2 className="text-3xl font-extrabold text-[#1e293b] tracking-tight font-display mb-2">
                  Forgot Password?
                </h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Enter your registered student email address, and we will send you instructions to reset your password.
                </p>

                {resetSuccess ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800 flex flex-col items-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                    <h3 className="font-bold text-lg mb-1">Reset Link Sent!</h3>
                    <p className="text-sm text-emerald-600/90 leading-relaxed max-w-xs">
                      We have sent a verification code to your email. Please check your inbox and follow the steps.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-sm p-3 rounded">
                        {error}
                      </div>
                    )}
                    
                    <div className="relative">
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. 420724104056@student.ckcet.edu.in"
                        className="w-full bg-[#eef2fc] text-slate-800 placeholder-slate-400 font-medium py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm pr-12"
                        required
                      />
                      <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      Reset Password
                    </button>
                  </form>
                )}
              </motion.div>
            ) : isLoginView ? (
              // LOGIN SCREEN
              <motion.div
                key="login_form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-4xl font-extrabold text-[#1e293b] tracking-tight font-display">
                    Login
                  </h2>
                </div>

                {error && (
                  <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-sm p-3 rounded mb-5">
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm p-3 rounded mb-5">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Username / Student Email"
                      className="w-full bg-[#eef2fc] text-slate-800 placeholder-slate-400 font-medium py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm pr-12"
                      required
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#eef2fc] text-slate-800 placeholder-slate-400 font-medium py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0d0c63] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-center py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordView(true);
                        setError('');
                      }}
                      className="text-[#334155] hover:text-[#0d0c63] font-medium text-sm transition-colors duration-150"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Login Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] tracking-wide"
                  >
                    Login
                  </button>
                </form>

                {/* Subtext instruction EXACTLY from the original image */}
                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                  <p className="text-[11px] md:text-[12px] text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Students: Use your Reg No. / Admission No. with <span className="font-semibold text-slate-500">@student.ckcet.edu.in</span>
                    <br />
                    <span className="text-slate-400/80">(e.g. 420724104056@student.ckcet.edu.in)</span>
                  </p>
                </div>

                {/* DEMO ACCOUNTS HELPER BOX (To let people check out both accounts immediately!) */}
                <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl text-xs">
                  <div className="flex items-center justify-between gap-1.5 text-[#0d0c63] font-bold text-xs uppercase tracking-wide mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Quick Select Student Profile (Demo)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRegistrySearch('');
                        setShowRegistryModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-850 underline font-bold normal-case text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer bg-transparent border-none outline-none"
                    >
                      View All 60 Accounts
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => selectDemoAccount(MOCK_STUDENTS[0])}
                      className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 font-semibold p-2 rounded-xl transition-all text-left text-slate-700 flex flex-col cursor-pointer"
                    >
                      <span className="text-[#0d0c63]">{MOCK_STUDENTS[0].name}</span>
                      <span className="text-[10px] text-slate-400 truncate font-mono">{MOCK_STUDENTS[0].email}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => selectDemoAccount(MOCK_STUDENTS[1])}
                      className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 font-semibold p-2 rounded-xl transition-all text-left text-slate-700 flex flex-col cursor-pointer"
                    >
                      <span className="text-[#0d0c63]">{MOCK_STUDENTS[1].name}</span>
                      <span className="text-[10px] text-slate-400 truncate font-mono">{MOCK_STUDENTS[1].email}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              // REGISTER SCREEN WITH THE EXACT UI FROM SCREENSHOT
              <motion.div
                key="register_form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md mx-auto"
              >
                {/* Center Title */}
                <div className="text-center mb-6">
                  <h2 className="text-4xl font-extrabold text-[#111827] tracking-tight font-display">
                    Registration
                  </h2>
                </div>

                {/* Faculty vs Student Toggle Tabs */}
                <div className="grid grid-cols-2 bg-white border border-slate-200/85 rounded-xl overflow-hidden mb-6 p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('faculty');
                      setRegNo('ameersyed1226');
                    }}
                    className={`py-3.5 px-4 flex items-center justify-center gap-2.5 text-sm font-bold tracking-wide rounded-lg transition-all ${
                      regRole === 'faculty'
                        ? 'bg-[#0d0c63] text-white shadow'
                        : 'bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    <span>Faculty</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('student');
                      setRegNo('');
                    }}
                    className={`py-3.5 px-4 flex items-center justify-center gap-2.5 text-sm font-bold tracking-wide rounded-lg transition-all ${
                      regRole === 'student'
                        ? 'bg-[#0d0c63] text-white shadow'
                        : 'bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4.5 h-4.5" />
                    <span>Student</span>
                  </button>
                </div>

                {error && (
                  <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-sm p-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm p-3 rounded-xl mb-4 flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-semibold">{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  
                  {/* Row 1: Salutation Dropdown and Name Input */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 relative">
                      <select
                        value={regSalutation}
                        onChange={(e) => setRegSalutation(e.target.value)}
                        className="w-full bg-[#f1f5f9] text-slate-700 font-semibold py-3.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                        ▼
                      </div>
                    </div>
                    <div className="col-span-8">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={regRole === 'faculty' ? "Faculty Name" : "Student Name"}
                        className="w-full bg-[#f1f5f9] text-slate-700 placeholder-slate-400 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: ID Code / Register Number & Date of Joining/Admission */}
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <input
                        type="text"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        placeholder={regRole === 'faculty' ? "Faculty ID / Code" : "Register Number"}
                        className="w-full bg-[#f1f5f9] text-slate-700 placeholder-slate-400 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                        {regRole === 'faculty' ? 'DATE OF JOINING' : 'DATE OF ADMISSION'}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={regDateOfJoining}
                          onChange={(e) => setRegDateOfJoining(e.target.value)}
                          className="w-full bg-[#f1f5f9] text-slate-700 font-semibold py-3 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-xs cursor-pointer"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Designation / Semester Select */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                      {regRole === 'faculty' ? 'DESIGNATION' : 'SEMESTER STATUS'}
                    </label>
                    <div className="relative">
                      {regRole === 'faculty' ? (
                        <select
                          value={regDesignation}
                          onChange={(e) => setRegDesignation(e.target.value)}
                          className="w-full bg-[#f1f5f9] text-slate-700 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Designation</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Professor">Professor</option>
                          <option value="Head of Department">Head of Department (HOD)</option>
                          <option value="Lab Instructor">Lab Instructor</option>
                        </select>
                      ) : (
                        <select
                          value={regDesignation}
                          onChange={(e) => setRegDesignation(e.target.value)}
                          className="w-full bg-[#f1f5f9] text-slate-700 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Semester</option>
                          <option value="Semester I">Semester I (First Year)</option>
                          <option value="Semester II">Semester II (First Year)</option>
                          <option value="Semester III">Semester III (Second Year)</option>
                          <option value="Semester IV">Semester IV (Second Year)</option>
                          <option value="Semester V">Semester V (Third Year)</option>
                          <option value="Semester VI">Semester VI (Third Year)</option>
                          <option value="Semester VII">Semester VII (Final Year)</option>
                          <option value="Semester VIII">Semester VIII (Final Year)</option>
                        </select>
                      )}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Programme & Department */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select
                        value={regProgramme}
                        onChange={(e) => setRegProgramme(e.target.value)}
                        className="w-full bg-[#f1f5f9] text-slate-700 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value="B.E.">B.E.</option>
                        <option value="B.Tech.">B.Tech.</option>
                        <option value="M.E.">M.E.</option>
                        <option value="MBA">MBA</option>
                        <option value="MCA">MCA</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                        ▼
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        className="w-full bg-[#f1f5f9] text-slate-700 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value="Computer Science and Engineering">Computer Science &amp; Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics and Communication Eng.">Electronics &amp; Communication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electrical and Electronics Eng.">Electrical &amp; Electronics</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Email Field */}
                  <div className="relative">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-[#f1f5f9] text-slate-700 placeholder-slate-400 font-semibold py-3.5 px-5 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Row 6: Password with Highlight Border from Image */}
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full bg-[#eef2fc] border border-indigo-200/60 text-slate-800 placeholder-slate-400 font-semibold py-3.5 px-5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-sm pr-12 shadow-inner"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0d0c63]"
                    >
                      {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-extrabold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md active:scale-[0.99] uppercase tracking-wider text-sm mt-2"
                  >
                    Register
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer copyright */}
      <div id="portal_footer" className="text-center mt-12 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} CK College of Engineering and Technology. All rights reserved.
        <br />
        <span className="text-[10px] text-slate-300 mt-1 block">Designed &amp; Maintained by CSE Department</span>
      </div>

      {/* 60 STUDENTS CREDENTIALS DIRECTORY MODAL */}
      <AnimatePresence>
        {showRegistryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-4xl h-[85vh] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden text-xs"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0d0c63] to-indigo-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <LockKeyhole className="w-5 h-5 text-indigo-200" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base tracking-wide uppercase font-display">Student Credentials Directory</h3>
                    <p className="text-[10px] text-indigo-200 font-semibold tracking-wide">60 Mock Student Portal Login Accounts</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegistryModal(false)}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all active:scale-95 cursor-pointer border-none outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Search Bar */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <input
                    type="text"
                    placeholder="Search by student name or register number..."
                    value={registrySearch}
                    onChange={(e) => setRegistrySearch(e.target.value)}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 font-semibold py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#0d0c63] outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-xs"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-2xs shrink-0">
                  Total Match: {filteredMockStudents.length} Students
                </span>
              </div>

              {/* Modal Content - List of Students */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredMockStudents.map((stu) => {
                    const isCopied = copiedId === stu.regNo;
                    return (
                      <div
                        key={stu.regNo}
                        className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-2xs hover:border-indigo-100 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase font-display leading-tight truncate">
                              {stu.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider font-mono font-medium truncate">
                              Reg No: {stu.regNo}
                            </p>
                          </div>
                          <span className="bg-indigo-50 text-[#0d0c63] text-[9px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider border border-indigo-100/45 shrink-0">
                            CSE - SEM 4
                          </span>
                        </div>

                        {/* Credentials Data Box */}
                        <div className="bg-slate-50/80 rounded-xl p-3 space-y-1.5 text-[11px] border border-slate-100/50">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="font-medium text-slate-400 text-[10px] uppercase font-mono">Email:</span>
                            <span className="font-semibold text-slate-700 font-mono truncate max-w-[200px] text-right" title={stu.email}>
                              {stu.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="font-medium text-slate-400 text-[10px] uppercase font-mono">Password:</span>
                            <span className="font-extrabold text-[#0d0c63] font-mono tracking-wider text-right">
                              {stu.password}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(stu)}
                            className={`py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Details</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              selectDemoAccount(stu);
                              // Auto submit form directly
                              setShowRegistryModal(false);
                              setTimeout(() => {
                                const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
                                if (submitBtn) submitBtn.click();
                              }, 150);
                            }}
                            className="bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer hover:shadow-xs active:scale-[0.98] border-none"
                          >
                            <span>Quick Login</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredMockStudents.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-slate-100 p-4 rounded-full text-slate-400 mb-3">
                      <Search className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">No Student Found</h4>
                    <p className="text-slate-400 text-xs mt-1">Try searching with a different name or register number.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
