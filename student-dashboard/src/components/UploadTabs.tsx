/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Briefcase, 
  Upload, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  Plus, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { StudentCertificate, InternshipEntry } from '../types';

interface UploadTabsProps {
  mode: 'certificates' | 'internships';
  certificates: StudentCertificate[];
  internships: InternshipEntry[];
  onUpdateCertificates: (newCertificates: StudentCertificate[]) => void;
  onUpdateInternships: (newInternships: InternshipEntry[]) => void;
}

export default function UploadTabs({
  mode,
  certificates,
  internships,
  onUpdateCertificates,
  onUpdateInternships,
}: UploadTabsProps) {
  // Certificate states
  const [certTitle, setCertTitle] = useState('');
  const [certCategory, setCertCategory] = useState<StudentCertificate['category']>('Online Course');
  const [certDate, setCertDate] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);

  // Internship states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('2 Months');
  const [startDate, setStartDate] = useState('');
  const [desc, setDesc] = useState('');
  const [internshipFile, setInternshipFile] = useState<File | null>(null);

  const [notif, setNotif] = useState('');

  const triggerNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(''), 4500);
  };

  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certDate) return;

    const fakeFileName = certFile ? certFile.name : `${certTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`;
    const fakeFileSize = certFile ? `${(certFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';

    const newCert: StudentCertificate = {
      id: `cert-${Date.now()}`,
      title: certTitle,
      category: certCategory,
      issueDate: certDate,
      fileName: fakeFileName,
      status: 'Pending Verification',
      fileSize: fakeFileSize
    };

    onUpdateCertificates([newCert, ...certificates]);
    setCertTitle('');
    setCertDate('');
    setCertFile(null);
    triggerNotification('✓ Certificate uploaded and queued for admin validation!');
  };

  const handleDeleteCertificate = (id: string) => {
    onUpdateCertificates(certificates.filter(c => c.id !== id));
    triggerNotification('✓ Certificate removed.');
  };

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !startDate) return;

    const fakeFileName = internshipFile ? internshipFile.name : `${company.toLowerCase().replace(/\s+/g, '_')}_offer.pdf`;

    const newInternship: InternshipEntry = {
      id: `int-${Date.now()}`,
      companyName: company,
      role,
      duration,
      startDate,
      status: 'Ongoing',
      fileName: fakeFileName,
      description: desc
    };

    onUpdateInternships([newInternship, ...internships]);
    setCompany('');
    setRole('');
    setStartDate('');
    setDesc('');
    setInternshipFile(null);
    triggerNotification('✓ Internship record logged and offer document uploaded successfully!');
  };

  const handleDeleteInternship = (id: string) => {
    onUpdateInternships(internships.filter(i => i.id !== id));
    triggerNotification('✓ Internship record deleted.');
  };

  return (
    <div className="space-y-8" id="uploads-tab-container">
      {/* Toast banner */}
      {notif && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <FileCheck className="w-4 h-4 text-green-400" />
          <span>{notif}</span>
        </div>
      )}

      {mode === 'certificates' ? (
        // Certificates Mode layout
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] h-fit">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-600" /> Register Academic Certificate
            </h3>

            <form onSubmit={handleCertificateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Certificate Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Learning Specialization"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Category *</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={certCategory}
                    onChange={(e) => setCertCategory(e.target.value as any)}
                  >
                    <option value="Online Course">Online Course</option>
                    <option value="Extracurricular">Extracurricular</option>
                    <option value="Sports">Sports</option>
                    <option value="Technical Paper">Technical Paper</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Issue Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Drag and drop select file */}
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Upload Certificate (PDF/Image) *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-600 bg-slate-50/50 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setCertFile(e.target.files ? e.target.files[0] : null)}
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-indigo-600 transition-colors" />
                  <p className="font-bold text-slate-600">
                    {certFile ? certFile.name : 'Choose file or drag here'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" /> Save Certificate Details
              </button>
            </form>
          </div>

          {/* Table list */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileCheck className="w-4.5 h-4.5 text-indigo-600" /> Uploaded Credentials Inventory
            </h3>

            <div className="space-y-4">
              {certificates.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10">No uploaded certificates yet.</p>
              ) : (
                certificates.map((cert) => (
                  <div key={cert.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/20 hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {cert.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">Issued: {cert.issueDate}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{cert.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Upload className="w-3 h-3 text-slate-400" /> {cert.fileName} ({cert.fileSize})
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${
                        cert.status === 'Verified'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : cert.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {cert.status === 'Verified' ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5 animate-pulse" />}
                        {cert.status}
                      </span>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id)}
                        className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        // Internship Mode layout
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] h-fit">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" /> Register Internship Engagement
            </h3>

            <form onSubmit={handleInternshipSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google India"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Intern"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Duration *</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Letter Attachment</label>
                  <div className="relative border border-slate-200 bg-slate-50 hover:bg-white rounded-lg p-2.5 text-center flex items-center justify-center gap-1 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setInternshipFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-600 line-clamp-1">
                      {internshipFile ? internshipFile.name : 'Upload PDF'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Key responsibilities & projects</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 h-20 focus:outline-indigo-600 focus:bg-white resize-none"
                  placeholder="Developed frontend systems, resolved bugs..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" /> Save Internship Record
              </button>
            </form>
          </div>

          {/* Table list */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-indigo-600" /> Professional Experience Inventory
            </h3>

            <div className="space-y-4">
              {internships.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10">No internship records logged.</p>
              ) : (
                internships.map((int) => (
                  <div key={int.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/20 hover:bg-slate-50/60 transition-colors flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{int.companyName}</h4>
                        <p className="text-xs text-slate-600 font-semibold">{int.role} • <span className="text-indigo-600">{int.duration}</span></p>
                        <p className="text-[10px] text-slate-400 font-semibold">Commenced: {int.startDate}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          int.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        }`}>
                          {int.status}
                        </span>
                        <button
                          onClick={() => handleDeleteInternship(int.id)}
                          className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 italic font-medium">
                      "{int.description}"
                    </p>

                    {int.fileName && (
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-700 font-bold bg-indigo-50/50 w-fit px-2 py-1 rounded-md border border-indigo-100/30">
                        <FileCheck className="w-3.5 h-3.5" /> Attached: {int.fileName}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
