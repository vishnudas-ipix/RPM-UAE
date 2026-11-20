import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Truck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  TrendingUp,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
  FileCheck
} from 'lucide-react';
import {
  Project,
  Manpower,
  Vehicle,
  ApprovalRequest,
  OperationalTask,
  Ticket,
  Emirate,
  UAEProjectCategory
} from '../../types';

interface OperationalDashboardProps {
  projects: Project[];
  manpower: Manpower[];
  vehicles: Vehicle[];
  approvals: ApprovalRequest[];
  tasks: OperationalTask[];
  tickets: Ticket[];
  selectedEmirate: Emirate | 'All';
  onNavigateTab: (tab: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenMRFModal: () => void;
  onOpenAmbulanceReqModal: () => void;
}

export const OperationalDashboard: React.FC<OperationalDashboardProps> = ({
  projects,
  manpower,
  vehicles,
  approvals,
  tasks,
  tickets,
  selectedEmirate,
  onNavigateTab,
  onOpenNewProjectModal,
  onOpenMRFModal,
  onOpenAmbulanceReqModal,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<UAEProjectCategory | 'All'>('All');
  const [timePeriod, setTimePeriod] = useState<'Current Month' | 'Previous Month' | 'Current Year'>('Current Month');

  // Filtered datasets based on topbar Emirate and Category Filter
  const filteredProjects = projects.filter((p) => {
    const matchEmirate = selectedEmirate === 'All' || p.operatingEmirate === selectedEmirate;
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchEmirate && matchCategory;
  });

  const filteredManpower = manpower.filter((m) => {
    return selectedEmirate === 'All' || m.emirate === selectedEmirate;
  });

  const filteredVehicles = vehicles.filter((v) => {
    return selectedEmirate === 'All' || v.emirate === selectedEmirate;
  });

  // KPIs
  const activeProjectsCount = filteredProjects.filter((p) => p.status === 'Active' && p.type === 'Project').length;
  const activeEventsCount = filteredProjects.filter((p) => p.status === 'Active' && p.type === 'Event').length;
  const pendingProjectsCount = filteredProjects.filter((p) =>
    ['Awaiting Management Review', 'Management Reviewing', 'Awaiting Client Document Submission', 'Pending Client Confirmation'].includes(p.status)
  ).length;
  const completedProjectsCount = filteredProjects.filter((p) => ['Demobilization Complete', 'Closed', 'Inactive'].includes(p.status)).length;

  // Manpower KPIs
  const totalStaff = filteredManpower.length;
  const allocatedStaff = filteredManpower.filter((m) => m.currentProjectId).length;
  const benchStaff = totalStaff - allocatedStaff;
  const staffOnLeave = filteredManpower.filter((m) => m.availabilityStatus === 'On Leave').length;
  const staffNoticePeriod = filteredManpower.filter((m) => m.isNoticePeriod).length;
  const staffUtilizationRate = totalStaff > 0 ? Math.round((allocatedStaff / totalStaff) * 100) : 0;

  // Fleet KPIs
  const totalVehicles = filteredVehicles.length;
  const allocatedVehicles = filteredVehicles.filter((v) => v.operationalStatus === 'Allocated').length;
  const maintenanceVehicles = filteredVehicles.filter((v) => v.operationalStatus === 'Under Maintenance').length;
  const nonCompliantVehicles = filteredVehicles.filter((v) => v.operationalStatus === 'Non-Compliant').length;
  const benchVehicles = totalVehicles - allocatedVehicles - maintenanceVehicles - nonCompliantVehicles;
  const fleetUtilizationRate = totalVehicles > 0 ? Math.round((allocatedVehicles / totalVehicles) * 100) : 0;

  // Compliance KPIs
  const expiredDocsCount = filteredVehicles.filter(v => v.operationalStatus === 'Non-Compliant').length +
    filteredManpower.filter(m => m.availabilityStatus === 'Not Eligible').length;
  const expiring30DaysCount = 4; // realistic demonstration value
  const overdueTasksCount = tasks.filter((t) => t.status === 'Overdue').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              RPM UAE Operational Intelligence
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pre-hospital deployment metrics across Abu Dhabi, Dubai, Sharjah, and Northern Emirates
          </p>
        </div>

        {/* Filters and Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="All">All UAE Categories</option>
              <option value="ADNOC">ADNOC (HSE & Offshore)</option>
              <option value="Government">Government / Semi-Govt</option>
              <option value="Private">Private Sector</option>
              <option value="Event">Event Standby</option>
            </select>
          </div>

          {/* Time Period Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Period:</span>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="Current Month">Current Month (March 2026)</option>
              <option value="Previous Month">Previous Month</option>
              <option value="Current Year">Current Year (2026)</option>
            </select>
          </div>

          {/* Create Project CTA */}
          <button
            onClick={onOpenNewProjectModal}
            className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Project / Event (BOQ)</span>
          </button>
        </div>
      </div>

      {/* KPI Section 1: Project & Event Analytics (Module 10.3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-rpm-navy-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Section 1 — Project & Event Analytics
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-semibold text-rpm-navy-600 hover:underline flex items-center space-x-1"
          >
            <span>View All Deployments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rpm-navy-300 transition-colors">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Active Projects</p>
            <p className="text-2xl font-black text-rpm-navy-700 mt-1">{activeProjectsCount}</p>
            <p className="text-[10px] text-emerald-600 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Includes ADNOC offshore units</span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rpm-navy-300 transition-colors">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Active Event Standbys</p>
            <p className="text-2xl font-black text-purple-700 mt-1">{activeEventsCount}</p>
            <p className="text-[10px] text-purple-600 mt-1">DWC 2026 & cultural standbys</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rpm-navy-300 transition-colors">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">New Initiated (Month)</p>
            <p className="text-2xl font-black text-blue-600 mt-1">3</p>
            <p className="text-[10px] text-slate-500 mt-1">Mandatory BOQ & Deliverables</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rpm-navy-300 transition-colors">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Pending Review / Confirmation</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingProjectsCount}</p>
            <p className="text-[10px] text-amber-700 mt-1 font-medium">Stage 3A / 3B Gates</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rpm-navy-300 transition-colors">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Demobilized / Closed</p>
            <p className="text-2xl font-black text-slate-700 mt-1">{completedProjectsCount}</p>
            <p className="text-[10px] text-slate-500 mt-1">Client Survey Triggered</p>
          </div>
        </div>
      </div>

      {/* KPI Section 2 & 3: Manpower & Fleet Utilization (Module 10.4 & 10.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manpower Utilization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-rpm-navy-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Manpower Utilization Analytics
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                {staffUtilizationRate}% Utilized
              </span>
              <button
                onClick={() => onNavigateTab('manpower')}
                className="text-xs text-rpm-navy-600 font-semibold hover:underline"
              >
                Roster →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Total Staff Pool</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{totalStaff}</p>
              <span className="text-[10px] text-slate-400">RPM Own + Vendor Staff</span>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
              <span className="text-[11px] text-emerald-800 font-medium">Allocated (Billable)</span>
              <p className="text-xl font-bold text-emerald-700 mt-0.5">{allocatedStaff}</p>
              <span className="text-[10px] text-emerald-600">On Active UAE Sites</span>
            </div>
            <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100">
              <span className="text-[11px] text-blue-800 font-medium">Bench / Standby</span>
              <p className="text-xl font-bold text-blue-700 mt-0.5">{benchStaff}</p>
              <span className="text-[10px] text-blue-600">Available for Deployment</span>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Staff Deployment Ratio</span>
              <span>{allocatedStaff} / {totalStaff} Clinical Crew</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${staffUtilizationRate}%` }}
                title={`Allocated: ${staffUtilizationRate}%`}
              ></div>
              <div
                className="bg-blue-400 h-full"
                style={{ width: `${100 - staffUtilizationRate}%` }}
                title="Bench"
              ></div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Notice Period: <strong className="text-amber-700">{staffNoticePeriod} staff</strong> (auto-moves to inactive)
            </span>
            <span className="text-slate-500">
              On Leave / Break: <strong className="text-slate-700">{staffOnLeave} staff</strong>
            </span>
            <button
              onClick={onOpenMRFModal}
              className="text-xs text-rpm-navy-600 hover:text-rpm-navy-800 font-bold flex items-center space-x-1"
            >
              <span>+ Raise MRF</span>
            </button>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-rpm-navy-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Fleet (Ambulance) Utilization
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-rpm-navy-50 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
                {fleetUtilizationRate}% Allocated
              </span>
              <button
                onClick={() => onNavigateTab('fleet')}
                className="text-xs text-rpm-navy-600 font-semibold hover:underline"
              >
                Fleet Pool →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 mb-4">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium">Total Ambulances</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{totalVehicles}</p>
              <span className="text-[9px] text-slate-400">ALS / BLS / ICU</span>
            </div>
            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-medium">Allocated</span>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">{allocatedVehicles}</p>
              <span className="text-[9px] text-emerald-600">On Site</span>
            </div>
            <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
              <span className="text-[10px] text-amber-800 font-medium">Maintenance</span>
              <p className="text-lg font-bold text-amber-700 mt-0.5">{maintenanceVehicles}</p>
              <span className="text-[9px] text-amber-600">EMC / Toyota</span>
            </div>
            <div className="bg-red-50/60 p-2.5 rounded-lg border border-red-100">
              <span className="text-[10px] text-red-800 font-medium">Non-Compliant</span>
              <p className="text-lg font-bold text-red-700 mt-0.5">{nonCompliantVehicles}</p>
              <span className="text-[9px] text-red-600">Mulkiya / ROP</span>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Ambulance Readiness</span>
              <span>{allocatedVehicles} Allocated • {benchVehicles} Ready Bench</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-rpm-navy-600 h-full"
                style={{ width: `${fleetUtilizationRate}%` }}
                title={`Allocated: ${fleetUtilizationRate}%`}
              ></div>
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${(benchVehicles / totalVehicles) * 100}%` }}
                title="Available Bench"
              ></div>
              <div
                className="bg-red-500 h-full"
                style={{ width: `${(nonCompliantVehicles / totalVehicles) * 100}%` }}
                title="Non-Compliant"
              ></div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              DOH Facility License: <strong className="text-emerald-700">Valid (#DOH-FAC-2024-9182)</strong>
            </span>
            <button
              onClick={onOpenAmbulanceReqModal}
              className="text-xs text-rpm-navy-600 hover:text-rpm-navy-800 font-bold flex items-center space-x-1"
            >
              <span>+ Request Ambulance</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Section 4: Compliance Alerts & 24h Lock Tracker (Module 10.6 & Module 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Alerts Radar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rpm-red" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Compliance Expiry Radar
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('compliance')}
              className="text-[11px] text-rpm-navy-600 font-bold hover:underline"
            >
              Doc Master →
            </button>
          </div>
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-900">Expired Documents</p>
                <p className="text-[11px] text-red-700">Blocked automatically from pool</p>
              </div>
              <span className="text-lg font-black text-red-700">{expiredDocsCount}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Expiring in 30 Days</p>
                <p className="text-[11px] text-amber-700">UAE Visa, Malpractice & ROP</p>
              </div>
              <span className="text-lg font-black text-amber-700">{expiring30DaysCount}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Overdue Operational Tasks</p>
                <p className="text-[11px] text-slate-500">Auto-flagged with notification</p>
              </div>
              <span className="text-lg font-black text-slate-700">{overdueTasksCount}</span>
            </div>
          </div>
        </div>

        {/* 24-Hour Approval Lock Monitor (Module 2.4) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                24h Lock Auto-Intimation
              </h3>
            </div>
            <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              Escalation Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Approvals must be processed within 24 hours. Failure triggers automatic intimation to GM & stakeholders.
          </p>
          <div className="space-y-2">
            {approvals.slice(0, 3).map((app) => (
              <div
                key={app.id}
                onClick={() => onNavigateTab('approvals')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-rpm-navy-400 cursor-pointer bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
                    {app.projectName}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    app.isEscalated ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {app.isEscalated ? 'ESCALATED' : `${Math.floor(app.lockTimerRemainingSeconds / 3600)}h left`}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{app.moduleType}</span>
                  <span>By: {app.requestedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inter-Department Ticket Queue (Module 13) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4 text-rpm-navy-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Service Request Streams (7)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('ticketing')}
              className="text-[11px] text-rpm-navy-600 font-bold hover:underline"
            >
              Hub →
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Dual hierarchy routing: Site Staff → TL → PL (Super Access) → OM/GM → Higher Management.
          </p>
          <div className="space-y-2">
            {tickets.slice(0, 3).map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => onNavigateTab('ticketing')}
                className="p-2 rounded-lg border border-slate-200 hover:border-rpm-navy-300 cursor-pointer bg-slate-50 text-xs transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate max-w-[180px]">
                    {tkt.title}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {tkt.assignedDepartment}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{tkt.stream}</span>
                  <span className="font-mono text-emerald-700">{tkt.currentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

