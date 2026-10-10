/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Sliders, 
  CheckCircle, 
  Award, 
  RefreshCw 
} from 'lucide-react';
import { InternalMarkEntry, AssessmentMarks } from '../types';
import { initialInternalMarks } from '../data';

interface InternalMarksTabProps {
  internalMarks: InternalMarkEntry[];
  overallAverage: number;
  onUpdateInternalMarks: (newMarks: InternalMarkEntry[]) => void;
}

export default function InternalMarksTab({
  internalMarks,
  overallAverage,
  onUpdateInternalMarks,
}: InternalMarksTabProps) {
  const marksList = (internalMarks && internalMarks.length > 0) ? internalMarks : initialInternalMarks;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(marksList[0]?.id || '');

  const activeMark = marksList.find(m => m.id === selectedSubjectId) || marksList[0];

  const handleSliderChange = (assessmentKey: keyof AssessmentMarks, value: number) => {
    const updated = marksList.map(m => {
      if (m.id === selectedSubjectId) {
        return {
          ...m,
          assessments: {
            ...m.assessments,
            [assessmentKey]: value
          }
        };
      }
      return m;
    });
    onUpdateInternalMarks(updated);
  };

  const handleResetSubject = () => {
    const defaultsMap: Record<string, AssessmentMarks> = {
      im1: { quiz1: 8.5, midterm: 26, quiz2: 9, assignment: 9.5, project: 36 },
      im2: { quiz1: 7, midterm: 22, quiz2: 8, assignment: 8, project: 32 },
      im3: { quiz1: 9.5, midterm: 28.5, quiz2: 10, assignment: 9.5, project: 38 },
      im4: { quiz1: 6.5, midterm: 19, quiz2: 7.5, assignment: 8, project: 30 },
      im5: { quiz1: 8, midterm: 24.5, quiz2: 8, assignment: 9, project: 35 }
    };

    const updated = marksList.map(m => {
      if (m.id === selectedSubjectId && defaultsMap[m.id]) {
        return {
          ...m,
          assessments: { ...defaultsMap[m.id] }
        };
      }
      return m;
    });
    onUpdateInternalMarks(updated);
  };

  const calculateTotal = (assessments: AssessmentMarks) => {
    return (
      assessments.quiz1 +
      assessments.midterm +
      assessments.quiz2 +
      assessments.assignment +
      assessments.project
    );
  };

  const getGradeEstimate = (score: number) => {
    if (score >= 90) return { letter: 'S', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
    if (score >= 80) return { letter: 'A', color: 'text-green-600 bg-green-50 border-green-100' };
    if (score >= 70) return { letter: 'B', color: 'text-blue-600 bg-blue-50 border-blue-100' };
    if (score >= 60) return { letter: 'C', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    if (score >= 50) return { letter: 'D', color: 'text-orange-600 bg-orange-50 border-orange-100' };
    return { letter: 'F', color: 'text-rose-600 bg-rose-50 border-rose-100' };
  };

  return (
    <div className="space-y-8" id="internal-marks-tab-container">
      {/* Header stat box */}
      <div className="bg-gradient-to-r from-[#212c6a] to-indigo-950 rounded-2xl p-6 text-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-300" /> Continuous Internal Assessment (CIA)
          </h3>
          <p className="text-xs text-indigo-100 max-w-xl">
            View detailed midterms, quizzes, and assignments. Play around with the interactive calculators below to run hypothetical grading goals.
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 text-center">
          <p className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">Overall Internal average</p>
          <p className="text-2xl font-black text-white">{overallAverage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left 2 Columns: Subjects Selector List */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Registered Courses</p>
          <div className="space-y-2">
            {marksList.map((m) => {
              const totalScore = calculateTotal(m.assessments);
              const estimate = getGradeEstimate(totalScore);
              const isSelected = m.id === selectedSubjectId;

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedSubjectId(m.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isSelected 
                      ? 'border-[#212c6a] bg-indigo-50/25 shadow-[0_4px_12px_rgba(33,44,106,0.04)] ring-1 ring-[#212c6a]/10' 
                      : 'border-gray-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {m.subjectCode}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{m.subjectName}</h4>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-lg font-bold text-slate-800">{totalScore.toFixed(1)}</p>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${estimate.color}`}>
                      Est: {estimate.letter}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Sliders and Detailed Calculator */}
        {activeMark && (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-bold bg-[#212c6a] text-white px-2 py-0.5 rounded">
                    {activeMark.subjectCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-1">{activeMark.subjectName}</h3>
                </div>
                <button 
                  onClick={handleResetSubject}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer bg-indigo-50 hover:bg-indigo-100/60 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
                </button>
              </div>

              {/* Assessment Sliders */}
              <div className="space-y-5">
                {/* Sliders metadata configuration */}
                {[
                  { key: 'quiz1', label: 'Quiz Assessment 1', max: 10, step: 0.5, desc: 'Class test / Written quiz' },
                  { key: 'midterm', label: 'Midterm Examination', max: 30, step: 0.5, desc: 'Centralized semester midterm exam' },
                  { key: 'quiz2', label: 'Quiz Assessment 2', max: 10, step: 0.5, desc: 'Technical quiz / MCQ test' },
                  { key: 'assignment', label: 'Assignment / Seminars', max: 10, step: 0.5, desc: 'Self study projects and submissions' },
                  { key: 'project', label: 'Course Laboratory / Project', max: 40, step: 0.5, desc: 'Capstone lab experiments or coding projects' }
                ].map((item) => {
                  const val = activeMark.assessments[item.key as keyof AssessmentMarks];
                  return (
                    <div key={item.key} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-xs font-bold text-gray-700">{item.label}</label>
                          <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                        </div>
                        <span className="text-xs font-extrabold text-[#212c6a] bg-slate-100 px-2 py-1 rounded min-w-12 text-center">
                          {val} / {item.max}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max={item.max}
                          step={item.step}
                          value={val}
                          onChange={(e) => handleSliderChange(item.key as keyof AssessmentMarks, parseFloat(e.target.value))}
                          className="flex-1 accent-[#212c6a] h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total projection box */}
            <div className="mt-8 bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-600 rounded-lg text-white">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Calculated Internal Total</p>
                  <p className="text-[10px] text-gray-400">Sum of continuous assessment marks</p>
                </div>
              </div>
              <div className="text-right flex items-center space-x-3">
                <div>
                  <p className="text-2xl font-black text-[#212c6a]">
                    {calculateTotal(activeMark.assessments).toFixed(1)} <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  </p>
                </div>
                <div className={`text-center font-bold text-xs border rounded-lg px-3 py-1.5 ${
                  getGradeEstimate(calculateTotal(activeMark.assessments)).color
                }`}>
                  <p className="text-[9px] uppercase tracking-wider font-semibold">Grade</p>
                  <p className="text-lg font-black">{getGradeEstimate(calculateTotal(activeMark.assessments)).letter}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
