import React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { PMProject, PMTask, PMMilestone, PMBudget, PMRisk } from '../pm.types';

interface PMReportsViewProps {
  project: PMProject;
  tasks: PMTask[];
  milestones: PMMilestone[];
  budgets: PMBudget[];
  risks: PMRisk[];
}

export const PMReportsView: React.FC<PMReportsViewProps> = ({
  project,
  tasks,
  milestones,
  budgets,
  risks,
}) => {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectBudgets = budgets.filter((b) => b.projectId === project.id);
  const projectRisks = risks.filter((r) => r.projectId === project.id);

  const completedTasks = projectTasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = projectTasks.filter((t) => t.status === 'In Progress').length;
  const overdueTasks = projectTasks.filter((t) => {
    if (t.status === 'Completed' || t.status === 'Cancelled') return false;
    return new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  }).length;

  const totalEstBudget = project.estimatedBudget;
  const totalActualCost = project.actualCost;
  const costVariance = totalEstBudget - totalActualCost;
  const costPerformanceIndex = totalActualCost > 0 ? (totalEstBudget * (project.progressPercent / 100)) / totalActualCost : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Project Performance & Health Analytics</h2>
          <p className="text-xs text-slate-500">
            Earned Value Management (EVM), schedule variance, and executive KPI reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Project Health:</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              project.health === 'On Track'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : project.health === 'At Risk'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            ● {project.health}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Overall Progress
          </span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{project.progressPercent}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cost Performance (CPI)
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {costPerformanceIndex.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {costPerformanceIndex >= 1 ? 'Under or on budget' : 'Over budget run-rate'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Task Completion Ratio
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {completedTasks} / {projectTasks.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{inProgressTasks} currently in flight</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Overdue Deliverables
          </span>
          <div className={`text-2xl font-extrabold mt-1 ${overdueTasks > 0 ? 'text-red-700' : 'text-slate-900'}`}>
            {overdueTasks}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires PM escalation</p>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Planned vs Actual Financials
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Total Budget Ceiling</span>
                <span className="font-bold text-slate-900">AED {totalEstBudget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Actual Incurred Cost</span>
                <span className="font-bold text-slate-900">AED {totalActualCost.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min((totalActualCost / totalEstBudget) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="pt-2 flex justify-between text-xs font-bold border-t border-slate-100">
              <span className="text-slate-500">Remaining Funds:</span>
              <span className={costVariance >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                AED {costVariance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Milestone Governance Status
          </h3>
          <div className="space-y-3">
            {projectMilestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{m.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : m.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.status} ({m.progressPercent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
