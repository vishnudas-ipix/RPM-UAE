import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  Truck,
  Users,
  ShieldAlert,
  Send,
  Eye,
  Download,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  Star,
  ExternalLink,
  Upload,
  UserCheck
} from 'lucide-react';
import { Project, Manpower, Vehicle, UserRole } from '../../types';

interface ProjectDetailViewProps {
  project: Project;
  allManpower: Manpower[];
  allVehicles: Vehicle[];
  currentRole: UserRole;
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  allManpower,
  allVehicles,
  currentRole,
  onBack,
  onUpdateProject,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'allocations' | 'stage3A' | 'stage3B' | 'stage5' | 'stage7demob' | 'audit'
  >('overview');

  const [showWatermarkPreview, setShowWatermarkPreview] = useState(false);
  const [clientEmailInput, setClientEmailInput] = useState(project.authorizedClientEmails.join(', ') || project.clientContactEmail);
  const [isDispatching, setIsDispatching] = useState(false);
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [nurseFormCompleted, setNurseFormCompleted] = useState(project.nurseDemobFormSubmitted);
  const [surveyRating, setSurveyRating] = useState<number>(project.clientSatisfactionRating || 5);
  const [surveyFeedback, setSurveyFeedback] = useState(project.clientSatisfactionFeedback || '');

  const allocatedStaffMembers = allManpower.filter((m) =>
    project.allocatedManpower.includes(m.id)
  );
  const allocatedAmbulances = allVehicles.filter((v) =>
    project.allocatedVehicles.includes(v.id)
  );

