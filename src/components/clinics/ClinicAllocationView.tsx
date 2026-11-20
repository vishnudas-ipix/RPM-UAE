import React, { useState } from 'react';
import {
  Building,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  UserCheck,
  Stethoscope,
  Award
} from 'lucide-react';
import { Clinic, Emirate, UserRole } from '../../types';

interface ClinicAllocationViewProps {
  clinics: Clinic[];
  selectedEmirate: Emirate | 'All';
  currentRole: UserRole;
  onUpdateClinicStatus: (clinicId: string, newStatus: Clinic['status']) => void;
  onAddClinic: (newClinic: Partial<Clinic>) => void;
}

export const ClinicAllocationView: React.FC<ClinicAllocationViewProps> = ({
  clinics,
  selectedEmirate,
  currentRole,
  onUpdateClinicStatus,
  onAddClinic,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New clinic form state
  const [name, setName] = useState('');
  const [type, setType] = useState<Clinic['type']>('Type A Clinic');
  const [emirate, setEmirate] = useState<Emirate>('Abu Dhabi');
  const [isLicensed, setIsLicensed] = useState(true);
  const [adoshRef, setAdoshRef] = useState('ADOSH-MCP-2026-991');
  const [supervisorName, setSupervisorName] = useState('Sr. Supervisor Mariam Al-Husseini');
  const [supervisorContact, setSupervisorContact] = useState('+971 50 119 2834');

  const filteredClinics = clinics.filter((c) => {
    const matchEmirate = selectedEmirate === 'All' || c.emirate === selectedEmirate;
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clinicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.associatedProjectName && c.associatedProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchEmirate && matchType && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClinic: Partial<Clinic> = {
      clinicId: `CLN-UAE-00${clinics.length + 1}`,
      name,
      type,
      emirate,
      isLicensed,
      qaLicensingStage: isLicensed ? 'License Issued' : undefined,
      adoshPermitRef: adoshRef,
      status: 'Pending Mobilization',
      supervisorName,
      supervisorContact,
      ambulanceCoordinatorSignoff: true,
      clientDocGateCleared: false,
    };
    onAddClinic(newClinic);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              On-Site Clinic Allocation & QA Licensing
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 6 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governs Type A (Permanent/Large), Type B (Medium), and Type C (First Aid / Event) setups. Enforces ADOSH Medical Coverage Plans, DOH QA facility licensing, and Ambulance Coordinator sign-offs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Configure New On-Site Clinic</span>
        </button>
      </div>

      {/* UAE Clinic Regulatory Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <Stethoscope className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-white block">
              UAE Pre-Mobilization & Licensing Enforcement
            </span>
            <span className="text-slate-300 text-[11px]">
              For ADNOC sites: ADOSH Medical Coverage Plan must be validated before status becomes Operational. Ambulance Coordinator sign-off is mandatory.
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-2.5 py-1 rounded border border-slate-700">
          QA Licensing Active
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by clinic name, ID, project..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rpm-navy-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Types (A/B/C)</option>
              <option value="Type A Clinic">Type A (Multi-room Permanent)</option>
              <option value="Type B Clinic">Type B (Medium Setup)</option>
              <option value="Type C Clinic (First Aid Clinic)">Type C (First Aid / Event)</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredClinics.length}</strong> clinic facilities
        </span>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <div key={clinic.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-rpm-navy-700 block">{clinic.clinicId}</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{clinic.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  clinic.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {clinic.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <span className="font-semibold text-slate-800">{clinic.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Emirate / Region:</span>
                  <span className="font-semibold text-slate-800">{clinic.emirate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">QA Licensing Status:</span>
                  <span className="font-bold text-rpm-navy-700">
                    {clinic.isLicensed ? `Licensed (${clinic.qaLicensingStage || 'Active'})` : 'Non-Licensed (Field Post)'}
                  </span>
                </div>
                {clinic.associatedProjectName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Linked Project:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[160px]">{clinic.associatedProjectName}</span>
                  </div>
                )}
                {clinic.adoshPermitRef && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ADOSH Permit Ref:</span>
                    <span className="font-mono text-emerald-700 font-semibold">{clinic.adoshPermitRef}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Supervisor:</span>
                  <span className="font-medium text-slate-800">{clinic.supervisorName}</span>
                </div>
              </div>

              {/* UAE Checklist Status */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Ambulance Coordinator Sign-off:</span>
                  <strong className="text-emerald-700">✓ Signed</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Client Confirmation Gate 3B:</span>
                  <strong className={clinic.clientDocGateCleared ? 'text-emerald-700' : 'text-amber-700'}>
                    {clinic.clientDocGateCleared ? '✓ Cleared' : 'Pending Client Acceptance'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                {clinic.mobilizationDate ? `Active since: ${clinic.mobilizationDate}` : 'Pending trigger'}
              </span>

              {clinic.status === 'Pending Mobilization' ? (
                <button
                  onClick={() => onUpdateClinicStatus(clinic.id, 'Operational')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                >
                  Confirm Operational (Dy Nurse)
                </button>
              ) : (
                <button
                  onClick={() => onUpdateClinicStatus(clinic.id, 'Closed (Mobilized)')}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded"
                >
                  Close Clinic
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Clinic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold">Configure New Clinic Facility</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Al Dhafra Petrochemical Clinic"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinic Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    <option value="Type A Clinic">Type A (Multi-room)</option>
                    <option value="Type B Clinic">Type B (Medium)</option>
                    <option value="Type C Clinic (First Aid Clinic)">Type C (First Aid / Event)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emirate *</label>
                  <select
                    value={emirate}
                    onChange={(e) => setEmirate(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Northern Emirates">Northern Emirates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ADOSH Medical Coverage Plan Reference</label>
                <input
                  type="text"
                  value={adoshRef}
                  onChange={(e) => setAdoshRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="clinicLic"
                  checked={isLicensed}
                  onChange={(e) => setIsLicensed(e.target.checked)}
                  className="rounded text-rpm-navy-600"
                />
                <label htmlFor="clinicLic" className="font-semibold text-slate-700 cursor-pointer">
                  Licensed Healthcare Facility (DOH / QA Managed)
                </label>
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
                  Save Clinic Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

