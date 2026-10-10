/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { AttendanceSubject, AttendanceLogEntry } from '../types';

interface AttendanceTabProps {
  subjects: AttendanceSubject[];
  logs: AttendanceLogEntry[];
  overallAttendance: number;
  totalAttended: number;
  totalConducted: number;
  onUpdateLogs: (newLogs: AttendanceLogEntry[]) => void;
  onUpdateSubjects: (newSubjects: AttendanceSubject[]) => void;
}

const subjectAbsenceRecords: Record<string, Array<{ date: string; day: string; reason: string; detail: string }>> = {
  "Compiler Design": [
    {
      date: "22-07-2026",
      day: "Tuesday",
      reason: "Family Function",
      detail: "Student attended an important family function. Prior information was given. Leave approved."
    },
    {
      date: "05-08-2026",
      day: "Wednesday",
      reason: "Medical Leave",
      detail: "Student was absent due to fever. Visited hospital for treatment. Medical certificate submitted."
    },
    {
      date: "28-07-2026",
      day: "Tuesday",
      reason: "Personal",
      detail: "Family emergency. Out of station for emergency domestic matters. Prior intimation sent to HOD."
    },
    {
      date: "15-07-2026",
      day: "Wednesday",
      reason: "On Leave",
      detail: "Represented the university in the zonal football tournament with official approval."
    }
  ],
  "Digital Computing": [
    {
      date: "03-08-2026",
      day: "Monday",
      reason: "OD",
      detail: "Workshop participation in digital design."
    },
    {
      date: "22-07-2026",
      day: "Wednesday",
      reason: "OD",
      detail: "Participated in off-campus academic training program on system architectures."
    }
  ],
  "Data Warehouse": [
    {
      date: "04-08-2026",
      day: "Tuesday",
      reason: "OD",
      detail: "Seminar participation in cloud warehousing concepts."
    },
    {
      date: "21-07-2026",
      day: "Tuesday",
      reason: "OD",
      detail: "Official duty for representing the college in state-level symposium."
    }
  ],
  "Software Engineering": [
    {
      date: "06-08-2026",
      day: "Thursday",
      reason: "Medical Leave",
      detail: "Absent due to viral flu. Prescribed rest for 2 days by physician."
    },
    {
      date: "30-07-2026",
      day: "Thursday",
      reason: "On Leave",
      detail: "Attended sister's marriage ceremony in native village. Approved by class coordinator."
    }
  ],
  "Computer Networks": [
    {
      date: "31-07-2026",
      day: "Friday",
      reason: "OD",
      detail: "Workshop participation in advanced routing algorithms."
    },
    {
      date: "17-07-2026",
      day: "Friday",
      reason: "OD",
      detail: "Presented technical research paper on peer-to-peer file sharing protocols."
    }
  ],
  "Database Management Systems": [
    {
      date: "29-07-2026",
      day: "Wednesday",
      reason: "OD",
      detail: "Representing university in national hackathon grand finale."
    },
    {
      date: "15-07-2026",
      day: "Wednesday",
      reason: "Medical Leave",
      detail: "Underwent dental extraction procedure. Recommended one day rest by dentist."
    }
  ],
  "Artificial Intelligence": [
    {
      date: "27-07-2026",
      day: "Monday",
      reason: "Personal",
      detail: "Family emergency travel to hometown."
    },
    {
      date: "13-07-2026",
      day: "Monday",
      reason: "OD",
      detail: "Participated as volunteer in international AI workshop hosted in campus."
    }
  ],
  "Discrete Mathematics": [
    {
      date: "24-07-2026",
      day: "Friday",
      reason: "Medical Leave",
      detail: "Doctor consultation and eye examination clinic appointment."
    },
    {
      date: "10-07-2026",
      day: "Friday",
      reason: "Personal",
      detail: "Missed morning session classes due to heavy rainfall and transport delays."
    }
  ]
};

