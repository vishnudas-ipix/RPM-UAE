import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  X,
  History,
  Folder,
  Check,
  XCircle,
  FileCheck
} from 'lucide-react';
import { PMDocument, PMDocumentCategory, PMDocumentVersion } from '../pm.types';

interface PMDocumentViewProps {
  projectId: string;
  documents: PMDocument[];
  onAddDocument: (doc: Partial<PMDocument>) => void;
  onUpdateDocument: (doc: PMDocument) => void;
}

const CATEGORIES: PMDocumentCategory[] = [
  'Project Proposal',
  'Statement of Work',
  'Requirements',
  'Contracts',
  'Technical Documentation',
  'Design Documents',
  'Development Documents',
  'QA Documents',
  'UAT Documents',
  'Deployment Documents',
  'Client Approvals',
  'Handover Documents',
  'Closure Documents',
];

export const PMDocumentView: React.FC<PMDocumentViewProps> = ({
  projectId,
  documents,
  onAddDocument,
  onUpdateDocument,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingHistoryDoc, setViewingHistoryDoc] = useState<PMDocument | null>(null);

  // Form states
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<PMDocumentCategory>('Technical Documentation');
  const [docDesc, setDocDesc] = useState('');
  const [docVersion, setDocVersion] = useState('v1.0');
  const [docSize, setDocSize] = useState('2.4 MB');

  const projectDocs = documents.filter((d) => d.projectId === projectId);

  const filteredDocs = projectDocs.filter((d) => {
    if (selectedCat !== 'all' && d.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    onAddDocument({
      projectId,
      name: docName,
      category: docCategory,
      description: docDesc,
      uploadedBy: 'Ahmed Al Rashidi',
      uploadedAt: new Date().toISOString().split('T')[0],
      version: docVersion,
      approvalStatus: 'Draft',
      size: docSize,
      versions: [
        {
          version: docVersion,
          uploadedBy: 'Ahmed Al Rashidi',
          uploadedAt: new Date().toISOString().split('T')[0],
          changeNote: 'Initial upload',
        },
      ],
    });
    setShowUploadModal(false);
  };

  const handleApprovalAction = (doc: PMDocument, newStatus: PMDocument['approvalStatus']) => {
    onUpdateDocument({
      ...doc,
      approvalStatus: newStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Project Document Repository</h2>
          <p className="text-xs text-slate-500">
            Version-controlled artifacts, specifications, contracts, and signed governance records
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Upload size={14} />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Category Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-3 shadow-sm h-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
            Categories ({CATEGORIES.length})
          </span>
          <div className="space-y-0.5">
            <button
              onClick={() => setSelectedCat('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                selectedCat === 'all'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>All Documents</span>
              <span className="text-[11px] font-bold text-slate-400">{projectDocs.length}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const count = projectDocs.filter((d) => d.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                    selectedCat === cat
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {count > 0 && (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Document Cards & Table */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title, description..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        doc.approvalStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : doc.approvalStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : doc.approvalStatus === 'Rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {doc.approvalStatus}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                    {doc.description || 'No description entered.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                      {doc.version}
                    </span>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingHistoryDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                      title="Version History"
                    >
                      <History size={14} />
                    </button>
                    {doc.approvalStatus !== 'Approved' && (
                      <button
                        onClick={() => handleApprovalAction(doc, 'Approved')}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                No documents found in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VERSION HISTORY MODAL */}
      {viewingHistoryDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Document Version History</h3>
              <button onClick={() => setViewingHistoryDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs mb-2">{viewingHistoryDoc.name}</h4>
              <div className="space-y-2">
                {(viewingHistoryDoc.versions || []).map((v, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-blue-700 font-mono">{v.version}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{v.changeNote}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-400">
                      <div>{v.uploadedBy}</div>
                      <div>{v.uploadedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Upload Project Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. System Requirements Specification (SRS) v2.0"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Version</label>
                  <input
                    type="text"
                    value={docVersion}
                    onChange={(e) => setDocVersion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
