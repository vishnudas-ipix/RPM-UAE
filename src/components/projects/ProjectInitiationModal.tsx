import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { Project, Emirate, UAEProjectCategory, ContractType } from '../../types';

interface ProjectInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProject: Partial<Project>) => void;
}

export const ProjectInitiationModal: React.FC<ProjectInitiationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [bdName, setBdName] = useState('Hamad Al-Zaabi');
  const [bdId, setBdId] = useState('EMP-BD-109');
  const [bdPosition, setBdPosition] = useState('Senior BD Account Lead');
  const [category, setCategory] = useState<'Project' | 'Event'>('Project');
  const [operatingEmirate, setOperatingEmirate] = useState<Emirate>('Abu Dhabi');
  const [contractType, setContractType] = useState<ContractType>('ADNOC');
  const [projectCategory, setProjectCategory] = useState<UAEProjectCategory>('ADNOC');
  const [adoshPermitRequired, setAdoshPermitRequired] = useState(true);
  const [regionLocation, setRegionLocation] = useState('');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [demobDate, setDemobDate] = useState('');
  
  // Mandatory UAE fields
  const [boqReference, setBoqReference] = useState('');
  const [boqFileUploaded, setBoqFileUploaded] = useState(false);
  const [deliverablesFileUploaded, setDeliverablesFileUploaded] = useState(false);
  const [poStatus, setPoStatus] = useState<'PO Uploaded' | 'Alternate Document Uploaded' | 'PO Pending'>('PO Uploaded');
  
  // Rotation configuration
  const [dutyScheduleType, setDutyScheduleType] = useState<'Rotation-Based' | 'Normal Duty'>('Rotation-Based');
  const [rotationCycleDays, setRotationCycleDays] = useState(28);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];

    if (!projectName.trim()) errs.push('Project / Event Name is mandatory.');
    if (!clientName.trim()) errs.push('Client Name is mandatory.');
    if (!regionLocation.trim()) errs.push('Region / City / Physical Location is mandatory.');
    if (!startDate) errs.push('Mobilization Start Date is mandatory.');
    if (!demobDate) errs.push('Tentative Demobilization Date is mandatory.');
    
    // UAE Scope Mandatories: BOQ and Deliverables list are mandatory at initiation
    if (!boqReference.trim()) errs.push('BOQ Reference Code / Number is mandatory for UAE projects.');
    if (!boqFileUploaded) errs.push('BOQ Document Upload is mandatory for UAE projects.');
    if (!deliverablesFileUploaded) errs.push('Deliverables List Document Upload is mandatory for UAE projects.');

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const newProject: Partial<Project> = {
      projectCode: `PRJ-UAE-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: projectName,
      type: category,
      category: projectCategory,
      contractType,
      operatingEmirate,
      regionLocation,
      clientName,
      clientContactEmail: clientEmail || 'procurement@client.ae',
      clientContactPerson: 'Client Representative',
      bdName,
      bdId,
      bdPosition,
      adoshPermitRequired,
      dutyScheduleType,
      rotationCycleDays: dutyScheduleType === 'Rotation-Based' ? rotationCycleDays : undefined,
      startDate,
      demobilizationDateTentative: demobDate,
      status: 'Awaiting Management Review',
      poStatus,
      boqReference,
      boqDocPath: `/docs/boq/BOQ_${boqReference.replace(/\s+/g, '_')}.pdf`,
      deliverablesListDocPath: `/docs/deliverables/Deliverables_${projectName.replace(/\s+/g, '_').substring(0, 15)}.pdf`,
      remarks,
      stage3ACompiled: false,
      clientDocAccessSetting: projectCategory === 'ADNOC' ? 'View Only' : 'Download Enabled',
      authorizedClientEmails: clientEmail ? [clientEmail] : [],
      docPackWatermarkApplied: false,
      clientConfirmationStatus: 'Pending',
      allocatedVehicles: [],
      allocatedManpower: [],
      nurseDemobFormSubmitted: false,
      clientSatisfactionSurveySent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rpm-navy-700 rounded-lg text-rpm-red">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">
                  Initiate Project / Event Account (UAE Form)
                </h2>
                <span className="text-[10px] bg-rpm-red text-white font-bold px-2 py-0.5 rounded">
                  UAE SRS Mandatory Fields
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Enforces mandatory BOQ & Deliverables, ADOSH permit check, and duty rotation cycles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-rpm-navy-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-red-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Please complete mandatory UAE submission requirements:</span>
              </div>
              <ul className="list-disc list-inside text-xs text-red-700 pl-4 space-y-0.5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Business Development & Account Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-rpm-navy-600" />
              <span>1. Business Development & Account Ownership</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  BD Representative Name *
                </label>
                <input
                  type="text"
                  value={bdName}
                  onChange={(e) => setBdName(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  BD Employee ID *
                </label>
                <input
                  type="text"
                  value={bdId}
                  onChange={(e) => setBdId(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  BD Position / Role *
                </label>
                <input
                  type="text"
                  value={bdPosition}
                  onChange={(e) => setBdPosition(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Operational Classification & Scope */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-rpm-navy-600" />
              <span>2. Operational Classification & Regulatory Scope</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type of Engagement *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-medium"
                >
                  <option value="Project">Long-Term Medical Project</option>
                  <option value="Event">Temporary Event Medical Standby</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Emirate *
                </label>
                <select
                  value={operatingEmirate}
                  onChange={(e) => setOperatingEmirate(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-medium"
                >
                  <option value="Abu Dhabi">Abu Dhabi (DOH Regulated)</option>
                  <option value="Dubai">Dubai (DHA Regulated)</option>
                  <option value="Sharjah">Sharjah (MOHAP Regulated)</option>
                  <option value="Northern Emirates">Northern Emirates (MOHAP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UAE Project Category *
                </label>
                <select
                  value={projectCategory}
                  onChange={(e) => {
                    const val = e.target.value as UAEProjectCategory;
                    setProjectCategory(val);
                    setContractType(val);
                    if (val === 'ADNOC') setAdoshPermitRequired(true);
                  }}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-medium"
                >
                  <option value="ADNOC">ADNOC (Offshore / Onshore H2S Rules)</option>
                  <option value="Government">Government (DOH / ADOSH)</option>
                  <option value="Semi-Government">Semi-Government</option>
                  <option value="Private">Private Sector</option>
                  <option value="Event">Event Category</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project / Event Official Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. ADNOC Offshore Ruwais Field Medical Unit"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Organization Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. ADNOC Refining & Petrochemicals"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Region / Physical Site Location *
                </label>
                <input
                  type="text"
                  value={regionLocation}
                  onChange={(e) => setRegionLocation(e.target.value)}
                  placeholder="e.g. Al Dhafra Petroleum Zone, Sector 4"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Client Email (For Stage 3A Doc Pack Dispatch)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="e.g. safety.director@adnoc.ae"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <input
                type="checkbox"
                id="adoshPermit"
                checked={adoshPermitRequired}
                onChange={(e) => setAdoshPermitRequired(e.target.checked)}
                className="rounded border-slate-300 text-rpm-navy-600 focus:ring-rpm-navy-500"
              />
              <label htmlFor="adoshPermit" className="text-xs text-amber-950 font-semibold cursor-pointer">
                ADOSH Permit Required (Mandatory for industrial sites, construction deployments & large events)
              </label>
            </div>
          </div>

          {/* Section 3: Timeline & Duty Rotation Configuration */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-rpm-navy-600" />
              <span>3. Deployment Dates & Rotation Schedule</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobilization Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tentative Demob Date *
                </label>
                <input
                  type="date"
                  value={demobDate}
                  onChange={(e) => setDemobDate(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duty Schedule Type
                </label>
                <select
                  value={dutyScheduleType}
                  onChange={(e) => setDutyScheduleType(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-medium"
                >
                  <option value="Rotation-Based">Rotation-Based (Offshore/Remote)</option>
                  <option value="Normal Duty">Normal Duty (Onshore/Daily Shift)</option>
                </select>
              </div>

              {dutyScheduleType === 'Rotation-Based' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rotation Cycle (Days)
                  </label>
                  <input
                    type="number"
                    value={rotationCycleDays}
                    onChange={(e) => setRotationCycleDays(Number(e.target.value))}
                    min={7}
                    max={60}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Auto-triggers 7d advance crew alerts</span>
                </div>
              ) : (
                <div className="flex items-center pt-5 text-xs text-slate-400">
                  Standard shifts apply
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Mandatory UAE Documents (BOQ, Deliverables, PO) */}
          <div className="bg-rpm-navy-50/60 p-4 rounded-xl border border-rpm-navy-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rpm-navy-900 flex items-center space-x-1.5">
                <Upload className="w-4 h-4 text-rpm-navy-700" />
                <span>4. Mandatory UAE Document Attachments</span>
              </h3>
              <span className="text-[10px] bg-rpm-navy-200 text-rpm-navy-900 font-bold px-2 py-0.5 rounded">
                System Blocks If Missing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* BOQ Reference & Upload */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  BOQ Reference & Document *
                </label>
                <input
                  type="text"
                  value={boqReference}
                  onChange={(e) => setBoqReference(e.target.value)}
                  placeholder="e.g. BOQ-2026-DAS-01"
                  className="w-full text-xs p-1.5 mb-2 bg-slate-50 border border-slate-300 rounded focus:border-rpm-navy-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setBoqFileUploaded(!boqFileUploaded)}
                  className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 border ${
                    boqFileUploaded
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-dashed border-slate-300'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{boqFileUploaded ? '✓ BOQ PDF Attached' : 'Upload BOQ (Mandatory)'}</span>
                </button>
              </div>

              {/* Deliverables List Upload */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Deliverables List Document *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Scope deliverables must be linked to project from initiation.
                </p>
                <button
                  type="button"
                  onClick={() => setDeliverablesFileUploaded(!deliverablesFileUploaded)}
                  className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 border ${
                    deliverablesFileUploaded
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-dashed border-slate-300'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{deliverablesFileUploaded ? '✓ Deliverables Attached' : 'Upload Deliverables PDF'}</span>
                </button>
              </div>

              {/* PO Status & Alternate Document */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  PO / Client Confirmation
                </label>
                <select
                  value={poStatus}
                  onChange={(e) => setPoStatus(e.target.value as any)}
                  className="w-full text-xs p-1.5 mb-2 bg-slate-50 border border-slate-300 rounded font-medium"
                >
                  <option value="PO Uploaded">Formal Client PO Attached</option>
                  <option value="Alternate Document Uploaded">Client Email Confirmation</option>
                  <option value="PO Pending">PO Pending (Awaiting within 5 Days)</option>
                </select>
                <div className="text-[10px] text-slate-500">
                  {poStatus === 'PO Pending' ? (
                    <span className="text-amber-700 font-medium">Triggers conditional approval loop with 5-day timer</span>
                  ) : (
                    <span>Ready for legal clause confirmation</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operational Scope Remarks & Equipment Requirements
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Detail required ALS/BLS ambulance configurations, clinic specifications, and specialized personnel..."
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:border-rpm-navy-500 h-20"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Upon submission, routes to Legal Review → Management 24h Approval Lock
            </span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Submit Project Request →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

