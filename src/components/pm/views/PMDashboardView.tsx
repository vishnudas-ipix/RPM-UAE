import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Bell,
  Activity,
  Flag,
  ShieldAlert,
  Layers,
  BarChart3,
  ChevronRight,
  Info,
  AlertCircle,
  CheckCheck,
  ArrowRight,
} from 'lucide-react';
import {
  PMState,
  PMView,
  PMProject,
  PMTask,
  PMMilestone,
  PMRisk,
  PMApproval,
  PMNotification,
} from '../pm.types';

// ─── Props ────────────────────────────────────────────────────

interface PMDashboardViewProps {
  state: PMState;
  onNavigate: (view: PMView) => void;
  onSelectProject: (id: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Status Badge ─────────────────────────────────────────────

function statusBadge(status: string): JSX.Element {
  const map: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-800',
    Planning: 'bg-violet-100 text-violet-800',
    'On Hold': 'bg-amber-100 text-amber-800',
    Completed: 'bg-slate-100 text-slate-700',
    Closed: 'bg-slate-200 text-slate-600',
    UAT: 'bg-blue-100 text-blue-800',
    Draft: 'bg-gray-100 text-gray-600',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Pending: 'bg-orange-100 text-orange-700',
    Clarification: 'bg-yellow-100 text-yellow-700',
    'Not Started': 'bg-gray-100 text-gray-500',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Under Review': 'bg-indigo-100 text-indigo-700',
    'Pending Review': 'bg-purple-100 text-purple-700',
    Delayed: 'bg-red-100 text-red-700',
    Backlog: 'bg-slate-100 text-slate-600',
    'To Do': 'bg-blue-50 text-blue-600',
    'Rework Required': 'bg-rose-100 text-rose-700',
    Open: 'bg-red-100 text-red-700',
    Escalated: 'bg-rose-200 text-rose-800',
    Mitigated: 'bg-teal-100 text-teal-700',
  };
  const cls = map[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

// ─── Health Dot ───────────────────────────────────────────────

function healthDot(health: string): JSX.Element {
  const map: Record<string, string> = {
    'On Track': 'bg-emerald-500',
    'At Risk': 'bg-amber-400',
    Critical: 'bg-red-500',
    'Not Started': 'bg-slate-300',
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${map[health] ?? 'bg-gray-300'}`} />
      <span className="text-xs text-slate-600">{health}</span>
    </span>
  );
}

// ─── Severity Badge ───────────────────────────────────────────

function severityBadge(severity: string): JSX.Element {
  const map: Record<string, string> = {
    Critical: 'bg-red-200 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[severity] ?? 'bg-gray-100 text-gray-600'}`}>
      {severity}
    </span>
  );
}

// ─── Notification Icon ────────────────────────────────────────

function notifIcon(type: string): JSX.Element {
  const iconCls = 'w-4 h-4';
  if (type.toLowerCase().includes('risk') || type.toLowerCase().includes('alert'))
    return <AlertTriangle className={`${iconCls} text-amber-500`} />;
  if (type.toLowerCase().includes('approv') || type.toLowerCase().includes('decision'))
    return <CheckCircle2 className={`${iconCls} text-emerald-500`} />;
  if (type.toLowerCase().includes('deadline') || type.toLowerCase().includes('due'))
    return <Clock className={`${iconCls} text-red-500`} />;
  if (type.toLowerCase().includes('info'))
    return <Info className={`${iconCls} text-blue-500`} />;
  return <Bell className={`${iconCls} text-slate-400`} />;
}

// ─── Milestone Status Badge ───────────────────────────────────

function milestoneBadge(status: string): JSX.Element {
  return statusBadge(status);
}

// ─── Main Component ───────────────────────────────────────────

export function PMDashboardView({ state, onNavigate, onSelectProject }: PMDashboardViewProps): JSX.Element {
  const [notificationsRead, setNotificationsRead] = useState(false);

  const { projects, tasks, milestones, risks, approvals, activityLogs, notifications } = state;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ── KPI calculations ──────────────────────────────────────
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const inPlanning = projects.filter(p => p.status === 'Planning').length;
  const onHold = projects.filter(p => p.status === 'On Hold').length;
  const completed = projects.filter(p => p.status === 'Completed' || p.status === 'Closed').length;
  const delayed = projects.filter(p => p.health === 'At Risk' || p.health === 'Critical').length;
  const pendingApprovals = approvals.filter(a => a.decision === 'Pending').length;

  // ── Health breakdown ──────────────────────────────────────
  const onTrackCount = projects.filter(p => p.health === 'On Track').length;
  const atRiskCount = projects.filter(p => p.health === 'At Risk').length;
  const criticalCount = projects.filter(p => p.health === 'Critical').length;

  // ── Task status distribution ──────────────────────────────
  const taskBacklog = tasks.filter(t => t.status === 'Backlog').length;
  const taskTodo = tasks.filter(t => t.status === 'To Do').length;
  const taskInProgress = tasks.filter(t => t.status === 'In Progress').length;
  const taskUnderReview = tasks.filter(t => t.status === 'Under Review').length;
  const taskCompleted = tasks.filter(t => t.status === 'Completed').length;
  const taskOverdue = tasks.filter(t => {
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today && t.status !== 'Completed' && t.status !== 'Cancelled';
  }).length;

  // ── Projects table (most recent 5) ────────────────────────
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // ── Upcoming milestones (not completed, sorted by planned date) ──
  const upcomingMilestones = [...milestones]
    .filter(m => m.status !== 'Completed')
    .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime())
    .slice(0, 6);

  // ── Project name lookup ───────────────────────────────────
  const projectNameById = Object.fromEntries(projects.map(p => [p.id, p.name]));
  const projectCodeById = Object.fromEntries(projects.map(p => [p.id, p.code]));

  // ── Open risks ────────────────────────────────────────────
  const openRisks = risks.filter(r => r.status === 'Open' || r.status === 'Escalated');

  // ── Notifications ─────────────────────────────────────────
  const unreadNotifs = notificationsRead
    ? []
    : notifications.filter(n => !n.isRead);

  // ── Recent activity ───────────────────────────────────────
  const recentActivity = [...activityLogs]
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
    .slice(0, 5);

  // ─────────────────────────────────────────────────────────
  // KPI Cards config
  // ─────────────────────────────────────────────────────────
  type KPICard = {
    label: string;
    value: number;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: JSX.Element;
    trend: 'up' | 'down' | 'neutral';
  };

  const kpiCards: KPICard[] = [
    {
      label: 'Total Projects',
      value: totalProjects,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: <FolderOpen className="w-6 h-6 text-blue-500" />,
      trend: 'neutral',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      trend: 'up',
    },
    {
      label: 'In Planning',
      value: inPlanning,
      color: 'text-violet-700',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      icon: <Layers className="w-6 h-6 text-violet-500" />,
      trend: 'neutral',
    },
    {
      label: 'On Hold',
      value: onHold,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      trend: 'neutral',
    },
    {
      label: 'Completed',
      value: completed,
      color: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      icon: <CheckCircle2 className="w-6 h-6 text-slate-500" />,
      trend: 'up',
    },
    {
      label: 'Delayed',
      value: delayed,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      trend: delayed > 0 ? 'down' : 'neutral',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: <CheckCheck className="w-6 h-6 text-orange-500" />,
      trend: pendingApprovals > 0 ? 'down' : 'neutral',
    },
  ];

  function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-300" />;
  }

  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-full">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-5 h-5 text-slate-500" />
            <h1 className="text-xl font-bold text-slate-800">Project Management Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500">
            RPM UAE &bull; OPMS &nbsp;·&nbsp;
            {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-2 bg-[#064E86] hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {kpiCards.slice(0, 4).map(card => (
          <div
            key={card.label}
            className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-4 flex items-center gap-3`}
          >
            <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">{card.icon}</div>
            <div className="min-w-0">
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-xs text-slate-500 leading-tight mt-0.5">{card.label}</div>
            </div>
            <div className="ml-auto">
              <TrendIcon trend={card.trend} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpiCards.slice(4).map(card => (
          <div
            key={card.label}
            className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-4 flex items-center gap-3`}
          >
            <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">{card.icon}</div>
            <div className="min-w-0">
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-xs text-slate-500 leading-tight mt-0.5">{card.label}</div>
            </div>
            <div className="ml-auto">
              <TrendIcon trend={card.trend} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Project Health Overview ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            Project Health Overview
          </h2>
          <span className="text-xs text-slate-400">{totalProjects} total project{totalProjects !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">{onTrackCount}</span>
            <span className="text-xs text-emerald-600">On Track</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-sm font-semibold text-amber-700">{atRiskCount}</span>
            <span className="text-xs text-amber-600">At Risk</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-700">{criticalCount}</span>
            <span className="text-xs text-red-600">Critical</span>
          </div>
          {totalProjects > 0 && (
            <div className="ml-auto flex items-center gap-1">
              {/* Health bar visualization */}
              <div className="flex h-3 w-40 rounded-full overflow-hidden bg-slate-100">
                {onTrackCount > 0 && (
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(onTrackCount / totalProjects) * 100}%` }}
                  />
                )}
                {atRiskCount > 0 && (
                  <div
                    className="bg-amber-400 h-full"
                    style={{ width: `${(atRiskCount / totalProjects) * 100}%` }}
                  />
                )}
                {criticalCount > 0 && (
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${(criticalCount / totalProjects) * 100}%` }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Projects Table ────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-slate-400" />
            Recent Projects
          </h2>
          <button
            onClick={() => onNavigate('list')}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-5 py-2.5 font-medium">Code</th>
                <th className="text-left px-3 py-2.5 font-medium">Project Name</th>
                <th className="text-left px-3 py-2.5 font-medium">PM</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="text-left px-3 py-2.5 font-medium">Health</th>
                <th className="text-left px-3 py-2.5 font-medium">Progress</th>
                <th className="text-left px-3 py-2.5 font-medium">Budget</th>
                <th className="text-left px-3 py-2.5 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-slate-400 py-8 text-sm">No projects yet</td>
                </tr>
              ) : (
                recentProjects.map(project => (
                  <tr
                    key={project.id}
                    onClick={() => { onSelectProject(project.id); onNavigate('overview'); }}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                        {project.code}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {project.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 text-xs">{project.projectManager}</td>
                    <td className="px-3 py-3">{statusBadge(project.status)}</td>
                    <td className="px-3 py-3">{healthDot(project.health)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-24">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{project.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">{formatCurrency(project.estimatedBudget)}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{formatDate(project.expectedEndDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Task Status Distribution ──────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
          Task Status Distribution
          <span className="ml-auto text-xs font-normal text-slate-400">{tasks.length} total tasks</span>
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'Backlog', count: taskBacklog, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
            { label: 'To Do', count: taskTodo, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            { label: 'In Progress', count: taskInProgress, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
            { label: 'Under Review', count: taskUnderReview, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
            { label: 'Completed', count: taskCompleted, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            { label: 'Overdue', count: taskOverdue, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
          ].map(item => (
            <div
              key={item.label}
              className={`${item.bg} border ${item.border} rounded-xl p-3 text-center`}
            >
              <div className={`text-2xl font-bold ${item.text}`}>{item.count}</div>
              <div className={`text-xs font-medium mt-0.5 ${item.text} opacity-80`}>{item.label}</div>
              {tasks.length > 0 && (
                <div className="mt-2 bg-white bg-opacity-60 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${item.text.replace('text-', 'bg-')}`}
                    style={{ width: `${(item.count / tasks.length) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-Column: Milestones + Activity ─────────────────── */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Flag className="w-4 h-4 text-slate-400" />
              Upcoming Milestones
            </h2>
            <button
              onClick={() => onNavigate('milestones')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingMilestones.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">No upcoming milestones</div>
            ) : (
              upcomingMilestones.map(ms => (
                <div key={ms.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{ms.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {projectNameById[ms.projectId] ?? ms.projectId}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {milestoneBadge(ms.status)}
                      <span className="text-xs text-slate-400">{formatDate(ms.plannedDate)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Recent Activity
            </h2>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">No activity yet</div>
            ) : (
              recentActivity.map(log => (
                <div key={log.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm text-slate-700">
                        <span className="font-medium text-slate-800">{log.performedBy}</span>
                        {' '}{log.action}{' '}
                        <span className="text-blue-600">{log.entity}</span>
                        {log.newValue && (
                          <span className="text-slate-500"> → <em>{log.newValue}</em></span>
                        )}
                      </div>
                      {log.remarks && (
                        <div className="text-xs text-slate-400 mt-0.5 truncate">{log.remarks}</div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{timeAgo(log.performedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── Open Risks + Notifications ────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Open Risks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Open Risks
              {openRisks.length > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {openRisks.length}
                </span>
              )}
            </h2>
            <button
              onClick={() => onNavigate('risks')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {openRisks.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                No open risks
              </div>
            ) : (
              openRisks.map(risk => (
                <div key={risk.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {severityBadge(risk.severity)}
                        <span className="text-xs text-slate-400">{statusBadge(risk.status)}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-800 truncate">{risk.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Owner: <span className="text-slate-600">{risk.owner}</span>
                        {' · '}
                        {projectCodeById[risk.projectId] ?? risk.projectId}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-400" />
              Notifications
              {unreadNotifs.length > 0 && (
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadNotifs.length}
                </span>
              )}
            </h2>
            {unreadNotifs.length > 0 && (
              <button
                onClick={() => setNotificationsRead(true)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {unreadNotifs.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 text-slate-200" />
                All caught up!
              </div>
            ) : (
              unreadNotifs.map(notif => (
                <div key={notif.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{notifIcon(notif.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-slate-700 leading-snug">{notif.message}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <span className="capitalize">{notif.type}</span>
                        <span>·</span>
                        <span>{timeAgo(notif.createdAt)}</span>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
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

export default PMDashboardView;
