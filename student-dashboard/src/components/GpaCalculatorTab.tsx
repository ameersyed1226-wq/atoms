/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Calculator, 
  Award, 
  Sparkles 
} from 'lucide-react';
import { SemesterGPA, CourseGrade } from '../types';

interface GpaCalculatorTabProps {
  semesters: SemesterGPA[];
  currentCgpa: number;
  onUpdateSemesters: (newSemesters: SemesterGPA[]) => void;
}

// Convert letter grades to standard college Grade Points (e.g., S=10, A=9, B=8, C=7, D=6, E=5, F=0)
export const gradePointsMap = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 5,
  'F': 0,
};

export default function GpaCalculatorTab({
  semesters,
  currentCgpa,
  onUpdateSemesters,
}: GpaCalculatorTabProps) {
  const [expandedSemesterId, setExpandedSemesterId] = useState<string | null>(null);

  // States for Semester 6 Simulation
  const [simCourses, setSimCourses] = useState<Omit<CourseGrade, 'id'>[]>([
    { code: 'CSE-301', name: 'Software Engineering', credits: 3, grade: 'A' },
    { code: 'CSE-302', name: 'Computer Networks', credits: 4, grade: 'B' },
    { code: 'CSE-303', name: 'Database Management Systems', credits: 4, grade: 'S' },
    { code: 'CSE-304', name: 'Artificial Intelligence', credits: 3, grade: 'C' },
    { code: 'CSE-305', name: 'Discrete Mathematics', credits: 4, grade: 'A' },
  ]);

  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseGrade, setNewCourseGrade] = useState<'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');

  const toggleExpand = (id: string) => {
    setExpandedSemesterId(expandedSemesterId === id ? null : id);
  };

  const handleAddCourseSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    setSimCourses([
      ...simCourses,
      {
        code: newCourseCode || `SIM-${simCourses.length + 1}`,
        name: newCourseName,
        credits: newCourseCredits,
        grade: newCourseGrade
      }
    ]);
    setNewCourseCode('');
    setNewCourseName('');
    setNewCourseCredits(3);
  };

  const handleRemoveCourseSim = (idx: number) => {
    setSimCourses(simCourses.filter((_, i) => i !== idx));
  };

  const handleSimGradeChange = (idx: number, grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F') => {
    setSimCourses(simCourses.map((c, i) => i === idx ? { ...c, grade } : c));
  };

  // Calculate Semester 6 simulated SGPA
  const simTotalCredits = simCourses.reduce((sum, c) => sum + c.credits, 0);
  const simTotalPoints = simCourses.reduce((sum, c) => sum + (c.credits * gradePointsMap[c.grade]), 0);
  const simGpa = simTotalCredits > 0 ? simTotalPoints / simTotalCredits : 0;

  // Calculate simulated Cumulative CGPA combining historical terms and the simulated Term 6
  const historicalTotalCredits = semesters.reduce((sum, sem) => {
    const semCredits = sem.courses.reduce((s, c) => s + c.credits, 0);
    return sum + semCredits;
  }, 0);

  const historicalTotalPoints = semesters.reduce((sum, sem) => {
    const semPoints = sem.courses.reduce((s, c) => s + (c.credits * gradePointsMap[c.grade]), 0);
    return sum + semPoints;
  }, 0);

  const combinedTotalCredits = historicalTotalCredits + simTotalCredits;
  const combinedTotalPoints = historicalTotalPoints + simTotalPoints;
  const combinedCgpa = combinedTotalCredits > 0 ? combinedTotalPoints / combinedTotalCredits : 0;

  return (
    <div className="space-y-8" id="gpa-tab-container">
      {/* Overview GPA Header cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#212c6a] to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between h-40">
          <div>
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Active Cumulative CGPA</p>
            <h3 className="text-3xl font-black mt-1">{currentCgpa.toFixed(2)}</h3>
          </div>
          <p className="text-[10px] text-indigo-100 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Calculated over Semesters 1 to 5
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between h-40">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Simulated Sem-6 GPA</p>
            <h3 className="text-3xl font-black text-indigo-600 mt-1">{simGpa.toFixed(2)}</h3>
          </div>
          <p className="text-[10px] text-gray-500">
            Based on {simCourses.length} simulated courses ({simTotalCredits} credits)
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between h-40 ring-2 ring-indigo-100">
          <div>
            <p className="text-xs text-indigo-600 uppercase tracking-wider font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Prospective CGPA
            </p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{combinedCgpa.toFixed(2)}</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            Projected CGPA combining Semesters 1-6
          </p>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left 2 Columns: Historical semesters */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1">Academic History (Transcript)</h3>
          
          <div className="space-y-3">
            {semesters.map((sem) => {
              const isExpanded = expandedSemesterId === sem.id;
              const semCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0);

              return (
                <div 
                  key={sem.id} 
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                >
                  <button
                    onClick={() => toggleExpand(sem.id)}
                    className="w-full p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Semester {sem.semesterNumber}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {sem.courses.length} courses • {semCredits} Credit Hours
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black text-[#212c6a] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                        SGPA: {sem.gpa.toFixed(2)}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="bg-slate-50/50 border-t border-gray-50 px-4 py-3 divide-y divide-gray-100">
                      {sem.courses.map((course) => (
                        <div key={course.id} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-gray-800">{course.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              {course.code} • {course.credits} Credits
                            </p>
                          </div>
                          <span className="font-extrabold text-indigo-700 bg-white shadow-sm border border-slate-100 px-2.5 py-1 rounded">
                            Grade: {course.grade}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Active simulation cockpit */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" /> Prospective Semester-6 Simulator
            </h3>
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-full font-semibold">
              Live Modeler
            </span>
          </div>

          {/* Quick simulator course table */}
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2.5">Course Name</th>
                    <th className="pb-2.5 text-center">Credits</th>
                    <th className="pb-2.5 text-center">Target Grade</th>
                    <th className="pb-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {simCourses.map((course, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/30">
                      <td className="py-3 pr-2 font-medium text-slate-800">
                        <p>{course.name}</p>
                        <span className="text-[10px] text-slate-400">{course.code}</span>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-500">{course.credits}</td>
                      <td className="py-3 text-center">
                        <select
                          value={course.grade}
                          onChange={(e) => handleSimGradeChange(idx, e.target.value as any)}
                          className="bg-white border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold focus:outline-indigo-600 focus:border-indigo-600"
                        >
                          {Object.keys(gradePointsMap).map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleRemoveCourseSim(idx)}
                          className="text-gray-400 hover:text-rose-600 cursor-pointer p-1 rounded hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inline add course form */}
            <form onSubmit={handleAddCourseSim} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row gap-3 text-xs items-end">
              <div className="flex-1 space-y-1">
                <label className="text-gray-500 font-bold">Add Simulator Course</label>
                <input
                  type="text"
                  placeholder="e.g., Cryptography"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-indigo-600 text-xs"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-20 space-y-1">
                <label className="text-gray-500 font-bold">Credits</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-indigo-600"
                  value={newCourseCredits}
                  onChange={(e) => setNewCourseCredits(parseInt(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <div className="w-full sm:w-20 space-y-1">
                <label className="text-gray-500 font-bold">Grade</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-indigo-600"
                  value={newCourseGrade}
                  onChange={(e) => setNewCourseGrade(e.target.value as any)}
                >
                  {Object.keys(gradePointsMap).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white px-4 py-2 rounded font-bold flex items-center justify-center gap-1 cursor-pointer h-[34px]"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