  // Stage 3A: Dispatch Document Pack
  const handleDispatchDocPack = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      const emails = clientEmailInput.split(',').map((e) => e.trim()).filter(Boolean);
      const updated: Project = {
        ...project,
        stage3ACompiled: true,
        stage3ADispatchDate: new Date().toISOString().split('T')[0],
        stage3ADispatchStatus: 'Submitted to Client',
        authorizedClientEmails: emails,
        docPackWatermarkApplied: true,
        docPackUrlToken: `https://opms.rpm.ae/portal/docpack/view?t=token_${project.projectCode.toLowerCase()}_${Date.now()}`,
        status: 'Pending Client Confirmation',
        updatedAt: new Date().toISOString(),
      };
      onUpdateProject(updated);
    }, 800);
  };

  // Stage 3B: Accept Client Confirmation
  const handleConfirmClientGate = () => {
    const updated: Project = {
      ...project,
      clientConfirmationDate: new Date().toISOString().split('T')[0],
      clientConfirmationAttachment: `/docs/client-confirmations/${project.projectCode}_Client_Formal_Acceptance.pdf`,
      clientConfirmationStatus: 'Confirmed',
      status: 'Allocation in Progress',
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  // Stage 5: Trigger Mobilization (OM only)
  const handleTriggerMobilization = () => {
    const updated: Project = {
      ...project,
      mobilizationConfirmedDate: new Date().toISOString().split('T')[0],
      mobilizationConfirmedBy: 'Zayed Al-Ameri (Ops Manager)',
      mobilizationSummaryPdfUrl: `/docs/mobilization/${project.projectCode}_Summary.pdf`,
      status: 'Active',
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  // Stage 7: Nurse Demobilization Form Validation
  const handleValidateNurseDemob = () => {
    const updated: Project = {
      ...project,
      nurseDemobFormSubmitted: true,
      nurseDemobFormAttachment: `/docs/demob/${project.projectCode}_Nurse_Demob_Checklist.pdf`,
      nurseDemobChecklistValidatedBy: `${currentRole} - Verified`,
      status: 'Demobilization Complete',
      clientSatisfactionSurveySent: true,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
    setNurseFormCompleted(true);
  };

  // Stage 7: Save Client Survey
  const handleSaveSurvey = () => {
    const updated: Project = {
      ...project,
      clientSatisfactionRating: surveyRating,
      clientSatisfactionFeedback: surveyFeedback,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated);
  };

  // Stages pipeline definitions
  const stages = [
    { num: '1', name: 'Initiation', status: 'done' },
    { num: '2', name: 'Approval', status: 'done' },
    { num: '3', name: 'Allocation', status: project.allocatedVehicles.length > 0 ? 'done' : 'current' },
    { num: '3A', name: 'Doc Review', status: project.stage3ACompiled ? 'done' : 'current' },
    { num: '3B', name: 'Client Gate', status: project.clientConfirmationStatus === 'Confirmed' ? 'done' : project.stage3ACompiled ? 'current' : 'pending' },
    { num: '5', name: 'Mobilize', status: project.status === 'Active' ? 'done' : 'pending' },
    { num: '6', name: 'Execution', status: project.status === 'Active' ? 'current' : 'pending' },
    { num: '7', name: 'Demob (UAE)', status: project.status.includes('Demobilization') ? 'current' : 'pending' },
    { num: '8', name: 'Closure', status: project.status === 'Closed' ? 'done' : 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button and Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-xs font-black text-rpm-navy-700 bg-rpm-navy-50 px-2 py-0.5 rounded border border-rpm-navy-200">
                {project.projectCode}
              </span>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                {project.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {project.operatingEmirate}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              {project.name}
            </h1>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Current Lifecycle Stage</span>
            <span className="text-xs font-bold text-rpm-navy-700 bg-rpm-navy-50 px-2.5 py-1 rounded-md border border-rpm-navy-200 inline-block">
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* UAE 8-Stage Lifecycle Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {stages.map((st, idx) => (
            <React.Fragment key={st.num}>
              <div className="flex flex-col items-center space-y-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    st.status === 'done'
                      ? 'bg-emerald-600 text-white'
                      : st.status === 'current'
                      ? 'bg-rpm-navy-600 text-white ring-4 ring-rpm-navy-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {st.status === 'done' ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span className={`text-[11px] font-semibold ${
                  st.status === 'current' ? 'text-rpm-navy-700 font-bold' : 'text-slate-600'
                }`}>
                  {st.name}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  st.status === 'done' ? 'bg-emerald-500' : 'bg-slate-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', label: '1. Overview & Scope' },
          { id: 'allocations', label: `2. Allocations (${project.allocatedVehicles.length} Amb / ${project.allocatedManpower.length} Crew)` },
          { id: 'stage3A', label: '3A. UAE Doc Pack Review & Dispatch' },
          { id: 'stage3B', label: `3B. Client Confirmation Gate [${project.clientConfirmationStatus}]` },
          { id: 'stage5', label: '5. Mobilization & PDF' },
          { id: 'stage7demob', label: '7. UAE Demobilization Workflow' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Scope */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rpm-navy-600" />
                <span>Contract & Scope Documentation (UAE Mandatory)</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Client Name</span>
                  <span className="text-slate-800 font-bold">{project.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Client Authorised Contact</span>
                  <span className="text-slate-800 font-bold">{project.clientContactPerson} ({project.clientContactEmail})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Location</span>
                  <span className="text-slate-800 font-medium">{project.regionLocation} ({project.operatingEmirate})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Assigned Project Lead (PL)</span>
                  <span className="text-rpm-navy-700 font-bold">{project.assignedPL || 'Awaiting OM assignment'}</span>
                </div>
              </div>

              {/* UAE Mandatory Attachments */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-700">Mandatory UAE Documents:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">BOQ Reference</span>
                    <span className="text-xs font-mono font-bold text-slate-800 block">{project.boqReference}</span>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">✓ Attached & Verified</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deliverables Matrix</span>
                    <span className="text-xs font-bold text-slate-800 block">Deliverables List</span>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">✓ Scope Linked</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">PO Status</span>
                    <span className="text-xs font-bold text-slate-800 block">{project.poStatus}</span>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">✓ Legal Verified</span>
                  </div>
                </div>
              </div>

              {project.remarks && (
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold block">Operational Remarks:</span>
                  <p className="text-slate-700 mt-0.5">{project.remarks}</p>
                </div>
              )}
            </div>

            {/* Rotation Configuration Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-rpm-navy-600" />
                <span>Duty Schedule & Rotation Configuration</span>
              </h2>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Duty Schedule Type</span>
                  <span className="text-slate-800 font-bold">{project.dutyScheduleType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Rotation Cycle</span>
                  <span className="text-slate-800 font-bold font-mono">
                    {project.rotationCycleDays ? `${project.rotationCycleDays} Days Cycle` : 'N/A (Standard Duty)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Advance Alert Lead Time</span>
                  <span className="text-amber-800 font-bold">7 Days Advance to PL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Regulatory & Permitting Badges */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                UAE Regulatory Enforcement
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Governing Health Authority:</span>
                  <span className="font-bold text-white">DOH (Abu Dhabi)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">ADOSH Site Permit:</span>
                  <span className="font-bold text-emerald-400">
                    {project.adoshPermitRequired ? 'Required & Enforced' : 'Exempt'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Client Doc Access Rule:</span>
                  <span className="font-bold text-amber-300">
                    {project.clientDocAccessSetting} (Category Rule)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Data Residency:</span>
                  <span className="font-bold text-emerald-400">AWS UAE Region</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>UAE Gate Control Warning</span>
              </div>
              <p className="text-amber-800">
                Mobilization cannot proceed until both <strong>Stage 3A (Document Pack Dispatch)</strong> and <strong>Stage 3B (Formal Client Confirmation)</strong> gates are fully approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Allocations */}
      {activeTab === 'allocations' && (
        <div className="space-y-6">
          {/* Ambulances */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-rpm-navy-600" />
                <span>Allocated Fleet (Ambulances)</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {allocatedAmbulances.length} Active Vehicles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allocatedAmbulances.map((veh) => (
                <div key={veh.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rpm-navy-700">{veh.code} • {veh.plateNo}</span>
                    <span className="text-[10px] bg-rpm-navy-100 text-rpm-navy-800 font-bold px-2 py-0.5 rounded">
                      {veh.type} ({veh.driveType})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{veh.make} {veh.model} ({veh.year})</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                    <div>Mulkiya: <strong className="text-slate-800">{veh.mulkiyaExpiry}</strong></div>
                    <div>ROP Permit: <strong className="text-slate-800">{veh.ropExpiry}</strong></div>
                    <div>DOH Classification: <strong className="text-slate-800">{veh.dohClassificationType}</strong></div>
                    <div>BioMed Calib: <strong className="text-emerald-700">✓ {veh.bioMedicalItems.length} Items Valid</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manpower */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <Users className="w-4 h-4 text-rpm-navy-600" />
                <span>Allocated Clinical Manpower</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {allocatedStaffMembers.length} Deployed Staff
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allocatedStaffMembers.map((staff) => (
                <div key={staff.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{staff.rpmId}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      staff.ragStatus === 'Green' ? 'bg-emerald-100 text-emerald-800' :
                      staff.ragStatus === 'Amber' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      RAG: {staff.ragStatus}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                  <p className="text-[11px] text-rpm-navy-700 font-semibold">{staff.role}</p>
                  
                  <div className="text-[10px] text-slate-500 space-y-0.5 pt-2 border-t border-slate-200">
                    <div>Emirates ID: {staff.emiratesIdNo}</div>
                    {staff.healthAuthorityLicenseNo && (
                      <div>{staff.healthAuthorityType} License: {staff.healthAuthorityLicenseNo}</div>
                    )}
                    <div className="text-slate-700 font-medium">Monthly Allowance: AED {staff.allowanceAED || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3A: UAE Document Review & Dispatch */}
      {activeTab === 'stage3A' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Stage 3A — UAE Document Compilation & Dispatch Portal
                </h3>
                <span className="text-[10px] bg-rpm-navy-100 text-rpm-navy-800 font-bold px-2 py-0.5 rounded">
                  UAE-Specific Requirement
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generates a secure, watermarked document pack served through an authenticated client web portal with OTP validation.
              </p>
            </div>

            <button
              onClick={() => setShowWatermarkPreview(true)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <Eye className="w-4 h-4 text-rpm-navy-600" />
              <span>Preview Watermarked Document Pack</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compiled Documents Manifest */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Compiled Deployment Document Pack:
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">👨‍⚕️ Clinical Staff Documents ({allocatedStaffMembers.length} Staff):</span>
                  <ul className="list-disc list-inside text-slate-600 pl-2 text-[11px] space-y-0.5">
                    <li>Passport, Emirates ID & UAE Residence Visas (2-year tracked)</li>
                    <li>DOH / DHA Professional Licenses & Scopes of Practice</li>
                    <li>DOH-Approved BLS / ACLS Provider Certifications</li>
                    <li>Driver RAG Profiles & Incident Clearances</li>
                    <li>Site-Specific Training & ADNOC HSE Induction Passes</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">🚑 Ambulance Compliance Documents ({allocatedAmbulances.length} Vehicles):</span>
                  <ul className="list-disc list-inside text-slate-600 pl-2 text-[11px] space-y-0.5">
                    <li>Mulkiya (Abu Dhabi Registration Card)</li>
                    <li>Abu Dhabi Police / DMT Annual Fitness Certificates</li>
                    <li>DOH Ambulance Classification Certificates (ALS/BLS)</li>
                    <li>ROP Route Clearance Permit Documents</li>
                    <li>Bio-Medical Equipment Calibration Certificates (Defibrillator/Ventilator)</li>
                    <li>DOH Ambulance Service Facility Operating License</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Client Web Dispatch Settings */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Client Dispatch & Access Configuration:
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Client Email Recipients (OTP Protected) *
                </label>
                <input
                  type="text"
                  value={clientEmailInput}
                  onChange={(e) => setClientEmailInput(e.target.value)}
                  placeholder="e.g. hse.procurement@adnoc.ae, safety@adnoc.ae"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-mono focus:border-rpm-navy-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Access restricted to these emails only — OTP authentication required before loading.
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Client Document Access:</span>
                  <span className="font-bold text-rpm-navy-700 bg-rpm-navy-50 px-2 py-0.5 rounded border border-rpm-navy-200">
                    {project.clientDocAccessSetting}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Configured by Corporate Admin under the <strong>{project.category}</strong> category master.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-slate-600 font-semibold block">System Watermarking:</span>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ System-applied RPM Logo & "CONFIDENTIAL - RPM UAE" watermark rendered at document-level.
                </p>
              </div>

              {project.stage3ADispatchStatus === 'Submitted to Client' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-emerald-800 block">✓ Dispatched to Client:</span>
                  <p className="text-emerald-700 font-mono text-[11px] truncate">
                    URL: {project.docPackUrlToken}
                  </p>
                  <span className="text-[10px] text-emerald-600 block">
                    Dispatched on: {project.stage3ADispatchDate} • Status: Submitted to Client
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleDispatchDocPack}
                  disabled={isDispatching}
                  className="w-full py-2.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isDispatching ? 'Generating & Watermarking Pack...' : 'Generate Watermarked Pack & Dispatch to Client'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3B: Client Confirmation Gate */}
      {activeTab === 'stage3B' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
            <div className={`p-2 rounded-lg ${
              project.clientConfirmationStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {project.clientConfirmationStatus === 'Confirmed' ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Stage 3B — Client Acceptance and Confirmation Gate
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  project.clientConfirmationStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 animate-pulse'
                }`}>
                  Gate: {project.clientConfirmationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Critical UAE Gate: Mobilization cannot proceed without formal client acceptance of staff and vehicle documentation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Confirmation Gate Rules:
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                <p>
                  • Client reviews compiled document pack via secure web portal.
                </p>
                <p>
                  • Formal acceptance must be attached (Official Email confirmation or client approval letter).
                </p>
                <p>
                  • System blocks Operations Manager from triggering mobilization until this gate is cleared.
                </p>
                <p>
                  • Mid-project additions (via MRF or Ambulance Requests) also require this confirmation gate.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Gate Clearance Action:
              </h4>

              {project.clientConfirmationStatus === 'Confirmed' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Client Confirmation Gate CLEARED</span>
                  </div>
                  <p className="text-emerald-700">
                    Confirmed on: <strong>{project.clientConfirmationDate}</strong>
                  </p>
                  <p className="text-emerald-700 font-mono text-[11px]">
                    Attachment: {project.clientConfirmationAttachment}
                  </p>
                  <p className="text-emerald-900 font-semibold pt-1">
                    ✓ Stage 5 Mobilization Trigger is now UNLOCKED for Operations Manager.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                    Status: <strong>Pending Client Confirmation</strong>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Attach Client Acceptance Document / Email Record *
                    </label>
                    <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                      <Upload className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                      <span>Formal_Client_Acceptance_Signoff.pdf attached</span>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmClientGate}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    Clear Gate & Record Formal Client Acceptance →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Mobilization */}
      {activeTab === 'stage5' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Stage 5 — Mobilization & Summary Generation
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  project.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {project.status === 'Active' ? 'Mobilized & Active' : 'Readiness Validation'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Operations Manager confirms on-site readiness and generates the official Mobilization Summary PDF.
              </p>
            </div>

            {project.clientConfirmationStatus !== 'Confirmed' && (
              <span className="text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-md border border-red-200 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Blocked by Client Gate 3B</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Mobilization Checklist:
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Client Confirmation Gate (Stage 3B)</span>
                  <span className={`font-bold ${project.clientConfirmationStatus === 'Confirmed' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {project.clientConfirmationStatus === 'Confirmed' ? '✓ Cleared' : '✗ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Fleet Deployment (Ambulances)</span>
                  <span className="text-emerald-700 font-bold">✓ {allocatedAmbulances.length} Ready</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Clinical Manpower (Crew)</span>
                  <span className="text-emerald-700 font-bold">✓ {allocatedStaffMembers.length} Cleared</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span>DOH Equipment Standards Inspection</span>
                  <span className="text-emerald-700 font-bold">✓ Passed</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Operations Manager Execution:
              </h4>

              {project.status === 'Active' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-emerald-800 block">✓ Project is Active & Mobilized</span>
                  <p className="text-emerald-700">
                    Confirmed by: <strong>{project.mobilizationConfirmedBy}</strong> on {project.mobilizationConfirmedDate}
                  </p>
                  <p className="text-emerald-700 font-mono text-[11px]">
                    Summary PDF: {project.mobilizationSummaryPdfUrl}
                  </p>
                  <button
                    onClick={() => alert(`Mobilization Summary PDF for ${project.projectCode}\nIncludes: Fleet allocations, Clinical crew credentials, DOH facility license, and Client confirmation.`)}
                    className="mt-2 py-1.5 px-3 bg-white text-emerald-800 font-bold rounded border border-emerald-300 hover:bg-emerald-100 flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Mobilization Summary PDF</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTriggerMobilization}
                  disabled={project.clientConfirmationStatus !== 'Confirmed'}
                  className="w-full py-2.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm On-Site Readiness & Mobilize Project</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: UAE Demobilization Workflow */}
      {activeTab === 'stage7demob' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Stage 7 — UAE Demobilization Workflow (4 Steps)
              </h3>
              <span className="text-[10px] bg-rpm-red text-white font-bold px-2 py-0.5 rounded">
                Distinct UAE Flow
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Client/HSE email trigger → Communication to UAE HODs → Nurse Demobilization Form Checklist & Site Manager / PL validation → Automated Client Satisfaction Survey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 & 2 */}
            <div className="space-y-4">
              {/* Step 1: Client/HSE Email Trigger */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">1. Client / HSE Demob Email Trigger</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-slate-600">
                  Triggered by client email from HSE Manager. Internal demobilization is blocked until client email is attached.
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                  Attached: {project.demobRequestAttachment || 'Client_HSE_Demob_Trigger_Email.pdf'}
                </div>
              </div>

              {/* Step 2: HOD Communication */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">2. Notification to UAE Department Heads</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    ✓ Sent
                  </span>
                </div>
                <p className="text-slate-600">
                  Auto-dispatched to: Transport Supervisor (Vehicles), Dy Nurse Manager (Crew), Biomedical Engineering, and HR.
                </p>
              </div>
            </div>

            {/* Step 3 & 4 */}
            <div className="space-y-4">
              {/* Step 3: Nurse Demob Form Submission & Validation */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">3. Nurse Demob Form & Checklist</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    nurseFormCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {nurseFormCompleted ? '✓ Validated by PL' : 'Awaiting Validation'}
                  </span>
                </div>
                <p className="text-slate-600">
                  On-site nurse submits final equipment handover, consumables reconciliation, and ambulance condition checklist.
                </p>
                
                {nurseFormCompleted ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">
                    Validated & Approved by: <strong>{project.nurseDemobChecklistValidatedBy || 'Rashid Al-Nuaimi (Project Lead)'}</strong>
                  </div>
                ) : (
                  <button
                    onClick={handleValidateNurseDemob}
                    className="w-full py-2 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white rounded text-xs font-bold transition-colors"
                  >
                    Validate & Sign Off Nurse Demob Form (PL)
                  </button>
                )}
              </div>

              {/* Step 4: Client Satisfaction Survey */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">4. Client Satisfaction Survey</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    Post-Demob Trigger
                  </span>
                </div>
                <p className="text-slate-600">
                  Automated trigger sends confirmation email and satisfaction survey link to authorized client email.
                </p>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">Client Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSurveyRating(star)}
                          className={`text-sm ${star <= surveyRating ? 'text-amber-500' : 'text-slate-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={surveyFeedback}
                      onChange={(e) => setSurveyFeedback(e.target.value)}
                      placeholder="Client feedback notes..."
                      className="w-full text-xs p-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <button
                    onClick={handleSaveSurvey}
                    className="text-xs text-rpm-navy-600 font-bold hover:underline"
                  >
                    Save Survey Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watermarked Document Pack Modal Preview */}
      {showWatermarkPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>RPM UAE Secure Document Pack Portal</span>
                  <span className="text-[10px] bg-rpm-red text-white font-bold px-2 py-0.5 rounded">
                    Client View Preview
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Simulating authenticated client recipient: {project.clientContactEmail}
                </p>
              </div>
              <button
                onClick={() => setShowWatermarkPreview(false)}
                className="text-white hover:text-slate-300 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Document Content with repeating watermark overlay */}
            <div className="flex-1 overflow-y-auto p-8 relative rpm-watermark-overlay bg-slate-50">
              <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-xl border border-slate-200 relative">
                {/* Visual Watermark Text Stamp */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
                  <span className="text-6xl font-black text-slate-900 rotate-[-30deg] tracking-widest text-center">
                    CONFIDENTIAL<br />RESPONSE PLUS MEDICAL
                  </span>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <img src="/rpm-logo.png" alt="RPM" className="h-10 object-contain" />
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-500">PACK #{project.projectCode}</span>
                    <p className="text-xs text-slate-700 font-bold">{project.clientName}</p>
                  </div>
                </div>

                <div className="py-6 space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase">Executive Resource Pack Manifest</h4>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <p><strong>Deployment Location:</strong> {project.regionLocation} ({project.operatingEmirate})</p>
                    <p><strong>Category:</strong> {project.category} • <strong>Access:</strong> {project.clientDocAccessSetting}</p>
                    <p><strong>Allocated Vehicles:</strong> {allocatedAmbulances.length} Units (Mulkiya & DOH Classification verified)</p>
                    <p><strong>Allocated Clinical Crew:</strong> {allocatedStaffMembers.length} Staff (Emirates ID & DOH verified)</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-slate-800">Included Certificates:</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">✓ DOH Ambulance Facility #DOH-FAC-2024-9182</div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">✓ ADOSH HSE Medical Coverage Approvals</div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">✓ Bio-Medical Calibration Reports</div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">✓ Driver Defensive Driving Clearances</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Response Plus Medical Services LLC (UAE)</span>
                  {project.clientDocAccessSetting === 'Download Enabled' ? (
                    <button className="px-3 py-1.5 bg-rpm-navy-600 text-white rounded font-bold text-xs flex items-center space-x-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Complete PDF Pack</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 font-semibold italic">
                      [Download disabled by Category Master policy: View Only]
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

