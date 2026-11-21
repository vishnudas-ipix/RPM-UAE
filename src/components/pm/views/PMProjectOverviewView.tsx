import React, { useState } from 'react';
import {
  Edit3,
  RefreshCw,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
  Shield,
  FileCheck,
  CircleAlert,
} from 'lucide-react';
import {
  PMProject,
  PMTask,
  PMMilestone,
  PMTeamMember,
  PMRisk,
  PMBudget,
  PMPhase,
  PMApproval,
  PMView,
  PMProjectStatus,
  PMProjectHealth,
} from '../pm.types';

// ─── Status / Health Helpers ────────────────────────────────────────────────

const STATUS_COLORS: Record<PMProjectStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-700',
  'Under Assessment': 'bg-indigo-100 text-indigo-700',
  'Clarification Required': 'bg-yellow-100 text-yellow-800',
  'Pending Approval': 'bg-amber-100 text-amber-800',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Planning: 'bg-purple-100 text-purple-700',
  'Ready for Execution': 'bg-teal-100 text-teal-700',
  Active: 'bg-green-100 text-green-800',
  'On Hold': 'bg-orange-100 text-orange-700',
  'Under Review': 'bg-indigo-100 text-indigo-700',
  UAT: 'bg-cyan-100 text-cyan-800',
  'Ready for Deployment': 'bg-teal-100 text-teal-800',
  Deployed: 'bg-blue-100 text-blue-800',
  Handover: 'bg-violet-100 text-violet-700',
  'Pending Closure': 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-800',
  Closed: 'bg-slate-100 text-slate-700',
  Archived: 'bg-gray-100 text-gray-500',
};

const HEALTH_CONFIG: Record<PMProjectHealth, { dot: string; label: string; text: string }> = {
  'On Track': { dot: 'bg-green-500', label: 'On Track', text: 'text-green-700' },
  'At Risk': { dot: 'bg-amber-500', label: 'At Risk', text: 'text-amber-700' },
  Critical: { dot: 'bg-red-500', label: 'Critical', text: 'text-red-700' },
  'Not Started': { dot: 'bg-gray-400', label: 'Not Started', text: 'text-gray-600' },
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border border-red-200',
  High: 'bg-orange-100 text-orange-700 border border-orange-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const PHASE_STATUS_COLORS: Record<string, string> = {
  'Not Started': 'text-gray-500',
  'In Progress': 'text-blue-600',
  Completed: 'text-green-600',
  'On Hold': 'text-orange-600',
};

const MILESTONE_STATUS_COLORS: Record<string, string> = {
  'Not Started': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Pending Review': 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Delayed: 'bg-red-100 text-red-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

const RISK_SEVERITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-blue-100 text-blue-700',
};

// Valid status transitions
const STATUS_TRANSITIONS: Partial<Record<PMProjectStatus, PMProjectStatus[]>> = {
  Draft: ['Submitted'],
  Submitted: ['Under Assessment', 'Rejected'],
  'Under Assessment': ['Clarification Required', 'Pending Approval', 'Rejected'],
  'Clarification Required': ['Submitted'],
  'Pending Approval': ['Approved', 'Rejected'],
  Approved: ['Planning'],
  Planning: ['Ready for Execution', 'On Hold'],
  'Ready for Execution': ['Active'],
  Active: ['On Hold', 'Under Review', 'UAT'],
  'On Hold': ['Active', 'Rejected'],
  'Under Review': ['Active', 'On Hold'],
  UAT: ['Ready for Deployment', 'Active'],
  'Ready for Deployment': ['Deployed'],
  Deployed: ['Handover', 'Validation Pending' as PMProjectStatus],
  Handover: ['Pending Closure'],
  'Pending Closure': ['Completed', 'Active'],
  Completed: ['Closed'],
  Closed: ['Archived'],
};

