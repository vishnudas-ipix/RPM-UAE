import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Paperclip,
  Check,
  X,
  FileCheck
} from 'lucide-react';
import { PMTestRecord } from '../pm.types';

interface PMQAViewProps {
  projectId: string;
  testRecords: PMTestRecord[];
  onAddRecord: (r: Partial<PMTestRecord>) => void;
  onUpdateRecord: (r: PMTestRecord) => void;
}

type TabType = 'testing' | 'uat';

export const PMQAView: React.FC<PMQAViewProps> = ({
  projectId,
  testRecords,
  onAddRecord,
  onUpdateRecord,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('testing');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PMTestRecord['type']>('Test Case');
  const [status, setStatus] = useState<PMTestRecord['status']>('Draft');
  const [severity, setSeverity] = useState<PMTestRecord['severity']>('Medium');
  const [assignedTo, setAssignedTo] = useState('Sarah Johnson (QA)');
  const [clientFeedback, setClientFeedback] = useState('');

  const projectTests = testRecords.filter((t) => t.projectId === projectId);
  const qatRecords = projectTests.filter((t) => t.type !== 'UAT');
  const uatRecords = projectTests.filter((t) => t.type === 'UAT');

  const totalTests = qatRecords.length;
  const passedTests = qatRecords.filter((t) => t.status === 'Passed').length;
  const failedTests = qatRecords.filter((t) => t.status === 'Failed').length;
  const blockedCount = qatRecords.filter((t) => t.status === 'Blocked').length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddRecord({
      projectId,
      type,
      title,
      status,
      severity: type === 'Defect' ? severity : undefined,
      assignedTo,
      submittedAt: new Date().toISOString().split('T')[0],
      clientFeedback: type === 'UAT' ? clientFeedback : undefined,
    });
    setShowAddModal(false);
  };

  const handleUATStatus = (rec: PMTestRecord, newStatus: PMTestRecord['status']) => {
    onUpdateRecord({
      ...rec,
      status: newStatus,
      resolvedAt: newStatus === 'Signed Off' ? new Date().toISOString().split('T')[0] : rec.resolvedAt,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'testing' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical size={14} />
            <span>QA Testing & Defects ({qatRecords.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('uat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'uat' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck size={14} />
            <span>User Acceptance Testing (UAT) ({uatRecords.length})</span>
          </button>
        </div>

        <button
          onClick={() => {
            setType(activeTab === 'uat' ? 'UAT' : 'Test Case');
            setTitle('');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus size={14} />
          <span>{activeTab === 'uat' ? 'Submit UAT Cycle' : 'Add Test / Defect'}</span>
        </button>
      </div>

      {/* 1. QA TESTING TAB */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tests Run</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalTests}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Tests Passed</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{passedTests}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Defects / Failed</span>
              <div className="text-2xl font-extrabold text-red-700 mt-1">{failedTests}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Quality Pass Rate</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{passRate}%</div>
            </div>
          </div>

          {/* Test Records Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Test Cases, Plans & Defect Tracking
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Record Title</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Severity</th>
                    <th className="py-2.5 px-4">Assigned QA</th>
                    <th className="py-2.5 px-4">Submitted</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {qatRecords.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{t.title}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {t.severity ? (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              t.severity === 'Critical'
                                ? 'bg-red-100 text-red-800'
                                : t.severity === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.severity}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{t.assignedTo}</td>
                      <td className="py-3 px-4 text-slate-500">{t.submittedAt}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'Passed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {t.status !== 'Passed' && (
                          <button
                            onClick={() => onUpdateRecord({ ...t, status: 'Passed' })}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold"
                          >
                            Mark Passed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {qatRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No QA test cases entered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. UAT TAB */}
      {activeTab === 'uat' && (
        <div className="space-y-4">
          {uatRecords.map((uat) => (
            <div
              key={uat.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{uat.title}</h4>
                  <span className="text-xs text-slate-500">
                    Assigned: {uat.assignedTo} • Submitted: {uat.submittedAt}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    uat.status === 'Signed Off'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {uat.status}
                </span>
              </div>

              {uat.clientFeedback && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-slate-800 block text-[10px] uppercase mb-0.5">
                    Client Feedback & Observations
                  </span>
                  {uat.clientFeedback}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 text-xs">
                {uat.status !== 'Signed Off' && (
                  <>
                    <button
                      onClick={() => handleUATStatus(uat, 'Signed Off')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve Client UAT Sign-Off</span>
                    </button>
                    <button
                      onClick={() => handleUATStatus(uat, 'Failed')}
                      className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold"
                    >
                      Log Rejection
                    </button>
                  </>
                )}
                {uat.status === 'Signed Off' && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={16} /> Formal Client Acceptance Completed
                  </span>
                )}
              </div>
            </div>
          ))}

          {uatRecords.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              No UAT test records submitted. Click "Submit UAT Cycle" to record client validation.
            </div>
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Create QA / UAT Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End-to-End Ambulance Booking Workflow Validation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Record Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Test Case">Test Case</option>
                    <option value="Defect">Defect</option>
                    <option value="Test Plan">Test Plan</option>
                    <option value="UAT">User Acceptance Test (UAT)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned QA / Lead</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              {type === 'UAT' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client Feedback Notes</label>
                  <textarea
                    rows={3}
                    value={clientFeedback}
                    onChange={(e) => setClientFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
