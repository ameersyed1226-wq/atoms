/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from './types';
import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import AttendanceSyncBridge from './components/AttendanceSyncBridge';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if student session is already active in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ckcet_current_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse current student session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (student: Student) => {
    setCurrentUser(student);
    localStorage.setItem('ckcet_current_user', JSON.stringify(student));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ckcet_current_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0d0c63] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#0d0c63] font-bold uppercase tracking-widest mt-4">Loading Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans antialiased">
      <AttendanceSyncBridge />
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div
            key="login_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StudentDashboard student={currentUser} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