// ─── Utility helpers ─────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-AE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount: number, currency = 'AED'): string {
  return `${currency} ${amount.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;
}

function calcWorkingDays(start: string, end: string): number {
  if (!start || !end) return 0;
  let count = 0;
  const cur = new Date(start);
  const endDate = new Date(end);
  while (cur <= endDate) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function daysFromNow(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500',
];
function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, icon: Icon, action }: { title: string; icon?: React.ElementType; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-[#064E86]" />}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-medium text-[#064E86] hover:underline"
    >
      {label} <ArrowRight className="w-3 h-3" />
    </button>
  );
}

// Circular progress
function CircularProgress({ percent, size = 96 }: { percent: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={percent >= 80 ? '#10b981' : percent >= 50 ? '#3b82f6' : '#f59e0b'}
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

// ─── Status Update Modal ─────────────────────────────────────────────────────

interface StatusModalProps {
  project: PMProject;
  onClose: () => void;
  onConfirm: (newStatus: PMProjectStatus, remarks: string) => void;
}

function StatusUpdateModal({ project, onClose, onConfirm }: StatusModalProps) {
  const transitions = STATUS_TRANSITIONS[project.status] ?? [];
  const [selectedStatus, setSelectedStatus] = useState<PMProjectStatus>(
    transitions[0] ?? project.status
  );
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!remarks.trim()) {
      setError('Please provide remarks for the status change.');
      return;
    }
    onConfirm(selectedStatus, remarks.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[#064E86] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-base">Update Project Status</h2>
            <p className="text-blue-200 text-xs mt-0.5">{project.code} — {project.name}</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[project.status]}`}>
              {project.status}
            </span>
          </div>

          {transitions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No further transitions available.</p>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as PMProjectStatus)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E86]"
              >
                {transitions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Remarks *</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => { setRemarks(e.target.value); setError(''); }}
              placeholder="Describe the reason for status change..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#064E86] resize-none"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={transitions.length === 0}
              className="px-4 py-2 text-sm font-medium bg-[#064E86] text-white rounded-lg hover:bg-[#053f6e] disabled:opacity-50 transition"
            >
              Confirm Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface PMProjectOverviewViewProps {
  project: PMProject;
  tasks: PMTask[];
  milestones: PMMilestone[];
  teamMembers: PMTeamMember[];
  risks: PMRisk[];
  budgets: PMBudget[];
  phases: PMPhase[];
  approvals: PMApproval[];
  onNavigate: (view: PMView) => void;
  onUpdateProject: (project: PMProject) => void;
}

