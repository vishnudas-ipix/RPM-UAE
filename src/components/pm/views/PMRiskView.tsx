import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  ShieldAlert,
  HelpCircle,
  GitMerge,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  X,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  PMRisk,
  PMIssue,
  PMChangeRequest,
  PMRiskSeverity,
  PMRiskStatus,
  PMIssueStatus,
  PMChangeStatus,
  PMTaskPriority,
} from '../pm.types';

interface PMRiskViewProps {
  projectId: string;
  risks: PMRisk[];
  issues: PMIssue[];
  changeRequests: PMChangeRequest[];
  onAddRisk: (r: Partial<PMRisk>) => void;
  onUpdateRisk: (r: PMRisk) => void;
  onAddIssue: (i: Partial<PMIssue>) => void;
  onUpdateIssue: (i: PMIssue) => void;
  onAddChangeRequest: (cr: Partial<PMChangeRequest>) => void;
  onUpdateChangeRequest: (cr: PMChangeRequest) => void;
}

type TabType = 'risks' | 'issues' | 'changes';

const SEVERITY_CONFIG: Record<PMRiskSeverity, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  High: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  Low: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
};

export const PMRiskView: React.FC<PMRiskViewProps> = ({
  projectId,
  risks,
  issues,
  changeRequests,
  onAddRisk,
  onUpdateRisk,
  onAddIssue,
  onUpdateIssue,
  onAddChangeRequest,
  onUpdateChangeRequest,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('risks');

  // Modals
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showCRModal, setShowCRModal] = useState(false);

  // Risk form states
  const [riskTitle, setRiskTitle] = useState('');
  const [riskDesc, setRiskDesc] = useState('');
  const [riskProb, setRiskProb] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [riskImpact, setRiskImpact] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [riskOwner, setRiskOwner] = useState('Ahmed Al Rashidi');
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [contingencyPlan, setContingencyPlan] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  // Issue form states
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issuePriority, setIssuePriority] = useState<PMTaskPriority>('High');
  const [issueOwner, setIssueOwner] = useState('Sarah Johnson');
  const [targetDate, setTargetDate] = useState('');

  // CR form states
  const [crRequestedBy, setCrRequestedBy] = useState('Client (ADNOC HSE)');
  const [crDesc, setCrDesc] = useState('');
  const [crReason, setCrReason] = useState('');
  const [crScopeImpact, setCrScopeImpact] = useState('');
  const [crTimelineImpact, setCrTimelineImpact] = useState('');
  const [crBudgetImpact, setCrBudgetImpact] = useState(0);
  const [crTechImpact, setCrTechImpact] = useState('');

  const projectRisks = risks.filter((r) => r.projectId === projectId);
  const projectIssues = issues.filter((i) => i.projectId === projectId);
  const projectCRs = changeRequests.filter((cr) => cr.projectId === projectId);

  const calculateScore = (prob: 'High' | 'Medium' | 'Low', impact: 'High' | 'Medium' | 'Low') => {
    const pVal = prob === 'High' ? 3 : prob === 'Medium' ? 2 : 1;
    const iVal = impact === 'High' ? 3 : impact === 'Medium' ? 2 : 1;
    return pVal * iVal;
  };

  const calculateSeverity = (score: number): PMRiskSeverity => {
    if (score >= 7) return 'Critical';
    if (score >= 5) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  };

  const handleSaveRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskTitle.trim()) return;

    const score = calculateScore(riskProb, riskImpact);
    const sev = calculateSeverity(score);

    onAddRisk({
      projectId,
      title: riskTitle,
      description: riskDesc,
      probability: riskProb,
      impact: riskImpact,
      riskScore: score,
      severity: sev,
      owner: riskOwner,
      mitigationPlan,
      contingencyPlan,
      reviewDate: reviewDate || new Date().toISOString().split('T')[0],
      status: 'Open',
      identifiedAt: new Date().toISOString().split('T')[0],
    });
    setShowRiskModal(false);
  };

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    onAddIssue({
      projectId,
      title: issueTitle,
      description: issueDesc,
      priority: issuePriority,
      owner: issueOwner,
      reportedDate: new Date().toISOString().split('T')[0],
      targetResolutionDate: targetDate || new Date().toISOString().split('T')[0],
      resolutionRemarks: '',
      status: 'Open',
    });
    setShowIssueModal(false);
  };

  const handleSaveCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crDesc.trim()) return;

    const count = projectCRs.length + 1;
    onAddChangeRequest({
      projectId,
      changeId: `CRQ-2026-${String(count).padStart(3, '0')}`,
      requestedBy: crRequestedBy,
      description: crDesc,
      reason: crReason,
      scopeImpact: crScopeImpact,
      timelineImpact: crTimelineImpact,
      budgetImpact: Number(crBudgetImpact) || 0,
      technicalImpact: crTechImpact,
      decision: 'Under Review',
      implementationStatus: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
    });
    setShowCRModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Top Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('risks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'risks' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Risk Register ({projectRisks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'issues' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Issue Log ({projectIssues.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'changes' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitMerge size={14} />
            <span>Change Requests ({projectCRs.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'risks' && (
            <button
              onClick={() => setShowRiskModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus size={15} />
              <span>Log Risk</span>
            </button>
          )}
          {activeTab === 'issues' && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus size={15} />
              <span>Raise Issue</span>
            </button>
          )}
          {activeTab === 'changes' && (
            <button
              onClick={() => setShowCRModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus size={15} />
              <span>Submit Change Request</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. RISKS TAB */}
      {activeTab === 'risks' && (
        <div className="space-y-6">
          {/* Risk Heatmap Summary & Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Risk Probability vs Impact Matrix
              </h3>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-3 bg-amber-100/60 rounded text-amber-900">
                  Medium-Low
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'High' && r.impact === 'Low').length}
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded text-orange-900">
                  High-Med
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'High' && r.impact === 'Medium').length}
                  </div>
                </div>
                <div className="p-3 bg-red-200 rounded text-red-900">
                  Critical
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'High' && r.impact === 'High').length}
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded text-slate-700">
                  Low-Low
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'Medium' && r.impact === 'Low').length}
                  </div>
                </div>
                <div className="p-3 bg-amber-100 rounded text-amber-900">
                  Med-Med
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'Medium' && r.impact === 'Medium').length}
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded text-orange-900">
                  Med-High
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'Medium' && r.impact === 'High').length}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border rounded text-slate-600">
                  Low-Low
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'Low' && r.impact === 'Low').length}
                  </div>
                </div>
                <div className="p-3 bg-slate-100 rounded text-slate-700">
                  Low-Med
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'Low' && r.impact === 'Medium').length}
                  </div>
                </div>
                <div className="p-3 bg-amber-100 rounded text-amber-900">
                  Low-High
                  <div className="text-base font-extrabold mt-1">
                    {projectRisks.filter((r) => r.probability === 'Low' && r.impact === 'High').length}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center">
                Top row: High Probability • Right col: High Impact
              </p>
            </div>

            {/* Risk Register Table */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Risk Register
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Risk Title & Mitigation</th>
                      <th className="py-2.5 px-3 text-center">Severity</th>
                      <th className="py-2.5 px-3">Owner</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {projectRisks.map((risk) => {
                      const sev = SEVERITY_CONFIG[risk.severity] || SEVERITY_CONFIG.Medium;
                      return (
                        <tr key={risk.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900">{risk.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              Plan: {risk.mitigationPlan}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}
                            >
                              {risk.severity} ({risk.riskScore})
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{risk.owner}</td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                              {risk.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {risk.status === 'Open' ? (
                              <button
                                onClick={() => onUpdateRisk({ ...risk, status: 'Mitigated' })}
                                className="px-2 py-1 text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded font-semibold"
                              >
                                Mitigate
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Closed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {projectRisks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          No risks recorded for this project.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ISSUES TAB */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Issues Log & Resolution Tracking
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Issue Description</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Owner</th>
                  <th className="py-2.5 px-4">Reported</th>
                  <th className="py-2.5 px-4">Target Date</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projectIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{issue.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{issue.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                        {issue.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{issue.owner}</td>
                    <td className="py-3 px-4 text-slate-500">{issue.reportedDate}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{issue.targetResolutionDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          issue.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : issue.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {issue.status !== 'Resolved' && (
                        <button
                          onClick={() => onUpdateIssue({ ...issue, status: 'Resolved' })}
                          className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {projectIssues.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No open issues reported.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CHANGE REQUESTS TAB */}
      {activeTab === 'changes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Change Request Management & Baseline Control
              </h3>
              <p className="text-[11px] text-slate-500">
                Formal changes to project scope, schedule, budget, or architecture
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">CR ID</th>
                  <th className="py-2.5 px-4">Description & Reason</th>
                  <th className="py-2.5 px-4">Requested By</th>
                  <th className="py-2.5 px-4">Budget Impact</th>
                  <th className="py-2.5 px-4">Timeline Impact</th>
                  <th className="py-2.5 px-4">Decision</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projectCRs.map((cr) => (
                  <tr key={cr.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{cr.changeId}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{cr.description}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Reason: {cr.reason}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{cr.requestedBy}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {cr.budgetImpact > 0 ? `+AED ${cr.budgetImpact.toLocaleString()}` : 'AED 0'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{cr.timelineImpact || 'No impact'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cr.decision === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cr.decision === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cr.decision}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {cr.decision === 'Under Review' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onUpdateChangeRequest({ ...cr, decision: 'Approved' })}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateChangeRequest({ ...cr, decision: 'Rejected' })}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-semibold rounded"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Decided</span>
                      )}
                    </td>
                  </tr>
                ))}
                {projectCRs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No change requests submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RISK MODAL */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Log Project Risk</h3>
              <button onClick={() => setShowRiskModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveRisk} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Risk Title *</label>
                <input
                  type="text"
                  required
                  value={riskTitle}
                  onChange={(e) => setRiskTitle(e.target.value)}
                  placeholder="e.g. DOH Licensing Delay for Emergency Ambulance Roster"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Probability</label>
                  <select
                    value={riskProb}
                    onChange={(e) => setRiskProb(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="High">High (Score 3)</option>
                    <option value="Medium">Medium (Score 2)</option>
                    <option value="Low">Low (Score 1)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Impact</label>
                  <select
                    value={riskImpact}
                    onChange={(e) => setRiskImpact(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="High">High (Score 3)</option>
                    <option value="Medium">Medium (Score 2)</option>
                    <option value="Low">Low (Score 1)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Risk Owner</label>
                <input
                  type="text"
                  value={riskOwner}
                  onChange={(e) => setRiskOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mitigation Plan</label>
                <textarea
                  rows={2}
                  value={mitigationPlan}
                  onChange={(e) => setMitigationPlan(e.target.value)}
                  placeholder="Proactive steps to prevent risk occurrence..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contingency Plan</label>
                <textarea
                  rows={2}
                  value={contingencyPlan}
                  onChange={(e) => setContingencyPlan(e.target.value)}
                  placeholder="Action to take if risk materializes..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRiskModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Log Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Raise Project Issue</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveIssue} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. Telematics GPS ping failure in Western Region"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={issuePriority}
                    onChange={(e) => setIssuePriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Resolution Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Owner</label>
                <input
                  type="text"
                  value={issueOwner}
                  onChange={(e) => setIssueOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Impact</label>
                <textarea
                  rows={3}
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Raise Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CR MODAL */}
      {showCRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Submit Change Request</h3>
              <button onClick={() => setShowCRModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveCR} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Requested By</label>
                <input
                  type="text"
                  value={crRequestedBy}
                  onChange={(e) => setCrRequestedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Change Description *</label>
                <textarea
                  rows={2}
                  required
                  value={crDesc}
                  onChange={(e) => setCrDesc(e.target.value)}
                  placeholder="Detail the requested change to deliverables or scope..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Business Reason</label>
                <textarea
                  rows={2}
                  value={crReason}
                  onChange={(e) => setCrReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Budget Impact (AED)</label>
                  <input
                    type="number"
                    value={crBudgetImpact}
                    onChange={(e) => setCrBudgetImpact(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Timeline Impact</label>
                  <input
                    type="text"
                    value={crTimelineImpact}
                    onChange={(e) => setCrTimelineImpact(e.target.value)}
                    placeholder="e.g. +2 weeks"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCRModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
