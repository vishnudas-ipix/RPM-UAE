import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Server,
  RotateCcw,
  ShieldCheck,
  Check,
  X,
  FileText
} from 'lucide-react';
import { PMDeployment, PMDeploymentStatus } from '../pm.types';

interface PMDeploymentViewProps {
  projectId: string;
  deployments: PMDeployment[];
  onAddDeployment: (d: Partial<PMDeployment>) => void;
  onUpdateDeployment: (d: PMDeployment) => void;
}

export const PMDeploymentView: React.FC<PMDeploymentViewProps> = ({
  projectId,
  deployments,
  onAddDeployment,
  onUpdateDeployment,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [releaseVersion, setReleaseVersion] = useState('v1.4.0');
  const [environment, setEnvironment] = useState('Staging / UAT Environment');
  const [plannedDate, setPlannedDate] = useState('');
  const [owner, setOwner] = useState('DevOps Lead (RPM Cloud)');
  const [rollbackPlan, setRollbackPlan] = useState('Revert container image to v1.3.9 via AWS ECR tag update');
  const [notes, setNotes] = useState('');

  const projectDeployments = deployments.filter((d) => d.projectId === projectId);

  const handleToggleChecklist = (dep: PMDeployment, itemIndex: number) => {
    const updatedChecklist = dep.checklist.map((c, i) =>
      i === itemIndex ? { ...c, completed: !c.completed } : c
    );
    onUpdateDeployment({
      ...dep,
      checklist: updatedChecklist,
    });
  };

  const handleStatusChange = (dep: PMDeployment, newStatus: PMDeploymentStatus) => {
    onUpdateDeployment({
      ...dep,
      status: newStatus,
      actualDate: newStatus === 'Successful' ? new Date().toISOString().split('T')[0] : dep.actualDate,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseVersion.trim()) return;

    onAddDeployment({
      projectId,
      releaseVersion,
      environment,
      plannedDate: plannedDate || new Date().toISOString().split('T')[0],
      status: 'Planned',
      owner,
      checklist: [
        { item: 'Database Backup & Migration Snapshot Confirmed', completed: false },
        { item: 'Production Code Freeze & Signed Artifact Verified', completed: false },
        { item: 'AWS UAE Cloud Infrastructure Readiness (CPU/Mem/LB)', completed: false },
        { item: 'Security & DOH Data Encryption Keys In Place', completed: false },
        { item: 'Smoke Test Scripts Pre-Configured', completed: false },
        { item: 'Rollback & Emergency Recovery Protocol Approved', completed: false },
      ],
      rollbackPlan,
      validationResults: 'Pending post-deployment automated health check',
      notes,
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Deployment & Go-Live Governance</h2>
          <p className="text-xs text-slate-500">
            Release gating, environment verification, rollback assurance, and production readiness
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Rocket size={14} />
          <span>Plan Release / Deployment</span>
        </button>
      </div>

      {/* Deployment Records */}
      <div className="space-y-6">
        {projectDeployments.map((dep) => {
          const completedChecks = dep.checklist.filter((c) => c.completed).length;
          const totalChecks = dep.checklist.length;
          const isReady = completedChecks === totalChecks;

          return (
            <div
              key={dep.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Server size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        Release {dep.releaseVersion}
                      </h3>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {dep.environment}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          dep.status === 'Successful'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dep.status === 'Rolled Back'
                            ? 'bg-red-100 text-red-800'
                            : dep.status === 'Ready for Deployment'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {dep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Owner: {dep.owner} • Planned: {dep.plannedDate}
                      {dep.actualDate && ` • Deployed: ${dep.actualDate}`}
                    </p>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2">
                  {dep.status === 'Planned' && (
                    <button
                      onClick={() => handleStatusChange(dep, 'Ready for Deployment')}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Authorize Ready
                    </button>
                  )}

                  {dep.status === 'Ready for Deployment' && (
                    <button
                      onClick={() => handleStatusChange(dep, 'Deployment in Progress')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Rocket size={13} />
                      <span>Start Go-Live</span>
                    </button>
                  )}

                  {dep.status === 'Deployment in Progress' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(dep, 'Successful')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Check size={13} />
                        <span>Confirm Success</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(dep, 'Rolled Back')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <RotateCcw size={13} />
                        <span>Trigger Rollback</span>
                      </button>
                    </>
                  )}

                  {dep.status === 'Successful' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={16} /> Live in Production
                    </span>
                  )}
                </div>
              </div>

              {/* Deployment Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Go-Live Readiness Checklist ({completedChecks} / {totalChecks} Verified)
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {Math.round((completedChecks / totalChecks) * 100)}% Ready
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {dep.checklist.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(dep, idx)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                        {item.item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rollback & Validation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-amber-50/40 border border-amber-200/80 p-3.5 rounded-xl">
                  <span className="font-bold text-amber-900 block text-[10px] uppercase mb-1">
                    Pre-Approved Rollback Plan
                  </span>
                  <p className="text-slate-700">{dep.rollbackPlan}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                  <span className="font-bold text-slate-800 block text-[10px] uppercase mb-1">
                    Validation Results
                  </span>
                  <p className="text-slate-700">{dep.validationResults || 'All smoke tests passed.'}</p>
                </div>
              </div>
            </div>
          );
        })}

        {projectDeployments.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No deployments logged yet. Plan a new release to start tracking production deployment.
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Plan Release / Deployment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Release Version *</label>
                  <input
                    type="text"
                    required
                    value={releaseVersion}
                    onChange={(e) => setReleaseVersion(e.target.value)}
                    placeholder="e.g. v2.1.0-RC1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Environment</label>
                  <input
                    type="text"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Planned Date</label>
                  <input
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deployment Owner</label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Rollback Strategy</label>
                <textarea
                  rows={2}
                  value={rollbackPlan}
                  onChange={(e) => setRollbackPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
