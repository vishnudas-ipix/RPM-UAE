import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  ArrowUpDown,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { PMProject, PMView, PMProjectStatus, PMProjectPriority, PMProjectHealth } from '../pm.types';

// ─── Props ────────────────────────────────────────────────────

interface PMProjectListViewProps {
  projects: PMProject[];
  onSelectProject: (id: string) => void;
  onNavigate: (view: PMView) => void;
}

// ─── Color Helpers ────────────────────────────────────────────

const STATUS_COLORS: Record<PMProjectStatus, string> = {
  'Draft':                'bg-gray-100 text-gray-700 border-gray-300',
  'Submitted':            'bg-blue-100 text-blue-700 border-blue-300',
  'Under Assessment':     'bg-indigo-100 text-indigo-700 border-indigo-300',
  'Clarification Required':'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Pending Approval':     'bg-orange-100 text-orange-700 border-orange-300',
  'Approved':             'bg-emerald-100 text-emerald-700 border-emerald-300',
  'Rejected':             'bg-red-100 text-red-700 border-red-300',
  'Planning':             'bg-violet-100 text-violet-700 border-violet-300',
  'Ready for Execution':  'bg-teal-100 text-teal-700 border-teal-300',
  'Active':               'bg-green-100 text-green-700 border-green-300',
  'On Hold':              'bg-amber-100 text-amber-700 border-amber-300',
  'Under Review':         'bg-cyan-100 text-cyan-700 border-cyan-300',
  'UAT':                  'bg-purple-100 text-purple-700 border-purple-300',
  'Ready for Deployment': 'bg-lime-100 text-lime-700 border-lime-300',
  'Deployed':             'bg-emerald-100 text-emerald-700 border-emerald-300',
  'Handover':             'bg-sky-100 text-sky-700 border-sky-300',
  'Pending Closure':      'bg-orange-100 text-orange-700 border-orange-300',
  'Completed':            'bg-green-100 text-green-700 border-green-300',
  'Closed':               'bg-slate-100 text-slate-700 border-slate-300',
  'Archived':             'bg-stone-100 text-stone-700 border-stone-300',
};

const PRIORITY_COLORS: Record<PMProjectPriority, string> = {
  'Critical': 'bg-red-100 text-red-700 border-red-300',
  'High':     'bg-orange-100 text-orange-700 border-orange-300',
  'Medium':   'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Low':      'bg-gray-100 text-gray-600 border-gray-300',
};

const HEALTH_DOT: Record<PMProjectHealth, string> = {
  'On Track':   'bg-green-500',
  'At Risk':    'bg-amber-500',
  'Critical':   'bg-red-500',
  'Not Started':'bg-slate-400',
};

const HEALTH_TEXT: Record<PMProjectHealth, string> = {
  'On Track':   'text-green-700',
  'At Risk':    'text-amber-700',
  'Critical':   'text-red-700',
  'Not Started':'text-slate-500',
};

const HEALTH_PILL: Record<PMProjectHealth, string> = {
  'On Track':   'bg-green-50 text-green-700 border border-green-200',
  'At Risk':    'bg-amber-50 text-amber-700 border border-amber-200',
  'Critical':   'bg-red-50 text-red-700 border border-red-200',
  'Not Started':'bg-slate-50 text-slate-600 border border-slate-200',
};

// AED formatter
const fmtAED = (n: number) =>
  'AED ' + n.toLocaleString('en-AE', { minimumFractionDigits: 0 });

// Date helpers
const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

const fmtDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── Component ────────────────────────────────────────────────

const PAGE_SIZE = 10;

const ALL_STATUSES: PMProjectStatus[] = [
  'Draft','Submitted','Under Assessment','Clarification Required',
  'Pending Approval','Approved','Rejected','Planning','Ready for Execution',
  'Active','On Hold','Under Review','UAT','Ready for Deployment',
  'Deployed','Handover','Pending Closure','Completed','Closed','Archived',
];

const ALL_PRIORITIES: PMProjectPriority[] = ['Critical','High','Medium','Low'];
const ALL_HEALTHS: PMProjectHealth[] = ['On Track','At Risk','Critical','Not Started'];