export default function AttendanceTab({
  subjects,
}: AttendanceTabProps) {
  const [selectedSubject, setSelectedSubject] = useState<AttendanceSubject | null>(null);
  const [absenceIndex, setAbsenceIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectSubject = (sub: AttendanceSubject) => {
    setSelectedSubject(sub);
    setAbsenceIndex(0);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(container.scrollLeft / width);
      const records = subjectAbsenceRecords[selectedSubject?.name || ''] || [];
      if (index !== absenceIndex && index >= 0 && index < records.length) {
        setAbsenceIndex(index);
      }
    }
  };

  const handleNext = (recordsLength: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const nextIndex = Math.min(recordsLength - 1, absenceIndex + 1);
      container.scrollTo({
        left: nextIndex * container.clientWidth,
        behavior: 'smooth'
      });
      setAbsenceIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const prevIndex = Math.max(0, absenceIndex - 1);
      container.scrollTo({
        left: prevIndex * container.clientWidth,
        behavior: 'smooth'
      });
      setAbsenceIndex(prevIndex);
    }
  };

  return (
    <div className="space-y-6" id="attendance-tab-container">
      {/* Main Container styled exactly as requested */}
      <div className="bg-slate-50/50 rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
        {/* Dark Blue Header Block matching the screenshot */}
        <div className="bg-[#212c6a] text-white py-5 px-6 font-bold text-center text-xl md:text-2xl tracking-wide shadow-sm">
          Attendance Management
        </div>

        {/* List of cards */}
        <div className="p-4 md:p-6 space-y-6">
          {subjects.map((sub) => {
            const perc = sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 0;
            const hasAbsences = sub.total - sub.attended > 0;
            const reason = subjectAbsenceRecords[sub.name]?.[0] || { reason: "OD", detail: "Academic symposium presentation." };

            return (
              <div 
                key={sub.id} 
                className="bg-white rounded-lg border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                {/* Header-like structure inside Card */}
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-950 tracking-tight">{sub.name}</h3>
                    <div className="space-y-1 pt-1">
                      <p className="text-sm font-medium text-gray-700">Conducted Classes : {sub.total}</p>
                      <p className="text-sm font-medium text-gray-700">Attended Classes : {sub.attended}</p>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-gray-950 pl-4 shrink-0">
                    {perc}%
                  </div>
                </div>

                {/* Reason block */}
                {hasAbsences && (
                  <div className="mt-4 bg-indigo-50/40 border-l-[3.5px] border-[#212c6a] p-4 max-w-xl rounded-r-md">
                    <p className="text-xs font-bold text-indigo-950">Reason : {reason.reason}</p>
                    <p className="text-xs text-indigo-900 mt-1.5 leading-relaxed font-medium">{reason.detail}</p>
                  </div>
                )}

                {/* View button */}
                <div className="mt-4">
                  <button 
                    onClick={() => handleSelectSubject(sub)}
                    className="bg-[#212c6a] hover:bg-[#1a2355] text-white px-4 py-2.5 text-xs font-semibold rounded transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.98]"
                  >
                    View Absence History
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Absence History */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full border border-gray-100 shadow-2xl p-8 transform transition-all duration-300 scale-100 flex flex-col relative max-h-[90vh]">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-950">
                {selectedSubject.name} - Absence History
              </h3>
              <button 
                onClick={() => setSelectedSubject(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Scrollable List container */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-x-auto flex pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar" 
              id="absence-history-scroll-container"
            >
              {(() => {
                const records = subjectAbsenceRecords[selectedSubject.name] || [
                  {
                    date: "05-08-2026",
                    day: "Wednesday",
                    reason: "Medical Leave",
                    detail: "Student was absent due to fever. Visited hospital for treatment. Medical certificate submitted."
                  }
                ];

                return records.map((record, index) => (
                  <div 
                    key={index} 
                    className="w-full shrink-0 snap-start snap-always px-1"
                  >
                    <div className="border border-gray-150 rounded-xl p-5 bg-white shadow-xs hover:shadow-sm transition-shadow duration-150 relative">
                      {/* Record Badge/Number indicator */}
                      <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Record {index + 1} of {records.length}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch mt-1">
                        {/* Left Side: Plain details */}
                        <div className="space-y-3.5 flex flex-col justify-center py-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-gray-900 text-sm md:text-base">Date :</span>
                            <span className="text-gray-700 text-sm md:text-base font-semibold">{record.date}</span>
                          </div>
                          
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-gray-900 text-sm md:text-base">Day :</span>
                            <span className="text-gray-700 text-sm md:text-base font-semibold">{record.day}</span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-gray-900 text-sm md:text-base">Reason :</span>
                            <span className="text-gray-700 text-sm md:text-base font-semibold text-indigo-950 bg-indigo-50/70 px-2.5 py-0.5 rounded-md border border-indigo-100/50">
                              {record.reason}
                            </span>
                          </div>
                        </div>

                        {/* Right Side: Colored details card */}
                        <div className="bg-indigo-50/15 rounded-lg p-5 flex flex-col justify-start border border-indigo-100/30">
                          <h4 className="text-sm font-extrabold text-gray-950 mb-2.5">Absence Details</h4>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {record.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 mt-2 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedSubject(null)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-7 py-3 rounded transition-all duration-150 cursor-pointer shadow-sm uppercase tracking-wider active:scale-[0.98]"
              >
                Close
              </button>

              {/* Previous / Next buttons */}
              {(() => {
                const records = subjectAbsenceRecords[selectedSubject.name] || [];
                if (records.length <= 1) return null;
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={absenceIndex === 0}
                      className={`px-4 py-2.5 text-xs font-bold rounded flex items-center gap-1 transition-all duration-150 ${
                        absenceIndex === 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#212c6a] hover:bg-[#1a2355] text-white cursor-pointer active:scale-95 shadow-sm'
                      }`}
                    >
                      ◀ Previous
                    </button>
                    
                    <button
                      onClick={() => handleNext(records.length)}
                      disabled={absenceIndex === records.length - 1}
                      className={`px-4 py-2.5 text-xs font-bold rounded flex items-center gap-1 transition-all duration-150 ${
                        absenceIndex === records.length - 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#212c6a] hover:bg-[#1a2355] text-white cursor-pointer active:scale-95 shadow-sm'
                      }`}
                    >
                      Next ▶
                    </button>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


