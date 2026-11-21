import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Flag,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { PMProject, PMPhase, PMMilestone, PMTask } from '../pm.types';

interface PMTimelineViewProps {
  project: PMProject;
  phases: PMPhase[];
  milestones: PMMilestone[];
  tasks: PMTask[];
}

export const PMTimelineView: React.FC<PMTimelineViewProps> = ({
  project,
  phases,
  milestones,
  tasks,
}) => {
  const [zoomLevel, setZoomLevel] = useState<'months' | 'weeks'>('months');

  const projectPhases = phases.filter((p) => p.projectId === project.id).sort((a, b) => a.order - b.order);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  // Month columns 2026: Jan -> Dec
  const months = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Project Gantt Schedule & Milestones</h2>
          <p className="text-xs text-slate-500">
            Lifecycle timeline from {project.startDate} to {project.expectedEndDate}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-700" />
            <span className="text-slate-600">Phase Bar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-amber-500" />
            <span className="text-slate-600">Gate Milestone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Task Schedule</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto p-4">
        <div className="min-w-[900px]">
          {/* Header row with months */}
          <div className="grid grid-cols-12 gap-1 border-b border-slate-200 pb-2 mb-4 text-center text-xs font-bold text-slate-600">
            {months.map((m, idx) => (
              <div
                key={m}
                className={`py-1.5 rounded ${
                  idx === 5 ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200' : 'bg-slate-50'
                }`}
              >
                {m}
                {idx === 5 && <span className="block text-[9px] font-normal text-blue-500">Today</span>}
              </div>
            ))}
          </div>

          {/* Master Project Bar */}
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
              <span>{project.name} (Overall Lifecycle)</span>
              <span className="text-blue-700">{project.progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden relative">
              <div
                className="bg-blue-700 h-full rounded-full transition-all"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Phases & Key Tasks
            </h3>

            {projectPhases.map((phase, pIdx) => {
              const phaseTasks = projectTasks.filter((t) => t.phaseId === phase.id);

              return (
                <div key={phase.id} className="space-y-2 border-b border-slate-100 pb-4">
                  {/* Phase Row */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-extrabold">
                        {phase.order}
                      </span>
                      <span>{phase.name}</span>
                      <span className="text-[10px] text-slate-400">({phase.plannedStart} → {phase.plannedEnd})</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{phase.progressPercent}%</span>
                  </div>

                  {/* Visual Bar Across 12 Columns */}
                  <div className="grid grid-cols-12 gap-1 h-6 bg-slate-50 rounded-lg p-0.5 border border-slate-100 relative">
                    <div
                      className={`h-full rounded-md shadow-xs flex items-center px-2 text-[10px] font-bold text-white ${
                        phase.status === 'Completed'
                          ? 'bg-emerald-600'
                          : phase.status === 'In Progress'
                          ? 'bg-blue-600'
                          : 'bg-slate-400'
                      }`}
                      style={{
                        gridColumnStart: pIdx === 0 ? 1 : pIdx === 1 ? 3 : 7,
                        gridColumnEnd: pIdx === 0 ? 3 : pIdx === 1 ? 7 : 11,
                      }}
                    >
                      <span className="truncate">{phase.name} ({phase.status})</span>
                    </div>
                  </div>

                  {/* Tasks in Phase */}
                  <div className="pl-6 space-y-1 pt-1">
                    {phaseTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between text-[11px] text-slate-600">
                        <span className="truncate max-w-xs flex items-center gap-1.5">
                          <span className="font-mono text-blue-600 font-bold">{task.taskId}</span>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">{task.dueDate}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500'
                                : task.status === 'In Progress'
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestones Markers Row */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Contractual & Gate Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectMilestones.map((m) => (
                <div key={m.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs">
                  <div className="flex items-center justify-between text-amber-800 font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <Flag size={14} className="text-amber-600" />
                      {m.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">{m.plannedDate}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">{m.status}</span>
                    <span className="text-slate-500">{m.progressPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
