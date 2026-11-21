import React, { useState } from 'react';
import {
  GitBranch,
  DollarSign,
  Plus,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  X,
  Edit2,
  FileText,
  Users
} from 'lucide-react';
import { PMProject, PMPhase, PMBudget, PMTask, PMTeamMember } from '../pm.types';

interface PMPlanningViewProps {
  project: PMProject;
  phases: PMPhase[];
  budgets: PMBudget[];
  tasks: PMTask[];
  teamMembers: PMTeamMember[];
  onAddPhase: (p: Partial<PMPhase>) => void;
  onUpdatePhase: (p: PMPhase) => void;
  onAddBudget: (b: Partial<PMBudget>) => void;
  onUpdateBudget: (b: PMBudget) => void;
}

type TabType = 'wbs' | 'budget' | 'scope' | 'resources';

export const PMPlanningView: React.FC<PMPlanningViewProps> = ({
  project,
  phases,
  budgets,
  tasks,
  teamMembers,
  onAddPhase,
  onUpdatePhase,
  onAddBudget,
  onUpdateBudget,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('wbs');

  // Phase modal
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [phaseName, setPhaseName] = useState('');
  const [phaseDesc, setPhaseDesc] = useState('');
  const [phaseStart, setPhaseStart] = useState('');
  const [phaseEnd, setPhaseEnd] = useState('');

  // Budget modal
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetCat, setBudgetCat] = useState('Resource & Engineering');
  const [budgetDept, setBudgetDept] = useState('Digital Ops');
  const [plannedAmt, setPlannedAmt] = useState(100000);
  const [actualAmt, setActualAmt] = useState(0);
  const [budgetNotes, setBudgetNotes] = useState('');

  const projectPhases = phases.filter((p) => p.projectId === project.id).sort((a, b) => a.order - b.order);
  const projectBudgets = budgets.filter((b) => b.projectId === project.id);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectMembers = teamMembers.filter((m) => m.projectId === project.id);

  // Budget calculations
  const totalPlannedBudget = projectBudgets.reduce((sum, b) => sum + b.plannedAmount, 0) || project.estimatedBudget;
  const totalActualCost = projectBudgets.reduce((sum, b) => sum + b.actualAmount, 0) || project.actualCost;
  const budgetVariance = totalPlannedBudget - totalActualCost;

  const handleSavePhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseName.trim()) return;

    onAddPhase({
      projectId: project.id,
      name: phaseName,
      description: phaseDesc,
      plannedStart: phaseStart || project.startDate,
      plannedEnd: phaseEnd || project.expectedEndDate,
      progressPercent: 0,
      status: 'Not Started',
      order: projectPhases.length + 1,
    });
    setShowPhaseModal(false);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const planned = Number(plannedAmt) || 0;
    const actual = Number(actualAmt) || 0;

    onAddBudget({
      projectId: project.id,
      category: budgetCat,
      department: budgetDept,
      plannedAmount: planned,
      actualAmount: actual,
      variance: planned - actual,
      notes: budgetNotes,
    });
    setShowBudgetModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Top Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('wbs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'wbs' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>WBS & Phases ({projectPhases.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'budget' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign size={14} />
            <span>Budget & Expenses</span>
          </button>
          <button
            onClick={() => setActiveTab('scope')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'scope' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={14} />
            <span>Scope Baseline</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'resources' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>Resource Capacity</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'wbs' && (
            <button
              onClick={() => setShowPhaseModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              <Plus size={15} />
              <span>Add Phase</span>
            </button>
          )}
          {activeTab === 'budget' && (
            <button
              onClick={() => setShowBudgetModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              <Plus size={15} />
              <span>Add Budget Allocation</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. WBS & PHASES */}
      {activeTab === 'wbs' && (
        <div className="space-y-4">
          {projectPhases.map((phase) => {
            const phaseTasks = projectTasks.filter((t) => t.phaseId === phase.id);
            const completedPhaseTasks = phaseTasks.filter((t) => t.status === 'Completed').length;

            return (
              <div
                key={phase.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center text-xs">
                      #{phase.order}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{phase.name}</h3>
                      <p className="text-xs text-slate-500">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar size={13} /> {phase.plannedStart} → {phase.plannedEnd}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        phase.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : phase.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {phase.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>
                      Phase Completion ({completedPhaseTasks} of {phaseTasks.length} tasks done)
                    </span>
                    <span className="font-bold text-slate-900">{phase.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        phase.progressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${phase.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {projectPhases.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
              No phases defined yet. Click "Add Phase" to structure your Work Breakdown Structure.
            </div>
          )}
        </div>
      )}

      {/* 2. BUDGET PLANNING */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Planned Budget
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                AED {totalPlannedBudget.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">Approved project cost baseline</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Actual Expenditure
              </span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">
                AED {totalActualCost.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {((totalActualCost / totalPlannedBudget) * 100).toFixed(1)}% of total allocated budget spent
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Budget Variance
              </span>
              <div
                className={`text-2xl font-extrabold mt-1 ${
                  budgetVariance >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                AED {Math.abs(budgetVariance).toLocaleString()} {budgetVariance >= 0 ? 'Under' : 'Over'}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {budgetVariance >= 0 ? 'Cost within approved ceiling' : 'Requires management change request'}
              </p>
            </div>
          </div>

          {/* Budget Line Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cost Breakdown by Category & Department
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Expense Category</th>
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4 text-right">Planned (AED)</th>
                    <th className="py-2.5 px-4 text-right">Actual (AED)</th>
                    <th className="py-2.5 px-4 text-right">Variance</th>
                    <th className="py-2.5 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {projectBudgets.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{b.category}</td>
                      <td className="py-3 px-4 text-slate-600">{b.department}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        AED {b.plannedAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        AED {b.actualAmount.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold ${
                          b.variance >= 0 ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        AED {b.variance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{b.notes || '—'}</td>
                    </tr>
                  ))}
                  {projectBudgets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No budget line items recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SCOPE BASELINE */}
      {activeTab === 'scope' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs text-slate-700">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Scope of Work (Approved Baseline)</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed text-slate-800">
              {project.scopeOfWork || 'No formal scope of work document recorded.'}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Business Requirements</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed text-slate-800">
              {project.businessRequirements || 'No specific business requirements entered.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Expected Deliverables</h4>
              <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl text-blue-900 leading-relaxed">
                {project.deliverables || 'Deliverables not formally cataloged.'}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Initial Assumptions & Dependencies</h4>
              <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl text-amber-900 leading-relaxed">
                {project.assumptions || project.dependencies || 'Standard enterprise operating environment assumed.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESOURCE CAPACITY */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Allocated Human Resources & Capacity Planning
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Resource</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4 text-center">Allocation</th>
                  <th className="py-2.5 px-4">Period</th>
                  <th className="py-2.5 px-4 text-right">Est. Cost (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projectMembers.map((m) => {
                  const estCost = Math.round((m.allocationPercent / 100) * 45000);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                      <td className="py-3 px-4 text-blue-700 font-medium">{m.role}</td>
                      <td className="py-3 px-4 text-slate-600">{m.department}</td>
                      <td className="py-3 px-4 text-center font-bold">{m.allocationPercent}%</td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {m.startDate} → {m.endDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        AED {estCost.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD PHASE MODAL */}
      {showPhaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Add WBS Phase</h3>
              <button onClick={() => setShowPhaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSavePhase} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phase Name *</label>
                <input
                  type="text"
                  required
                  value={phaseName}
                  onChange={(e) => setPhaseName(e.target.value)}
                  placeholder="e.g. Discovery & Requirements Validation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planned Start</label>
                  <input
                    type="date"
                    value={phaseStart}
                    onChange={(e) => setPhaseStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planned End</label>
                  <input
                    type="date"
                    value={phaseEnd}
                    onChange={(e) => setPhaseEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={phaseDesc}
                  onChange={(e) => setPhaseDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhaseModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Add Phase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BUDGET MODAL */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Add Budget Allocation</h3>
              <button onClick={() => setShowBudgetModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveBudget} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Category *</label>
                <input
                  type="text"
                  required
                  value={budgetCat}
                  onChange={(e) => setBudgetCat(e.target.value)}
                  placeholder="e.g. Infrastructure Hosting & AWS"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={budgetDept}
                    onChange={(e) => setBudgetDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planned Amount (AED)</label>
                  <input
                    type="number"
                    value={plannedAmt}
                    onChange={(e) => setPlannedAmt(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={budgetNotes}
                  onChange={(e) => setBudgetNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
