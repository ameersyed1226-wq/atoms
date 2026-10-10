/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  UserCheck 
} from 'lucide-react';
import { LeaveRequest } from '../types';

interface LeaveRequestTabProps {
  leaves: LeaveRequest[];
  onUpdateLeaves: (newLeaves: LeaveRequest[]) => void;
}

export default function LeaveRequestTab({
  leaves,
  onUpdateLeaves,
}: LeaveRequestTabProps) {
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Sick Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!startDate || !endDate || !reason.trim()) {
      setFormError('Please fill out all mandatory fields.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setFormError('Start date cannot be after the end date.');
      return;
    }

    const newRequest: LeaveRequest = {
      id: `lr-${Date.now()}`,
      startDate,
      endDate,
      leaveType,
      reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    onUpdateLeaves([newRequest, ...leaves]);
    setStartDate('');
    setEndDate('');
    setReason('');
    setFormSuccess(true);

    // Auto clear success notice
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const handleCancelRequest = (id: string) => {
    onUpdateLeaves(leaves.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8" id="leave-request-tab-container">
      {/* Header alert informational */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5.5 h-5.5 text-indigo-600" /> Administrative Leave Portal
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Apply for Sick Leave, Casual Leave, Medical Leave, or official Duty Leave. All submitted requests undergo automatic routing to administrative coordinators for verification.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-50 border border-amber-100 text-amber-800 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-amber-600">Pending Requests</p>
            <p className="text-lg font-black">{leaves.filter(l => l.status === 'Pending').length}</p>
          </div>
          <div className="bg-green-50 border border-green-100 text-green-800 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-green-600">Approved Leaves</p>
            <p className="text-lg font-black">{leaves.filter(l => l.status === 'Approved').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left 2 Columns: Application Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] h-fit">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-[#212c6a]" /> Submit Leave Request
          </h3>

          <form onSubmit={handleSubmitLeave} className="space-y-4">
            {formError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                ⚠️ {formError}
              </p>
            )}

            {formSuccess && (
              <p className="text-xs font-bold text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                ✓ Leave request submitted successfully!
              </p>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Leave Category *</label>
              <select
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Medical">Medical Leave</option>
                <option value="Duty Leave">Duty Leave (Athletics / Hackathons)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Start Date *</label>
                <input
                  type="date"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">End Date *</label>
                <input
                  type="date"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Reason for absence *</label>
              <textarea
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 h-24 focus:outline-indigo-600 resize-none"
                placeholder="Brief description of emergency..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={400}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Request Leave Authorization
            </button>
          </form>
        </div>

        {/* Right 3 Columns: Requests Ledger */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserCheck className="w-4.5 h-4.5 text-[#212c6a]" /> Leave History & Ledger
          </h3>

          <div className="space-y-4">
            {leaves.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-10">No submitted leaves found.</p>
            ) : (
              leaves.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 border border-slate-100 rounded-xl bg-slate-50/20 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row justify-between items-start gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.leaveType}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">Applied: {item.appliedDate}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      Duration: {item.startDate} to {item.endDate}
                    </p>
                    <p className="text-xs text-slate-500 italic font-medium leading-relaxed max-w-md">
                      "{item.reason}"
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 self-stretch sm:self-auto justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                      item.status === 'Approved'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : item.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {item.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                      {item.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {item.status === 'Pending' && <Clock className="w-3 h-3 animate-spin" />}
                      {item.status}
                    </span>

                    {item.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelRequest(item.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors hover:bg-rose-50 p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
