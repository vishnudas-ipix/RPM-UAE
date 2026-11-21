import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  FileCheck,
  Check,
  X
} from 'lucide-react';
import { PMApproval, PMProject } from '../pm.types';

interface PMApprovalViewProps {
  approvals: PMApproval[];
  projects: PMProject[];
  onDecide: (
    approvalId: string,
    decision: PMApproval['decision'],
    remarks: string,
    conditionNote?: string
  ) => void;
}

export const PMApprovalView: React.FC<PMApprovalViewProps> = ({
  approvals,
  projects,
  onDecide,
}) => {
  const [selectedApproval, setSelectedApproval] = useState<PMApproval | null>(null);
  const [decisionType, setDecisionType] = useState<PMApproval['decision']>('Approved');
  const [remarks, setRemarks] = useState('');
  const [conditionNote, setConditionNote] = useState('');

  const pendingApprovals = approvals.filter((a) => a.decision === 'Pending');
  const pastApprovals = approvals.filter((a) => a.decision !== 'Pending');

  const handleOpenDecisionModal = (
    approval: PMApproval,
    decision: PMApproval['decision']
  ) => {
    setSelectedApproval(approval);
    setDecisionType(decision);
    setRemarks('');
    setConditionNote('');
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval) return;
    onDecide(selectedApproval.id, decisionType, remarks, conditionNote);
    setSelectedApproval(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Project Governance & Gate Approvals</h2>
          <p className="text-xs text-slate-500">
            Initial feasibility validation, budget sign-off, conditional approvals, and clarification requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Pending Actions:</span>
          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
            {pendingApprovals.length} Requests
          </span>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <Clock size={15} />
            <span>Awaiting Management Decision</span>
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingApprovals.map((app) => {
            const project = projects.find((p) => p.id === app.projectId);
            return (
              <div key={app.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {project?.code || 'PRJ'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{project?.name || 'Project'}</h4>
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                        {app.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted by {app.reviewer} • {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Decision Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleOpenDecisionModal(app, 'Approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleOpenDecisionModal(app, 'Conditional')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold"
                    >
                      Conditional
                    </button>
                    <button
                      onClick={() => handleOpenDecisionModal(app, 'Clarification')}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold"
                    >
                      Clarify
                    </button>
                    <button
                      onClick={() => handleOpenDecisionModal(app, 'Rejected')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {project && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Budget</span>
                      <span className="font-bold text-slate-800">AED {project.estimatedBudget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Start Date</span>
                      <span className="font-semibold text-slate-800">{project.startDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Target End</span>
                      <span className="font-semibold text-slate-800">{project.expectedEndDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Client / Category</span>
                      <span className="font-semibold text-slate-800">{project.client} ({project.category})</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {pendingApprovals.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No approvals pending management action.
            </div>
          )}
        </div>
      </div>

      {/* Past Decisions Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Completed Decision History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Project</th>
                <th className="py-2.5 px-4">Stage</th>
                <th className="py-2.5 px-4">Reviewer</th>
                <th className="py-2.5 px-4">Decision</th>
                <th className="py-2.5 px-4">Decided At</th>
                <th className="py-2.5 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pastApprovals.map((app) => {
                const project = projects.find((p) => p.id === app.projectId);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{project?.name || 'Project'}</td>
                    <td className="py-3 px-4 text-slate-600">{app.stage}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{app.reviewer}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.decision === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.decision === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : app.decision === 'Conditional'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.decision}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{app.decidedAt || app.submittedAt}</td>
                    <td className="py-3 px-4 text-slate-600 italic">{app.remarks || app.conditionNote || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DECISION MODAL */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Record Governance Decision: {decisionType}
              </h3>
              <button onClick={() => setSelectedApproval(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleConfirmDecision} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Remarks / Justification *</label>
                <textarea
                  rows={3}
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="State the formal governance remarks, validation findings, or prerequisites..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              {decisionType === 'Conditional' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Condition Notes</label>
                  <textarea
                    rows={2}
                    value={conditionNote}
                    onChange={(e) => setConditionNote(e.target.value)}
                    placeholder="Specific conditions that must be resolved within milestone period..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApproval(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg font-bold ${
                    decisionType === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : decisionType === 'Rejected'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Confirm {decisionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