export function PMProjectOverviewView({
  project,
  tasks,
  milestones,
  teamMembers,
  risks,
  budgets,
  phases,
  approvals,
  onNavigate,
  onUpdateProject,
}: PMProjectOverviewViewProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [scopeExpanded, setScopeExpanded] = useState(false);
  const [reqExpanded, setReqExpanded] = useState(false);

  // ── Filtered data ─────────────────────────────────────────
  const projectPhases = phases.filter((p) => p.projectId === project.id).sort((a, b) => a.order - b.order);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectTeam = teamMembers.filter((t) => t.projectId === project.id);
  const projectBudgets = budgets.filter((b) => b.projectId === project.id);
  const projectRisks = risks.filter((r) => r.projectId === project.id);
  const pendingApprovals = approvals.filter((a) => a.projectId === project.id && a.decision === 'Pending');
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  // ── Budget calculations ───────────────────────────────────
  const totalEstimated = projectBudgets.length
    ? projectBudgets.reduce((s, b) => s + b.plannedAmount, 0)
    : project.estimatedBudget;
  const totalActual = projectBudgets.length
    ? projectBudgets.reduce((s, b) => s + b.actualAmount, 0)
    : project.actualCost;
  const totalRemaining = totalEstimated - totalActual;
  const budgetUtilPct = totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0;
  const budgetBarColor =
    budgetUtilPct > 95 ? 'bg-red-500' : budgetUtilPct > 80 ? 'bg-amber-500' : 'bg-green-500';
  const budgetTextColor =
    budgetUtilPct > 95 ? 'text-red-600' : budgetUtilPct > 80 ? 'text-amber-600' : 'text-green-600';

  // ── Dates & duration ─────────────────────────────────────
  const workingDays = calcWorkingDays(project.startDate, project.expectedEndDate);
  const daysLeft = daysFromNow(project.expectedEndDate);
  const isOverdue = daysLeft < 0 && !project.actualEndDate;

  // ── Risk counts ───────────────────────────────────────────
  const openRisks = projectRisks.filter((r) => r.status === 'Open' || r.status === 'Escalated');
  const riskBySeverity: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  openRisks.forEach((r) => { riskBySeverity[r.severity] = (riskBySeverity[r.severity] || 0) + 1; });

  // ── Milestone counts ──────────────────────────────────────
  const completedMilestones = projectMilestones.filter((m) => m.status === 'Completed' || m.status === 'Approved').length;

  // ── Recent activity (simulate from status history + tasks) ─
  type ActivityItem = { id: string; label: string; detail: string; time: string };
  const recentActivity: ActivityItem[] = [
    ...project.statusHistory.map((sh) => ({
      id: sh.id,
      label: `Status → ${sh.status}`,
      detail: sh.remarks || 'Status updated',
      time: sh.changedAt,
    })),
    ...projectTasks.map((t) => ({
      id: t.id,
      label: `Task: ${t.taskId}`,
      detail: `${t.title} — ${t.status}`,
      time: t.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 3);

  // ── Status update handler ─────────────────────────────────
  const handleStatusUpdate = (newStatus: PMProjectStatus, remarks: string) => {
    const now = new Date().toISOString();
    const updated: PMProject = {
      ...project,
      status: newStatus,
      updatedAt: now,
      statusHistory: [
        ...project.statusHistory,
        {
          id: `sh-${Date.now()}`,
          status: newStatus,
          changedBy: 'Current User',
          changedAt: now,
          remarks,
        },
      ],
    };
    onUpdateProject(updated);
    setShowStatusModal(false);
  };

  // ─── Health info ──────────────────────────────────────────
  const health = HEALTH_CONFIG[project.health];

  // ─── Scope truncate helpers ───────────────────────────────
  const TRUNC = 220;
  const scopeLong = (project.scopeOfWork?.length ?? 0) > TRUNC;
  const reqLong = (project.businessRequirements?.length ?? 0) > TRUNC;

  return (
    <div className="p-6 min-h-full bg-gray-50">
      {/* ── Status Update Modal ── */}
      {showStatusModal && (
        <StatusUpdateModal
          project={project}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusUpdate}
        />
      )}

      {/* ── Two-column layout ── */}
      <div className="flex gap-6 items-start">
        {/* ════════ LEFT COLUMN (2/3) ════════ */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* 1. Project Header */}
          <Card>
            <div className="p-5">
              {/* Top row: code + name + status */}
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <span className="shrink-0 inline-block px-2.5 py-1 rounded-md bg-[#064E86]/10 text-[#064E86] text-xs font-mono font-semibold">
                  {project.code}
                </span>
                <h1 className="flex-1 text-xl font-bold text-gray-900 leading-tight min-w-0">
                  {project.name}
                </h1>
                <span className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[project.status]}`}>
                  {project.status}
                </span>
              </div>

              {/* Health indicator */}
              <div className={`flex items-center gap-2 mb-4 ${health.text}`}>
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${health.dot}`} />
                <span className="text-sm font-medium">{health.label}</span>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_COLORS[project.priority]}`}>
                  {project.priority} Priority
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                  {project.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                  {project.category}
                </span>
                {project.client && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700">
                    {project.client}
                  </span>
                )}
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onNavigate('create')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Project
                </button>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#064E86] text-white rounded-lg hover:bg-[#053f6e] transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Update Status
                </button>
                <button
                  onClick={() => onNavigate('timeline')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#064E86] text-[#064E86] rounded-lg hover:bg-blue-50 transition"
                >
                  <Clock className="w-3.5 h-3.5" /> View Timeline
                </button>
              </div>
            </div>
          </Card>

          {/* 2. Project Progress */}
          <Card>
            <CardHeader title="Project Progress" icon={TrendingUp} />
            <div className="p-5">
              {/* Overall progress */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative shrink-0">
                  <CircularProgress percent={project.progressPercent} size={96} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">{project.progressPercent}%</span>
                    <span className="text-[10px] text-gray-500 leading-none">Complete</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Overall Completion</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="h-3 rounded-full bg-[#064E86] transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Planned: {project.progressPercent}%</span>
                    <span>Actual: {project.progressPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Phase-wise progress */}
              {projectPhases.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phase Breakdown</p>
                  {projectPhases.map((phase) => (
                    <div key={phase.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{phase.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${PHASE_STATUS_COLORS[phase.status]}`}>
                            {phase.status}
                          </span>
                          <span className="text-xs text-gray-500">{phase.progressPercent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            phase.status === 'Completed'
                              ? 'bg-green-500'
                              : phase.status === 'In Progress'
                              ? 'bg-blue-500'
                              : phase.status === 'On Hold'
                              ? 'bg-orange-400'
                              : 'bg-gray-300'
                          }`}
                          style={{ width: `${phase.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* 3. Key Dates */}
          <Card>
            <CardHeader title="Key Dates" icon={Calendar} />
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expected End</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(project.expectedEndDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Actual End</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {project.actualEndDate ? formatDate(project.actualEndDate) : <span className="text-gray-400 font-normal">Not set</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Duration (working days)</p>
                  <p className="text-sm font-bold text-gray-800">{workingDays} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Days Remaining</p>
                  {project.actualEndDate ? (
                    <p className="text-sm font-bold text-green-600">Completed</p>
                  ) : isOverdue ? (
                    <p className="text-sm font-bold text-red-600">{Math.abs(daysLeft)} days overdue</p>
                  ) : (
                    <p className="text-sm font-bold text-gray-800">{daysLeft} days</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Scope Summary */}
          <Card>
            <CardHeader title="Scope Summary" icon={FileCheck} />
            <div className="p-5 space-y-4">
              {/* Scope of Work */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Scope of Work</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {scopeExpanded || !scopeLong
                    ? project.scopeOfWork
                    : `${project.scopeOfWork?.slice(0, TRUNC)}...`}
                </p>
                {scopeLong && (
                  <button
                    onClick={() => setScopeExpanded(!scopeExpanded)}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-[#064E86] hover:underline"
                  >
                    {scopeExpanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show more</>}
                  </button>
                )}
              </div>

              {/* Business Requirements */}
              {project.businessRequirements && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Business Requirements</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {reqExpanded || !reqLong
                      ? project.businessRequirements
                      : `${project.businessRequirements.slice(0, TRUNC)}...`}
                  </p>
                  {reqLong && (
                    <button
                      onClick={() => setReqExpanded(!reqExpanded)}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-[#064E86] hover:underline"
                    >
                      {reqExpanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show more</>}
                    </button>
                  )}
                </div>
              )}

              {/* Key Deliverables */}
              {project.deliverables && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Key Deliverables</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.deliverables}</p>
                </div>
              )}

              {/* Assumptions */}
              {project.assumptions && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Assumptions</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{project.assumptions}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ════════ RIGHT COLUMN (1/3) ════════ */}
        <div className="w-80 shrink-0 space-y-4">

          {/* 1. Budget Snapshot */}
          <Card>
            <CardHeader
              title="Budget Snapshot"
              icon={DollarSign}
              action={<NavLink label="Details" onClick={() => onNavigate('reports')} />}
            />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Estimated</span>
                <span className="text-sm font-semibold text-gray-800">{formatCurrency(totalEstimated, project.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Actual Spent</span>
                <span className="text-sm font-semibold text-gray-800">{formatCurrency(totalActual, project.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Remaining</span>
                <span className={`text-sm font-semibold ${totalRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totalRemaining, project.currency)}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Utilization</span>
                  <span className={`font-semibold ${budgetTextColor}`}>{budgetUtilPct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${budgetBarColor}`}
                    style={{ width: `${Math.min(budgetUtilPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Team Summary */}
          <Card>
            <CardHeader
              title={`Team (${projectTeam.length})`}
              icon={Users}
              action={<NavLink label="View All" onClick={() => onNavigate('team')} />}
            />
            <div className="p-4">
              {projectTeam.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No team members assigned.</p>
              ) : (
                <div className="space-y-2.5">
                  {projectTeam.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${avatarColor(member.name)} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-xs font-bold">{getInitials(member.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{member.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {projectTeam.length > 5 && (
                    <p className="text-xs text-gray-400">+{projectTeam.length - 5} more members</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 3. Milestone Status */}
          <Card>
            <CardHeader
              title="Milestones"
              icon={CheckCircle2}
              action={<NavLink label="View All" onClick={() => onNavigate('milestones')} />}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-green-500"
                    style={{ width: projectMilestones.length ? `${(completedMilestones / projectMilestones.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 shrink-0">
                  {completedMilestones}/{projectMilestones.length}
                </span>
              </div>
              {projectMilestones.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No milestones defined.</p>
              ) : (
                <div className="space-y-2">
                  {projectMilestones.slice(0, 4).map((m) => (
                    <div key={m.id} className="flex items-start gap-2">
                      <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${MILESTONE_STATUS_COLORS[m.status]}`}>
                        {m.status}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{m.name}</p>
                        <p className="text-[11px] text-gray-500">{formatDate(m.plannedDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* 4. Risk Summary */}
          <Card>
            <CardHeader
              title="Risks"
              icon={AlertTriangle}
              action={<NavLink label="View All" onClick={() => onNavigate('risks')} />}
            />
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-2">Open / Escalated Risks</p>
              <div className="flex flex-wrap gap-1.5">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map((sev) =>
                  riskBySeverity[sev] > 0 ? (
                    <span key={sev} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${RISK_SEVERITY_COLORS[sev]}`}>
                      {sev}: {riskBySeverity[sev]}
                    </span>
                  ) : null
                )}
                {openRisks.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No open risks.</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Total risks: <span className="font-semibold text-gray-700">{projectRisks.length}</span>
              </p>
            </div>
          </Card>

          {/* 5. Pending Approvals */}
          <Card>
            <CardHeader
              title="Pending Approvals"
              icon={CircleAlert}
              action={<NavLink label="View All" onClick={() => onNavigate('approvals')} />}
            />
            <div className="p-4">
              {pendingApprovals.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No pending approvals.</p>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((appr) => (
                    <div key={appr.id} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-gray-800">{appr.stage}</p>
                      <p className="text-[11px] text-gray-500">Reviewer: {appr.reviewer}</p>
                      <p className="text-[11px] text-gray-400">Submitted: {formatDate(appr.submittedAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* 6. Recent Activity */}
          <Card>
            <CardHeader
              title="Recent Activity"
              icon={Activity}
              action={<NavLink label="View All" onClick={() => onNavigate('activity')} />}
            />
            <div className="p-4">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#064E86] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{item.label}</p>
                        <p className="text-[11px] text-gray-500 truncate">{item.detail}</p>
                        <p className="text-[11px] text-gray-400">{formatDate(item.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default PMProjectOverviewView;