export const PMProjectListView: React.FC<PMProjectListViewProps> = ({
  projects,
  onSelectProject,
  onNavigate,
}) => {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<PMProjectStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<PMProjectPriority | ''>('');
  const [healthFilter, setHealthFilter]   = useState<PMProjectHealth | ''>('');
  const [deptFilter, setDeptFilter]       = useState('');
  const [page, setPage]               = useState(1);

  // Collect unique departments from data
  const departments = useMemo(() => {
    const depts = Array.from(new Set(projects.map(p => p.department).filter(Boolean)));
    return depts.sort();
  }, [projects]);

  // Health summary counts (over ALL projects, not filtered)
  const healthCounts = useMemo(() => {
    const counts: Partial<Record<PMProjectHealth, number>> = {};
    for (const p of projects) {
      counts[p.health] = (counts[p.health] ?? 0) + 1;
    }
    return counts;
  }, [projects]);

  // Filtered projects
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter(p => {
      if (q && ![p.name, p.code, p.client, p.projectManager]
        .some(f => f.toLowerCase().includes(q))) return false;
      if (statusFilter   && p.status   !== statusFilter)   return false;
      if (priorityFilter && p.priority !== priorityFilter) return false;
      if (healthFilter   && p.health   !== healthFilter)   return false;
      if (deptFilter     && p.department !== deptFilter)   return false;
      return true;
    });
  }, [projects, search, statusFilter, priorityFilter, healthFilter, deptFilter]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageEnd    = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pageItems  = filtered.slice(pageStart, pageEnd);

  const handleOpen = (project: PMProject) => {
    onSelectProject(project.id);
    onNavigate('overview');
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setter(e.target.value as any);
      setPage(1);
    };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-0">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-blue-700" />
            <h1 className="text-xl font-semibold text-gray-900">All Projects</h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
              {projects.length}
            </span>
          </div>
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2 bg-[#064E86] hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* ── Health Summary Strip ─────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <span className="text-xs font-medium text-gray-500 mr-1">Health:</span>
        {ALL_HEALTHS.map(h => (
          healthCounts[h] !== undefined ? (
            <button
              key={h}
              onClick={() => {
                setHealthFilter(prev => prev === h ? '' : h);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                healthFilter === h
                  ? HEALTH_PILL[h] + ' ring-2 ring-offset-1 ring-current'
                  : HEALTH_PILL[h] + ' opacity-80 hover:opacity-100'
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full ${HEALTH_DOT[h]}`} />
              {h}
              <span className="ml-0.5 font-bold">{healthCounts[h]}</span>
            </button>
          ) : null
        ))}
        {(search || statusFilter || priorityFilter || healthFilter || deptFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); setHealthFilter(''); setDeptFilter(''); setPage(1); }}
            className="ml-auto text-xs text-red-600 hover:text-red-800 font-medium underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, code, client, PM…"
            value={search}
            onChange={handleFilterChange(setSearch)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={handleFilterChange(setPriorityFilter)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          {ALL_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Health filter */}
        <select
          value={healthFilter}
          onChange={handleFilterChange(setHealthFilter)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Health</option>
          {ALL_HEALTHS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        {/* Department filter */}
        {departments.length > 0 && (
          <select
            value={deptFilter}
            onChange={handleFilterChange(setDeptFilter)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}

        <span className="ml-auto text-xs text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table Area ───────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No projects found</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {projects.length === 0
                ? 'Start by creating your first project.'
                : 'Try adjusting your filters or search term.'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => onNavigate('create')}
                className="mt-5 flex items-center gap-2 bg-[#064E86] hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  <div className="flex items-center gap-1">Code <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">PM</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Type / Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Health</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[110px]">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Due Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageItems.map((project, idx) => {
                const overdue = isOverdue(project.expectedEndDate) &&
                  !['Completed','Closed','Archived','Deployed'].includes(project.status);
                return (
                  <tr
                    key={project.id}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
                    onClick={() => handleOpen(project)}
                  >
                    {/* Code */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={e => { e.stopPropagation(); handleOpen(project); }}
                        className="font-mono text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
                      >
                        {project.code}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </button>
                    </td>

                    {/* Project Name */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="font-semibold text-gray-900 truncate leading-tight">{project.name}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">{project.client}</div>
                    </td>

                    {/* PM */}
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{project.projectManager}</td>

                    {/* Type & Category */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100 font-medium leading-tight">
                          {project.type}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700 border border-purple-100 font-medium leading-tight">
                          {project.category}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_COLORS[project.priority]}`}>
                        {project.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[project.status]}`}>
                        {project.status}
                      </span>
                    </td>

                    {/* Health */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${HEALTH_DOT[project.health]}`} />
                        <span className={`text-xs font-medium ${HEALTH_TEXT[project.health]}`}>{project.health}</span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden min-w-[60px]">
                          <div
                            className={`h-full rounded-full transition-all ${
                              project.progressPercent >= 90 ? 'bg-green-500' :
                              project.progressPercent >= 60 ? 'bg-blue-500' :
                              project.progressPercent >= 30 ? 'bg-amber-500' : 'bg-red-400'
                            }`}
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-8 text-right tabular-nums">
                          {project.progressPercent}%
                        </span>
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-xs tabular-nums">
                      {fmtAED(project.estimatedBudget)}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-gray-600'}`}>
                        {fmtDate(project.expectedEndDate)}
                        {overdue && (
                          <span className="ml-1 text-red-500 font-bold" title="Overdue">●</span>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpen(project)}
                        className="text-xs font-medium text-blue-700 hover:text-white hover:bg-blue-700 border border-blue-300 hover:border-blue-700 px-3 py-1 rounded-lg transition-colors"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold">{pageStart + 1}</span>–<span className="font-semibold">{pageEnd}</span> of{' '}
            <span className="font-semibold">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons (max 5 shown) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .reduce<(number | '...')[]>((acc, n, i, arr) => {
                if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((item, i) =>
                item === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm select-none">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`w-8 h-8 text-sm rounded-lg border transition-colors font-medium ${
                      safePage === item
                        ? 'bg-[#064E86] text-white border-[#064E86]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMProjectListView;
