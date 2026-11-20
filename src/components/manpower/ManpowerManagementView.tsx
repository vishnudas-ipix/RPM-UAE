import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Award,
  AlertOctagon,
  ArrowRightLeft,
  UserX,
  FileCheck2,
  History,
  Building
} from 'lucide-react';
import {
  Manpower,
  Emirate,
  ClinicalRole,
  ManpowerSourceType,
  RAGStatus,
  WarningLevel,
  AvailabilityStatus,
  UserRole
} from '../../types';

interface ManpowerManagementViewProps {
  manpowerList: Manpower[];
  selectedEmirate: Emirate | 'All';
  currentRole: UserRole;
  onAddManpower: (newStaff: Partial<Manpower>) => void;
  onRequestSwap: (manpowerId: string, targetProjectId: string, reason: string) => void;
  onRecordIncident: (manpowerId: string, incident: any) => void;
}

export const ManpowerManagementView: React.FC<ManpowerManagementViewProps> = ({
  manpowerList,
  selectedEmirate,
  currentRole,
  onAddManpower,
  onRequestSwap,
  onRecordIncident,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [ragFilter, setRagFilter] = useState<string>('All');
  const [selectedStaff, setSelectedStaff] = useState<Manpower | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Swap State
  const [swapTargetProject, setSwapTargetProject] = useState('prj-003');
  const [swapReason, setSwapReason] = useState('');

  // Incident & Warning State
  const [incidentType, setIncidentType] = useState<'Accident' | 'Warning Sign Violation' | 'Warning Letter' | 'Incident Report'>('Warning Sign Violation');
  const [warningLevel, setWarningLevel] = useState<WarningLevel>('Verbal & Written Warning');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [blackPoints, setBlackPoints] = useState(2);
  const [validityDate, setValidityDate] = useState('2026-09-30');

  // New Manpower Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<ClinicalRole>('Nurse');
  const [newSourceType, setNewSourceType] = useState<ManpowerSourceType>('RPM Own Employee');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newEmirate, setNewEmirate] = useState<Emirate>('Abu Dhabi');
  const [newEmiratesId, setNewEmiratesId] = useState('784-1992-1192834-1');
  const [newEmiratesIdExp, setNewEmiratesIdExp] = useState('2028-04-15');
  const [newVisaNo, setNewVisaNo] = useState('201/2024/8819273');
  const [newVisaExp, setNewVisaExp] = useState('2028-04-10');
  const [newPassportNo, setNewPassportNo] = useState('T9918234');
  const [newAuthority, setNewAuthority] = useState<'DOH' | 'DHA' | 'MOHAP'>('DOH');
  const [newLicenseNo, setNewLicenseNo] = useState('DOH-RN-2026-1182');
  const [newLicenseExp, setNewLicenseExp] = useState('2027-10-20');
  const [newScope, setNewScope] = useState('FAP / GP CLINIC');
  const [newBlsProvider, setNewBlsProvider] = useState('Cleveland Clinic Abu Dhabi (DOH Approved)');
  const [newAdnocEligible, setNewAdnocEligible] = useState(true);

  const filteredStaff = manpowerList.filter((m) => {
    const matchEmirate = selectedEmirate === 'All' || m.emirate === selectedEmirate;
    const matchRole = roleFilter === 'All' || m.role === roleFilter;
    const matchAvail = availabilityFilter === 'All' || m.availabilityStatus === availabilityFilter;
    const matchRag = ragFilter === 'All' || m.ragStatus === ragFilter;
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.rpmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.emiratesIdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.currentProjectName && m.currentProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchEmirate && matchRole && matchAvail && matchRag;
  });

  const getRagBadge = (rag: RAGStatus) => {
    switch (rag) {
      case 'Green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Red':
        return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    }
  };

  const getAvailBadge = (st: AvailabilityStatus) => {
    switch (st) {
      case 'Eligible & Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Eligible but Unavailable':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Not Eligible':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'On Leave':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Notice Period':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: Partial<Manpower> = {
      rpmId: `RPM-UAE-${newRole.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      role: newRole,
      sourceType: newSourceType,
      companyName: newSourceType === 'Manpower Company Staff' ? newCompanyName : undefined,
      emirate: newEmirate,
      availabilityStatus: 'Eligible & Available',
      adnocEligible: newAdnocEligible,
      isNoticePeriod: false,
      emiratesIdNo: newEmiratesId,
      emiratesIdExpiry: newEmiratesIdExp,
      uaeVisaNo: newVisaNo,
      uaeVisaExpiry: newVisaExp,
      passportNo: newPassportNo,
      passportExpiry: '2030-01-01',
      healthInsuranceNo: 'DAMAN-UAE-2026',
      healthInsuranceExpiry: '2027-12-31',
      healthAuthorityType: newAuthority,
      healthAuthorityLicenseNo: newLicenseNo,
      healthAuthorityLicenseExpiry: newLicenseExp,
      licenseScopeOfPractice: newScope,
      blsProvider: newBlsProvider,
      blsExpiry: '2027-08-15',
      ragStatus: 'Green',
      accidentCount: 0,
      warningSignViolations: 0,
      warningLettersCount: 0,
      totalBlackPoints: 0,
      warningHistory: [],
      totalCrewChangesLast12Months: 0,
      crewChangeHistory: [],
    };

    onAddManpower(newStaff);
    setShowAddModal(false);
  };

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    onRequestSwap(selectedStaff.id, swapTargetProject, swapReason);
    setShowSwapModal(false);
    setSwapReason('');
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    const incident = {
      id: `inc-${Date.now()}`,
      manpowerId: selectedStaff.id,
      incidentType,
      warningLevel,
      validityEndDate: validityDate,
      incidentDate: new Date().toISOString().split('T')[0],
      description: incidentDesc,
      blackPoints,
      documentPath: `/docs/warnings/${selectedStaff.rpmId}_Warning.pdf`,
      recordedBy: `${currentRole}`,
      createdAt: new Date().toISOString(),
    };
    onRecordIncident(selectedStaff.id, incident);
    setShowIncidentModal(false);
    setIncidentDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Manpower & Clinical Resource Management
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 4 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governs Emirates ID, UAE Residence Visa, DOH/DHA/MOHAP licenses, Driver RAG performance (Red/Amber/Yellow/Green), 4-level warnings, and crew change rotation tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Employee (UAE Compliance)</span>
        </button>
      </div>

      {/* Notice & Scope Callout: No Locum Staff in UAE */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-white block">
              UAE Manpower Scope Enforced: RPM Own Employee & Manpower Company Staff Only
            </span>
            <span className="text-slate-300 text-[11px]">
              *Locum Staff category is strictly NOT applicable for RPM UAE operations. EVOS replaced by UAE Defensive Driving Certificate.
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 whitespace-nowrap">
          DOH circulars enforced
        </span>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, RPM ID, Emirates ID, project..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rpm-navy-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Clinical Roles</option>
              <option value="Driver">Ambulance Driver</option>
              <option value="Nurse">Registered Nurse (RN)</option>
              <option value="Paramedic">Paramedic (ALS)</option>
              <option value="Doctor (GP/ER)">Doctor (GP/ER)</option>
              <option value="EMT">EMT Emergency Tech</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Availability:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Availabilities</option>
              <option value="Eligible & Available">Eligible & Available</option>
              <option value="Eligible but Unavailable">Eligible but Unavailable (Deployed)</option>
              <option value="Not Eligible">Not Eligible (Compliance Issue)</option>
              <option value="Notice Period">Notice Period (Serving)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">RAG:</span>
            <select
              value={ragFilter}
              onChange={(e) => setRagFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All RAG Statuses</option>
              <option value="Green">Green (No incidents)</option>
              <option value="Amber">Amber (1-2 incidents)</option>
              <option value="Yellow">Yellow (3-5 incidents)</option>
              <option value="Red">Red (6+ incidents / Blocked)</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredStaff.length}</strong> personnel records
        </span>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">RPM ID & Name</th>
                <th className="py-3 px-3">Role & Source</th>
                <th className="py-3 px-3">UAE ID & Expiry</th>
                <th className="py-3 px-3">DOH/DHA Authority</th>
                <th className="py-3 px-3">RAG & Black Points</th>
                <th className="py-3 px-3">Availability Status</th>
                <th className="py-3 px-3">Active Deployment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    staff.isNoticePeriod ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-rpm-navy-700 block">
                      {staff.rpmId}
                    </span>
                    <span className="font-bold text-slate-900 block text-xs">{staff.name}</span>
                    {staff.isNoticePeriod && (
                      <span className="inline-block mt-0.5 text-[9px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-bold">
                        Notice Ends: {staff.noticePeriodEndDate}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800 block">{staff.role}</span>
                    <span className="text-[10px] text-slate-500">
                      {staff.sourceType} {staff.companyName ? `(${staff.companyName})` : ''}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="font-mono text-slate-800 block">{staff.emiratesIdNo}</span>
                      <span className="text-[10px] text-slate-500">Exp: {staff.emiratesIdExpiry}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    {staff.healthAuthorityLicenseNo ? (
                      <div>
                        <span className="inline-block text-[10px] bg-rpm-navy-50 text-rpm-navy-800 font-bold px-1.5 py-0.2 rounded border border-rpm-navy-200">
                          {staff.healthAuthorityType}: {staff.healthAuthorityLicenseNo}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Exp: {staff.healthAuthorityLicenseExpiry}
                        </span>
                      </div>
                    ) : staff.uaeDrivingLicenseNo ? (
                      <div>
                        <span className="inline-block text-[10px] bg-slate-100 text-slate-800 font-bold px-1.5 py-0.2 rounded border border-slate-200">
                          DL: {staff.uaeDrivingLicenseNo}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Defensive Driving ✓
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Support Staff</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRagBadge(staff.ragStatus)}`}>
                        {staff.ragStatus}
                      </span>
                      {staff.totalBlackPoints > 0 && (
                        <span className="text-[10px] font-mono text-red-700 font-bold">
                          {staff.totalBlackPoints} pts
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getAvailBadge(staff.availabilityStatus)}`}>
                      {staff.availabilityStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {staff.currentProjectName ? (
                      <span className="font-semibold text-slate-800 block truncate max-w-[150px]">
                        {staff.currentProjectName}
                      </span>
                    ) : (
                      <span className="text-blue-700 font-medium">Ready in Bench Pool</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedStaff(staff)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                    >
                      Profile & RAG →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Profile & RAG Details Drawer (Section 8.13 & 8.14) */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-rpm-red bg-white px-2 py-0.5 rounded">
                    {selectedStaff.rpmId}
                  </span>
                  <h3 className="text-sm font-bold text-white">{selectedStaff.name}</h3>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedStaff.role} • {selectedStaff.emirate} • {selectedStaff.sourceType}
                </p>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-white hover:text-slate-300 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* RAG Performance Card (Section 8.13) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                      Staff Performance Profile & RAG Rating (8.13)
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      4-Level Warning System: Verbal, Verbal & Written, Written, Mercy
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getRagBadge(selectedStaff.ragStatus)}`}>
                    RAG: {selectedStaff.ragStatus}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Accidents</span>
                    <span className="text-base font-black text-slate-900">{selectedStaff.accidentCount}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Sign Violations</span>
                    <span className="text-base font-black text-slate-900">{selectedStaff.warningSignViolations}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Warning Letters</span>
                    <span className="text-base font-black text-slate-900">{selectedStaff.warningLettersCount}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Black Points</span>
                    <span className="text-base font-black text-red-700">{selectedStaff.totalBlackPoints}</span>
                  </div>
                </div>

                {selectedStaff.performanceNotes && (
                  <p className="text-slate-600 italic bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                    "{selectedStaff.performanceNotes}"
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowIncidentModal(true)}
                    className="px-3 py-1.5 bg-rpm-red hover:bg-rpm-red-600 text-white rounded font-bold text-xs flex items-center space-x-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Record Warning / Incident (Site Visit)</span>
                  </button>
                </div>
              </div>

              {/* Warning & Incident History */}
              {selectedStaff.warningHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                    Warning History & HR Attachments ({selectedStaff.warningHistory.length})
                  </h4>
                  {selectedStaff.warningHistory.map((w) => (
                    <div key={w.id} className="p-3 bg-red-50/50 rounded-lg border border-red-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-900">{w.incidentType} — {w.warningLevel}</span>
                        <span className="text-[10px] font-mono text-slate-500">{w.incidentDate}</span>
                      </div>
                      <p className="text-slate-700 text-[11px]">{w.description}</p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>Validity ends: <strong>{w.validityEndDate}</strong> • Black points: +{w.blackPoints}</span>
                        <span className="text-rpm-navy-600 font-bold hover:underline cursor-pointer">
                          View Warning Document PDF ↗
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Crew Change Frequency & Pattern Tracking (Section 8.14) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                      Crew Change Frequency & Rotation Tracking (8.14)
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Total moves in last 12 months: <strong>{selectedStaff.totalCrewChangesLast12Months}</strong>
                    </span>
                  </div>
                  {selectedStaff.nextRotationDueDate && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                      Next Rotation: {selectedStaff.nextRotationDueDate}
                    </span>
                  )}
                </div>

                {selectedStaff.crewChangeHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStaff.crewChangeHistory.map((c) => (
                      <div key={c.id} className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-800">{c.fromProjectName} → {c.toProjectName}</span>
                          <span className="font-mono text-slate-500">{c.changeDate}</span>
                        </div>
                        <p className="text-slate-600">{c.reason}</p>
                        <p className="text-emerald-700 font-medium text-[10px]">{c.hoursSplitImpact}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">No recent rotation movements recorded.</p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="px-3 py-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white rounded font-bold text-xs flex items-center space-x-1"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Initiate Manpower Swap Request (GM Approval)</span>
                  </button>
                </div>
              </div>

              {/* UAE Compliance Documents */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                  UAE Mandatory Identification & Licensing
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Emirates ID (2-Yr Cycle)</span>
                    <span className="font-mono font-bold text-slate-800">{selectedStaff.emiratesIdNo}</span>
                    <span className="text-[10px] text-slate-500 block">Exp: {selectedStaff.emiratesIdExpiry}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">UAE Residence Visa</span>
                    <span className="font-mono font-bold text-slate-800">{selectedStaff.uaeVisaNo}</span>
                    <span className="text-[10px] text-slate-500 block">Exp: {selectedStaff.uaeVisaExpiry}</span>
                  </div>
                  {selectedStaff.healthAuthorityLicenseNo && (
                    <div className="p-2.5 bg-white rounded border border-slate-200 col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {selectedStaff.healthAuthorityType} License & Scope
                      </span>
                      <span className="font-bold text-rpm-navy-700">{selectedStaff.healthAuthorityLicenseNo} (Exp: {selectedStaff.healthAuthorityLicenseExpiry})</span>
                      <span className="text-[10px] text-slate-600 block mt-0.5">Scope: {selectedStaff.licenseScopeOfPractice}</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">BLS Provider: {selectedStaff.blsProvider}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Warning Modal (4-Level Warning Mechanism) */}
      {showIncidentModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold">Record Performance Observation (Site Visit)</h3>
                <span className="text-[10px] text-slate-300 font-mono">{selectedStaff.name} ({selectedStaff.rpmId})</span>
              </div>
              <button onClick={() => setShowIncidentModal(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleIncidentSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Type *</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                >
                  <option value="Warning Sign Violation">Warning Sign / Speed Violation</option>
                  <option value="Accident">Accident / Vehicle Damage</option>
                  <option value="Warning Letter">Formal HR Warning Letter</option>
                  <option value="Incident Report">Clinical / Ground Incident Report</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">4-Level Warning Mechanism (Section 8.13.1) *</label>
                <select
                  value={warningLevel}
                  onChange={(e) => setWarningLevel(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-rpm-red"
                >
                  <option value="Verbal Warning">(1) Verbal Warning</option>
                  <option value="Verbal & Written Warning">(2) Verbal & Written Warning</option>
                  <option value="Written Warning">(3) Written Warning (Defined Validity)</option>
                  <option value="Mercy Warning">(4) Mercy Warning (Strict Final Validity)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Black Points Added</label>
                  <input
                    type="number"
                    value={blackPoints}
                    onChange={(e) => setBlackPoints(Number(e.target.value))}
                    min={0}
                    max={24}
                    className="w-full p-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warning Validity End</label>
                  <input
                    type="date"
                    value={validityDate}
                    onChange={(e) => setValidityDate(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Description & Observation Notes *</label>
                <textarea
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="Detail observations made during site audit..."
                  className="w-full p-2 border border-slate-300 rounded h-20"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-red hover:bg-rpm-red-600 text-white font-bold rounded"
                >
                  Commit Warning to Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Swap Request Modal */}
      {showSwapModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold">Initiate Manpower Swap Request</h3>
              <button onClick={() => setShowSwapModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleSwapSubmit} className="p-5 space-y-3 text-xs">
              <p className="text-slate-600 text-[11px]">
                Swap requests require General Manager approval before confirmation. System validates incoming resource compliance.
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Project *</label>
                <select
                  value={swapTargetProject}
                  onChange={(e) => setSwapTargetProject(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                >
                  <option value="prj-003">Abu Dhabi Ports Khalifa Terminal Health Center</option>
                  <option value="prj-004">Al Maryah Financial Free Zone Medical Station</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Swap Justification / Reason *</label>
                <textarea
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  placeholder="Operational need, client request, rotation schedule..."
                  className="w-full p-2 border border-slate-300 rounded h-20"
                  required
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Submit Swap for GM Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Onboard Employee (UAE Manpower Master)</h3>
                <p className="text-xs text-slate-300">Mandatory Emirates ID, UAE Visa & DOH/DHA licensing</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (As on Passport) *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Khalid Al-Shamsi"
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Role / Position *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  >
                    <option value="Nurse">Nurse (Registered Nurse RN)</option>
                    <option value="Paramedic">Paramedic (Advanced Life Support)</option>
                    <option value="Doctor (GP/ER)">Doctor (General Practitioner / ER)</option>
                    <option value="Driver">Ambulance Driver</option>
                    <option value="EMT">Emergency Medical Technician (EMT)</option>
                    <option value="Lab Tech">Lab Technician</option>
                    <option value="X-ray Tech">X-Ray Technician</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Type (No Locum) *</label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded font-medium"
                  >
                    <option value="RPM Own Employee">RPM Own Employee</option>
                    <option value="Manpower Company Staff">Manpower Supply Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Operational Emirate *</label>
                  <select
                    value={newEmirate}
                    onChange={(e) => setNewEmirate(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Northern Emirates">Northern Emirates</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ADNOC HSE Eligible</label>
                  <div className="pt-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newAdnocEligible}
                      onChange={(e) => setNewAdnocEligible(e.target.checked)}
                      className="rounded text-rpm-navy-600"
                    />
                    <span className="font-semibold text-slate-700">H2S & Induction</span>
                  </div>
                </div>
              </div>

              {newSourceType === 'Manpower Company Staff' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manpower Supply Company Name *</label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. Al Sahel Logistics & Staffing LLC"
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
              )}

              {/* UAE Identification Section */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase block text-[10px]">
                  UAE Resident Identification (2-Year Tracking):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Emirates ID No. *</label>
                    <input
                      type="text"
                      value={newEmiratesId}
                      onChange={(e) => setNewEmiratesId(e.target.value)}
                      placeholder="784-XXXX-XXXXXXX-X"
                      className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Emirates ID Expiry *</label>
                    <input
                      type="date"
                      value={newEmiratesIdExp}
                      onChange={(e) => setNewEmiratesIdExp(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">UAE Residence Visa No. *</label>
                    <input
                      type="text"
                      value={newVisaNo}
                      onChange={(e) => setNewVisaNo(e.target.value)}
                      placeholder="201/XXXX/XXXXXXX"
                      className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">UAE Visa Expiry *</label>
                    <input
                      type="date"
                      value={newVisaExp}
                      onChange={(e) => setNewVisaExp(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Licensing Section */}
              {newRole !== 'Driver' && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 uppercase block text-[10px]">
                    Health Authority Licensing (Clinical Roles):
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Authority *</label>
                      <select
                        value={newAuthority}
                        onChange={(e) => setNewAuthority(e.target.value as any)}
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold"
                      >
                        <option value="DOH">DOH (Abu Dhabi)</option>
                        <option value="DHA">DHA (Dubai)</option>
                        <option value="MOHAP">MOHAP (Federal)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">License Number *</label>
                      <input
                        type="text"
                        value={newLicenseNo}
                        onChange={(e) => setNewLicenseNo(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">License Expiry *</label>
                      <input
                        type="date"
                        value={newLicenseExp}
                        onChange={(e) => setNewLicenseExp(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">License Scope of Practice *</label>
                    <input
                      type="text"
                      value={newScope}
                      onChange={(e) => setNewScope(e.target.value)}
                      placeholder="e.g. FAP, GP CLINIC, SCHOOL CLINIC"
                      className="w-full p-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rpm-navy-600 text-white rounded font-bold hover:bg-rpm-navy-700"
                >
                  Onboard & Route for HR Activation →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

