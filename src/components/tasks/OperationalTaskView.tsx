import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  User,
  Calendar,
  Briefcase
} from 'lucide-react';
import { OperationalTask, Project, UserRole } from '../../types';

interface OperationalTaskViewProps {
  tasks: OperationalTask[];
  projects: Project[];
  currentRole: UserRole;
  onAddTask: (newTask: Partial<OperationalTask>) => void;
  onUpdateStatus: (taskId: string, newStatus: OperationalTask['status']) => void;
}

export const OperationalTaskView: React.FC<OperationalTaskViewProps> = ({
  tasks,
  projects,
  currentRole,
  onAddTask,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('Rashid Al-Nuaimi');
  const [assignedRole, setAssignedRole] = useState('Project Lead');
  const [priority, setPriority] = useState<OperationalTask['priority']>('High');
  const [dueDate, setDueDate] = useState('2026-04-05');
  const [linkedPrj, setLinkedPrj] = useState(projects[0]?.id || '');

  const filteredTasks = tasks.filter((t) => {
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchSearch =
      t.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.linkedProjectName && t.linkedProjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchPriority && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === linkedPrj);
    const newTask: Partial<OperationalTask> = {
      taskTitle: title,
      description: desc,
      assignedTo,
      assignedToRole: assignedRole,
      linkedProjectId: linkedPrj,
      linkedProjectName: prj?.name,
      priority,
      dueDate,
      status: 'Pending',
      attachmentsCount: 1,
      createdBy: `${currentRole}`,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Operational Task Management
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 8 (UAE)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracks operational activities, field readiness checklists, calibration verifications, and compliance milestones with automated overdue escalation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Operational Task</span>
        </button>
      </div>

      {/* Task Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks, assignees, projects..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rpm-navy-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue (Auto-Flagged)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredTasks.length}</strong> tasks
        </span>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Task Details</th>
                <th className="py-3 px-3">Linked Project</th>
                <th className="py-3 px-3">Assigned To</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-bold text-slate-900 block text-xs">{task.taskTitle}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{task.description}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Created by: {task.createdBy}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-medium text-slate-800 block truncate max-w-[160px]">
                      {task.linkedProjectName || 'General Operational'}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800 block">{task.assignedTo}</span>
                    <span className="text-[10px] text-slate-500">{task.assignedToRole}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-medium text-slate-700">
                    {task.dueDate}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      task.status === 'Overdue' ? 'bg-red-100 text-red-800 font-black animate-pulse' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as any)}
                      className="text-xs p-1 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="Pending">Mark Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Mark Done ✓</option>
                      <option value="Overdue">Flag Overdue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3 bg-rpm-navy-800 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold">Create Operational Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Verify ROP Route Permits for Meydan Convoy"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Provide complete task scope and action items..."
                  className="w-full p-2 border border-slate-300 rounded h-20"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Linked Project</label>
                  <select
                    value={linkedPrj}
                    onChange={(e) => setLinkedPrj(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded font-bold"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Person *</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Create & Notify Assignee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

