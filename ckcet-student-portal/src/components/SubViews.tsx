import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, CalendarDays, Shield, CreditCard, Download, 
  Book, Search, Check, Briefcase, FileText, Sparkles, ArrowUpRight, 
  Clock, MapPin, ClipboardList, Info, AlertCircle, RefreshCw, Send, Plus,
  Award, Users, Megaphone, CheckCircle, Camera, ChevronDown, ChevronUp,
  PenTool, Upload, X, Home, GraduationCap, CheckSquare, BookOpen
} from 'lucide-react';
import { Student, Course, Announcement } from '../types';

// ==========================================
// 1. PROFILE SUB-VIEW
// ==========================================
interface ProfileViewProps {
  student: Student;
  onBack: () => void;
}

const sectionFields: Record<string, string[]> = {
  personalInfo: [
    'title', 'firstName', 'lastName', 'gender', 'dob', 'nationality', 'religion',
    'community', 'caste', 'motherTongue', 'bloodGroup', 'maritalStatus', 'aadhaarNumber', 'emailId'
  ],
  familyDetails: [
    'fatherName', 'motherName', 'guardianName', 'fatherOccupationSector', 'fatherOrganisation',
    'fatherDesignation', 'fatherAnnualIncome', 'motherOccupationSector', 'motherOrganisation',
    'motherDesignation', 'motherAnnualIncome', 'familyAnnualIncome'
  ],
  contactDetails: [
    'studentMobile', 'fatherMobile', 'motherMobile', 'studentWhatsapp', 'fatherWhatsapp', 'motherWhatsapp'
  ],
  addressDetails: [
    'presentHouseNo', 'presentStreet', 'presentLocality', 'presentCity', 'presentPincode', 'presentDistrict', 'presentState', 'presentCountry',
    'permanentAddress', 'permanentPincode', 'permanentCity', 'permanentState', 'permanentDistrict', 'permanentCountry',
    'hostellerDayScholar', 'transportRequired', 'transportRoute', 'transportStage'
  ],
  academicDetails: [
    'previousSchoolCollege', 'mediumOfInstruction', 'examinationPassedAppeared', 'studentCategory', 'seatCategory', 'scholarshipDetails', 'emisUmisNumber'
  ],
  qualifyingMarks: [
    'mathsPCOrOther', 'physicsTheory', 'chemistryLab', 'totalMarks', 'cutoff', 'tenthInstitute', 'tenthBoard', 'tenthMonthYear', 'tenthAttempts', 'tenthMarks',
    'twelfthInstitute', 'twelfthBoard', 'twelfthMonthYear', 'twelfthAttempts', 'twelfthMarks', 'diplomaDegreeInstitute', 'diplomaDegreeBoard', 'diplomaDegreeMonthYear', 'diplomaDegreeAttempts', 'diplomaDegreeMarks'
  ]
};

