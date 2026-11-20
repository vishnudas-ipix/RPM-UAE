import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  Truck,
  Users,
  CalendarDays,
  Building,
  CheckSquare,
  ShieldCheck,
  LifeBuoy,
  Database,
  FileText,
  BadgeAlert,
  Send,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

export type ActiveTab =
  | 'dashboard'
  | 'projects'
  | 'approvals'
  | 'fleet'
  | 'manpower'
  | 'scheduling'
  | 'clinics'
  | 'tasks'
  | 'compliance'
  | 'ticketing'
  | 'masterdata'
  | 'sitestaff';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  pendingApprovalsCount: number;
  openTicketsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  pendingApprovalsCount,
  openTicketsCount,
}) => {
  const isSiteStaffOnly = currentRole === 'Site Staff (Field User)';

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Operational Dashboard',
      sublabel: 'UAE Regional KPIs & Analytics',
      icon: LayoutDashboard,
      module: 'Module 10',
      hiddenForSiteStaff: true,
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Projects & Events',
      sublabel: 'BOQ, Doc Pack, Gates 3A & 3B',
      icon: Briefcase,
      module: 'Module 1',
      hiddenForSiteStaff: true,
    },
    {
      id: 'approvals' as ActiveTab,
      label: 'Approval Workflows',
      sublabel: '24h Intimation & Escalations',
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500',
      module: 'Module 2',
      hiddenForSiteStaff: true,
    },
    {
      id: 'fleet' as ActiveTab,
      label: 'Fleet Management',
      sublabel: 'Mulkiya, ROP, Bio-Medical Calib',
      icon: Truck,
      module: 'Module 3',
      hiddenForSiteStaff: true,
    },
    {
      id: 'manpower' as ActiveTab,
      label: 'Manpower Management',
      sublabel: 'DOH/DHA, Driver RAG, Crew Cycles',
      icon: Users,
      module: 'Module 4',
      hiddenForSiteStaff: true,
    },
    {
      id: 'scheduling' as ActiveTab,
      label: 'Scheduling & Timesheets',
      sublabel: 'Shifts, Duty Rosters & Payroll',
      icon: CalendarDays,
      module: 'Module 5',
      hiddenForSiteStaff: true,
    },
    {
      id: 'clinics' as ActiveTab,
      label: 'Clinic Allocation',
      sublabel: 'Type A/B/C, DOH QA Licensing',
      icon: Building,
      module: 'Module 6',
      hiddenForSiteStaff: true,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Operational Tasks',
      sublabel: 'Project & Field Assignments',
      icon: CheckSquare,
      module: 'Module 8',
      hiddenForSiteStaff: true,
    },
    {
      id: 'compliance' as ActiveTab,
      label: 'Compliance & Doc Master',
      sublabel: '30/60/90d Expiry & Company Master',
      icon: ShieldCheck,
      module: 'Module 9 & 13.7',
      hiddenForSiteStaff: true,
    },
    {
      id: 'ticketing' as ActiveTab,
      label: 'Inter-Dept Requests',
      sublabel: '7 Streams & Dual Routing',
      icon: LifeBuoy,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: 'bg-rpm-red',
      module: 'Module 13',
      hiddenForSiteStaff: false,
    },
    {
      id: 'masterdata' as ActiveTab,
      label: 'Master Data Onboarding',
      sublabel: 'UAE Categories, Vendors & Pools',
      icon: Database,
      module: 'Module 12',
      hiddenForSiteStaff: true,
    },
    {
      id: 'sitestaff' as ActiveTab,
      label: 'Site Staff Portal',
      sublabel: 'Project-Scoped Field Access',
      icon: Send,
      module: 'Field Access',
      hiddenForSiteStaff: false,
    },
  ];

  const visibleItems = isSiteStaffOnly
    ? navItems.filter((i) => !i.hiddenForSiteStaff)
    : navItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-[calc(100vh-61px)] border-r border-slate-800">
      {/* UAE Operational Context Pill */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            UAE Ops Scope
          </span>
          <span className="text-[10px] bg-rpm-navy-700 text-rpm-navy-100 font-semibold px-2 py-0.5 rounded">
            F7935WA26
          </span>
        </div>
        <p className="text-xs text-slate-300 font-medium mt-1">
          Response Plus Medical Services (UAE)
        </p>
        <p className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>DOH • ADOSH • MOHRE Enforced</span>
        </p>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-start space-x-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-rpm-navy-600 text-white font-semibold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-rpm-red'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-tight truncate">
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`${item.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`block text-[10px] truncate ${
                    isActive ? 'text-rpm-navy-100' : 'text-slate-400'
                  }`}
                >
                  {item.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Legal / Cloud Compliance Status Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>Regional Isolation:</span>
          <span className="font-bold text-white">UAE Only</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Data Residency:</span>
          <span className="text-emerald-400 font-medium">AWS UAE Region</span>
        </div>
        <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 text-center">
          RPM UAE Proprietary Platform © 2026
        </p>
      </div>
    </aside>
  );
};

