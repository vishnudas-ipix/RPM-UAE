import React, { useState } from 'react';
import {
  Archive,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Lock,
  RotateCcw,
  Clock,
  DollarSign,
  Check,
  X
} from 'lucide-react';
import {
  PMProject,
  PMClosure,
  PMTask,
  PMMilestone,
  PMDocument,
  PMDeployment,
} from '../pm.types';

interface PMClosureViewProps {
  project: PMProject;
  closure: PMClosure | undefined;
  tasks: PMTask[];
  milestones: PMMilestone[];
  documents: PMDocument[];
  deployments: PMDeployment[];
  onInitiateClosure: (closure: Partial<PMClosure>) => void;
  onUpdateClosure: (closure: PMClosure) => void;
  onCloseProject: (projectId: string) => void;
}

export const PMClosureView: React.FC<PMClosureViewProps> = ({
  project,
  closure,
  tasks,
  milestones,
  documents,
  deployments,
  onInitiateClosure,
  onUpdateClosure,
  onCloseProject,
}) => {
  const [actualEndDate, setActualEndDate] = useState(
    closure?.actualEndDate || new Date().toISOString().split('T')[0]
  );
  const [finalCost, setFinalCost] = useState(closure?.finalCost || project.actualCost);
  const [deliverablesSummary, setDeliverablesSummary] = useState(
    closure?.deliverablesSummary || 'All contract scope items delivered and tested.'
  );
  const [clientAcceptance, setClientAcceptance] = useState<PMClosure['clientAcceptance']>(
    closure?.clientAcceptance || 'Accepted'
  );
  const [lessonsLearned, setLessonsLearned] = useState(
    closure?.lessonsLearned ||
      'Strong cross-functional collaboration between IT and UAE operations was critical for on-time delivery.'
  );
  const [pmRemarks, setPmRemarks] = useState(
    closure?.pmRemarks || 'Ready for formal project archiving and warranty support phase.'
  );

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectDeployments = deployments.filter((d) => d.projectId === project.id);

  // Automated Checklist Validation
  const incompleteTasks = projectTasks.filter(
    (t) => t.status !== 'Completed' && t.status !== 'Cancelled'
  ).length;
  const incompleteMilestones = projectMilestones.filter(
    (m) => m.status !== 'Completed'
  ).length;
  const hasSuccessfulDeployment = projectDeployments.some(
    (d) => d.status === 'Successful'
  );
  const hasClosureDocs = projectDocs.some(
    (d) => d.category === 'Closure Documents' || d.category === 'Handover Documents'
  );

  const checklistItems = [
    { label: 'All Project Tasks Completed or Waived', passed: incompleteTasks === 0, count: `${projectTasks.length - incompleteTasks}/${projectTasks.length}` },
    { label: 'All Phase & Gate Milestones Completed', passed: incompleteMilestones === 0, count: `${projectMilestones.length - incompleteMilestones}/${projectMilestones.length}` },
    { label: 'Production Deployment & Smoke Test Confirmed', passed: hasSuccessfulDeployment || projectDeployments.length === 0, count: hasSuccessfulDeployment ? 'Verified' : 'N/A' },
    { label: 'Handover & Closure Documentation Cataloged', passed: hasClosureDocs || projectDocs.length > 0, count: `${projectDocs.length} Docs` },
    { label: 'Formal Client Sign-Off & Acceptance Received', passed: clientAcceptance === 'Accepted', count: clientAcceptance },
  ];

  const allChecksPassed = checklistItems.every((c) => c.passed);
  const isClosed = project.status === 'Closed' || project.status === 'Archived';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInitiateClosure({
      projectId: project.id,
      actualStartDate: project.startDate,
      actualEndDate,
      finalCost: Number(finalCost) || 0,
      budgetVariance: project.estimatedBudget - Number(finalCost),
      deliverablesSummary,
      clientAcceptance,
      lessonsLearned,
      pmRemarks,
      closureApproval: 'Approved',
      approvedBy: 'General Manager (RPM UAE)',
      approvedAt: new Date().toISOString().split('T')[0],
      checklist: checklistItems.map((c) => ({ item: c.label, completed: c.passed })),
    });
    onCloseProject(project.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900">Project Handover & Closure Governance</h2>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isClosed ? 'bg-slate-800 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Final stage gate, audit trail verification, knowledge transfer, and archive seal
          </p>
        </div>

        {isClosed && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Lock size={15} />
            <span>Project Formally Closed & Archived</span>
          </div>
        )}
      </div>

      {/* Closure Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Stage Gate Closure Readiness Checklist
        </h3>
        <div className="space-y-2.5">
          {checklistItems.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                c.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-amber-50/50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2.5 font-semibold">
                {c.passed ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                )}
                <span>{c.label}</span>
              </div>
              <span className="font-mono text-[11px] font-bold">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Closure Submission Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900">Final Closure Sign-Off & Lessons Learned</h3>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Actual Completion Date</label>
              <input
                type="date"
                required
                disabled={isClosed}
                value={actualEndDate}
                onChange={(e) => setActualEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Final Actual Cost (AED)</label>
              <input
                type="number"
                required
                disabled={isClosed}
                value={finalCost}
                onChange={(e) => setFinalCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Client Formal Acceptance</label>
              <select
                disabled={isClosed}
                value={clientAcceptance}
                onChange={(e) => setClientAcceptance(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none disabled:bg-slate-100"
              >
                <option value="Accepted">Accepted with Formal Sign-Off</option>
                <option value="Pending">Pending Final Client Review</option>
                <option value="Rejected">Conditional Acceptance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Deliverables & Handover Summary</label>
            <textarea
              rows={2}
              disabled={isClosed}
              value={deliverablesSummary}
              onChange={(e) => setDeliverablesSummary(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Lessons Learned & Retrospective</label>
            <textarea
              rows={3}
              disabled={isClosed}
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Project Manager Final Remarks</label>
            <textarea
              rows={2}
              disabled={isClosed}
              value={pmRemarks}
              onChange={(e) => setPmRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none disabled:bg-slate-100"
            />
          </div>

          {!isClosed && (
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm"
              >
                <Archive size={16} />
                <span>Authorize Handover & Close Project</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
