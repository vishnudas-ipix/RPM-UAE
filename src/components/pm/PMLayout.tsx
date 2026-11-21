import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Eye,
  GitBranch,
  CheckSquare,
  Users,
  Flag,
  CalendarDays,
  FileText,
  AlertTriangle,
  GitMerge,
  MessageSquare,
  FlaskConical,
  Rocket,
  BarChart3,
  Archive,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { PMView } from './pm.types';

interface PMLayoutProps {
  currentView: PMView;
  selectedProjectId: string | null;
  selectedProjectName: string | null;
  onNavigate: (view: PMView) => void;
  onBackToOps: () => void;
  pendingApprovalsCount: number;
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  view: PMView;
  icon: React.ElementType;
  accentRed?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const VIEW_LABELS: Record<PMView, string> = {
  dashboard: 'Dashboard',
  list: 'All Projects',
  create: 'New Project',
  overview: 'Overview',
  planning: 'Planning',
  tasks: 'Tasks',
  team: 'Team',
  milestones: 'Milestones',
  timeline: 'Timeline',
  documents: 'Documents',
  risks: 'Risks & Issues',
  communications: 'Communications',
  'qa-uat': 'QA & UAT',
  deployment: 'Deployment',
  reports: 'Reports',
  closure: 'Closure',
  activity: 'Activity Log',
  approvals: 'Approvals',
};

const PMLayout: React.FC<PMLayoutProps> = ({
  currentView,
  selectedProjectId,
  selectedProjectName,
  onNavigate,
  onBackToOps,
  pendingApprovalsCount,
  children,
}) => {
  const overviewSection: NavSection = {
    title: 'Overview',
    items: [
      { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
      { label: 'All Projects', view: 'list', icon: FolderOpen },
      { label: 'New Project', view: 'create', icon: Plus, accentRed: true },
    ],
  };

  const workspaceSection: NavSection = {
    title: 'Project Workspace',
    items: [
      { label: 'Overview', view: 'overview', icon: Eye },
      { label: 'Planning', view: 'planning', icon: GitBranch },
      { label: 'Tasks', view: 'tasks', icon: CheckSquare },
      { label: 'Team', view: 'team', icon: Users },
      { label: 'Milestones', view: 'milestones', icon: Flag },
      { label: 'Timeline', view: 'timeline', icon: CalendarDays },
      { label: 'Documents', view: 'documents', icon: FileText },
      { label: 'Risks & Issues', view: 'risks', icon: AlertTriangle },
      { label: 'Change Requests', view: 'risks', icon: GitMerge },
      { label: 'Communications', view: 'communications', icon: MessageSquare },
      { label: 'QA & UAT', view: 'qa-uat', icon: FlaskConical },
      { label: 'Deployment', view: 'deployment', icon: Rocket },
      { label: 'Reports', view: 'reports', icon: BarChart3 },
      { label: 'Closure', view: 'closure', icon: Archive },
      { label: 'Activity Log', view: 'activity', icon: Clock },
    ],
  };

  const adminSection: NavSection = {
    title: 'Administration',
    items: [
      { label: 'Approvals', view: 'approvals', icon: CheckCircle2 },
    ],
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = currentView === item.view;
    const Icon = item.icon;

    const baseClasses =
      'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer';

    const activeClasses = 'bg-blue-700 text-white';
    const inactiveClasses = item.accentRed
      ? 'text-red-400 hover:bg-slate-800 hover:text-red-300'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white';

    return (
      <button
        key={`${item.view}-${item.label}`}
        onClick={() => onNavigate(item.view)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        title={item.label}
      >
        <Icon size={15} className="shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.view === 'approvals' && pendingApprovalsCount > 0 && (
          <span className="ml-auto shrink-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {pendingApprovalsCount > 99 ? '99+' : pendingApprovalsCount}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (section: NavSection, show: boolean = true) => {
    if (!show) return null;
    return (
      <div key={section.title} className="mb-4">
        <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 select-none">
          {section.title}
        </p>
        <div className="space-y-0.5">{section.items.map(renderNavItem)}</div>
      </div>
    );
  };

  const viewLabel = VIEW_LABELS[currentView] ?? currentView;

  return (
    <div className="flex h-full">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-slate-900 flex flex-col overflow-y-auto">
        {/* Sidebar header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-semibold text-sm leading-tight">
              Project Management
            </span>
          </div>
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
            style={{ backgroundColor: '#064E86', color: '#ffffff' }}
          >
            RPM UAE
          </span>
        </div>

        {/* Back to Operations */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <button
            onClick={onBackToOps}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors duration-150 group w-full"
          >
            <ArrowLeft size={13} className="shrink-0 group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span>Back to Operations</span>
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-2 pt-1 pb-4 overflow-y-auto">
          {renderSection(overviewSection)}
          {renderSection(workspaceSection, selectedProjectId !== null)}
          {renderSection(adminSection)}
        </nav>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Breadcrumb bar */}
        <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">Project Management</span>
          <ChevronRight size={14} className="text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold">{viewLabel}</span>
          {selectedProjectId && selectedProjectName && (
            <>
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: '#064E86' }}
                />
                {selectedProjectName}
              </span>
            </>
          )}
        </div>

        {/* Content area */}
        <main className="flex-1 bg-slate-50 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PMLayout;
