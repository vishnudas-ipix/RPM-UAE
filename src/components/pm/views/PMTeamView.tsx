import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Building,
  CheckCircle2,
  Calendar,
  Percent,
  Edit2,
  Trash2,
  X,
  Shield,
  Briefcase
} from 'lucide-react';
import { PMTeamMember, PMProject, PMTask, PMRole, PMRACIRole } from '../pm.types';

interface PMTeamViewProps {
  projectId: string;
  teamMembers: PMTeamMember[];
  project: PMProject;
  tasks: PMTask[];
  onAddMember: (member: Partial<PMTeamMember>) => void;
  onUpdateMember: (member: PMTeamMember) => void;
}

const RACI_BADGES: Record<PMRACIRole, { bg: string; text: string; label: string; desc: string }> = {
  Responsible: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'R', desc: 'Does the work' },
  Accountable: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'A', desc: 'Approves / owns result' },
  Consulted: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'C', desc: 'Provides input' },
  Informed: { bg: 'bg-slate-100', text: 'text-slate-800', label: 'I', desc: 'Kept updated' },
};

const ROLES_LIST: PMRole[] = [
  'Super Admin',
  'PM Admin',
  'Management',
  'Project Manager',
  'Project Coordinator',
  'Technical Lead',
  'Developer',
  'QA Engineer',
  'DevOps Engineer',
  'Finance Reviewer',
  'Client Reviewer',
];

export const PMTeamView: React.FC<PMTeamViewProps> = ({
  projectId,
  teamMembers,
  project,
  tasks,
  onAddMember,
  onUpdateMember,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<PMTeamMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<PMRole>('Developer');
  const [department, setDepartment] = useState('IT & Digital Systems');
  const [responsibility, setResponsibility] = useState('');
  const [allocationPercent, setAllocationPercent] = useState(100);
  const [startDate, setStartDate] = useState(project.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(project.expectedEndDate || '');
  const [raciRole, setRaciRole] = useState<PMRACIRole>('Responsible');
  const [email, setEmail] = useState('');

  const projectMembers = teamMembers.filter((m) => m.projectId === projectId);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setRole('Developer');
    setDepartment('IT & Digital Systems');
    setResponsibility('');
    setAllocationPercent(100);
    setStartDate(project.startDate || new Date().toISOString().split('T')[0]);
    setEndDate(project.expectedEndDate || '');
    setRaciRole('Responsible');
    setEmail('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (m: PMTeamMember) => {
    setEditingMember(m);
    setName(m.name);
    setRole(m.role);
    setDepartment(m.department);
    setResponsibility(m.responsibility);
    setAllocationPercent(m.allocationPercent);
    setStartDate(m.startDate);
    setEndDate(m.endDate);
    setRaciRole(m.raciRole);
    setEmail(m.email);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name,
        role,
        department,
        responsibility,
        allocationPercent: Number(allocationPercent),
        startDate,
        endDate,
        raciRole,
        email,
      });
    } else {
      onAddMember({
        projectId,
        name,
        role,
        department,
        responsibility,
        allocationPercent: Number(allocationPercent),
        startDate,
        endDate,
        raciRole,
        email,
      });
    }
    setShowAddModal(false);
  };

  // Mock Deliverables for RACI matrix
  const raciItems = [
    'Architecture & SRS Specification',
    'Core Workflow & Backend Engineering',
    'Frontend & UI/UX Development',
    'Quality Assurance & UAT Sign-off',
    'Cloud Infrastructure & CI/CD Pipeline',
    'Client Handover & Operations Training',
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Project Team & RACI Assignment</h2>
          <p className="text-xs text-slate-500">
            {projectMembers.length} active members assigned to <span className="font-semibold text-slate-800">{project.name}</span>
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={15} />
          <span>Assign Team Member</span>
        </button>
      </div>

      {/* Team Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectMembers.map((member) => {
          const assignedCount = tasks.filter((t) => t.assignedTo === member.name).length;
          const raci = RACI_BADGES[member.raciRole] || RACI_BADGES.Responsible;

          return (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {member.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit assignment"
                >
                  <Edit2 size={14} />
                </button>
              </div>

              {/* Responsibility */}
              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-800 block text-[10px] uppercase">Responsibility</span>
                {member.responsibility}
              </div>

              {/* Allocation bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-600">
                  <span>Allocation</span>
                  <span className="font-bold text-slate-900">{member.allocationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      member.allocationPercent >= 100
                        ? 'bg-red-500'
                        : member.allocationPercent >= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(member.allocationPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Details footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5" title={member.email}>
                  <Mail size={12} className="text-slate-400" />
                  <span className="truncate max-w-[140px]">{member.email}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${raci.bg} ${raci.text}`}
                  title={`${member.raciRole}: ${raci.desc}`}
                >
                  RACI: {raci.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RACI Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project RACI Responsibility Matrix
            </h3>
            <p className="text-[11px] text-slate-500">
              R = Responsible, A = Accountable, C = Consulted, I = Informed
            </p>
          </div>
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">R - Responsible</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">A - Accountable</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">C - Consulted</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded">I - Informed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-1/3">Project Deliverable / Workstream</th>
                {projectMembers.map((m) => (
                  <th key={m.id} className="py-2.5 px-4 text-center">
                    {m.name.split(' ')[0]}
                    <span className="block text-[10px] font-normal text-slate-400">{m.role}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {raciItems.map((item, idx) => (
                <tr key={item} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{item}</td>
                  {projectMembers.map((m, mIdx) => {
                    // Generate deterministic RACI assignments based on role & index
                    let val: PMRACIRole = 'Informed';
                    if (m.role === 'Project Manager') val = idx === 0 ? 'Accountable' : 'Accountable';
                    else if (m.role === 'Technical Lead') val = idx <= 2 ? 'Responsible' : 'Consulted';
                    else if (m.role === 'Developer') val = idx === 1 || idx === 2 ? 'Responsible' : 'Informed';
                    else if (m.role === 'QA Engineer') val = idx === 3 ? 'Responsible' : 'Consulted';
                    else if (m.role === 'DevOps Engineer') val = idx === 4 ? 'Responsible' : 'Informed';

                    const badge = RACI_BADGES[val];
                    return (
                      <td key={m.id} className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-block w-6 h-6 rounded-full font-bold text-xs leading-6 ${badge.bg} ${badge.text}`}
                          title={`${m.name}: ${val}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingMember ? 'Edit Team Assignment' : 'Assign Team Member'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohammed Al Hashimi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as PMRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                  >
                    {ROLES_LIST.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">RACI Responsibility</label>
                  <select
                    value={raciRole}
                    onChange={(e) => setRaciRole(e.target.value as PMRACIRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                  >
                    <option value="Responsible">Responsible (R)</option>
                    <option value="Accountable">Accountable (A)</option>
                    <option value="Consulted">Consulted (C)</option>
                    <option value="Informed">Informed (I)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Allocation %</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={allocationPercent}
                    onChange={(e) => setAllocationPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@rpm.ae"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Responsibility Summary</label>
                <textarea
                  rows={2}
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  placeholder="Primary tasks, deliverables owned, and technical domain..."
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
                  {editingMember ? 'Save Changes' : 'Assign Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
