import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  XCircle,
  FileCheck,
  Shield,
  Layers,
  ChevronRight,
  Filter,
  Search,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ApprovalRequest, UserRole } from '../../types';

interface ApprovalWorkflowViewProps {
  approvals: ApprovalRequest[];
  currentRole: UserRole;
  onApprove: (id: string, comment?: string) => void;
  onConditionalApprove: (id: string, condition: string, days: number) => void;
  onClarify: (id: string, query: string) => void;
  onDecline: (id: string, reason: string) => void;
  onOverride: (id: string, reason: string) => void;
}

export const ApprovalWorkflowView: React.FC<ApprovalWorkflowViewProps> = ({
  approvals,
  currentRole,
  onApprove,
  onConditionalApprove,
  onClarify,
  onDecline,
  onOverride,
}) => {
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(null);
  const [actionType, setActionType] = useState<
    'approve' | 'conditional' | 'clarify' | 'decline' | 'override' | null
  >(null);
  const [commentText, setCommentText] = useState('');
  const [conditionDays, setConditionDays] = useState(5);
  const [filterType, setFilterType] = useState<string>('All');

  // Format seconds to hh:mm:ss
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00:00 (EXPIRED)';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (actionType === 'approve') {
      onApprove(selectedReq.id, commentText);
    } else if (actionType === 'conditional') {
      onConditionalApprove(selectedReq.id, commentText || 'PO must be uploaded within threshold', conditionDays);
    } else if (actionType === 'clarify') {
      onClarify(selectedReq.id, commentText);
    } else if (actionType === 'decline') {
      onDecline(selectedReq.id, commentText);
    } else if (actionType === 'override') {
      onOverride(selectedReq.id, commentText);
    }

    setSelectedReq(null);
    setActionType(null);
    setCommentText('');
  };

  const filteredApprovals = approvals.filter((a) => {
    if (filterType === 'All') return true;
    return a.moduleType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Approval Workflow & 24-Hour Lock System
            </h1>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300">
              Module 2 Escalation Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforces 24-hour auto-intimation to GM, conditional approvals (5-day PO window), clarification loops, and controlled overrides.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-rpm-navy-50 text-rpm-navy-700 font-bold px-3 py-1.5 rounded-lg border border-rpm-navy-200">
            Current Approver: {currentRole}
          </span>
        </div>
      </div>

      {/* 24-Hour Timer Escalation Callout */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 rounded-xl border border-amber-300 flex items-start space-x-3 text-xs">
        <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0 animate-pulse" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            24-Hour Auto-Intimation & Escalation Logic Active
          </p>
          <p className="text-amber-900">
            Every approval request enters a 24-hour lock window upon submission. If the approver takes no action within 24 hours, an auto-intimation is dispatched to GM & higher management.
          </p>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Module Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium"
            >
              <option value="All">All Types</option>
              <option value="Project Initiation">Project Initiation</option>
              <option value="Resource Allocation">Resource Allocation</option>
              <option value="Manpower Swap">Manpower Swap</option>
              <option value="Ambulance Request">Ambulance Request</option>
              <option value="MRF Request">MRF Request</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredApprovals.length}</strong> pending approval requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-3">Module Type</th>
                <th className="py-3 px-3">Project / Account</th>
                <th className="py-3 px-3">Requested By</th>
                <th className="py-3 px-3">Submitted At</th>
                <th className="py-3 px-3">24h Lock Countdown</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApprovals.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-rpm-navy-700">
                    {req.requestId}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {req.moduleType}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{req.projectName}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {req.requestedBy}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                    {new Date(req.submittedAt).toLocaleDateString()} {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-1.5">
                      <Clock className={`w-3.5 h-3.5 ${req.isEscalated ? 'text-red-600' : 'text-amber-500'}`} />
                      <span className={`font-mono font-bold text-xs ${
                        req.isEscalated ? 'text-red-700 font-black animate-pulse' : 'text-slate-800'
                      }`}>
                        {formatTime(req.lockTimerRemainingSeconds)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.isEscalated
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {req.isEscalated ? 'GM ESCALATED' : req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Approve */}
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setActionType('approve');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors"
                        title="Approve Submission"
                      >
                        Approve
                      </button>

                      {/* Conditional */}
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setActionType('conditional');
                        }}
                        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-xs transition-colors"
                        title="Conditional Approval (e.g. 5 days for PO)"
                      >
                        Conditional
                      </button>

                      {/* Clarification */}
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setActionType('clarify');
                        }}
                        className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-xs transition-colors"
                        title="Request Clarification from BD"
                      >
                        Clarify
                      </button>

                      {/* Decline */}
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setActionType('decline');
                        }}
                        className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded text-xs transition-colors"
                        title="Decline Submission"
                      >
                        Decline
                      </button>

                      {/* Override */}
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setActionType('override');
                        }}
                        className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded text-xs transition-colors"
                        title="Controlled Operational Override"
                      >
                        Override
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal (Approve / Conditional / Clarify / Decline / Override) */}
      {selectedReq && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold capitalize">
                  {actionType === 'conditional'
                    ? 'Conditional Approval Handling'
                    : actionType === 'override'
                    ? 'Controlled Resource Override'
                    : `${actionType} Request`}
                </h3>
                <span className="text-xs text-slate-300 font-mono">
                  {selectedReq.requestId} — {selectedReq.projectName}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedReq(null);
                  setActionType(null);
                }}
                className="text-white hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-6 space-y-4 text-xs">
              {actionType === 'conditional' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-2">
                  <p className="font-bold">Conditional Approval Window:</p>
                  <p>
                    Account status becomes <strong>Pending Document Submission</strong>. BD receives daily reminder notifications until fulfilled. If BD fails within the window, GM is alerted and account remains locked.
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="font-semibold">Fulfillment Window (Days):</span>
                    <input
                      type="number"
                      value={conditionDays}
                      onChange={(e) => setConditionDays(Number(e.target.value))}
                      min={1}
                      max={14}
                      className="w-16 p-1 border border-slate-300 rounded font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {actionType === 'override' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 space-y-1">
                  <p className="font-bold">Controlled Override Mechanism (Section 6.6):</p>
                  <p>
                    Allows bridging real-world operational ground lag. Does not bypass mandatory clinical certification or roadworthiness checks. Immutable audit trail recorded.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {actionType === 'clarify'
                    ? 'Clarification Question to Submitter (Mandatory) *'
                    : actionType === 'decline'
                    ? 'Decline Justification (Mandatory) *'
                    : actionType === 'override'
                    ? 'Operational Justification for Override (Mandatory) *'
                    : 'Remarks / Instructions (Optional)'}
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter detailed notes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg h-24 focus:bg-white focus:border-rpm-navy-500"
                  required={['clarify', 'decline', 'override'].includes(actionType)}
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-y-0 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReq(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-lg shadow-xs transition-colors ${
                    actionType === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : actionType === 'decline'
                      ? 'bg-red-600 hover:bg-red-700'
                      : actionType === 'conditional'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rpm-navy-600 hover:bg-rpm-navy-700'
                  }`}
                >
                  Confirm {actionType.toUpperCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

