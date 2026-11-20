import React, { useState } from 'react';
import {
  Bell,
  Building2,
  ChevronDown,
  ShieldCheck,
  User,
  Clock,
  AlertTriangle,
  FileCheck2,
  Server,
  Layers,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { UserRole, Emirate, ApprovalRequest, Ticket } from '../../types';

interface TopbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedEmirate: Emirate | 'All';
  onEmirateChange: (emirate: Emirate | 'All') => void;
  pendingApprovals: ApprovalRequest[];
  tickets: Ticket[];
  onOpenApprovals: () => void;
  onOpenNotifications: () => void;
  onOpenSiteStaffView?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRole,
  onRoleChange,
  selectedEmirate,
  onEmirateChange,
  pendingApprovals,
  tickets,
  onOpenApprovals,
  onOpenNotifications,
  onOpenSiteStaffView,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const rolesList: UserRole[] = [
    'Corporate Admin',
    'Management',
    'Business Development (BD)',
    'Operations Team',
    'Operations Manager (OM)',
    'Project Lead (PL)',
    'Regional Manager',
    'Fleet Supervisor',
    'HR / Admin',
    'Dy Nurse / Nursing Supervisor',
    'Site Staff (Field User)',
    'QA Administrator',
  ];

  const urgentAlertsCount = pendingApprovals.filter(a => a.isEscalated || a.lockTimerRemainingSeconds < 18000).length;
  const slaBreachedTickets = tickets.filter(t => t.isSlaBreached).length;
  const totalBadgeCount = urgentAlertsCount + slaBreachedTickets + pendingApprovals.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-2.5 flex items-center justify-between">
        {/* Left: Branding & Entity Isolation Indicator */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <img
              src="/rpm-logo.png"
              alt="Response Plus Medical Services"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden lg:block pl-3 border-l border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rpm-navy-600 bg-rpm-navy-50 px-2 py-0.5 rounded border border-rpm-navy-200">
                  UAE Entity
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  OPMS Phase 1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                <Server className="w-3 h-3 text-emerald-600 inline" />
                <span>AWS UAE (me-central-1)</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">ADHICS & PDPL Isolated</span>
              </p>
            </div>
          </div>

          {/* UAE Emirate Filter */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 pl-2">Emirate:</span>
            {(['All', 'Abu Dhabi', 'Dubai', 'Sharjah', 'Northern Emirates'] as const).map((em) => (
              <button
                key={em}
                onClick={() => onEmirateChange(em)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedEmirate === em
                    ? 'bg-rpm-navy-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions, 24h Lock Warning, Notifications & Persona Switcher */}
        <div className="flex items-center space-x-4">
          {/* 24h Lock Timer Pill */}
          <button
            onClick={onOpenApprovals}
            className="hidden md:flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
            title="Approvals approaching or past the 24-hour lock window"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="font-semibold">24h Auto-Intimation:</span>
            <span className="bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-mono font-bold">
              {pendingApprovals.length} Pending
            </span>
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Operational Alerts"
            >
              <Bell className="w-5 h-5" />
              {totalBadgeCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rpm-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {totalBadgeCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-700">
                    UAE Operational Notifications
                  </span>
                  <span className="text-[11px] text-rpm-navy-600 font-semibold bg-rpm-navy-50 px-2 py-0.5 rounded">
                    Email Phase 1
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {pendingApprovals.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => {
                        setShowNotifMenu(false);
                        onOpenApprovals();
                      }}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-start space-x-2.5"
                    >
                      <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {req.moduleType}: {req.projectName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Timer: {Math.floor(req.lockTimerRemainingSeconds / 3600)}h remaining before GM escalation
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-start space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        DOH Facility License Verified
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Organization license #DOH-FAC-2024-9182 valid until Dec 2027.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      onOpenNotifications();
                    }}
                    className="text-xs text-rpm-navy-600 font-semibold hover:underline"
                  >
                    View All Compliance & Dispatch Alerts →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Persona / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2.5 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors text-left shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-rpm-navy-600 text-white flex items-center justify-center font-bold text-xs">
                {currentRole.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {currentRole}
                </span>
                <span className="block text-[10px] text-slate-500">
                  Role Simulation Switcher
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Switch Role View</p>
                  <p className="text-[11px] text-slate-500">
                    Tests RBAC, approval loops, and field staff credentials
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {rolesList.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-rpm-navy-50 ${
                        currentRole === role
                          ? 'font-bold text-rpm-navy-600 bg-rpm-navy-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rpm-navy-600"></span>
                      )}
                    </button>
                  ))}
                </div>
                {onOpenSiteStaffView && (
                  <div className="p-2 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenSiteStaffView();
                      }}
                      className="w-full py-1.5 px-3 bg-rpm-red text-white font-semibold rounded text-xs flex items-center justify-center space-x-1.5 hover:bg-rpm-red-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Field Site Staff Ticket Portal</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