export function ProfileView({ student, onBack }: ProfileViewProps) {
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`ckcet_profile_fields_${student.regNo}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      title: '',
      firstName: 'SYED',
      lastName: 'AMEER R',
      gender: '',
      dob: '',
      nationality: '',
      religion: '',
      community: '',
      caste: '',
      motherTongue: '',
      bloodGroup: '',
      maritalStatus: '',
      aadhaarNumber: '',
      emailId: 'ameersyed1226@gmail.com',
      fatherName: '',
      motherName: '',
      guardianName: '',
      fatherOccupationSector: '',
      fatherOrganisation: '',
      fatherDesignation: '',
      fatherAnnualIncome: '',
      motherOccupationSector: '',
      motherOrganisation: '',
      motherDesignation: '',
      motherAnnualIncome: '',
      familyAnnualIncome: '',
      studentMobile: '',
      fatherMobile: '',
      motherMobile: '',
      studentWhatsapp: '',
      fatherWhatsapp: '',
      motherWhatsapp: '',
      presentHouseNo: '',
      presentStreet: '',
      presentLocality: '',
      presentCity: '',
      presentPincode: '',
      presentDistrict: '',
      presentState: '',
      presentCountry: '',
      permanentAddress: '',
      permanentPincode: '',
      permanentCity: '',
      permanentState: '',
      permanentDistrict: '',
      permanentCountry: '',
      hostellerDayScholar: '',
      transportRequired: '',
      transportRoute: '',
      transportStage: '',
      previousSchoolCollege: '',
      mediumOfInstruction: '',
      examinationPassedAppeared: '',
      studentCategory: '',
      seatCategory: '',
      scholarshipDetails: '',
      emisUmisNumber: '',
      mathsPCOrOther: '',
      physicsTheory: '',
      chemistryLab: '',
      totalMarks: '',
      cutoff: '',
      tenthInstitute: '',
      tenthBoard: '',
      tenthMonthYear: '',
      tenthAttempts: '',
      tenthMarks: '',
      twelfthInstitute: '',
      twelfthBoard: '',
      twelfthMonthYear: '',
      twelfthAttempts: '',
      twelfthMarks: '',
      diplomaDegreeInstitute: '',
      diplomaDegreeBoard: '',
      diplomaDegreeMonthYear: '',
      diplomaDegreeAttempts: '',
      diplomaDegreeMarks: '',
    };
  });

  const [isSameAsPresent, setIsSameAsPresent] = useState(() => {
    const saved = localStorage.getItem(`ckcet_profile_is_same_${student.regNo}`);
    return saved === 'true';
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    familyDetails: false,
    contactDetails: false,
    addressDetails: false,
    academicDetails: false,
    qualifyingMarks: false
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem(`ckcet_avatar_${student.regNo}`) || student.avatar || '';
  });

  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [signatureUrl, setSignatureUrl] = useState<string>(() => {
    return localStorage.getItem(`ckcet_signature_${student.regNo}`) || '';
  });

  // Automatically sync permanent address with present address if toggled
  useEffect(() => {
    if (isSameAsPresent) {
      setFields(prev => {
        const combinedPresentAddress = `${prev.presentHouseNo || ''} ${prev.presentStreet || ''} ${prev.presentLocality || ''}`.trim();
        if (
          prev.permanentAddress !== combinedPresentAddress ||
          prev.permanentCity !== (prev.presentCity || '') ||
          prev.permanentPincode !== (prev.presentPincode || '') ||
          prev.permanentState !== (prev.presentState || '') ||
          prev.permanentDistrict !== (prev.presentDistrict || '') ||
          prev.permanentCountry !== (prev.presentCountry || '')
        ) {
          const updated = {
            ...prev,
            permanentAddress: combinedPresentAddress,
            permanentCity: prev.presentCity || '',
            permanentPincode: prev.presentPincode || '',
            permanentState: prev.presentState || '',
            permanentDistrict: prev.presentDistrict || '',
            permanentCountry: prev.presentCountry || ''
          };
          localStorage.setItem(`ckcet_profile_fields_${student.regNo}`, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [
    fields.presentHouseNo,
    fields.presentStreet,
    fields.presentLocality,
    fields.presentCity,
    fields.presentPincode,
    fields.presentDistrict,
    fields.presentState,
    fields.presentCountry,
    isSameAsPresent,
    student.regNo
  ]);

  const getFilledCount = (sectionKey: string) => {
    const keys = sectionFields[sectionKey];
    if (!keys) return 0;
    return keys.filter(k => fields[k] && fields[k].trim() !== '' && fields[k].trim() !== '—').length;
  };

  const totalFilled = Object.keys(sectionFields).reduce((acc, key) => {
    return acc + getFilledCount(key);
  }, 0);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem(`ckcet_avatar_${student.regNo}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureClick = () => {
    signatureInputRef.current?.click();
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSignatureUrl(base64String);
        localStorage.setItem(`ckcet_signature_${student.regNo}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSignatureUrl('');
    localStorage.removeItem(`ckcet_signature_${student.regNo}`);
  };

  const handleSameAddressToggle = (checked: boolean) => {
    setIsSameAsPresent(checked);
    localStorage.setItem(`ckcet_profile_is_same_${student.regNo}`, checked ? 'true' : 'false');
    if (checked) {
      setFields(prev => {
        const combined = `${prev.presentHouseNo || ''} ${prev.presentStreet || ''} ${prev.presentLocality || ''}`.trim();
        const updated = {
          ...prev,
          permanentAddress: combined,
          permanentCity: prev.presentCity || '',
          permanentPincode: prev.presentPincode || '',
          permanentState: prev.presentState || '',
          permanentDistrict: prev.presentDistrict || '',
          permanentCountry: prev.presentCountry || ''
        };
        localStorage.setItem(`ckcet_profile_fields_${student.regNo}`, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const renderField = (id: string, label: string, type: string = 'text', options?: string[]) => {
    const value = fields[id] || '';
    const isDisabled = isSameAsPresent && [
      'permanentAddress', 'permanentPincode', 'permanentCity', 'permanentState', 'permanentDistrict', 'permanentCountry'
    ].includes(id);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const newVal = e.target.value;
      setFields(prev => {
        const updated = { ...prev, [id]: newVal };
        localStorage.setItem(`ckcet_profile_fields_${student.regNo}`, JSON.stringify(updated));
        return updated;
      });
    };

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[10px] md:text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
          {label}
        </label>
        {type === 'select' && options ? (
          <select
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            className={`w-full bg-[#f8fafc] text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-xs md:text-sm ${isDisabled ? 'opacity-65 cursor-not-allowed bg-slate-100' : ''}`}
          >
            <option value="">—</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            placeholder="—"
            className={`w-full bg-[#f8fafc] text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-xs md:text-sm placeholder-slate-400 ${isDisabled ? 'opacity-65 cursor-not-allowed bg-slate-100' : ''}`}
          />
        )}
      </div>
    );
  };

  const keyDetails = [
    { label: 'Register Number', value: student.regNo, icon: Shield },
    { label: 'Student Name', value: fields.firstName || fields.lastName ? `${fields.firstName} ${fields.lastName}`.trim().toUpperCase() : student.name.toUpperCase(), icon: User },
    { label: 'Programme', value: 'UG', icon: GraduationCap },
    { label: 'Department', value: student.department, icon: BookOpen },
    { label: 'Section', value: 'A', icon: Users },
    { label: 'Batch', value: `${student.joinedYear}-${student.joinedYear + 4}`, icon: CalendarDays },
    { label: 'Email', value: fields.emailId || student.email, icon: Mail }
  ];

  const sectionsList = [
    {
      key: 'personalInfo',
      title: 'Personal Information',
      icon: User,
      color: 'indigo',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('title', 'Title', 'select', ['MR', 'MRS', 'MS', 'DR'])}
          {renderField('firstName', 'First Name')}
          {renderField('lastName', 'Last Name')}
          {renderField('gender', 'Gender', 'select', ['MALE', 'FEMALE', 'OTHER'])}
          {renderField('dob', 'Date of Birth', 'date')}
          {renderField('nationality', 'Nationality')}
          {renderField('religion', 'Religion')}
          {renderField('community', 'Community')}
          {renderField('caste', 'Caste')}
          {renderField('motherTongue', 'Mother Tongue')}
          {renderField('bloodGroup', 'Blood Group', 'select', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}
          {renderField('maritalStatus', 'Marital Status', 'select', ['SINGLE', 'MARRIED', 'DIVORCED'])}
          {renderField('aadhaarNumber', 'Aadhaar Number')}
          {renderField('emailId', 'Email ID')}
        </div>
      )
    },
    {
      key: 'familyDetails',
      title: 'Family Details',
      icon: Users,
      color: 'emerald',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('fatherName', 'Father / Guardian Name')}
          {renderField('motherName', 'Mother Name')}
          {renderField('guardianName', 'Guardian Name')}
          {renderField('fatherOccupationSector', 'Father Occupation Sector')}
          {renderField('fatherOrganisation', 'Father Organisation')}
          {renderField('fatherDesignation', 'Father Designation')}
          {renderField('fatherAnnualIncome', 'Father Annual Income')}
          {renderField('motherOccupationSector', 'Mother Occupation Sector')}
          {renderField('motherOrganisation', 'Mother Organisation')}
          {renderField('motherDesignation', 'Mother Designation')}
          {renderField('motherAnnualIncome', 'Mother Annual Income')}
          {renderField('familyAnnualIncome', 'Family Annual Income')}
        </div>
      )
    },
    {
      key: 'contactDetails',
      title: 'Contact Details',
      icon: Phone,
      color: 'violet',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('studentMobile', 'Student Mobile Number')}
          {renderField('fatherMobile', 'Father Mobile Number')}
          {renderField('motherMobile', 'Mother Mobile Number')}
          {renderField('studentWhatsapp', 'Student WhatsApp Number')}
          {renderField('fatherWhatsapp', 'Father WhatsApp Number')}
          {renderField('motherWhatsapp', 'Mother WhatsApp Number')}
        </div>
      )
    },
    {
      key: 'addressDetails',
      title: 'Address Details',
      icon: MapPin,
      color: 'rose',
      render: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField('presentHouseNo', 'Present House No')}
            {renderField('presentStreet', 'Present Street')}
            {renderField('presentLocality', 'Present Locality')}
            {renderField('presentCity', 'Present City')}
            {renderField('presentPincode', 'Present Pincode')}
            {renderField('presentDistrict', 'Present District')}
            {renderField('presentState', 'Present State')}
            {renderField('presentCountry', 'Present Country')}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 my-4">
            <span className="text-xs md:text-sm font-bold text-slate-600">Permanent address is same as present address</span>
            <button
              type="button"
              onClick={() => handleSameAddressToggle(!isSameAsPresent)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${isSameAsPresent ? 'bg-[#0d0c63]' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSameAsPresent ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <h5 className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase mb-4 mt-2">Permanent Address</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('permanentAddress', 'Permanent Address')}
              {renderField('permanentPincode', 'Permanent Pincode')}
              {renderField('permanentCity', 'Permanent City')}
              {renderField('permanentState', 'Permanent State')}
              {renderField('permanentDistrict', 'Permanent District')}
              {renderField('permanentCountry', 'Permanent Country')}
              {renderField('hostellerDayScholar', 'Hosteller / Day Scholar', 'select', ['HOSTELLER', 'DAY SCHOLAR'])}
              {renderField('transportRequired', 'Transport Required', 'select', ['YES', 'NO'])}
              {renderField('transportRoute', 'Transport Route')}
              {renderField('transportStage', 'Transport Stage')}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'academicDetails',
      title: 'Academic Details',
      icon: BookOpen,
      color: 'amber',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('previousSchoolCollege', 'Previous School / College')}
          {renderField('mediumOfInstruction', 'Medium of Instruction', 'select', ['ENGLISH', 'TAMIL', 'HINDI', 'OTHER'])}
          {renderField('examinationPassedAppeared', 'Examination Passed / Appeared')}
          {renderField('studentCategory', 'Student Category')}
          {renderField('seatCategory', 'Seat Category')}
          {renderField('scholarshipDetails', 'Scholarship Details')}
          {renderField('emisUmisNumber', 'EMIS / UMIS Number')}
        </div>
      )
    },
    {
      key: 'qualifyingMarks',
      title: 'Qualifying Exam Marks',
      icon: Award,
      color: 'sky',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('mathsPCOrOther', 'Maths/P/C')}
          {renderField('physicsTheory', 'Physics/Theory')}
          {renderField('chemistryLab', 'Chemistry/Lab')}
          {renderField('totalMarks', 'Total Marks')}
          {renderField('cutoff', 'Cutoff')}
          {renderField('tenthInstitute', '10th Institute')}
          {renderField('tenthBoard', '10th Board')}
          {renderField('tenthMonthYear', '10th Month / Year')}
          {renderField('tenthAttempts', '10th Attempts')}
          {renderField('tenthMarks', '10th Marks')}
          {renderField('twelfthInstitute', '12th Institute')}
          {renderField('twelfthBoard', '12th Board')}
          {renderField('twelfthMonthYear', '12th Month / Year')}
          {renderField('twelfthAttempts', '12th Attempts')}
          {renderField('twelfthMarks', '12th Marks')}
          {renderField('diplomaDegreeInstitute', 'Diploma / Degree Institute')}
          {renderField('diplomaDegreeBoard', 'Diploma / Degree Board')}
          {renderField('diplomaDegreeMonthYear', 'Diploma / Degree Month / Year')}
          {renderField('diplomaDegreeAttempts', 'Diploma / Degree Attempts')}
          {renderField('diplomaDegreeMarks', 'Diploma / Degree Marks')}
        </div>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Hidden file inputs for uploading avatar and signature */}
      <input 
        type="file" 
        ref={avatarInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={signatureInputRef} 
        onChange={handleSignatureChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono font-bold">Profile ID: {student.regNo}</span>
      </div>

      {/* 1. Header Card with gradient background */}
      <div className="bg-gradient-to-r from-[#0d0c63] to-[#0a0952] text-white p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto">
          {/* Avatar container with hover camera overlay */}
          <div 
            onClick={handleAvatarClick}
            className="w-20 h-20 md:w-24 md:h-24 bg-white/10 border-2 border-white/20 flex items-center justify-center rounded-full relative cursor-pointer hover:border-white/40 transition-all overflow-hidden shrink-0 group shadow-inner"
          >
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-black text-white tracking-wide">
                SA
              </span>
            )}
            <div className="absolute bottom-0 right-0 bg-white text-[#0d0c63] p-1.5 rounded-full shadow-md hover:scale-110 transition-all border border-slate-100">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-black font-display tracking-wide uppercase leading-tight">
              {fields.firstName || fields.lastName ? `${fields.firstName} ${fields.lastName}`.trim().toUpperCase() : student.name.toUpperCase()}
            </h2>
            <p className="text-xs md:text-sm font-mono text-indigo-200 mt-1 flex items-center justify-center md:justify-start gap-1.5 opacity-90">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>{student.regNo}</span>
            </p>
          </div>
        </div>

        {/* Fields filled indicator badge */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-indigo-100 flex items-center gap-1.5 shrink-0">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{totalFilled}/77 fields filled</span>
        </div>
      </div>

      {/* 2. Grid for Personal Details and Digital Signature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Details */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6 shrink-0">
            <User className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-slate-800 text-base font-display">Personal Details</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
            {keyDetails.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div key={index} className="flex items-center gap-3.5 p-3 hover:bg-slate-50/50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block leading-tight">
                      {detail.label}
                    </span>
                    <p className="font-bold text-slate-700 mt-0.5 text-xs md:text-sm leading-snug">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Digital Signature */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col h-full min-h-[280px]">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6 shrink-0">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-slate-800 text-base font-display">Digital Signature</h4>
          </div>

          <div 
            onClick={handleSignatureClick}
            className="flex-1 w-full bg-[#f8fafc] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-indigo-50/20 hover:border-indigo-300 transition-all min-h-[160px] relative group overflow-hidden"
          >
            {signatureUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img 
                  src={signatureUrl} 
                  alt="Digital Signature" 
                  className="max-h-24 max-w-full object-contain pointer-events-none" 
                />
                <button 
                  onClick={handleClearSignature} 
                  className="absolute top-0 right-0 p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-xs"
                  title="Remove Signature"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                <p className="text-xs md:text-sm text-slate-400 font-bold tracking-wide italic">No signature uploaded</p>
                <span className="text-[10px] text-slate-300 group-hover:text-indigo-400 transition-colors">Click to upload image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Collapsible Accordions for Sub-Forms */}
      <div className="space-y-4">
        {sectionsList.map((section, idx) => {
          const Icon = section.icon;
          const isExpanded = !!expandedSections[section.key];
          const totalFieldsCount = sectionFields[section.key].length;
          const filledFieldsCount = getFilledCount(section.key);
          const progressPercent = (filledFieldsCount / totalFieldsCount) * 100;

          return (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all duration-300 hover:border-slate-200"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-extrabold text-slate-800">
                      {section.title}
                    </h4>
                    
                    {/* Tiny Progress bar and filled fields count */}
                    <div className="flex items-center gap-2.5 mt-1">
                      <span className="text-[10px] md:text-[11px] font-extrabold text-slate-400 font-mono tracking-wider">
                        {filledFieldsCount}/{totalFieldsCount} fields
                      </span>
                      <div className="w-16 md:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0" />
                  )}
                </div>
              </button>

              {/* Accordion Content with framer-motion AnimatePresence */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div className="p-6 border-t border-slate-50 bg-[#fafcfd]/45">
                      {section.render()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 4. Footer secure text */}
      <div className="text-center pt-4 text-xs font-bold text-slate-400 tracking-wide">
        Data is stored securely in your student profile
      </div>
    </motion.div>
  );
}


// ==========================================
// 2. FEE DETAILS SUB-VIEW (Online payment & animated receipt)
// ==========================================
interface FeesViewProps {
  student: Student;
  onBack: () => void;
}
export function FeesView({ student, onBack }: FeesViewProps) {
  const [fees, setFees] = useState([
    { name: 'Semester Tuition Fee (Sem IV)', code: 'TUIT-4', amount: 55000, status: 'Paid', ref: 'TXN-982310', date: '2026-02-12' },
    { name: 'Hostel Rent & Mess Fees (Sem IV)', code: 'HOST-4', amount: 45000, status: 'Paid', ref: 'TXN-874312', date: '2026-02-14' },
    { name: 'Anna University Examination Fees', code: 'EXAM-4', amount: 1500, status: 'Pending', ref: null, date: null },
    { name: 'Placement Training & Skill Fees', code: 'PLACE-4', amount: 5000, status: 'Paid', ref: 'TXN-763421', date: '2026-03-05' }
  ]);
  const [payingFeeCode, setPayingFeeCode] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'processing' | 'receipt'>('selection');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState<string>(`${student.regNo}@okaxis`);
  const [receiptTxn, setReceiptTxn] = useState<any>(null);

  const startPayment = (code: string) => {
    setPayingFeeCode(code);
    setPaymentStep('processing');
    
    // Simulate transaction delay
    setTimeout(() => {
      const matchedFee = fees.find(f => f.code === code);
      const newRef = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toISOString().split('T')[0];
      
      setFees(prev => prev.map(f => {
        if (f.code === code) {
          return { ...f, status: 'Paid', ref: newRef, date: today };
        }
        return f;
      }));

      setReceiptTxn({
        name: matchedFee?.name,
        amount: matchedFee?.amount,
        ref: newRef,
        date: today,
        method: paymentMethod.toUpperCase()
      });
      setPaymentStep('receipt');
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Pending Fees: ₹{fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0)}</span>
        </span>
      </div>

      <AnimatePresence mode="wait">
        {paymentStep === 'selection' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 font-display text-sm">Active Fee Ledger - Semester IV</h4>
                <p className="text-xs text-slate-400 mt-0.5">Choose outstanding payments to pay securely online via college gateway.</p>
              </div>

              <div className="divide-y divide-slate-50 text-xs">
                {fees.map((fee, idx) => (
                  <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm leading-snug">{fee.name}</h5>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                        <span>Ledger ID: {fee.code}</span>
                        {fee.ref && <span>Receipt Ref: {fee.ref}</span>}
                        {fee.date && <span>Paid On: {fee.date}</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div>
                        <p className="text-right text-[10px] text-slate-400 font-bold uppercase">Amount</p>
                        <p className="font-extrabold text-[#0d0c63] text-sm mt-0.5">₹{fee.amount.toLocaleString('en-IN')}</p>
                      </div>

                      {fee.status === 'Paid' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-xl font-bold tracking-wide flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setPayingFeeCode(fee.code);
                            setPaymentStep('processing');
                            startPayment(fee.code);
                          }}
                          className="bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                        >
                          Pay Online
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {paymentStep === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-[#0d0c63] rounded-full animate-spin mb-6"></div>
            <h4 className="font-bold text-lg text-slate-800 font-display">Securing Payment Channel...</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              Please wait while we establish a secure connection with Anna University fee bank API. Do not refresh or press back.
            </p>
            <div className="mt-4 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-3.5 py-1 rounded-full font-mono font-bold uppercase tracking-widest">
              Securing SSL Handshake
            </div>
          </motion.div>
        )}

        {paymentStep === 'receipt' && receiptTxn && (
          <motion.div key="receipt" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-bold text-lg text-slate-800 font-display">Payment Successful!</h4>
              <p className="text-xs text-slate-400">Your fee payment ledger records have been updated successfully.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl text-left border border-slate-100 space-y-3.5 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Receipt Description</span>
                <span className="text-slate-700 font-bold truncate max-w-[200px]">{receiptTxn.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Transaction Reference</span>
                <span className="text-[#0d0c63] font-bold">{receiptTxn.ref}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Paid Date &amp; Time</span>
                <span className="text-slate-700 font-bold">{receiptTxn.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Student Reg No</span>
                <span className="text-slate-700 font-bold">{student.regNo}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400 font-bold uppercase text-[9px] text-left">Total Paid Amount</span>
                <span className="text-emerald-600 font-extrabold text-sm">₹{receiptTxn.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentStep('selection')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                Done
              </button>
              <button
                onClick={() => alert(`Receipt saved to downloads folder: RECEIPT_${receiptTxn.ref}.pdf`)}
                className="flex-1 bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save Receipt</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
interface SyllabusSubject {
  code: string;
  name: string;
  credits: number;
  type: 'THEORY' | 'PRACTICAL';
  units: { title: string; topics: string }[];
  books: string;
}

const SEMESTER_SYLLABI: Record<number, { subjects: SyllabusSubject[], credits: number, subjectsCount: number }> = {
  1: {
    subjectsCount: 9,
    credits: 21,
    subjects: [
      {
        code: 'HS3151',
        name: 'Professional English I',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: SHARING INFORMATION', topics: 'Listening: Listening to speaking, reading comprehension, writing paragraph, grammar basics.' },
          { title: 'UNIT II: GENERAL READING & WRITING', topics: 'Reading: Short articles, writing informal letters, instructions, active/passive voice.' },
          { title: 'UNIT III: TECHNICAL WRITING', topics: 'Writing: Descriptions of gadgets, definitions, collocations, compound nouns.' },
          { title: 'UNIT IV: REPORTING & ANALYSING', topics: 'Listening: Lectures, writing analytical paragraphs, report on experiments.' },
          { title: 'UNIT V: TECHNICAL COMMUNICATION', topics: 'Speaking: Group discussion, job application letters, formal correspondence.' }
        ],
        books: '1. English for Engineers and Technologists, Orient Blackswan.'
      },
      {
        code: 'MA3151',
        name: 'Matrices and Calculus',
        credits: 4,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: MATRICES', topics: 'Eigenvalues and Eigenvectors, Diagonalization, Quadratic forms, Cayley-Hamilton Theorem.' },
          { title: 'UNIT II: DIFFERENTIAL CALCULUS', topics: 'Limits, Continuity, Rolle\'s Theorem, Taylor\'s Series, Maxima and Minima of single variables.' },
          { title: 'UNIT III: FUNCTIONS OF SEVERAL VARIABLES', topics: 'Partial Derivatives, Jacobians, Taylor\'s Series for two variables, Lagrange Multipliers.' },
          { title: 'UNIT IV: MULTIPLE INTEGRALS', topics: 'Double Integrals, Area integrals, Triple Integrals, Volume calculations, Change of variables.' },
          { title: 'UNIT V: ORDINARY DIFFERENTIAL EQUATIONS', topics: 'Second-order linear equations, Method of variation of parameters, Cauchy-Euler equations.' }
        ],
        books: '1. G.B. Thomas, Calculus, Pearson Education.'
      },
      { code: 'PH3151', name: 'Engineering Physics', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: OSCILLATIONS & WAVES', topics: 'Simple harmonic motion, wave motion, resonance.' }], books: '1. Arthur Beiser, Concepts of Modern Physics.' },
      { code: 'CY3151', name: 'Engineering Chemistry', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: WATER TECHNOLOGY', topics: 'Hardness of water, boiler troubles, water treatment.' }], books: '1. Jain & Jain, Engineering Chemistry.' },
      { code: 'GE3151', name: 'Problem Solving and Python Programming', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: ALGORITHMIC PROBLEM SOLVING', topics: 'Algorithms, pseudo-code, flowcharts, recursion.' }], books: '1. Allen B. Downey, Think Python.' },
      { code: 'GE3152', name: 'TAMILIZHAR AND TECHNOLOGY', credits: 1, type: 'THEORY', units: [{ title: 'UNIT I: HERITAGE & INDUSTRY', topics: 'Tamil heritage, weaving, metallurgy, traditional engineering.' }], books: '1. Textbooks from Tamil Nadu Text Book Corporation.' },
      { code: 'GE3171', name: 'Python Programming Laboratory', credits: 2, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Implementing basic Python scripts, control flows, functions, libraries.' }], books: 'Lab Manual' },
      { code: 'BS3171', name: 'Physics and Chemistry Laboratory', credits: 2, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Viscosity, Laser, Spectrometer experiments; Water analysis, Conductometric titration.' }], books: 'Lab Manual' },
      { code: 'GE3172', name: 'English Laboratory', credits: 1, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Phonetics, Listening skills, Pronunciation, Group presentations.' }], books: 'Lab Manual' }
    ]
  },
  2: {
    subjectsCount: 10,
    credits: 26,
    subjects: [
      { code: 'HS3251', name: 'Professional English II', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: BUSINESS WRITING', topics: 'Letters, resume, cover emails, project plans.' }], books: '1. Professional Communications, Oxford Univ Press.' },
      { code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4, type: 'THEORY', units: [{ title: 'UNIT I: TESTING OF HYPOTHESIS', topics: 'Sampling distributions, Large sample tests, t-test, Chi-square, F-test.' }], books: '1. Richard Johnson, Probability and Statistics.' },
      { code: 'PH3256', name: 'Physics for Information Science', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: ELECTRICAL PROPERTIES', topics: 'Classical free electron theory, Wiedemann-Franz law, Quantum free electron theory.' }], books: '1. Charles Kittel, Solid State Physics.' },
      { code: 'BE3251', name: 'Basic Electrical and Electronics Engineering', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: DC & AC CIRCUITS', topics: 'Mesh analysis, nodal analysis, sinusoidal steady state response.' }], books: '1. D.P. Kothari, Basic Electrical Engineering.' },
      { code: 'GE3251', name: 'Engineering Graphics', credits: 4, type: 'THEORY', units: [{ title: 'UNIT I: PLANE CURVES & PROJECTION', topics: 'Conics, cycloids, projection of points and straight lines.' }], books: '1. K.V. Natarajan, Engineering Graphics.' },
      { code: 'GE3252', name: 'TAMILS AND TECHNOLOGY', credits: 1, type: 'THEORY', units: [{ title: 'UNIT I: SCIENTIFIC TAMIL', topics: 'Vocabulary, maritime trade, irrigation, astronomy.' }], books: 'Textbook by TN Govt.' },
      { code: 'CS3251', name: 'Programming in C', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: C PROGRAMMING BASICS', topics: 'Data types, Operators, Control statements, Arrays, Strings.' }], books: '1. Byron Gottfried, Schaum\'s Outline of Programming with C.' },
      { code: 'GE3271', name: 'Engineering Practices Laboratory', credits: 2, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Welding, plumbing, wiring, electronics assemblies.' }], books: 'Lab Manual' },
      { code: 'CS3271', name: 'Programming in C Laboratory', credits: 2, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Writing C programs using functions, structures, pointers, file systems.' }], books: 'Lab Manual' },
      { code: 'NCC3251', name: 'National Cadet Corps / NSS / YRC', credits: 1, type: 'PRACTICAL', units: [{ title: 'TRAINING', topics: 'Drills, social services, national integrity, leadership camps.' }], books: 'Guidelines' }
    ]
  },
  3: {
    subjectsCount: 9,
    credits: 22.5,
    subjects: [
      {
        code: 'MA3354',
        name: 'DISCRETE MATHEMATICS',
        credits: 4,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: MATHEMATICAL LOGIC', topics: 'Propositional Logic, Equivalences, Normal Forms, Predicates and Quantifiers, Rules of Inference, Proof Methods.' },
          { title: 'UNIT II: COMBINATORICS', topics: 'Mathematical Induction, Strong Induction, Pigeonhole Principle, Permutations and Combinations, Recurrence Relations, Generating Functions.' },
          { title: 'UNIT III: GRAPHS', topics: 'Graphs and Graph Models, Isomorphism, Connectivity, Euler and Hamilton Paths, Shortest-Path Problems, Planar Graphs.' },
          { title: 'UNIT IV: ALGEBRAIC STRUCTURES', topics: 'Groups, Subgroups, Homomorphisms, Cosets and Lagrange\'s Theorem, Rings, Fields, Integral Domains.' },
          { title: 'UNIT V: LATTICES AND BOOLEAN ALGEBRA', topics: 'Partial Orderings, Posets, Lattices, Properties, Lattices as Algebraic Systems, Boolean Algebra, Boolean Functions, Logic Gates.' }
        ],
        books: '1. Kenneth H. Rosen, Discrete Mathematics and its Applications, 8th Edition, Tata McGraw-Hill.'
      },
      {
        code: 'CS3351',
        name: 'Digital Principles and Computer Organization',
        credits: 4,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: LOGIC DESIGN', topics: 'Karnaugh Maps, Quine-McCluskey Method, Combinational Circuits, Multiplexers, Decoders, Adders.' },
          { title: 'UNIT II: SYNCHRONOUS SEQUENTIAL CIRCUITS', topics: 'Flip-Flops, Latches, Registers, Counters, State Reduction, Mealy and Moore Sequential Machines.' },
          { title: 'UNIT III: COMPUTER ORGANIZATION', topics: 'Instruction Set Architecture (ISA), Addressing Modes, CPU Data Path, Control Unit Design, Microprogramming.' },
          { title: 'UNIT IV: MEMORY SYSTEM', topics: 'Memory Hierarchy, Cache Mapping, Virtual Memory, RAM, ROM, Secondary Storage Technologies.' },
          { title: 'UNIT V: I/O & INTERFACES', topics: 'Interrupts, Direct Memory Access (DMA), Bus Standards, Pipelining, Multiprocessors.' }
        ],
        books: '1. M. Morris Mano, Digital Design, Pearson Education; Carl Hamacher, Computer Organization.'
      },
      {
        code: 'CS3301',
        name: 'DATA STRUCTURES',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: LINEAR DATA STRUCTURES - LIST', topics: 'Abstract Data Types (ADTs), Array-based implementation, Linked Lists, Doubly Linked Lists, Circular Linked Lists.' },
          { title: 'UNIT II: LINEAR DATA STRUCTURES - STACKS, QUEUES', topics: 'Stack ADT, Applications (Infix to Postfix, Recursion), Queue ADT, Circular Queue, Double Ended Queue (Deque).' },
          { title: 'UNIT III: NON-LINEAR DATA STRUCTURES - TREES', topics: 'Binary Trees, Tree Traversals, Expression Trees, Binary Search Trees, AVL Trees, B-Trees, Heap Structure.' },
          { title: 'UNIT IV: NON-LINEAR DATA STRUCTURES - GRAPHS', topics: 'Graph Representations, Breadth-First Search (BFS), Depth-First Search (DFS), Topological Sort, Prim\'s and Kruskal\'s Algorithms.' },
          { title: 'UNIT V: SEARCHING, SORTING AND HASHING', topics: 'Linear & Binary Search, Bubble, Insertion, Merge, Quick Sort, Hash Functions, Collision Resolution Techniques.' }
        ],
        books: '1. Mark Allen Weiss, Data Structures and Algorithm Analysis in C, Pearson Education.'
      },
      {
        code: 'CS3391',
        name: 'OBJECT ORIENTED PROGRAMING',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: OOP CONCEPTS & JAVA', topics: 'Objects, Classes, Inheritance, Polymorphism, Encapsulation, Java Basics, JVM, Data Types, Control Statements.' },
          { title: 'UNIT II: INHERITANCE AND INTERFACES', topics: 'Super Keyword, Abstract Classes, Final Classes, Interfaces, Inner Classes, Nested Classes.' },
          { title: 'UNIT III: EXCEPTION HANDLING AND I/O', topics: 'Try-catch, Throw, Throws, Finally, Built-in & Custom Exceptions, Streams, File I/O, Serialization.' },
          { title: 'UNIT IV: MULTITHREADING AND GENERICS', topics: 'Thread Life Cycle, Synchronization, Inter-thread Communication, Generic Classes, Generic Methods.' },
          { title: 'UNIT V: EVENT DRIVEN PROGRAMMING', topics: 'AWT, Swing, Event Listeners, Layout Managers, Graphics Programming, GUI Design.' }
        ],
        books: '1. Herbert Schildt, Java: The Complete Reference, McGraw-Hill.'
      },
      {
        code: 'CS3311',
        name: 'Data Structures and Laboratory',
        credits: 1.5,
        type: 'PRACTICAL',
        units: [
          { title: 'EXPERIMENT LIST', topics: 'Linked List implementation, Stack & Queue ADT, BST operations, AVL balance trees, Graph BFS & DFS, Sorting and Hashing.' }
        ],
        books: 'Lab Manual - Department of Computer Science and Engineering.'
      },
      {
        code: 'CS3381',
        name: 'OBJECT ORIENTED PROGRAMING LABORATORY',
        credits: 1,
        type: 'PRACTICAL',
        units: [
          { title: 'EXPERIMENT LIST', topics: 'Basic Java constructs, Class and Object relations, Method Overloading & Overriding, Abstract classes, Interface design, Exception handling, Multi-threaded programs, GUI designs.' }
        ],
        books: 'Lab Manual - Object Oriented Programming Practices.'
      },
      {
        code: 'GE3361',
        name: 'PROFESSIONAL DEVELOPMENT',
        credits: 1,
        type: 'PRACTICAL',
        units: [
          { title: 'ACTIVITIES', topics: 'Group Discussion, Mock Interview, Soft Skills, Public Speaking, Resume Drafting, Team building exercises.' }
        ],
        books: 'Training Guide - Placement and Development Cell.'
      },
      {
        code: 'CS3361',
        name: 'Data Science Laboratory',
        credits: 2,
        type: 'PRACTICAL',
        units: [
          { title: 'EXPERIMENT LIST', topics: 'R/Python for Data Science, Vectorized operations, Data cleansing, visualization, basic statistical modeling, linear regression.' }
        ],
        books: 'Lab Manual - Foundations of Data Science.'
      },
      {
        code: 'CS3352',
        name: 'Foundations of Data Science',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: INTRODUCTION', topics: 'Data Science Process, Roles, Big Data Overview, Analytical techniques.' },
          { title: 'UNIT II: DATA PREPARATION', topics: 'Data Cleaning, Manipulation, Dimensionality Reduction, Principal Component Analysis.' },
          { title: 'UNIT III: EXPLORATORY DATA ANALYSIS', topics: 'Descriptive Statistics, Summarizing Data, Visualizations (Scatter, Histogram, Box-plots).' },
          { title: 'UNIT IV: MACHINE LEARNING BASICS', topics: 'Supervised Learning (Regression, Classification), Unsupervised Learning (Clustering, K-Means).' },
          { title: 'UNIT V: RECENT ADVANCEMENTS', topics: 'Deep Learning introductions, AI Ethics, Data Privacy, Case studies.' }
        ],
        books: '1. Cathy O\'Neil and Rachel Schutt, Doing Data Science, O\'Reilly.'
      }
    ]
  },
  4: {
    subjectsCount: 8,
    credits: 21,
    subjects: [
      {
        code: 'CS3451',
        name: 'Database Management Systems',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: RELATIONAL DATABASES', topics: 'Relational Model, Relational Algebra, SQL Fundamentals, Advanced SQL, Views, Triggers, Integrity Constraints.' },
          { title: 'UNIT II: DATABASE DESIGN', topics: 'Functional Dependencies, Normalization, 1NF, 2NF, 3NF, BCNF, Multi-valued Dependencies, ER Diagrams.' },
          { title: 'UNIT III: TRANSACTIONS & CONCURRENCY', topics: 'ACID Properties, Transaction States, Concurrency Control, Lock-Based Protocols, Two-Phase Locking, Deadlock Handling.' },
          { title: 'UNIT IV: IMPLEMENTATION TECHNIQUES', topics: 'RAID, File Organizations, Indexing, B+ Tree Index Files, Hashing, Query Processing and Optimization.' },
          { title: 'UNIT V: NOSQL & RECENT TRENDS', topics: 'Distributed Databases, NoSQL Models, Key-Value Stores, Document Databases, Graph Databases, Spatial Databases.' }
        ],
        books: '1. Abraham Silberschatz, Henry F. Korth, Database System Concepts, McGraw-Hill.'
      },
      {
        code: 'CS3491',
        name: 'Cryptography and Information Security',
        credits: 4,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: CIPHER PRINCIPLES', topics: 'Symmetric Ciphers, Substitution Techniques, Transposition Techniques, DES, AES, Block Cipher Modes.' },
          { title: 'UNIT II: ASYMMETRIC KEY CRYPTO', topics: 'Number Theory Primer, RSA Algorithm, Diffie-Hellman Key Exchange, Elliptic Curve Cryptography.' },
          { title: 'UNIT III: DATA INTEGRITY', topics: 'Hash Functions, SHA-512, MD5, Digital Signatures, HMAC, Key Management and Distribution.' },
          { title: 'UNIT IV: SECURITY PROTOCOLS', topics: 'SSL/TLS, IPsec, PGP, Kerberos, Web Security Considerations.' },
          { title: 'UNIT V: MALWARE & FIREWALLS', topics: 'Intruders, Viruses, Worms, Trojan Horses, Firewalls Configuration, Trusted Systems.' }
        ],
        books: '1. William Stallings, Cryptography and Network Security, Pearson Education.'
      },
      {
        code: 'CS3461',
        name: 'Operating Systems',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: OS OVERVIEW', topics: 'System Calls, OS Structures, Boot Process, Process Concept, Process Scheduling.' },
          { title: 'UNIT II: CPU SCHEDULING', topics: 'Scheduling Algorithms, Threading Models, Process Synchronization, Semaphores, Monitors, Classic Synchronization Problems.' },
          { title: 'UNIT III: DEADLOCKS & MEMORY', topics: 'Deadlock Characterization, Prevention, Avoidance, Bankers Algorithm, Paging, Segmentation, Virtual Memory.' },
          { title: 'UNIT IV: FILE SYSTEMS', topics: 'File Concept, Directory Structure, File System Mounting, Allocation Methods, Free Space Management.' },
          { title: 'UNIT V: I/O & CASE STUDIES', topics: 'Disk Structure, Disk Scheduling, Swap-space Management, Linux OS Architecture Case Study.' }
        ],
        books: '1. Silberschatz, Galvin, and Gagne, Operating System Concepts, Wiley.'
      },
      { code: 'CS3401', name: 'Algorithms', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: ALGORITHM COMPLEXITY', topics: 'Asymptotic Notations, Space & Time Complexity, Recurrence Relations.' }], books: '1. Thomas H. Cormen, Introduction to Algorithms.' },
      { code: 'CS3492', name: 'Database Management Systems Laboratory', credits: 1.5, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'SQL Queries, Joins, Nested Queries, Triggers, Functions, JDBC connection.' }], books: 'Lab Manual' },
      { code: 'CS3481', name: 'Operating Systems Laboratory', credits: 1.5, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Shell Programming, CPU Scheduling algorithms, Semaphore implementations, Memory allocation.' }], books: 'Lab Manual' },
      { code: 'GE3451', name: 'Environmental Sciences and Sustainability', credits: 2, type: 'THEORY', units: [{ title: 'UNIT I: ECOSYSTEM & BIODIVERSITY', topics: 'Ecological balance, natural resources, biodiversity mapping, environmental pollution.' }], books: '1. Gilbert M. Masters, Environmental Engineering.' },
      { code: 'SB3401', name: 'Soft Skills Development', credits: 1, type: 'PRACTICAL', units: [{ title: 'EXPERIMENTS', topics: 'Presentation skills, listening comprehension, professional networking, active conversation loops.' }], books: 'Course Syllabus Guidelines' }
    ]
  },
  5: {
    subjectsCount: 17,
    credits: 26,
    subjects: [
      {
        code: 'CS3501',
        name: 'COMPILER DESIGN',
        credits: 4,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: LEXICAL ANALYSIS', topics: 'Introduction to Compilers, Phases of Compiler, Lexical Analyzer role, Finite Automata, Regular Expressions to DFA, Lex Tool.' },
          { title: 'UNIT II: SYNTAX ANALYSIS', topics: 'Context-Free Grammars, Top-Down Parsing (LL1, Recursive Descent), Bottom-Up Parsing (LR, LALR, SLR, Yacc Tool).' },
          { title: 'UNIT III: RUNTIME ENVIRONMENTS', topics: 'Syntax-Directed Translation, Intermediate Code Generation (Three-address code, Quadruples, Triples), Activation Records.' },
          { title: 'UNIT IV: CODE OPTIMIZATION', topics: 'Principal Sources of Optimization, Loop Optimization, DAG representation of basic blocks, Data Flow Analysis.' },
          { title: 'UNIT V: CODE GENERATION', topics: 'Issues in Code Generator Design, Target Language, Simple Code Generator, Register Allocation and Assignment.' }
        ],
        books: '1. Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman, Compilers: Principles, Techniques, and Tools, Pearson.'
      },
      {
        code: 'CS3591',
        name: 'Computer Networks',
        credits: 4,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: PHYSICAL LAYER', topics: 'Network Topology, Reference Models (OSI, TCP/IP), Media transmission, Multiplexing, Switching.' },
          { title: 'UNIT II: DATA LINK LAYER', topics: 'Error Detection & Correction, Flow Control, Sliding Window Protocols, MAC protocols, Ethernet, Wireless LANs.' },
          { title: 'UNIT III: NETWORK LAYER', topics: 'IPv4/IPv6 addressing, Subnetting, Routing Algorithms (Distance Vector, Link State), OSPF, BGP, DHCP, NAT.' },
          { title: 'UNIT IV: TRANSPORT LAYER', topics: 'UDP protocol, TCP Connection Management, Reliable Transmission, Congestion Control, Quality of Service (QoS).' },
          { title: 'UNIT V: APPLICATION LAYER', topics: 'Domain Name System (DNS), HTTP, SMTP, FTP, Socket Programming, Network Security basics.' }
        ],
        books: '1. Larry L. Peterson, Bruce S. Davie, Computer Networks: A Systems Approach, Elsevier.'
      },
      {
        code: 'CS3551',
        name: 'Distributed Computing',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: DISTRIBUTED SYSTEMS OVERVIEW', topics: 'Characterization of Distributed Systems, System Models, Networking & Internetworking, Inter-process Communication.' },
          { title: 'UNIT II: CLOCK SYNC & COORDINATION', topics: 'Logical Clocks, Physical Clocks, Synchronization, Mutual Exclusion Algorithms, Election Algorithms, Consensus.' },
          { title: 'UNIT III: DISTRIBUTED OBJECTS & FILES', topics: 'Remote Method Invocation (RMI), RPC, Distributed File Systems (NFS, HDFS), Directory Services.' },
          { title: 'UNIT IV: REPLICATION & FAULT TOLERANCE', topics: 'Consistency Models, Replication Protocols, Fault Tolerance, Process Resilience, Distributed Transactions.' },
          { title: 'UNIT V: PEER-TO-PEER SYSTEMS', topics: 'P2P architectures, Chord, Pastry, Distributed Shared Memory, Case studies on modern architectures.' }
        ],
        books: '1. George Coulouris, Jean Dollimore, Tim Kindberg, Distributed Systems: Concepts and Design, Pearson.'
      },
      {
        code: 'CCS375',
        name: 'WEB TECHNOLOGIES',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: FRONT-END BASIC CONSTRUCTS', topics: 'HTML5 Semantic layout, CSS3 grids and layouts, JavaScript ES6 syntax, Document Object Model (DOM) manipulations.' },
          { title: 'UNIT II: DYNAMIC CLIENT APP DEVELOPMENT', topics: 'AJAX, Fetch API, asynchronous flows, responsive design frameworks, component structures.' },
          { title: 'UNIT III: SERVER-SIDE ARCHITECTURES', topics: 'Node.js event loop, Express server framework, API Routing, Middleware logic, HTTP header controls.' },
          { title: 'UNIT IV: REACTIVE COMPONENT ENGINE', topics: 'React framework, Hooks, Context API, state machines, React Router DOM, lifecycle hooks, modular builds.' },
          { title: 'UNIT V: DATABASE INTEGRATION & DEPLOYMENT', topics: 'NoSQL integration, session cookies, JSON Web Token (JWT) validation, security considerations, cloud hosting.' }
        ],
        books: '1. Jeffrey C. Jackson, Web Technologies: A Computer Science Perspective, Pearson.'
      },
      {
        code: 'CCS341',
        name: 'DATA WAREHOUSING',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: DATA WAREHOUSE FUNDAMENTALS', topics: 'Introduction, Multidimensional Data Models, Star, Snowflake, Fact Constellation schemas, OLAP operations.' },
          { title: 'UNIT II: ARCHITECTURE & ETL PROCESS', topics: 'Three-tier architecture, ETL (Extraction, Transformation, Loading) design, Metadata repository, Data staging.' },
          { title: 'UNIT III: DATA CUBES & COMPUTATIONS', topics: 'Materialized views computations, Attribute-oriented induction, multidimensional indexing.' },
          { title: 'UNIT IV: SECURITY & SYSTEM CONTROLS', topics: 'Role-based access, audit trails, recovery systems, query optimizations, capacity management.' },
          { title: 'UNIT V: ANALYTICS & INDUSTRIAL CASES', topics: 'Business Intelligence applications, Reporting tools, cloud data warehouses, case studies on snowflake.' }
        ],
        books: '1. Jiawei Han and Micheline Kamber, Data Mining: Concepts and Techniques, Morgan Kaufmann.'
      },
      {
        code: 'CB3491',
        name: 'CRYPTOGRAPHY AND CYBER SECURITY',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: FOUNDATIONS OF SECURITY', topics: 'Symmetric encryption, AES, DES, block ciphers, key generation.' },
          { title: 'UNIT II: ASYMMETRIC KEY CRYPTO', topics: 'RSA, Diffie-Hellman Key exchange, Elliptic Curve Cryptography.' },
          { title: 'UNIT III: DATA PRIVACY & HASHING', topics: 'SHA-256, digital signatures, message authentication codes.' },
          { title: 'UNIT IV: SECURE PROTOCOLS', topics: 'IPsec, SSL, HTTPS, firewalls, network isolation.' },
          { title: 'UNIT V: INFRASTRUCTURE & THREATS', topics: 'Worms, Ransomware, Intrusion Detection, Cyber forensics, regulatory laws.' }
        ],
        books: '1. William Stallings, Cryptography and Network Security, Pearson.'
      },
      {
        code: 'MX3081',
        name: 'Introduction to Women and Gender Studies',
        credits: 3,
        type: 'THEORY',
        units: [
          { title: 'UNIT I: INTRODUCTORY CONCEPTS', topics: 'Understanding Sex vs Gender, Patriarchy, Socialisation process, Stereotyping, Gender Roles.' },
          { title: 'UNIT II: HISTORY OF FEMINISM', topics: 'Waves of Feminism, Key thinkers, Indian perspective on women rights and movements.' },
          { title: 'UNIT III: GENDER DEVELOPMENT', topics: 'Indicators, Health, Education, Economic participation, Wages gap, Glass ceiling.' },
          { title: 'UNIT IV: LEGISLATIVE CONTROLS', topics: 'Constitutional provisions, POSH act, Domestic violence acts, Maternity benefits, Equal opportunities.' },
          { title: 'UNIT V: MEDIA & GENDER REPRESENTATION', topics: 'Sexist language, advertisement stereotypes, digital media safety, inclusive workplaces.' }
        ],
        books: '1. Mary John, Women\'s Studies in India: A Reader, Penguin Books.'
      },
      { code: 'WL005', name: 'Win@Life 05', credits: 1, type: 'PRACTICAL', units: [{ title: 'UNIT I: SELF PROGRESSION', topics: 'Goal settings, time matrix, active listening, mindfulness loop.' }], books: 'Department Core Training Material' },
      { code: 'TPP005', name: 'Training & Placement Programming 05', credits: 1.5, type: 'PRACTICAL', units: [{ title: 'UNIT I: ALGORITHMS & CODING', topics: 'Data structures implementation, Dynamic Programming, String operations.' }], books: 'Placement Training Guide' },
      { code: 'TPC005', name: 'Training & Placement Communication 05', credits: 1, type: 'PRACTICAL', units: [{ title: 'UNIT I: BUSINESS ENGLSH & INTERACTION', topics: 'Mock presentations, pitch meetings, corporate etiquette.' }], books: 'Soft Skills Training Manual' },
      { code: 'TPA005', name: 'Training & Placement Aptitude 05', credits: 1, type: 'PRACTICAL', units: [{ title: 'UNIT I: QUANTITATIVE & LOGICAL APTITUDE', topics: 'Ratios, speed-distance-time, permutations, syllogisms.' }], books: 'Quantitative Aptitude by R S Aggarwal' }
    ]
  },
  6: {
    subjectsCount: 9,
    credits: 29,
    subjects: [
      { code: 'CS3601', name: 'Mobile Computing', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: INTRODUCTION', topics: 'Mobile communications, MAC protocols, cellular systems, GSM.' }], books: '1. Jochen Schiller, Mobile Communications.' },
      { code: 'CS3602', name: 'Compiler Design', credits: 4, type: 'THEORY', units: [{ title: 'UNIT I: COMPILERS OVERVIEW', topics: 'Phases of compilation, syntax-directed translation.' }], books: '1. Alfred V. Aho, Compilers.' },
      { code: 'CS3651', name: 'Internet of Things', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: IoT CONCEPTS', topics: 'Physical Design, Logical Design, Protocols, Enabling technologies.' }], books: '1. Arshdeep Bahga, Internet of Things.' }
    ]
  },
  7: {
    subjectsCount: 12,
    credits: 16,
    subjects: [
      { code: 'CS3701', name: 'Cloud Computing', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: CLOUD BASICS', topics: 'SaaS, PaaS, IaaS, deployment models, virtualisation.' }], books: '1. Kai Hwang, Distributed and Cloud Computing.' },
      { code: 'CS3702', name: 'Deep Learning', credits: 4, type: 'THEORY', units: [{ title: 'UNIT I: NEURAL NETWORKS', topics: 'Perceptrons, backpropagation, feedforward networks.' }], books: '1. Ian Goodfellow, Deep Learning.' }
    ]
  },
  8: {
    subjectsCount: 2,
    credits: 13,
    subjects: [
      { code: 'PROJ81', name: 'Project Work II', credits: 10, type: 'PRACTICAL', units: [{ title: 'PROJECT MILESTONES', topics: 'System analysis, coding, verification, performance auditing, thesis submission.' }], books: 'Research Articles and Project Guidelines' },
      { code: 'Elective V', name: 'Professional Elective V', credits: 3, type: 'THEORY', units: [{ title: 'UNIT I: ELECTIVE CORE', topics: 'Selected advanced topics in software engineering or network protocols.' }], books: 'Textbooks based on elected stream' }
    ]
  }
};

interface SyllabusViewProps {
  onBack: () => void;
}

export function SyllabusView({ onBack }: SyllabusViewProps) {
  const [selectedSemester, setSelectedSemester] = useState<number>(5); // Default to current 5th Semester
  const [selectedSubject, setSelectedSubject] = useState<SyllabusSubject | null>(null);

  const activeSemData = SEMESTER_SYLLABI[selectedSemester] || { subjects: [], credits: 0, subjectsCount: 0 };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Top action and title row */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold font-sans">
          Curriculum Explorer
        </span>
      </div>

      {/* Top three key-meta panels from the design image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PROGRAMME</p>
          <h4 className="text-sm font-black text-[#0d0c63] mt-1 uppercase">UG</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DEPARTMENT</p>
          <h4 className="text-sm font-black text-[#0d0c63] mt-1">B.E. Computer Science and Engineering</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REGULATION</p>
          <h4 className="text-sm font-black text-[#0d0c63] mt-1 font-mono">AU - R2021</h4>
        </div>
      </div>

      {/* Semester Subjects container precisely matching the styling requested */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0d0c63] p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-300" />
            <span className="font-extrabold uppercase tracking-wider text-xs font-display">Semester Subjects</span>
          </div>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] border border-white/20 outline-none cursor-pointer font-sans transition-colors"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num} className="text-slate-800 bg-white font-semibold">
                {num === 1 ? '1st' : num === 2 ? '2nd' : num === 3 ? '3rd' : `${num}th`} Semester
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[9px] uppercase tracking-wider font-extrabold">
                <th className="py-4 px-5 w-[60px] text-center">#</th>
                <th className="py-4 px-4 w-[140px]">SUBJECT CODE</th>
                <th className="py-4 px-4">SUBJECT NAME</th>
                <th className="py-4 px-4 text-center w-[110px]">CREDITS</th>
                <th className="py-4 px-4 text-center w-[130px]">TYPE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {activeSemData.subjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                    No syllabus records logged for this semester. Click any other semester below.
                  </td>
                </tr>
              ) : (
                activeSemData.subjects.map((sub, sIdx) => (
                  <tr
                    key={sub.code}
                    onClick={() => setSelectedSubject(sub)}
                    className="hover:bg-indigo-50/20 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-5 font-bold text-slate-400 text-center">{sIdx + 1}</td>
                    <td className="py-4 px-4 font-mono font-extrabold text-[#0d0c63]">{sub.code}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-700 hover:text-indigo-600 transition-colors">
                      {sub.name}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1 rounded-full">
                        {sub.credits}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-wide ${
                        sub.type === 'THEORY' 
                          ? 'bg-violet-50 text-violet-700 border border-violet-200' 
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}>
                        {sub.type}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of 8 Semester Cards below precisely matching the screenshot design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
          const isSelected = selectedSemester === sem;
          const semInfo = SEMESTER_SYLLABI[sem];
          const ordinalNames = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`p-5 rounded-2xl text-left transition-all border ${
                isSelected 
                  ? 'bg-indigo-50/40 border-indigo-600 shadow-sm font-semibold' 
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-xs'
              }`}
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {ordinalNames[sem - 1]} Semester
              </p>
              <h4 className="text-xs font-black text-slate-800 mt-2">
                {semInfo?.subjectsCount || 0} Subjects
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 inline-block">
                {semInfo?.credits || 0} Credits
              </span>
            </button>
          );
        })}
      </div>

      {/* Tip helper text */}
      <p className="text-center text-[10px] text-slate-400 italic">
        Tip: Click any subject cell inside the table to explore its 5 units syllabus outline and recommended textbooks list.
      </p>

      {/* Interactive units detail overlay modal when a subject is clicked */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full overflow-hidden text-xs flex flex-col max-h-[85vh]"
            >
              <div className="bg-[#0d0c63] p-4.5 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] bg-white/10 px-2.5 py-0.5 rounded uppercase tracking-widest font-bold">
                    {selectedSubject.code}
                  </span>
                  <span className="font-extrabold uppercase tracking-wider text-xs">Syllabus Outline</span>
                </div>
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-snug">{selectedSubject.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-1">
                    Credits: {selectedSubject.credits} &middot; Category: {selectedSubject.type}
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-b border-slate-100 py-4.5">
                  {selectedSubject.units.map((unit, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100/50 space-y-1">
                      <h5 className="font-black text-[#0d0c63] text-xs font-display">{unit.title}</h5>
                      <p className="text-slate-500 font-light leading-relaxed">{unit.topics}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50/20 border border-slate-100 rounded-xl text-xs">
                  <h5 className="font-bold text-slate-700 uppercase text-[9px] tracking-wider mb-1.5">Recommended Textbooks</h5>
                  <p className="text-slate-500 italic font-light font-sans leading-relaxed">{selectedSubject.books}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-3 rounded-xl transition-all shadow-md text-center uppercase tracking-wider text-[10px]"
                >
                  Close Syllabus Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// 4. QUESTION PAPERS SUB-VIEW
// ==========================================
interface QPapersViewProps {
  onBack: () => void;
}
export function QPapersView({ onBack }: QPapersViewProps) {
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);
  const [dlProgress, setDlProgress] = useState<number>(0);

  const triggerDownload = (code: string, examName: string) => {
    setDownloadingCode(code);
    setDlProgress(0);
    
    const interval = setInterval(() => {
      setDlProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingCode(null);
            alert(`File successfully downloaded: ${code}_${examName.replace(/ /g, '_')}.pdf`);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const papers = [
    { code: 'CS3451', name: 'Database Management Systems', papers: [
      { year: 'Nov/Dec 2024', key: 'db-24n', filename: 'CS3451_DBMS_ND24.pdf' },
      { year: 'Apr/May 2024', key: 'db-24a', filename: 'CS3451_DBMS_AM24.pdf' },
      { year: 'Nov/Dec 2023', key: 'db-23n', filename: 'CS3451_DBMS_ND23.pdf' }
    ]},
    { code: 'CS3491', name: 'Cryptography and Information Security', papers: [
      { year: 'Nov/Dec 2024', key: 'crypto-24n', filename: 'CS3491_CIS_ND24.pdf' },
      { year: 'Apr/May 2024', key: 'crypto-24a', filename: 'CS3491_CIS_AM24.pdf' }
    ]},
    { code: 'CS3461', name: 'Operating Systems', papers: [
      { year: 'Nov/Dec 2024', key: 'os-24n', filename: 'CS3461_OS_ND24.pdf' },
      { year: 'Nov/Dec 2023', key: 'os-23n', filename: 'CS3461_OS_ND23.pdf' }
    ]}
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">Previous University Papers</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6">
        <div>
          <h4 className="font-bold text-slate-800 font-display text-sm">Anna University Question Paper Archive</h4>
          <p className="text-xs text-slate-400 mt-0.5">Instant downloads for semester preparational guidelines.</p>
        </div>

        <div className="space-y-6 text-xs">
          {papers.map((sub, idx) => (
            <div key={idx} className="space-y-3.5">
              <h5 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-50 pb-2">{sub.name} ({sub.code})</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sub.papers.map((paper, pIdx) => (
                  <div key={pIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-indigo-100 transition-colors">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-indigo-50 text-[#0d0c63] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Semester Exam</span>
                      <p className="font-bold text-slate-800 text-xs mt-1.5">{paper.year}</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">{paper.filename}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {downloadingCode === paper.key ? (
                        <div className="w-full space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold text-[#0d0c63] font-mono">
                            <span>Downloading...</span>
                            <span>{dlProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0d0c63] rounded-full transition-all duration-150" style={{ width: `${dlProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerDownload(paper.key, paper.year)}
                          className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 5. ACADEMIC CALENDAR SUB-VIEW
// ==========================================
interface CalendarViewProps {
  onBack: () => void;
}
export function CalendarView({ onBack }: CalendarViewProps) {
  const events = [
    { date: 'Feb 05, 2026', title: 'College Reopening & Commencement', desc: 'Semester IV classes commence for all second-year B.E./B.Tech departments.', type: 'reopen', badge: 'Reopening' },
    { date: 'Mar 10 - Mar 15, 2026', title: 'Internal Assessment Test - I (IA1)', desc: 'Syllabus coverage: Units I & II. Attendance cutoff date for IA1 dispatch is March 08.', type: 'exam', badge: 'Exams' },
    { date: 'Apr 08, 2026', title: 'National Symposium - CRAFT 2026', desc: 'CKCET annual technical carnival symposium events & design challenges.', type: 'event', badge: 'Symposium' },
    { date: 'Apr 22 - Apr 27, 2026', title: 'Internal Assessment Test - II (IA2)', desc: 'Syllabus coverage: Units III & IV. Progress report dispatched to parents by May 01.', type: 'exam', badge: 'Exams' },
    { date: 'May 15 - May 22, 2026', title: 'Semester Model Examinations', desc: 'Full-syllabus theoretical examinations covering all 5 core curriculum Units.', type: 'exam', badge: 'Model Exams' },
    { date: 'May 28, 2026', title: 'Practical Examinations (Anna University)', desc: 'Anna University practical laboratory internal and external examinations schedules.', type: 'univ', badge: 'University Lab' },
    { date: 'Jun 04, 2026 onwards', title: 'University Theory Examinations', desc: 'Commencement of Anna University theoretical end-semester examinations.', type: 'univ', badge: 'Theory Exams' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Academic Session: 2025-26 Even Sem</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div>
          <h4 className="font-bold text-slate-800 font-display text-sm">Academic Event Timeline - Semester IV</h4>
          <p className="text-xs text-slate-400 mt-0.5">Follow the official university and college chronological roadmap dates.</p>
        </div>

        <div className="relative border-l border-indigo-100 ml-4 pl-6 space-y-6 text-xs">
          {events.map((ev, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[31px] top-1 bg-white border-2 border-indigo-500 w-4 h-4 rounded-full flex items-center justify-center z-10"></span>
              <div className="space-y-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-indigo-600 font-extrabold text-[10px]">{ev.date}</span>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ev.type === 'exam' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    ev.type === 'event' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                    ev.type === 'univ' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {ev.badge}
                  </span>
                </div>
                <h5 className="font-extrabold text-slate-800 font-display text-xs leading-snug">{ev.title}</h5>
                <p className="text-slate-500 font-light leading-relaxed">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 6. COURSE REGISTRATION SUB-VIEW
// ==========================================
interface RegistrationViewProps {
  student: Student;
  onBack: () => void;
}
export function RegistrationView({ student, onBack }: RegistrationViewProps) {
  const [registered, setRegistered] = useState<boolean>(() => {
    return localStorage.getItem(`ckcet_elective_registered_${student.regNo}`) === 'true';
  });
  const [selectedElective, setSelectedElective] = useState<string>('');
  const electives = [
    { code: 'CS3001', name: 'Cloud Computing & Services', faculty: 'Dr. R. Kannan, Professor/CSE', description: 'Advanced paradigms of AWS, cloud virtualization, architecture mapping, serverless computation.' },
    { code: 'CS3002', name: 'Full Stack Development', faculty: 'Mr. V. Vignesh, AP/CSE', description: 'Web architectures, React 19 framework paradigms, Express API servers, databases orchestration.' },
    { code: 'CS3003', name: 'Cyber Security & Ethical Hacking', faculty: 'Mrs. S. Radhika, AP/CSE', description: 'Information assurance protocols, network vulnerability screening, penetration testing paradigms.' }
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElective) return;
    setRegistered(true);
    localStorage.setItem(`ckcet_elective_registered_${student.regNo}`, 'true');
    localStorage.setItem(`ckcet_elective_choice_${student.regNo}`, selectedElective);
    alert('Professional elective registration submitted successfully! Receipt stored in student account.');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Semester V Elective Desk</span>
      </div>

      <AnimatePresence mode="wait">
        {!registered ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 font-display text-sm">Professional Elective Registration - Semester V</h4>
              <p className="text-xs text-slate-400 mt-0.5">Please review elective descriptions and faculties before locking in your choice.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="space-y-3">
                {electives.map((el, idx) => (
                  <label 
                    key={idx} 
                    className={`p-4 rounded-xl border flex gap-4 cursor-pointer items-start transition-all duration-200 ${
                      selectedElective === el.code ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-50' : 'bg-slate-50/20 border-slate-100 hover:bg-slate-50/55'
                    }`}
                  >
                    <input
                      type="radio"
                      name="elective"
                      value={el.code}
                      checked={selectedElective === el.code}
                      onChange={() => setSelectedElective(el.code)}
                      className="mt-1 accent-[#0d0c63]"
                    />
                    <div className="space-y-1">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-extrabold text-[#0d0c63]">{el.name}</span>
                        <span className="font-mono text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{el.code}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Faculty: {el.faculty}</p>
                      <p className="text-slate-500 font-light leading-relaxed mt-1.5">{el.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-800 space-y-1">
                <p className="font-bold">Important Notice:</p>
                <p className="font-light leading-relaxed text-[11px]">
                  Elective enrollment depends on submission timestamps and seat limitations. Once submitted, changes cannot be authorized through the student login portal.
                </p>
              </div>

              <button
                type="submit"
                disabled={!selectedElective}
                className="w-full bg-[#0d0c63] hover:bg-indigo-950 disabled:opacity-40 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md uppercase tracking-wider text-xs"
              >
                Submit Professional Elective Choice
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="receipt" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-md mx-auto text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-lg text-slate-800 font-display">Elective Registered!</h4>
              <p className="text-xs text-slate-400">Your selection was registered successfully for Semester V.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-3.5 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Registered Course</span>
                <span className="text-slate-700 font-bold truncate max-w-[200px]">
                  {electives.find(e => e.code === localStorage.getItem(`ckcet_elective_choice_${student.regNo}`))?.name || 'Full Stack Development'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Course Code</span>
                <span className="text-[#0d0c63] font-bold">{localStorage.getItem(`ckcet_elective_choice_${student.regNo}`) || 'CS3002'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Registered Time</span>
                <span className="text-slate-700 font-bold">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Verification Status</span>
                <span className="text-emerald-600 font-bold">Approved by Advisor</span>
              </div>
            </div>

            <button
              onClick={() => {
                setRegistered(false);
                localStorage.removeItem(`ckcet_elective_registered_${student.regNo}`);
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider"
            >
              Reset Registration (Demo)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// 7. LIBRARY SUB-VIEW (Interactive book search)
// ==========================================
interface LibraryViewProps {
  onBack: () => void;
}
export function LibraryView({ onBack }: LibraryViewProps) {
  const [issuedBooks, setIssuedBooks] = useState([
    { accessionNo: 'ACC-8231', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', issuedOn: '2026-03-24', dueOn: '2026-04-12', status: 'Active' },
    { accessionNo: 'ACC-9122', title: 'Database System Concepts', author: 'Silberschatz, Korth', issuedOn: '2026-03-28', dueOn: '2026-04-20', status: 'Active' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const booksCatalog = [
    { title: 'The C Programming Language', author: 'Kernighan & Ritchie', code: 'QA76.73.C15', status: 'Available' },
    { title: 'Java: The Complete Reference', author: 'Herbert Schildt', code: 'QA76.73.J38', status: 'Available' },
    { title: 'Operating System Concepts', author: 'Silberschatz, Galvin', code: 'QA76.76.O63', status: 'Issued (Due Apr 15)' },
    { title: 'Compiler Design: Principles', author: 'Aho & Ullman', code: 'QA76.76.C65', status: 'Available' },
    { title: 'Computer Architecture: A Quantitative Approach', author: 'Hennessy & Patterson', code: 'QA76.9.C38', status: 'Available' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(booksCatalog.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
  };

  const handleBorrow = (bookTitle: string) => {
    alert(`Reservation requested for: "${bookTitle}". Please collect from Central Library counter with your ID Card.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">Central Library Portal</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left: Issued Books desk */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 font-display text-sm">Issued Books &amp; Return Deadlines</h4>
            
            <div className="space-y-3">
              {issuedBooks.map((book, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{book.title}</p>
                    <p className="text-[10px] text-slate-400">Author: {book.author}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Accession: {book.accessionNo}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Issued</span>
                    <p className="text-[10px] font-bold text-rose-600 font-mono mt-1.5">Due: {book.dueOn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Book Search catalogs */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-slate-800 font-display text-sm">Central Library Search Catalog</h4>
            <p className="text-xs text-slate-400 mt-0.5">Search and check real-time availability of books inside library shelves.</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by book title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 font-medium py-3 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 pr-12 text-xs"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            <button
              type="submit"
              className="bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
            >
              Search
            </button>
          </form>

          {searchResults.length > 0 ? (
            <div className="space-y-3.5">
              <h5 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Search Results</h5>
              <div className="space-y-2.5">
                {searchResults.map((book, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100/80 bg-slate-50/20 hover:bg-slate-50/40 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{book.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Call No: {book.code} • {book.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        book.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {book.status}
                      </span>
                      {book.status === 'Available' && (
                        <button
                          onClick={() => handleBorrow(book.title)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-[#0d0c63] font-bold py-1 px-3 rounded-lg text-[9px] uppercase tracking-wider transition-all"
                        >
                          Reserve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery.trim() ? (
            <div className="text-center py-6 text-slate-400">
              <p>No books matching "{searchQuery}" found in library shelves.</p>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
              <p>Type a keyword like "OS" or "Java" to view the central catalogs catalog.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 8. PLACEMENT SUB-VIEW (Job search & instant application)
// ==========================================
interface PlacementViewProps {
  student: Student;
  onBack: () => void;
}
export function PlacementView({ student, onBack }: PlacementViewProps) {
  const [jobApplications, setJobApplications] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(`ckcet_placement_apps_${student.regNo}`);
    return stored ? JSON.parse(stored) : {
      'job-tcs': 'Eligible / Applied',
      'job-zoho': 'In Progress / Round 2 scheduled'
    };
  });

  const jobs = [
    {
      id: 'job-zoho',
      company: 'Zoho Corporation',
      role: 'Software Developer Intern / QA',
      ctc: '₹8.4 LPA',
      eligibility: 'CGPA >= 7.5, zero active backlogs',
      date: 'April 15, 2026',
      badge: 'Product Development'
    },
    {
      id: 'job-tcs',
      company: 'TCS Digital / Ninja',
      role: 'Systems Engineer',
      ctc: '₹3.6 - ₹7.2 LPA',
      eligibility: 'CGPA >= 6.0, maximum 1 backlog',
      date: 'April 20, 2026',
      badge: 'Consultancy Services'
    },
    {
      id: 'job-cts',
      company: 'Cognizant Technology Solutions',
      role: 'Programmer Analyst',
      ctc: '₹4.0 LPA',
      eligibility: 'CGPA >= 6.5, zero active backlogs',
      date: 'May 02, 2026',
      badge: 'IT Services'
    }
  ];

  const handleApply = (id: string, company: string) => {
    const newApps = { ...jobApplications, [id]: 'Applied Successfully' };
    setJobApplications(newApps);
    localStorage.setItem(`ckcet_placement_apps_${student.regNo}`, JSON.stringify(newApps));
    alert(`Placement office has logged your request! Resume profile sent to ${company} HR.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Placement Cell desk</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-6 text-xs">
        <div>
          <h4 className="font-bold text-slate-800 font-display text-sm">Placement Drive &amp; Recruitment Notice</h4>
          <p className="text-xs text-slate-400 mt-0.5">Submit registration requests to active MNC recruitment pipelines.</p>
        </div>

        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{job.company}</span>
                  <span className="text-[8px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">{job.badge}</span>
                </div>
                <p className="text-[#0d0c63] font-bold text-xs">{job.role}</p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Criteria: {job.eligibility}</span>
                  <span>Drive On: {job.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Package</p>
                  <p className="font-extrabold text-slate-700 text-xs">{job.ctc}</p>
                </div>

                {jobApplications[job.id] ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-lg font-bold tracking-wide">
                    {jobApplications[job.id]}
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(job.id, job.company)}
                    className="bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-2 px-5 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 9. DOWNLOADS SUB-VIEW (Request bonafides, study materials)
// ==========================================
interface DownloadsViewProps {
  student: Student;
  onBack: () => void;
}
export function DownloadsView({ student, onBack }: DownloadsViewProps) {
  const [bonafidePurpose, setBonafidePurpose] = useState('');
  const [requests, setRequests] = useState<any[]>(() => {
    const stored = localStorage.getItem(`ckcet_bonafides_${student.regNo}`);
    return stored ? JSON.parse(stored) : [
      { id: 'REQ-128', purpose: 'Bus Pass Concession', status: 'Approved (Collect at office)', date: '2026-03-10' }
    ];
  });

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonafidePurpose.trim()) return;

    const newReq = {
      id: 'REQ-' + Math.floor(100 + Math.random() * 900),
      purpose: bonafidePurpose.trim(),
      status: 'Under Review by HOD',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    localStorage.setItem(`ckcet_bonafides_${student.regNo}`, JSON.stringify(updated));
    setBonafidePurpose('');
    alert('Online request logged successfully! Track authorization status below.');
  };

  const materials = [
    { title: 'Anna University Hall Ticket (Sem IV)', file: 'Hall_Ticket_April_May_2026.pdf', size: '142 KB' },
    { title: 'Database Systems Unit-I Notes (Silberschatz format)', file: 'CS3451_Unit1_R2021.pdf', size: '2.4 MB' },
    { title: 'Operating Systems Scheduling Lab Programs', file: 'CS3461_OS_LabManual.pdf', size: '1.1 MB' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">Documents Vault</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left: Study Material Downloads */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 font-display text-sm">Academic Downloads Shelf</h4>
            <p className="text-xs text-slate-400 mt-0.5">Save direct copies of study files or verified University credentials.</p>
          </div>

          <div className="space-y-3">
            {materials.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{m.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{m.file} • {m.size}</p>
                </div>
                <button
                  onClick={() => alert(`Saved file: ${m.file} inside your Downloads shelf.`)}
                  className="bg-[#0d0c63] hover:bg-indigo-950 text-white p-2 rounded-xl transition-all shadow-md active:scale-95"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Request Bonafide Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h4 className="font-bold text-slate-800 font-display text-sm">Request Bonafide Certificate Online</h4>
            <p className="text-xs text-slate-400 mt-0.5">Generate verified letters for bus passes, education loans, or bank services.</p>
          </div>

          <form onSubmit={handleRequest} className="space-y-3 flex gap-2">
            <input
              type="text"
              placeholder="e.g. For Education Loan Application"
              value={bonafidePurpose}
              onChange={(e) => setBonafidePurpose(e.target.value)}
              className="flex-1 bg-[#eef2fc] text-slate-800 placeholder-slate-400 font-medium py-3 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
              required
            />
            <button
              type="submit"
              className="bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
            >
              Submit Request
            </button>
          </form>

          <div className="space-y-3.5 pt-4 border-t border-slate-50">
            <h5 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Requested Letters Status</h5>
            
            {requests.length === 0 ? (
              <p className="text-slate-400 italic">No letters requested yet.</p>
            ) : (
              <div className="space-y-2">
                {requests.map((r, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-700">{r.purpose}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Request Ref: {r.id} • Registered On: {r.date}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      r.status.includes('Approved') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 10. STEP ACTIVITY PORTAL SUB-VIEW
// ==========================================
interface StepActivityViewProps {
  onBack: () => void;
}
export function StepActivityView({ onBack }: StepActivityViewProps) {
  const [activities, setActivities] = useState([
    { id: 'ACT-402', title: 'Aptitude Training Bootcamp', category: 'Training', date: '2026-07-28', hours: 12, status: 'Approved', points: 30 },
    { id: 'ACT-391', title: 'National Level Hackathon (Smart India)', category: 'Technical', date: '2026-07-20', hours: 36, status: 'Approved', points: 100 },
    { id: 'ACT-355', title: 'Paper Presentation on Blockchain Security', category: 'Research', date: '2026-06-15', hours: 8, status: 'Approved', points: 50 },
    { id: 'ACT-298', title: 'Mock Technical Interview Session', category: 'Placement', date: '2026-05-10', hours: 4, status: 'Approved', points: 15 },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Technical');
  const [newHours, setNewHours] = useState('4');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const addedAct = {
      id: 'ACT-' + Math.floor(410 + Math.random() * 200),
      title: newTitle.trim(),
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      hours: parseInt(newHours) || 4,
      status: 'Pending Verification',
      points: 0
    };

    setActivities([addedAct, ...activities]);
    setNewTitle('');
    setFeedback('Activity logged successfully! Directing copy of verification to department co-ordinator.');
    setTimeout(() => setFeedback(null), 5000);
  };

  const totalPoints = activities.reduce((sum, act) => sum + act.points, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Skills, Training &amp; Enhancement Program</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total STEP Points</p>
          <h4 className="text-2xl font-black text-[#0d0c63] font-display mt-2 font-mono">{totalPoints}</h4>
          <span className="text-[9px] text-emerald-600 font-bold mt-1 inline-block">Tier: Elite Achiever</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Activities</p>
          <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">{activities.filter(a => a.status === 'Approved').length}</h4>
          <span className="text-[9px] text-slate-400 mt-1 inline-block">100% verification rate</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accumulated Hours</p>
          <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">
            {activities.reduce((sum, act) => sum + act.hours, 0)} hrs
          </h4>
          <span className="text-[9px] text-slate-400 mt-1 inline-block">Across 4 key domains</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Milestones</p>
          <h4 className="text-2xl font-black text-slate-800 font-display mt-2 font-mono">200 pt</h4>
          <span className="text-[9px] text-indigo-600 font-bold mt-1 inline-block">Earns Honor Pin</span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Log new activity */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 font-display text-sm mb-1">Submit Non-Curriculum Activity</h4>
          <p className="text-slate-400 text-xs mb-4">Log papers presented, outside credentials, hackathons, or co-curricular achievements to earn STEP points.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Activity Title / Name</label>
              <input
                type="text"
                placeholder="e.g. AWS Academy Cloud Foundations Certification"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#eef2fc] text-slate-800 placeholder-slate-400 font-medium py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#eef2fc] text-slate-700 font-medium py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs cursor-pointer"
                >
                  <option value="Technical">Technical Competency</option>
                  <option value="Training">Placement Training</option>
                  <option value="Research">Research &amp; Patents</option>
                  <option value="Sports">Sports / Cultural</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hours Claimed</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  className="w-full bg-[#eef2fc] text-slate-800 py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0d0c63] hover:bg-indigo-950 text-white font-bold py-3 rounded-xl transition-all shadow-md uppercase tracking-wider"
            >
              Submit Activity Details
            </button>
          </form>
        </div>

        {/* Right: Activities board */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 font-display text-sm">STEP Activity Logs Ledger</h4>
          <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
            {activities.map((act, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs">{act.title}</span>
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{act.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Logged: {act.date} • Duration: {act.hours} hrs</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-extrabold block ${act.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {act.status}
                  </span>
                  {act.points > 0 && (
                    <span className="text-xs font-black text-[#0d0c63] font-mono">+{act.points} pts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 11. MY MENTOR SUB-VIEW
// ==========================================
interface MentorViewProps {
  onBack: () => void;
}
export function MentorView({ onBack }: MentorViewProps) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'mentor', text: 'Dear Student, please submit your Sem IV internal project proposals by Friday for academic committee clearance.', date: '2026-08-01 11:30 AM' },
    { id: 2, sender: 'student', text: 'Good morning ma\'am. Yes, I have sent the PDF proposal draft to your academic inbox.', date: '2026-08-02 09:15 AM' },
    { id: 3, sender: 'mentor', text: 'Got it. I will review it today and schedule a brief online call for approvals.', date: '2026-08-02 10:45 AM' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const added = {
      id: messages.length + 1,
      sender: 'student',
      text: newMsg.trim(),
      date: new Date().toLocaleString()
    };

    setMessages([...messages, added]);
    setNewMsg('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Designated Faculty Academic Mentor</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mentor profile information card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
            alt="Mentor"
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-md"
          />
          <h4 className="text-base font-extrabold text-slate-800 mt-4 font-display">Mrs. S. Radhika, M.E.</h4>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">Assistant Professor • Computer Science Engineering</p>
          
          <span className="mt-3.5 inline-block bg-indigo-50 text-[#0d0c63] text-[9px] font-bold px-3 py-0.5 rounded-full">
            Active Academic Mentor
          </span>

          <div className="w-full mt-6 space-y-3.5 text-left border-t border-slate-50 pt-5">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Official Email</p>
                <p className="font-semibold text-slate-700 mt-0.5 font-mono">s.radhika@ckcet.edu.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Office Desk Extension</p>
                <p className="font-semibold text-slate-700 mt-0.5">+91 94432 01824 • Ext: 412</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Cabin Address</p>
                <p className="font-semibold text-slate-700 mt-0.5">CSE Department AP Room 204, C-Block</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Mentor Hours</p>
                <p className="font-semibold text-slate-700 mt-0.5">Tuesdays &amp; Thursdays 03:30 PM - 05:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat / interaction workspace */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden justify-between">
          <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex items-center justify-between">
            <h5 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Mentor Correspondence Thread</h5>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Faculty is Online"></span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/10">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3.5 rounded-2xl max-w-xs ${
                  msg.sender === 'student'
                    ? 'bg-[#0d0c63] text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-xs'
                }`}>
                  <p className="leading-relaxed font-light">{msg.text}</p>
                  <p className="text-[8px] text-slate-400 text-right mt-1.5 font-mono">{msg.date}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2 items-center bg-white">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Ask a question or request academic feedback..."
              className="flex-1 bg-slate-50 text-slate-800 placeholder-slate-400 font-medium py-2.5 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-300 text-xs"
              required
            />
            <button type="submit" className="p-2.5 bg-[#0d0c63] text-white rounded-xl shadow-sm active:scale-95">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 12. CIRCULARS BOARD SUB-VIEW
// ==========================================
interface CircularsViewProps {
  onBack: () => void;
}
export function CircularsView({ onBack }: CircularsViewProps) {
  const [circulars] = useState([
    { id: 'CIRC-199', title: 'Anna University Semester Examination Attendance Eligibility List Release', category: 'Examinations', date: '2026-08-03', author: 'Dr. Varatharajan, Controller of Examinations' },
    { id: 'CIRC-192', title: 'STEP Activity Points Verification & Submission Window - Sem IV', category: 'Academic Office', date: '2026-07-30', author: 'Principal Office, CKCET' },
    { id: 'CIRC-185', title: 'On-Campus Placement Drive for Cognizant Technology Solutions', category: 'Placements Cell', date: '2026-07-25', author: 'Prof. John William, Placement Officer' },
    { id: 'CIRC-176', title: 'Independence Day Celebrations and Cultural Schedule 2026', category: 'Cultural Council', date: '2026-07-18', author: 'Dr. Janagi A, Dean of Students' },
    { id: 'CIRC-155', title: 'Submission of Online Fee Receipt Copy - Hostel & Tuition Dues', category: 'Fees Audit Office', date: '2026-07-10', author: 'Finance Auditor' },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-bold text-[#0d0c63] hover:underline flex items-center gap-1">
          &larr; Back to Dashboard
        </button>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">College Circulars Board</span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <h4 className="font-bold text-slate-800 font-display text-sm">Official Campus Circulars Noticeboard</h4>
          <p className="text-xs text-slate-400 mt-0.5">Please check this section regularly for printable releases from administrative, exam and placement wings.</p>
        </div>

        <div className="space-y-4">
          {circulars.map(circ => (
            <div key={circ.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-colors space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-indigo-50 text-[#0d0c63] px-2.5 py-0.5 rounded-full uppercase text-[9px] tracking-wider font-extrabold border border-indigo-100">
                  {circ.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium">{circ.date}</span>
              </div>
              
              <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{circ.title}</h4>
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 font-mono italic">
                <span>Ref No: {circ.id}</span>
                <span>Signed: {circ.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
