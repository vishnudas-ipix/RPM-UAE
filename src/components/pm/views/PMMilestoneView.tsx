import React, { useState } from 'react';
import {
  Flag,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ChevronRight,
  X,
  Send,
  Check,
  RefreshCw,
  User
} from 'lucide-react';
import { PMMilestone, PMPhase, PMMilestoneStatus } from '../pm.types';

interface PMMilestoneViewProps {
  projectId: string;
  milestones: PMMilestone[];
  phases: PMPhase[];
  onAddMilestone: (m: Partial<PMMilestone>) => void;
  onUpdateMilestone: (m: PMMilestone) => void;
}

const MILESTONE_STATUS_CONFIG: Record<
  PMMilestoneStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  'Not Started': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', label: 'Not Started' },
  'In Progress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'In Progress' },
  'Pending Review': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending Review' },
  Approved: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Approved' },
  Delayed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Delayed' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Completed' },
};

export const PMMilestoneView: React.FC<PMMilestoneViewProps> = ({
  projectId,
  milestones,
  phases,
  onAddMilestone,
  onUpdateMilestone,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<PMMilestone | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phaseId, setPhaseId] = useState('');
  const [description, setDescription] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Ahmed Al Rashidi');
  const [deliverables, setDeliverables] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');

  const projectMilestones = milestones.filter((m) => m.projectId === projectId);

  const completedCount = projectMilestones.filter((m) => m.status === 'Completed').length;
  const inProgressCount = projectMilestones.filter((m) => m.status === 'In Progress').length;
  const pendingReviewCount = projectMilestones.filter((m) => m.status === 'Pending Review').length;
  const delayedCount = projectMilestones.filter((m) => m.status === 'Delayed').length;

  const handleOpenAdd = () => {
    setName('');
    setPhaseId(phases[0]?.id || '');
    setDescription('');
    setPlannedDate('');
    setResponsiblePerson('Ahmed Al Rashidi');
    setDeliverables('');
    setAcceptanceCriteria('');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !plannedDate) return;

    onAddMilestone({
      projectId,
      phaseId: phaseId || undefined,
      name,
      description,
      plannedDate,
      responsiblePerson,
      deliverables,
      acceptanceCriteria,
      status: 'Not Started',
      progressPercent: 0,
      approvalStatus: 'Pending',
    });
    setShowAddModal(false);
  };

  const handleTransition = (milestone: PMMilestone, newStatus: PMMilestoneStatus, approvalStatus?: 'Pending' | 'Approved' | 'Rejected') => {
    const updated: PMMilestone = {
      ...milestone,
      status: newStatus,
      approvalStatus: approvalStatus || milestone.approvalStatus,
      progressPercent: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : milestone.progressPercent,
      actualDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : milestone.actualDate,
    };
    onUpdateMilestone(updated);
    if (selectedMilestone?.id === milestone.id) {
      setSelectedMilestone(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Milestones</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{projectMilestones.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Flag size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Completed</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">{completedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Review</span>
            <div className="text-2xl font-extrabold text-amber-700 mt-0.5">{pendingReviewCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Delayed / Overdue</span>
            <div className="text-2xl font-extrabold text-red-700 mt-0.5">{delayedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Project Deliverables & Gate Milestones</h2>
          <p className="text-xs text-slate-500">
            Formal gate reviews, sign-offs, and critical delivery checkpoints
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {projectMilestones.map((m) => {
          const statusCfg = MILESTONE_STATUS_CONFIG[m.status] || MILESTONE_STATUS_CONFIG['Not Started'];
          const phase = phases.find((p) => p.id === m.phaseId);

          return (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <Flag size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                      {phase && (
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {phase.name}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{m.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Date</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(m.plannedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {m.actualDate && (
                    <div className="text-right border-l border-slate-200 pl-3">
                      <span className="text-[10px] text-emerald-600 uppercase font-bold block">Completed On</span>
                      <span className="font-semibold text-emerald-700">{m.actualDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Body: Deliverables + Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 text-[10px] uppercase block mb-1">
                    Associated Deliverables
                  </span>
                  <p className="text-slate-600">{m.deliverables || 'None specified'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 text-[10px] uppercase block mb-1">
                    Acceptance Criteria
                  </span>
                  <p className="text-slate-600">{m.acceptanceCriteria || 'Formal stakeholder sign-off'}</p>
                </div>
              </div>

              {/* Progress & Transition Controls */}
              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                {/* Progress bar */}
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                  <span className="font-medium text-slate-500 text-[11px] shrink-0">Progress:</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        m.progressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-800 text-[11px] shrink-0">{m.progressPercent}%</span>
                </div>

                {/* Workflow action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {m.status === 'Not Started' && (
                    <button
                      onClick={() => handleTransition(m, 'In Progress')}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg font-semibold text-xs flex items-center gap-1.5"
                    >
                      <span>Start Milestone</span>
                    </button>
                  )}

                  {m.status === 'In Progress' && (
                    <button
                      onClick={() => handleTransition(m, 'Pending Review')}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg font-semibold text-xs flex items-center gap-1.5"
                    >
                      <Send size={13} />
                      <span>Submit for Review</span>
                    </button>
                  )}

                  {m.status === 'Pending Review' && (
                    <>
                      <button
                        onClick={() => handleTransition(m, 'Approved', 'Approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Check size={13} />
                        <span>Approve Deliverables</span>
                      </button>
                      <button
                        onClick={() => handleTransition(m, 'In Progress', 'Rejected')}
                        className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg font-semibold text-xs"
                      >
                        Request Rework
                      </button>
                    </>
                  )}

                  {m.status === 'Approved' && (
                    <button
                      onClick={() => handleTransition(m, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      <span>Mark Completed & Close Gate</span>
                    </button>
                  )}

                  {m.status === 'Completed' && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 size={15} /> Completed & Signed Off
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {projectMilestones.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <Flag size={32} className="mx-auto text-slate-300 mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No Milestones Defined Yet</h4>
            <p className="text-xs text-slate-400 mt-1">
              Add key deliverables, stage gates, and client sign-off dates.
            </p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Create Project Milestone</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Milestone Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Stage 3A Architecture Watermark Sign-off"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Phase</label>
                  <select
                    value={phaseId}
                    onChange={(e) => setPhaseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                  >
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planned Date *</label>
                  <input
                    type="date"
                    required
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Responsible Lead</label>
                <input
                  type="text"
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Associated Deliverables</label>
                <textarea
                  rows={2}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="List of documents, code packages, or equipment delivered..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Acceptance Criteria</label>
                <textarea
                  rows={2}
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  placeholder="Requirements for stakeholder approval..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
