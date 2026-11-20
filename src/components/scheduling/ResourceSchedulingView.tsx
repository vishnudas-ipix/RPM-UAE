import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Download,
  Filter,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  History,
  ShieldCheck,
  ChevronRight,
  Split
} from 'lucide-react';
import { DutyScheduleSlot, Project, Manpower, UserRole } from '../../types';

interface ResourceSchedulingViewProps {
  dutySlots: DutyScheduleSlot[];
  projects: Project[];
  manpowerList: Manpower[];
  currentRole: UserRole;
  onAddSlot: (slot: Partial<DutyScheduleSlot>) => void;
  onOverrideSlot: (slotId: string, newHours: number, note: string) => void;
}

export const ResourceSchedulingView: React.FC<ResourceSchedulingViewProps> = ({
  dutySlots,
  projects,
  manpowerList,
  currentRole,
  onAddSlot,
  onOverrideSlot,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'scheduler' | 'eventRoster' | 'timesheet'>('scheduler');
  const [selectedProject, setSelectedProject] = useState<string>('prj-001');
  const [weekendConfig, setWeekendConfig] = useState<'Friday-Saturday' | 'Friday-Only'>('Friday-Saturday');
  
  // Override Modal State
  const [selectedSlotForOverride, setSelectedSlotForOverride] = useState<DutyScheduleSlot | null>(null);
  const [overrideHours, setOverrideHours] = useState(12);
  const [overrideReason, setOverrideReason] = useState('');
  
  // New Slot State
  const [newResource, setNewResource] = useState(manpowerList[0]?.id || '');
  const [newShiftType, setNewShiftType] = useState<DutyScheduleSlot['shiftType']>('12h Day');
  const [newDutyPattern, setNewDutyPattern] = useState<DutyScheduleSlot['dutyPattern']>('12 Hours – 7 Days/Week');
  const [newHours, setNewHours] = useState(12);
  const [newDate, setNewDate] = useState('2026-03-27');
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate Coverage
  const totalRequiredSlots = 16;
  const filledSlots = dutySlots.length;
  const coveragePct = Math.round((filledSlots / totalRequiredSlots) * 100);

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForOverride) return;
    onOverrideSlot(selectedSlotForOverride.id, overrideHours, overrideReason);
    setSelectedSlotForOverride(null);
    setOverrideReason('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = manpowerList.find(m => m.id === newResource);
    if (!staff) return;

    const slot: Partial<DutyScheduleSlot> = {
      projectId: selectedProject,
      resourceId: staff.id,
      resourceName: staff.name,
      role: staff.role,
      date: newDate,
      shiftType: newShiftType,
      dutyPattern: newDutyPattern,
      startHour: '07:00',
      endHour: '19:00',
      hoursWorked: newHours,
      allowanceAED: staff.allowanceAED ? Math.round(staff.allowanceAED / 20) : 150,
      isOverridden: false,
    };

    onAddSlot(slot);
    setShowAddModal(false);
  };

  const currentProjectObj = projects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Resource Scheduling & Timesheet Engine
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 5 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Working hours assignment (8h/6d, 8h/5d, 10h, 12h/7d, 24/7), UAE weekend policies, manual schedule overrides, and split timesheets for crew rotations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold pl-2">Weekend:</span>
            <button
              onClick={() => setWeekendConfig('Friday-Saturday')}
              className={`px-2 py-1 rounded font-medium ${weekendConfig === 'Friday-Saturday' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
            >
              Fri-Sat (Private)
            </button>
            <button
              onClick={() => setWeekendConfig('Friday-Only')}
              className={`px-2 py-1 rounded font-medium ${weekendConfig === 'Friday-Only' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'}`}
            >
              Fri-Only (Govt)
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Shift Hours</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Filled Shifts</span>
          <p className="text-xl font-black text-emerald-700 mt-0.5">{filledSlots}</p>
          <span className="text-[10px] text-emerald-600">Assigned crew members</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Vacant Slots</span>
          <p className="text-xl font-black text-amber-700 mt-0.5">{totalRequiredSlots - filledSlots}</p>
          <span className="text-[10px] text-amber-600">Open roster gaps</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Coverage Ratio</span>
          <p className="text-xl font-black text-rpm-navy-700 mt-0.5">{coveragePct}%</p>
          <span className="text-[10px] text-slate-400">Target: 100% 24/7 readiness</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Pending Swaps</span>
          <p className="text-xl font-black text-purple-700 mt-0.5">1</p>
          <span className="text-[10px] text-purple-600">GM Approval pending</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Timesheet Status</span>
          <p className="text-xl font-black text-slate-800 mt-0.5">Auto-Linked</p>
          <span className="text-[10px] text-emerald-600">Split crew change active</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('scheduler')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeSubTab === 'scheduler'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Daily Schedule & Shift Roster
        </button>
        <button
          onClick={() => setActiveSubTab('eventRoster')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeSubTab === 'eventRoster'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Event Duty Roster (Hour Matrix)
        </button>
        <button
          onClick={() => setActiveSubTab('timesheet')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeSubTab === 'timesheet'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Employee Timesheets & Payroll Export (9.7)
        </button>
      </div>

      {/* Tab 1: Daily Schedule Roster */}
      {activeSubTab === 'scheduler' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Project View:</span>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="text-xs font-semibold p-1.5 bg-slate-50 border border-slate-300 rounded"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.operatingEmirate})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Shift Policy: <strong className="text-slate-800">{currentProjectObj?.dutyScheduleType}</strong> ({currentProjectObj?.rotationCycleDays || 'Standard'} Days)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Resource & Role</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Duty Pattern</th>
                  <th className="py-3 px-3">Shift Timing</th>
                  <th className="py-3 px-3">Hours Logged</th>
                  <th className="py-3 px-3">Daily Allowance</th>
                  <th className="py-3 px-3">Override Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dutySlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{slot.resourceName}</span>
                      <span className="text-[10px] text-rpm-navy-700 font-semibold">{slot.role}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{slot.date}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium">{slot.dutyPattern}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {slot.startHour} – {slot.endHour} ({slot.shiftType})
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 font-mono">{slot.hoursWorked} hrs</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      AED {slot.allowanceAED}
                    </td>
                    <td className="py-3 px-3">
                      {slot.isOverridden ? (
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                          Overridden: {slot.overrideNote}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Standard Scheduled</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSlotForOverride(slot);
                          setOverrideHours(slot.hoursWorked);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs"
                      >
                        Override Shift →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Event Duty Roster Hour Matrix */}
      {activeSubTab === 'eventRoster' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 uppercase">
                Event Duty Roster — Hourly Assignment Matrix
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Hour-by-hour operational slot allocations for large events (e.g. Dubai World Cup 2026).
              </p>
            </div>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              High Risk Event Standby
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-100 p-2 font-bold text-[11px] text-slate-700 border-b border-slate-200">
                <div className="col-span-3">Role / Post</div>
                <div className="col-span-1 text-center">08:00</div>
                <div className="col-span-1 text-center">10:00</div>
                <div className="col-span-1 text-center">12:00</div>
                <div className="col-span-1 text-center">14:00</div>
                <div className="col-span-1 text-center">16:00</div>
                <div className="col-span-1 text-center">18:00</div>
                <div className="col-span-1 text-center">20:00</div>
                <div className="col-span-1 text-center">22:00</div>
                <div className="col-span-1 text-center">00:00</div>
              </div>

              {/* Roster Rows */}
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-12 p-2.5 items-center hover:bg-slate-50">
                  <div className="col-span-3">
                    <span className="font-bold text-slate-800 block">Dr. Ziyad Al-Farooq</span>
                    <span className="text-[10px] text-rpm-navy-700">Doctor (GP/ER) • Medical Pavilion</span>
                  </div>
                  <div className="col-span-9 grid grid-cols-9 gap-1 text-center">
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">On-Duty</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">On-Duty</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">On-Duty</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">On-Duty</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">On-Duty</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Peak</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Peak</span>
                    <span className="bg-slate-100 text-slate-400 py-1 rounded text-[10px]">Relief</span>
                    <span className="bg-slate-100 text-slate-400 py-1 rounded text-[10px]">Off</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 p-2.5 items-center hover:bg-slate-50">
                  <div className="col-span-3">
                    <span className="font-bold text-slate-800 block">Ahmed Kamal</span>
                    <span className="text-[10px] text-rpm-navy-700">Driver • AMB-UAE-003 ALS</span>
                  </div>
                  <div className="col-span-9 grid grid-cols-9 gap-1 text-center">
                    <span className="bg-slate-100 text-slate-400 py-1 rounded text-[10px]">Standby</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Patrol</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Patrol</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Patrol</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Gate Standby</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Gate Standby</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Track Standby</span>
                    <span className="bg-emerald-100 text-emerald-800 py-1 rounded text-[10px] font-bold">Track Standby</span>
                    <span className="bg-slate-100 text-slate-400 py-1 rounded text-[10px]">Post-Check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employee Timesheet & Payroll Export */}
      {activeSubTab === 'timesheet' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 uppercase">
                  Employee Timesheet Module (Section 9.7)
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Daily & Monthly Exports
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Auto-generated from scheduled shifts. Features split project records when staff are rotated mid-month to prevent scattered timesheets.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Exporting structured Excel (.xlsx) Daily Timesheet for HR...')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Daily (HR Format)</span>
              </button>
              <button
                onClick={() => alert('Exporting monthly consolidated Timesheet for Finance billing calculation...')}
                className="px-3 py-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white rounded font-bold text-xs flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Monthly (Finance Format)</span>
              </button>
            </div>
          </div>

          {/* Timesheet Split Note */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2 text-[11px] text-blue-900">
            <Split className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block">Automatic Mid-Month Crew Change Split:</span>
              <span>
                Staff member Tariq Al-Balooshi rotated from <em>Khalifa Port</em> to <em>ADNOC Offshore</em> on Feb 01. His timesheet reflects two distinct billable project segments with exact date ranges and allocated allowances.
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Project & Category</th>
                  <th className="py-3 px-3">Deployment Window</th>
                  <th className="py-3 px-3">Regular Hours</th>
                  <th className="py-3 px-3">Overtime Hours</th>
                  <th className="py-3 px-3">Allowance (AED)</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">Tariq Al-Balooshi</span>
                    <span className="font-mono text-[10px] text-slate-500">RPM-UAE-DRV-041</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">ADNOC Offshore Gas Fields</span>
                    <span className="text-[10px] text-amber-800 font-bold">ADNOC Category</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">01 Feb 2026 – 28 Feb 2026</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">224 hrs</td>
                  <td className="py-3 px-3 font-mono text-slate-600">16 hrs</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">AED 1,800</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Finance Approved
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">Fatima Al-Shehhi</span>
                    <span className="font-mono text-[10px] text-slate-500">RPM-UAE-NUR-112</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">ADNOC Offshore Gas Fields</span>
                    <span className="text-[10px] text-amber-800 font-bold">ADNOC Category</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">01 Feb 2026 – 28 Feb 2026</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">240 hrs</td>
                  <td className="py-3 px-3 font-mono text-slate-600">0 hrs</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700">AED 2,500</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Finance Approved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Override Modal */}
      {selectedSlotForOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold">Manual Schedule Override (Section 9.4)</h3>
                <span className="text-[10px] text-slate-300">{selectedSlotForOverride.resourceName}</span>
              </div>
              <button onClick={() => setSelectedSlotForOverride(null)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleOverrideSubmit} className="p-5 space-y-3 text-xs">
              <p className="text-slate-600 text-[11px]">
                Authorized for Ops Manager / Regional Manager. Validates certification and availability upon override with mandatory audit trail.
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Shift Hours Logged *</label>
                <input
                  type="number"
                  value={overrideHours}
                  onChange={(e) => setOverrideHours(Number(e.target.value))}
                  min={1}
                  max={24}
                  className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Override Reason *</label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Emergency standby extension, delayed relief chopper..."
                  className="w-full p-2 border border-slate-300 rounded h-20"
                  required
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlotForOverride(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Confirm Override & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold">Assign Resource Shift Hours</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Clinical Resource *</label>
                <select
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                >
                  {manpowerList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role}) — {m.availabilityStatus}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duty Pattern *</label>
                <select
                  value={newDutyPattern}
                  onChange={(e) => setNewDutyPattern(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded"
                >
                  <option value="12 Hours – 7 Days/Week">12 Hours – 7 Days/Week</option>
                  <option value="8 Hours – 6 Days/Week">8 Hours – 6 Days/Week (Standard UAE)</option>
                  <option value="8 Hours – 5 Days/Week">8 Hours – 5 Days/Week</option>
                  <option value="10 Hours">10 Hours Extended</option>
                  <option value="24/7 Duty">24/7 Continuous Duty</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift Type</label>
                  <select
                    value={newShiftType}
                    onChange={(e) => setNewShiftType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="12h Day">12h Day</option>
                    <option value="12h Night">12h Night</option>
                    <option value="Fixed (8h)">Fixed (8h)</option>
                    <option value="Flexible (10h)">Flexible (10h)</option>
                    <option value="Split">Split</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hours Logged</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    min={1}
                    max={24}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Save Shift to Timesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

