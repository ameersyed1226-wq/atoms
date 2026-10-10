/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  GraduationCap, 
  CalendarCheck, 
  FileCheck, 
  DollarSign, 
  Trophy, 
  Lock, 
  Unlock, 
  Sparkles 
} from 'lucide-react';
import { 
  AchievementBadge, 
  StudentCertificate, 
  StudentGoal, 
  FeeItem 
} from '../types';

interface BadgesTabProps {
  badges: AchievementBadge[];
  currentCgpa: number;
  overallAttendance: number;
  certificates: StudentCertificate[];
  goals: StudentGoal[];
  fees: FeeItem[];
}

export default function BadgesTab({
  badges,
  currentCgpa,
  overallAttendance,
  certificates,
  goals,
  fees,
}: BadgesTabProps) {
  const verifiedCertsCount = certificates.filter(c => c.status === 'Verified').length;
  const completedGoalsCount = goals.filter(g => g.completed).length;
  const outstandingBalance = fees.reduce((sum, f) => sum + (f.total - f.paid), 0);

  // Check locks in real-time
  const isUnlocked = (badgeId: string) => {
    switch (badgeId) {
      case 'bd1': // Academic Prodigy (CGPA >= 9.0)
        return currentCgpa >= 9.0;
      case 'bd2': // Perfect Presence (Attendance >= 90%)
        return overallAttendance >= 90.0;
      case 'bd3': // Certified Scholar (Verified certificates >= 3)
        return verifiedCertsCount >= 3;
      case 'bd4': // Sovereign Paid (All fees paid)
        return outstandingBalance <= 0;
      case 'bd5': // Goal Conqueror (Completed goals >= 3)
        return completedGoalsCount >= 3;
      default:
        return false;
    }
  };

  // Get active progress status for display
  const getBadgeProgress = (badgeId: string) => {
    switch (badgeId) {
      case 'bd1':
        return { current: currentCgpa.toFixed(2), target: '9.00', label: 'CGPA' };
      case 'bd2':
        return { current: `${overallAttendance.toFixed(1)}%`, target: '90.0%', label: 'Attendance' };
      case 'bd3':
        return { current: verifiedCertsCount, target: '3', label: 'Certs' };
      case 'bd4':
        return { current: `₹${outstandingBalance.toLocaleString()}`, target: '₹0', label: 'Dues' };
      case 'bd5':
        return { current: completedGoalsCount, target: '3', label: 'Goals' };
      default:
        return { current: '', target: '', label: '' };
    }
  };

  // Map icon strings to actual Lucide component instances
  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-12 h-12 ${unlocked ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`;
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className={cls} />;
      case 'CalendarCheck':
        return <CalendarCheck className={cls} />;
      case 'FileCheck':
        return <FileCheck className={cls} />;
      case 'DollarSign':
        return <DollarSign className={cls} />;
      case 'Trophy':
        return <Trophy className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  const unlockedCount = badges.filter(b => isUnlocked(b.id)).length;

  return (
    <div className="space-y-8" id="badges-tab-container">
      {/* Overview header */}
      <div className="bg-gradient-to-r from-[#212c6a] to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5.5 h-5.5 text-amber-400" /> Gamified Academic Achievements
          </h3>
          <p className="text-xs text-indigo-100 max-w-xl font-medium">
            Complete your daily college milestones to automatically unlock collectible badges. Dues paid, verified certs, goals achieved, and test marks actively influence locks!
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 text-center shrink-0">
          <p className="text-[10px] text-indigo-200 uppercase tracking-wider font-extrabold">Badges Unlocked</p>
          <p className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-5 h-5 animate-spin" /> {unlockedCount} / {badges.length}
          </p>
        </div>
      </div>

      {/* Badges Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b) => {
          const unlocked = isUnlocked(b.id);
          const prog = getBadgeProgress(b.id);

          return (
            <div 
              key={b.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative group ${
                unlocked 
                  ? 'border-amber-200 shadow-[0_8px_24px_rgba(245,158,11,0.06)] bg-gradient-to-b from-white to-amber-50/5 ring-1 ring-amber-100/30' 
                  : 'border-slate-100 opacity-60 bg-slate-50/30'
              }`}
              id={`badge-card-${b.id}`}
            >
              {/* Lock status indicator badge */}
              <span className={`absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                unlocked 
                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {unlocked ? (
                  <>
                    <Unlock className="w-2.5 h-2.5" /> Unlocked
                  </>
                ) : (
                  <>
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </>
                )}
              </span>

              {/* Badge Visual Icon */}
              <div className="space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto relative ${
                  unlocked 
                    ? 'bg-amber-50 ring-8 ring-amber-50/50' 
                    : 'bg-slate-100 ring-8 ring-slate-100/20'
                }`}>
                  {renderBadgeIcon(b.icon, unlocked)}
                </div>

                <div className="text-center space-y-1.5">
                  <h4 className={`text-sm font-bold ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed px-2">
                    {b.description}
                  </p>
                </div>
              </div>

              {/* Requirements summary and live stats */}
              <div className="border-t border-slate-100 mt-6 pt-4 space-y-2.5 text-xs text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requirements</p>
                <p className="text-[11px] text-slate-500 font-semibold italic px-1">
                  "{b.howToUnlock}"
                </p>

                {/* Progress bar metrics */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400">{prog.label}:</span>
                  <span className={unlocked ? 'text-amber-600' : 'text-slate-500'}>
                    Current: <strong>{prog.current}</strong> / Target: <strong>{prog.target}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
