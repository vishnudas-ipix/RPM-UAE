import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
  FileText,
  Upload,
  Calendar,
  Building,
  Lock,
  Download,
  AlertOctagon,
  Eye,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import {
  GeneralCompanyDocument,
  Manpower,
  Vehicle,
  Emirate,
  UserRole
} from '../../types';

interface ComplianceDocumentViewProps {
  generalDocs: GeneralCompanyDocument[];
  manpowerList: Manpower[];
  vehicles: Vehicle[];
  selectedEmirate: Emirate | 'All';
  currentRole: UserRole;
  onAddGeneralDoc: (doc: Partial<GeneralCompanyDocument>) => void;
}

export const ComplianceDocumentView: React.FC<ComplianceDocumentViewProps> = ({
  generalDocs,
  manpowerList,
  vehicles,
  selectedEmirate,
  currentRole,
  onAddGeneralDoc,
}) => {
  const [activeTab, setActiveTab] = useState<'expiryTracker' | 'generalMaster'>('expiryTracker');
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'All' | 'Manpower' | 'Fleet' | 'Company'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Expiring Soon' | 'Expired' | 'Active'>('All');
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // New General Doc State
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<GeneralCompanyDocument['category']>('Trade Licence');
  const [authority, setAuthority] = useState('Abu Dhabi DED');
  const [issueDate, setIssueDate] = useState('2025-01-01');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [hasNoExpiry, setHasNoExpiry] = useState(false);
  const [emirate, setEmirate] = useState<Emirate>('Abu Dhabi');
  const [division, setDivision] = useState('Corporate Operations');

  // Compile compliance items across Manpower, Fleet, and Company
  const allComplianceItems: {
    id: string;
    type: 'Manpower' | 'Fleet' | 'Company';
    subject: string;
    docName: string;
    authority: string;
    expiryDate: string;
    status: 'Active' | 'Expiring Soon' | 'Expired';
    daysToExpiry: number;
    emirate: Emirate;
  }[] = [];

  // Add Manpower doc expiries
  manpowerList.forEach((m) => {
    // Emirates ID
    allComplianceItems.push({
      id: `eid-${m.id}`,
      type: 'Manpower',
      subject: `${m.name} (${m.role})`,
      docName: 'Emirates ID (2-Yr Cycle)',
      authority: 'Federal ICP',
      expiryDate: m.emiratesIdExpiry,
      status: m.emiratesIdExpiry < '2026-03-27' ? 'Expired' : m.emiratesIdExpiry < '2026-05-01' ? 'Expiring Soon' : 'Active',
      daysToExpiry: Math.floor((new Date(m.emiratesIdExpiry).getTime() - new Date('2026-03-27').getTime()) / 86400000),
      emirate: m.emirate,
    });
    // Health Authority
    if (m.healthAuthorityLicenseNo) {
      allComplianceItems.push({
        id: `lic-${m.id}`,
        type: 'Manpower',
        subject: `${m.name} (${m.role})`,
        docName: `${m.healthAuthorityType} Clinical License`,
        authority: m.healthAuthorityType || 'DOH',
        expiryDate: m.healthAuthorityLicenseExpiry || '2027-01-01',
        status: (m.healthAuthorityLicenseExpiry || '') < '2026-03-27' ? 'Expired' : 'Active',
        daysToExpiry: 360,
        emirate: m.emirate,
      });
    }
  });

  // Add Fleet doc expiries
  vehicles.forEach((v) => {
    // Mulkiya
    allComplianceItems.push({
      id: `mul-${v.id}`,
      type: 'Fleet',
      subject: `${v.code} (${v.plateNo})`,
      docName: 'Mulkiya Registration (Abu Dhabi DMT)',
      authority: 'Police / DMT',
      expiryDate: v.mulkiyaExpiry,
      status: v.mulkiyaExpiry < '2026-03-27' ? 'Expired' : v.mulkiyaExpiry < '2026-05-01' ? 'Expiring Soon' : 'Active',
      daysToExpiry: Math.floor((new Date(v.mulkiyaExpiry).getTime() - new Date('2026-03-27').getTime()) / 86400000),
      emirate: v.emirate,
    });
    // ROP Permit
    allComplianceItems.push({
      id: `rop-${v.id}`,
      type: 'Fleet',
      subject: `${v.code} (${v.plateNo})`,
      docName: 'ROP Route Clearance Permit',
      authority: 'Abu Dhabi / Dubai Police',
      expiryDate: v.ropExpiry,
      status: v.ropExpiry < '2026-03-27' ? 'Expired' : 'Active',
      daysToExpiry: 220,
      emirate: v.emirate,
    });
  });

  // Add Company Docs
  generalDocs.forEach((g) => {
    allComplianceItems.push({
      id: `comp-${g.id}`,
      type: 'Company',
      subject: g.businessDivision,
      docName: g.name,
      authority: g.issuingAuthority,
      expiryDate: g.expiryDate || 'No Expiry',
      status: g.status,
      daysToExpiry: g.daysToExpiry || 999,
      emirate: g.emirate,
    });
  });

  const filteredItems = allComplianceItems.filter((item) => {
    const matchEmirate = selectedEmirate === 'All' || item.emirate === selectedEmirate;
    const matchScope = scopeFilter === 'All' || item.type === scopeFilter;
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEmirate && matchScope && matchStatus && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Partial<GeneralCompanyDocument> = {
      name: docName,
      category,
      issuingAuthority: authority,
      issueDate,
      expiryDate: hasNoExpiry ? undefined : expiryDate,
      hasNoExpiry,
      emirate,
      businessDivision: division,
      docPath: `/docs/company/${docName.replace(/\s+/g, '_')}.pdf`,
      status: 'Active',
      daysToExpiry: hasNoExpiry ? undefined : 600,
      uploadedBy: `${currentRole}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    onAddGeneralDoc(newDoc);
    setShowAddDocModal(false);
    setDocName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Compliance Module & General Document Master
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 9 & 13.7 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized document repository with 30/60/90-day expiry enforcement. Covers DOH facility licenses, Mulkiya, ROP, Emirates IDs, Trade Licences, and Corporate Insurances.
          </p>
        </div>

        <button
          onClick={() => setShowAddDocModal(true)}
          className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload General Company Document (13.7)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('expiryTracker')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeTab === 'expiryTracker'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Operational Expiry Tracker (Fleet & Manpower)
        </button>
        <button
          onClick={() => setActiveTab('generalMaster')}
          className={`px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
            activeTab === 'generalMaster'
              ? 'border-rpm-navy-600 text-rpm-navy-700 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Section 13.7: General Document Master (Company Level)
        </button>
      </div>

      {/* Tab 1: Expiry Tracker */}
      {activeTab === 'expiryTracker' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Total Tracked Documents</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">{allComplianceItems.length}</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Fully Compliant & Active</span>
              <p className="text-xl font-black text-emerald-700 mt-0.5">
                {allComplianceItems.filter(i => i.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-amber-700 font-bold uppercase">Expiring in 30/60 Days</span>
              <p className="text-xl font-black text-amber-700 mt-0.5">
                {allComplianceItems.filter(i => i.status === 'Expiring Soon').length}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-red-700 font-bold uppercase">Expired (Auto-Blocked)</span>
              <p className="text-xl font-black text-red-700 mt-0.5">
                {allComplianceItems.filter(i => i.status === 'Expired').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search subject, document, issuing authority..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rpm-navy-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-500 font-medium">Scope:</span>
                <select
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value="All">All Scopes</option>
                  <option value="Manpower">Clinical Manpower</option>
                  <option value="Fleet">Ambulances</option>
                  <option value="Company">Corporate / Company</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active (Compliant)</option>
                  <option value="Expiring Soon">Expiring Soon (30/60 Days)</option>
                  <option value="Expired">Expired (Non-Compliant)</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong className="text-slate-800">{filteredItems.length}</strong> compliance records
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Entity / Subject</th>
                    <th className="py-3 px-3">Scope</th>
                    <th className="py-3 px-3">Document Title</th>
                    <th className="py-3 px-3">Issuing Authority</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Days Left</th>
                    <th className="py-3 px-4 text-right">Compliance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.subject}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{item.docName}</td>
                      <td className="py-3 px-3 text-slate-600">{item.authority}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{item.expiryDate}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Expired'
                            ? 'bg-red-100 text-red-800 font-black animate-pulse'
                            : item.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.daysToExpiry < 0 ? 'EXPIRED' : `${item.daysToExpiry} days`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Reviewing compliance document: ${item.docName} for ${item.subject}`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                        >
                          Verify Doc →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: General Document Master (Section 13.7) */}
      {activeTab === 'generalMaster' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 uppercase">
                  Section 13.7: General Document Master — Company & Departmental Documents
                </h3>
                <span className="text-[10px] bg-rpm-navy-100 text-rpm-navy-800 font-bold px-2 py-0.5 rounded">
                  RBAC Governed
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Centralized repository for common organization-level documents (Trade Licence, DOH Ambulance Facility Licence, Civil Defence, Corporate Malpractice Policies, Biomedical SLAs).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-rpm-navy-700 font-bold bg-rpm-navy-50 px-2 py-0.5 rounded border border-rpm-navy-200 uppercase">
                      {doc.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{doc.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    doc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>Issuing Authority: <strong className="text-slate-800 block">{doc.issuingAuthority}</strong></div>
                  <div>Business Division: <strong className="text-slate-800 block">{doc.businessDivision}</strong></div>
                  <div>Issued: <strong className="text-slate-800 font-mono block">{doc.issueDate}</strong></div>
                  <div>Expires: <strong className="text-slate-800 font-mono block">{doc.expiryDate || 'No Expiry'}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Uploaded by: {doc.uploadedBy} on {doc.uploadDate}</span>
                  <button
                    onClick={() => alert(`Downloading verified PDF for ${doc.name}`)}
                    className="text-rpm-navy-600 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload General Doc Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold">Upload Company Document (Section 13.7)</h3>
              <button onClick={() => setShowAddDocModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Name *</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. DOH Ambulance Service Facility Operating License"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    <option value="Trade Licence">Trade Licence</option>
                    <option value="DOH Ambulance Facility Licence">DOH Ambulance Facility Licence</option>
                    <option value="Civil Defence Certificate">Civil Defence Certificate</option>
                    <option value="Corporate Insurance">Corporate Insurance</option>
                    <option value="Biomedical Master SLA">Biomedical Master SLA</option>
                    <option value="IT / Telecom Agreement">IT / Telecom Agreement</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emirate</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Issuing Authority *</label>
                <input
                  type="text"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disabled={hasNoExpiry}
                    className="w-full p-1.5 border border-slate-300 rounded disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="noExp"
                  checked={hasNoExpiry}
                  onChange={(e) => setHasNoExpiry(e.target.checked)}
                  className="rounded text-rpm-navy-600"
                />
                <label htmlFor="noExp" className="font-semibold text-slate-700 cursor-pointer">
                  This document has No Expiry (Permanent)
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Save to General Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

