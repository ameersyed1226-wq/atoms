/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Bot, 
  UserCheck 
} from 'lucide-react';
import { SupportTicket } from '../types';

interface HelpRequestTabProps {
  tickets: SupportTicket[];
  onUpdateTickets: (newTickets: SupportTicket[]) => void;
}

export default function HelpRequestTab({
  tickets,
  onUpdateTickets,
}: HelpRequestTabProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Academics');
  const [ticketMessage, setTicketMessage] = useState('');

  const [chatMessage, setChatMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.replies]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketMessage.trim()) return;

    const newId = `tk-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: newId,
      title: ticketTitle,
      category: ticketCategory,
      message: ticketMessage,
      status: 'Open',
      createdAt: new Date().toISOString(),
      replies: [
        {
          id: `rep-${Date.now()}`,
          sender: 'Student',
          message: ticketMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };

    onUpdateTickets([newTicket, ...tickets]);
    setSelectedTicketId(newId);
    setTicketTitle('');
    setTicketMessage('');
    setSubmittingTicket(false);

    // Trigger instant mock support response after 1.5 seconds for incredible interactivity!
    setTimeout(() => {
      const updatedWithAdmin = [newTicket, ...tickets].map(t => {
        if (t.id === newId) {
          const adminReply = getMockAdminResponse(ticketCategory, ticketTitle);
          return {
            ...t,
            status: 'In Progress' as const,
            replies: [
              ...t.replies,
              {
                id: `rep-admin-${Date.now()}`,
                sender: 'Admin' as const,
                message: adminReply,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      });
      onUpdateTickets(updatedWithAdmin);
    }, 1500);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeTicket) return;

    const studentMsg = chatMessage.trim();
    setChatMessage('');

    // Update with student reply
    const updatedWithStudent = tickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          replies: [
            ...t.replies,
            {
              id: `rep-${Date.now()}`,
              sender: 'Student' as const,
              message: studentMsg,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    });
    onUpdateTickets(updatedWithStudent);

    // Simulate Admin reply back
    setTimeout(() => {
      const updatedWithAdmin = updatedWithStudent.map(t => {
        if (t.id === activeTicket.id) {
          return {
            ...t,
            replies: [
              ...t.replies,
              {
                id: `rep-reply-${Date.now()}`,
                sender: 'Admin' as const,
                message: `Understood, Ameer. We have logged this note in our system and our administrators will review this shortly. Thank you for your patience!`,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      });
      onUpdateTickets(updatedWithAdmin);
    }, 1500);
  };

  const getMockAdminResponse = (cat: SupportTicket['category'], title: string) => {
    switch (cat) {
      case 'Academics':
        return `Hello Ameer, we have successfully received your academic query regarding "${title}". We have dispatched this request to your Department HOD. We will update you here shortly.`;
      case 'Hostel':
        return `Hi Ameer, thank you for reaching out to the Hostel Warden Office. We have registered your hostel grievance: "${title}". A coordinator has been assigned to verify this.`;
      case 'Fee Payment':
        return `Hello Ameer, the accounts desk has received your ticket regarding "${title}". We are checking our bank gateways. Please hold for up to 24 hours.`;
      case 'IT Support':
        return `Hi Ameer, IT Administration has noted your concern regarding "${title}". Please restart your device or verify your Wi-Fi credentials. If the issue persists, we will coordinate directly with you.`;
      case 'Exam Cell':
        return `Hello Ameer, the Controller of Examinations has received your file. Please double check standard examination guidelines in your handbook while we review.`;
      default:
        return `Hello Ameer, we have received your support inquiry and assigned it ticket ID: TK-${Math.floor(1000 + Math.random()*9000)}. An administrative counselor will reply shortly.`;
    }
  };

  return (
    <div className="space-y-8" id="help-request-tab-container">
      {/* Upper action header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <HelpCircle className="w-5.5 h-5.5 text-indigo-600 animate-pulse" /> Student Help Desk & Grievance Cell
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Having trouble with hostel Wi-Fi, grading discrepancies, or hostel issues? Submit a formal support ticket to communicate directly with administrative counselors.
          </p>
        </div>
        <button
          onClick={() => setSubmittingTicket(!submittingTicket)}
          className="bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Raise Assistance Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Create Ticket Form OR Active Tickets list */}
        <div className="lg:col-span-2 space-y-4">
          {submittingTicket ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
              <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-indigo-600" /> Create Assistance Ticket
              </h3>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Ticket Category *</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                  >
                    <option value="Academics">Academics & Syllabus</option>
                    <option value="Hostel">Hostel Dues & Rooms</option>
                    <option value="Fee Payment">Fee & Finance Transactions</option>
                    <option value="IT Support">University Campus IT & Wi-Fi</option>
                    <option value="Exam Cell">Semester Examinations Cell</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Ticket Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of issue"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 font-bold block">Grievance message *</label>
                  <textarea
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 h-24 focus:outline-indigo-600 focus:bg-white resize-none"
                    placeholder="Please write down precise details..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setSubmittingTicket(false)}
                    className="bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#212c6a] hover:bg-indigo-950 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    Send Ticket
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Grievance Tickets Ledger</p>
              
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {tickets.map((t) => {
                  const isSelected = t.id === selectedTicketId;

                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-[0_4px_12px_rgba(99,102,241,0.03)]' 
                          : 'border-gray-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {t.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{t.title}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold">Opened: {new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        t.status === 'Resolved'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : t.status === 'In Progress'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {t.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Detailed interactive Chat Log */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[520px]">
          {activeTicket ? (
            <>
              {/* Chat Title bar */}
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">{activeTicket.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                    Category: <strong className="text-indigo-600">{activeTicket.category}</strong> • Created on {new Date(activeTicket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                    activeTicket.status === 'Resolved'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                  }`}>
                    {activeTicket.status === 'Resolved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {activeTicket.status}
                  </span>
                </div>
              </div>

              {/* Chat Log Message bubble scroll */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {activeTicket.replies.map((rep) => {
                  const isAdmin = rep.sender === 'Admin';
                  return (
                    <div 
                      key={rep.id} 
                      className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                        isAdmin 
                          ? 'bg-slate-100 text-slate-800 rounded-tl-none' 
                          : 'bg-[#212c6a] text-white rounded-tr-none shadow-sm'
                      }`}>
                        <div className="flex items-center gap-1 mb-0.5 text-[10px] font-bold">
                          {isAdmin ? (
                            <span className="text-indigo-700 flex items-center gap-0.5">
                              <Bot className="w-3.5 h-3.5" /> Warden/Admin Support
                            </span>
                          ) : (
                            <span className="text-indigo-200">You (Ameer Syed)</span>
                          )}
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap font-medium">{rep.message}</p>
                        <p className={`text-[9px] text-right font-medium ${isAdmin ? 'text-slate-400' : 'text-indigo-200'}`}>
                          {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Message Input form */}
              <form onSubmit={handleSendChatMessage} className="border-t border-slate-100 pt-3 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type administrative reply..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-indigo-600 focus:bg-white focus:border-indigo-600 transition-all font-medium"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white rounded-xl px-4 flex items-center justify-center cursor-pointer shadow-sm"
                  title="Submit message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-200" />
              <p className="text-xs font-bold text-slate-700">No Support Tickets Selected</p>
              <p className="text-[10px] text-slate-400 max-w-xs">Raise a ticket using the action button or select an existing ticket on the left menu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
