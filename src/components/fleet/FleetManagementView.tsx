import React, { useState } from 'react';
import {
  Truck,
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
  Download,
  Building,
  CheckSquare,
  Wrench,
  FileCheck
} from 'lucide-react';
import { Vehicle, Emirate, VehicleType, DriveType, UserRole } from '../../types';

interface FleetManagementViewProps {
  vehicles: Vehicle[];
  selectedEmirate: Emirate | 'All';
  currentRole: UserRole;
  onAddVehicle: (newVehicle: Partial<Vehicle>) => void;
  onUploadMaintenanceReport: (vehicleId: string, report: any) => void;
  onUpdateInspection: (vehicleId: string, passed: boolean) => void;
}

export const FleetManagementView: React.FC<FleetManagementViewProps> = ({
  vehicles,
  selectedEmirate,
  currentRole,
  onAddVehicle,
  onUploadMaintenanceReport,
  onUpdateInspection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  // New Maintenance Report State
  const [serviceProvider, setServiceProvider] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [costAED, setCostAED] = useState(1500);

  // New Vehicle Modal State
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState<VehicleType>('ALS');
  const [newDriveType, setNewDriveType] = useState<DriveType>('4x4');
  const [newMake, setNewMake] = useState('Mercedes-Benz');
  const [newModel, setNewModel] = useState('Sprinter 319 CDI');
  const [newYear, setNewYear] = useState(2025);
  const [newOwnership, setNewOwnership] = useState<'RPM-owned' | 'Rental'>('RPM-owned');
  const [newRentalCompany, setNewRentalCompany] = useState('');
  const [newEmirate, setNewEmirate] = useState<Emirate>('Abu Dhabi');
  const [newMulkiyaExpiry, setNewMulkiyaExpiry] = useState('2028-02-15');
  const [newInsuranceExpiry, setNewInsuranceExpiry] = useState('2028-02-10');
  const [newRopDoc, setNewRopDoc] = useState('ROP-AD-PERMIT-2026-991');
  const [newRopExpiry, setNewRopExpiry] = useState('2027-10-15');
  const [newDohClassExpiry, setNewDohClassExpiry] = useState('2027-08-30');
  const [newAdnocEligible, setNewAdnocEligible] = useState(true);

  const filteredVehicles = vehicles.filter((v) => {
    const matchEmirate = selectedEmirate === 'All' || v.emirate === selectedEmirate;
    const matchType = typeFilter === 'All' || v.type === typeFilter;
    const matchStatus = statusFilter === 'All' || v.operationalStatus === statusFilter;
    const matchSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.currentProjectName && v.currentProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchEmirate && matchType && matchStatus && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVeh: Partial<Vehicle> = {
      code: `AMB-UAE-00${vehicles.length + 1}`,
      plateNo: newPlate,
      type: newType,
      driveType: newDriveType,
      make: newMake,
      model: newModel,
      year: newYear,
      ownershipType: newOwnership,
      rentalCompanyName: newOwnership === 'Rental' ? newRentalCompany : undefined,
      emirate: newEmirate,
      operationalStatus: 'Pending Approval', // Awaiting Fleet Supervisor approval
      adnocEligible: newAdnocEligible,
      mulkiyaDocPath: `/docs/fleet/Mulkiya_${newPlate.replace(/\s+/g, '_')}.pdf`,
      mulkiyaExpiry: newMulkiyaExpiry,
      insurancePolicyNo: 'RPM-DAMAN-INS-2026',
      insuranceExpiry: newInsuranceExpiry,
      annualFitnessCertExpiry: '2028-01-30',
      dohClassificationType: newType === 'ALS' ? 'ALS' : 'BLS',
      dohClassificationCertExpiry: newDohClassExpiry,
      ropDocumentNo: newRopDoc,
      ropExpiry: newRopExpiry,
      dohFacilityLicenseNo: 'DOH-FAC-2024-9182',
      dohFacilityLicenseExpiry: '2027-12-31',
      bioMedicalItems: [
        {
          id: `bio-${Date.now()}`,
          equipmentName: 'Defibrillator / Monitor',
          serialNumber: `SN-CAL-${Math.floor(1000 + Math.random() * 9000)}`,
          lastCalibrationDate: '2026-02-01',
          nextCalibrationDate: '2027-01-31',
          certificateDocPath: '/docs/biomed/Calib_Cert.pdf',
          status: 'Compliant',
        }
      ],
      maintenanceReports: [],
      dohEquipmentChecklistPassed: true,
      ambulanceCoordinatorSigned: false,
      lastInspectionDate: new Date().toISOString().split('T')[0],
    };

    onAddVehicle(newVeh);
    setShowAddModal(false);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const report = {
      id: `mrp-${Date.now()}`,
      vehicleId: selectedVehicle.id,
      plateNo: selectedVehicle.plateNo,
      reportDate: new Date().toISOString().split('T')[0],
      uploadedBy: `${currentRole} - Fleet Officer`,
      serviceProvider: serviceProvider || 'Emirates Motor Company (EMC)',
      workDescription: workDesc || 'Scheduled periodic maintenance & brake overhaul.',
      costAED: costAED,
      pdfDocPath: `/docs/fleet/reports/${selectedVehicle.plateNo}_Report.pdf`,
    };

    onUploadMaintenanceReport(selectedVehicle.id, report);
    setShowMaintenanceModal(false);
    setWorkDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Fleet (Ambulance) Management & Allocation
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 3 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracks Mulkiya, Abu Dhabi Police / DMT fitness, ROP permits, Bio-Medical calibration records, DOH facility licenses & maintenance repositories.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Ambulance (UAE)</span>
        </button>
      </div>

      {/* Real-time Fleet Status Counters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Total Fleet</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{vehicles.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase">Allocated</span>
          <p className="text-xl font-black text-emerald-700 mt-0.5">
            {vehicles.filter(v => v.operationalStatus === 'Allocated').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-blue-700 font-bold uppercase">Available Bench</span>
          <p className="text-xl font-black text-blue-700 mt-0.5">
            {vehicles.filter(v => v.operationalStatus === 'Active / Available').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-amber-700 font-bold uppercase">Maintenance</span>
          <p className="text-xl font-black text-amber-700 mt-0.5">
            {vehicles.filter(v => v.operationalStatus === 'Under Maintenance').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-purple-700 font-bold uppercase">Pending Approval</span>
          <p className="text-xl font-black text-purple-700 mt-0.5">
            {vehicles.filter(v => v.operationalStatus === 'Pending Approval').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-red-700 font-bold uppercase">Non-Compliant</span>
          <p className="text-xl font-black text-red-700 mt-0.5">
            {vehicles.filter(v => v.operationalStatus === 'Non-Compliant').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by plate, code, model, project..."
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
              <option value="All">All Types (ALS/BLS/ICU)</option>
              <option value="ALS">ALS (Advanced Life Support)</option>
              <option value="BLS">BLS (Basic Life Support)</option>
              <option value="Mobile ICU">Mobile ICU</option>
              <option value="PTV">PTV Patient Transport</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Operational Statuses</option>
              <option value="Active / Available">Active / Available Bench</option>
              <option value="Allocated">Allocated</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Pending Approval">Pending Supervisor Approval</option>
              <option value="Non-Compliant">Non-Compliant (Expired Docs)</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredVehicles.length}</strong> vehicles
        </span>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Code & Plate</th>
                <th className="py-3 px-3">Vehicle Details</th>
                <th className="py-3 px-3">Emirate & Ownership</th>
                <th className="py-3 px-3">UAE Mulkiya & ROP</th>
                <th className="py-3 px-3">Bio-Medical & DOH</th>
                <th className="py-3 px-3">Status & Deployment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((veh) => (
                <tr
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-bold text-rpm-navy-700 block">
                      {veh.code}
                    </span>
                    <span className="font-bold text-slate-900 block">{veh.plateNo}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">
                      {veh.make} {veh.model}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {veh.year} • <strong className="text-slate-700">{veh.type} ({veh.driveType})</strong>
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-slate-700 font-medium block">{veh.emirate}</span>
                    <span className="text-[10px] text-slate-500">
                      {veh.ownershipType} {veh.rentalCompanyName ? `(${veh.rentalCompanyName})` : ''}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="space-y-0.5 text-[11px]">
                      <div>
                        Mulkiya: <span className="font-mono text-slate-800 font-semibold">{veh.mulkiyaExpiry}</span>
                      </div>
                      <div>
                        ROP Permit: <span className="font-mono text-slate-800 font-semibold">{veh.ropExpiry}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="space-y-0.5 text-[11px]">
                      <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                        DOH {veh.dohClassificationType}
                      </span>
                      <div className="text-[10px] text-slate-500">
                        BioMed: <strong className="text-emerald-700">{veh.bioMedicalItems.length} items calibrated</strong>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      veh.operationalStatus === 'Allocated'
                        ? 'bg-purple-100 text-purple-800'
                        : veh.operationalStatus === 'Active / Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : veh.operationalStatus === 'Non-Compliant'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {veh.operationalStatus}
                    </span>
                    {veh.currentProjectName && (
                      <span className="block text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5">
                        {veh.currentProjectName}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedVehicle(veh)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                    >
                      Vehicle Profile →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Profile & Maintenance Drawer */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-rpm-red bg-white px-2 py-0.5 rounded">
                    {selectedVehicle.code}
                  </span>
                  <h3 className="text-sm font-bold text-white">{selectedVehicle.plateNo}</h3>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year}) • {selectedVehicle.type} ({selectedVehicle.driveType})
                </p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-white hover:text-slate-300 font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Compliance Badges */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                  UAE Vehicle Mandatory Compliance
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">Mulkiya Registration</span>
                    <span className="font-mono font-bold text-slate-800">{selectedVehicle.mulkiyaExpiry}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">Abu Dhabi Police ROP Permit</span>
                    <span className="font-mono font-bold text-slate-800">{selectedVehicle.ropExpiry}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">DOH Classification</span>
                    <span className="font-bold text-emerald-700">{selectedVehicle.dohClassificationType} (Expires: {selectedVehicle.dohClassificationCertExpiry})</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-semibold block text-[10px]">Annual Fitness (Police/DMT)</span>
                    <span className="font-mono font-bold text-slate-800">{selectedVehicle.annualFitnessCertExpiry}</span>
                  </div>
                </div>
              </div>

              {/* Bio-Medical Engineering Calibration Records (UAE Mandatory) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                    Bio-Medical Equipment Calibrations ({selectedVehicle.bioMedicalItems.length} Items)
                  </h4>
                  <span className="text-[10px] text-slate-500">DOH 30-Day Alert Enforced</span>
                </div>

                <div className="space-y-2">
                  {selectedVehicle.bioMedicalItems.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block">{item.equipmentName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">SN: {item.serialNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-mono">
                          Due: {item.nextCalibrationDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Report Repository (Section 7.7.1) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                      Maintenance Reports Repository
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Running PDF maintenance log visible to PL & Ops Team
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMaintenanceModal(true)}
                    className="px-2.5 py-1 bg-rpm-navy-600 text-white rounded font-bold text-xs hover:bg-rpm-navy-700 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Report</span>
                  </button>
                </div>

                {selectedVehicle.maintenanceReports.length > 0 ? (
                  <div className="space-y-2">
                    {selectedVehicle.maintenanceReports.map((rep) => (
                      <div key={rep.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{rep.serviceProvider}</span>
                          <span className="text-[10px] font-mono text-slate-500">{rep.reportDate}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{rep.workDescription}</p>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          <span>Uploaded by: {rep.uploadedBy} • Cost: AED {rep.costAED}</span>
                          <span className="text-rpm-navy-600 font-bold hover:underline cursor-pointer">
                            Download PDF ↗
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-400">
                    No maintenance reports uploaded yet.
                  </div>
                )}
              </div>

              {/* DOH Inspection Checklist (Section 7.6) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                    DOH Equipment Standards Inspection
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedVehicle.dohEquipmentChecklistPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedVehicle.dohEquipmentChecklistPassed ? '✓ Passed' : 'Inspection Pending'}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Ambulance Coordinator sign-off is mandatory before deployment for all UAE operations.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600">
                    Coordinator Signoff: <strong>{selectedVehicle.ambulanceCoordinatorSigned ? 'Signed & Validated' : 'Pending Sign-off'}</strong>
                  </span>
                  {!selectedVehicle.ambulanceCoordinatorSigned && (
                    <button
                      onClick={() => onUpdateInspection(selectedVehicle.id, true)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs"
                    >
                      Sign Off Inspection
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Onboard New Ambulance (UAE Form)</h3>
                <p className="text-xs text-slate-300">Enforces Mulkiya, ROP, DOH Classification & BioMed documents</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-slate-300">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plate Number (UAE Format) *</label>
                  <input
                    type="text"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    placeholder="e.g. Abu Dhabi 5 - 88192"
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                    required
                  />
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ambulance Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    <option value="ALS">ALS (Advanced Life Support)</option>
                    <option value="BLS">BLS (Basic Life Support)</option>
                    <option value="Mobile ICU">Mobile ICU</option>
                    <option value="PTV">PTV Patient Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Drive Type *</label>
                  <select
                    value={newDriveType}
                    onChange={(e) => setNewDriveType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="4x4">4x4 (Desert / Offshore)</option>
                    <option value="4x2">4x2 (City / Highway)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ownership Type *</label>
                  <select
                    value={newOwnership}
                    onChange={(e) => setNewOwnership(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="RPM-owned">RPM-owned</option>
                    <option value="Rental">Rental Company</option>
                  </select>
                </div>
              </div>

              {newOwnership === 'Rental' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rental Vendor Name *</label>
                  <input
                    type="text"
                    value={newRentalCompany}
                    onChange={(e) => setNewRentalCompany(e.target.value)}
                    placeholder="e.g. Thrifty Fleet Leasing UAE"
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
              )}

              {/* UAE Mandatory Expiry Dates */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase block text-[10px]">
                  UAE Mandatory Document Expiries:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Mulkiya Expiry *</label>
                    <input
                      type="date"
                      value={newMulkiyaExpiry}
                      onChange={(e) => setNewMulkiyaExpiry(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">ROP Permit Expiry *</label>
                    <input
                      type="date"
                      value={newRopExpiry}
                      onChange={(e) => setNewRopExpiry(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">DOH Class Expiry *</label>
                    <input
                      type="date"
                      value={newDohClassExpiry}
                      onChange={(e) => setNewDohClassExpiry(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="adnocEligible"
                  checked={newAdnocEligible}
                  onChange={(e) => setNewAdnocEligible(e.target.checked)}
                  className="rounded text-rpm-navy-600"
                />
                <label htmlFor="adnocEligible" className="font-semibold text-slate-700">
                  ADNOC Offshore / Remote Field Eligible (Includes roll cage & spark arrestor)
                </label>
              </div>

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
                  Submit for Fleet Supervisor Approval →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Maintenance Report Modal */}
      {showMaintenanceModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold">Upload Maintenance Report (PDF)</h3>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleMaintenanceSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Provider / Workshop *</label>
                <input
                  type="text"
                  value={serviceProvider}
                  onChange={(e) => setServiceProvider(e.target.value)}
                  placeholder="e.g. Emirates Motor Company (EMC)"
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Description & Parts Replaced *</label>
                <textarea
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                  placeholder="Detail service items, oil change, brake calibration..."
                  className="w-full p-2 border border-slate-300 rounded h-20"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maintenance Cost (AED)</label>
                <input
                  type="number"
                  value={costAED}
                  onChange={(e) => setCostAED(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-center text-slate-500">
                <Upload className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                <span>Maintenance_Invoice_Report.pdf attached</span>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Save to Vehicle Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

