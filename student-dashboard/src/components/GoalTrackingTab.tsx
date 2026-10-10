/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Filter, 
  Award, 
  TrendingUp 
} from 'lucide-react';
import { StudentGoal } from '../types';

interface GoalTrackingTabProps {
  goals: StudentGoal[];
  onUpdateGoals: (newGoals: StudentGoal[]) => void;
}

export default function GoalTrackingTab({
  goals,
  onUpdateGoals,
}: GoalTrackingTabProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | StudentGoal['category']>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<StudentGoal['category']>('Academic');
  const [newTargetDate, setNewTargetDate] = useState('');

  const handleToggleGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, completed: !g.completed };
      }
      return g;
    });
    onUpdateGoals(updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTargetDate) return;

    const newGoal: StudentGoal = {
      id: `g-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetDate: newTargetDate,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onUpdateGoals([...goals, newGoal]);
    setNewTitle('');
    setNewTargetDate('');
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateGoals(goals.filter(g => g.id !== id));
  };

  // Calculations
  const filteredGoals = goals.filter(g => activeCategory === 'All' || g.category === activeCategory);
  const totalCount = goals.length;
  const completedCount = goals.filter(g => g.completed).length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-8" id="goal-tracking-tab-container">
      {/* Header card with progress bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="space-y-1.5 w-full md:max-w-md">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-5.5 h-5.5 text-indigo-600 animate-pulse" /> Self-Development & Goals
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Stay focused on academic results and technical skills. Mark off tasks as you finish them!
          </p>
        </div>

        {/* Global Progress bar */}
        <div className="w-full md:max-w-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Overall Completion</span>
            <span>{completedCount}/{totalCount} completed ({completionPercentage.toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-50">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#212c6a] to-indigo-500 transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left 2 Columns: Add Goal Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] h-fit">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="w-4.5 h-4.5 text-[#212c6a]" /> Establish New Target Goal
          </h3>

          <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">Goal Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Solve 50 LeetCode dynamic problems"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Category *</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                >
                  <option value="Academic">Academic</option>
                  <option value="Skill Acquisition">Skill Acquisition</option>
                  <option value="Career">Placement & Career</option>
                  <option value="Physical">Health & Fitness</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-bold block">Target Completion Date *</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-indigo-600 focus:bg-white"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#212c6a] hover:bg-indigo-950 transition-colors text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Save Target Goal
            </button>
          </form>
        </div>

        {/* Right 3 Columns: Active checklist */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col min-h-[420px]">
          {/* Header filters */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4 pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-indigo-600" /> Active Goal Checklist
            </h3>

            {/* Selector Categories */}
            <div className="flex gap-1 flex-wrap">
              {(['All', 'Academic', 'Skill Acquisition', 'Career', 'Physical'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                    activeCategory === cat 
                      ? 'bg-[#212c6a] text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'Career' ? 'Placement' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* List scroll */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-1">
            {filteredGoals.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-10">No goals found under this category.</p>
            ) : (
              filteredGoals.map((g) => (
                <div 
                  key={g.id}
                  className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                    g.completed 
                      ? 'bg-green-50/15 border-green-100 opacity-80' 
                      : 'bg-slate-50/15 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleGoal(g.id)}
                      className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {g.completed ? (
                        <CheckCircle2 className="w-5.5 h-5.5 text-green-600" />
                      ) : (
                        <Circle className="w-5.5 h-5.5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-xs font-semibold ${g.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {g.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#212c6a] bg-indigo-50 px-1 rounded-md font-bold text-[9px] uppercase">
                          {g.category}
                        </span>
                        <span>Target: {g.targetDate}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="text-gray-300 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-all cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
