import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  AlertCircle,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  Kanban,
  List,
  CalendarDays,
  GanttChartSquare,
  X,
  Edit2,
  Send,
  Flag
} from 'lucide-react';
import { PMTask, PMPhase, PMTeamMember, PMTaskStatus, PMTaskPriority, PMTaskComment } from '../pm.types';

interface PMTaskViewProps {
  projectId: string;
  tasks: PMTask[];
  phases: PMPhase[];
  teamMembers: PMTeamMember[];
  onAddTask: (task: Partial<PMTask>) => void;
  onUpdateTask: (task: PMTask) => void;
  onAddComment: (taskId: string, comment: string) => void;
}

type ViewMode = 'kanban' | 'list' | 'calendar' | 'timeline';

const KANBAN_COLUMNS: { status: PMTaskStatus; label: string; color: string; border: string; bg: string }[] = [
  { status: 'Backlog', label: 'Backlog', color: 'text-slate-600', border: 'border-slate-300', bg: 'bg-slate-50' },
  { status: 'To Do', label: 'To Do', color: 'text-blue-600', border: 'border-blue-300', bg: 'bg-blue-50/50' },
  { status: 'In Progress', label: 'In Progress', color: 'text-amber-600', border: 'border-amber-300', bg: 'bg-amber-50/50' },
  { status: 'On Hold', label: 'On Hold', color: 'text-orange-600', border: 'border-orange-300', bg: 'bg-orange-50/50' },
  { status: 'Under Review', label: 'Under Review', color: 'text-purple-600', border: 'border-purple-300', bg: 'bg-purple-50/50' },
  { status: 'Rework Required', label: 'Rework Required', color: 'text-rose-600', border: 'border-rose-300', bg: 'bg-rose-50/50' },
  { status: 'Completed', label: 'Completed', color: 'text-emerald-600', border: 'border-emerald-300', bg: 'bg-emerald-50/50' },
  { status: 'Cancelled', label: 'Cancelled', color: 'text-gray-400', border: 'border-gray-200', bg: 'bg-gray-50' },
];

const PRIORITY_BADGES: Record<PMTaskPriority, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  High: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Low: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};

export const PMTaskView: React.FC<PMTaskViewProps> = ({
  projectId,
  tasks,
  phases,
  teamMembers,
  onAddTask,
  onUpdateTask,
  onAddComment,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [selectedTask, setSelectedTask] = useState<PMTask | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<PMTaskStatus>('To Do');
  const [newCommentText, setNewCommentText] = useState('');

  // Form state for new task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<PMTaskPriority>('Medium');
  const [phaseId, setPhaseId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(16);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');

  // Filter tasks for this project
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.projectId === projectId);
  }, [tasks, projectId]);

  const filteredTasks = useMemo(() => {
    return projectTasks.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchId = t.taskId.toLowerCase().includes(q);
        const matchAssignee = t.assignedTo.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchAssignee) return false;
      }
      if (selectedPhase !== 'all' && t.phaseId !== selectedPhase) return false;
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      if (selectedAssignee !== 'all' && t.assignedTo !== selectedAssignee) return false;
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
      return true;
    });
  }, [projectTasks, searchQuery, selectedPhase, selectedPriority, selectedAssignee, selectedStatus]);

  const handleOpenAddModal = (defaultStatus: PMTaskStatus = 'To Do') => {
    setNewTaskStatus(defaultStatus);
    setTitle('');
    setDescription('');
    setAssignedTo(teamMembers[0]?.name || '');
    setPriority('Medium');
    setPhaseId(phases[0]?.id || '');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setEstimatedHours(16);
    setAcceptanceCriteria('');
    setShowAddModal(true);
  };

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const count = projectTasks.length + 1;
    const newTask: Partial<PMTask> = {
      taskId: `TSK-${String(count).padStart(3, '0')}`,
      projectId,
      phaseId: phaseId || undefined,
      title,
      description,
      assignedTo: assignedTo || 'Unassigned',
      priority,
      status: newTaskStatus,
      startDate,
      dueDate: dueDate || startDate,
      estimatedHours: Number(estimatedHours) || 0,
      actualHours: 0,
      dependencies: [],
      acceptanceCriteria,
      comments: [],
      createdBy: 'Ahmed Al Rashidi',
    };

    onAddTask(newTask);
    setShowAddModal(false);
  };

  const handleStatusChange = (task: PMTask, newStatus: PMTaskStatus) => {
    const updated = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
    if (selectedTask?.id === task.id) {
      setSelectedTask(updated);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newCommentText.trim()) return;
    onAddComment(selectedTask.id, newCommentText.trim());
    setNewCommentText('');
    // optimistically update view modal
    const newComment: PMTaskComment = {
      id: `comm-${Date.now()}`,
      taskId: selectedTask.id,
      author: 'Ahmed Al Rashidi',
      content: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setSelectedTask({
      ...selectedTask,
      comments: [...(selectedTask.comments || []), newComment],
    });
  };

  const isOverdue = (dateStr: string, status: PMTaskStatus) => {
    if (status === 'Completed' || status === 'Cancelled') return false;
    const due = new Date(dateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban size={14} />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List size={14} />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays size={14} />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GanttChartSquare size={14} />
            <span>Timeline</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Total: <span className="font-bold text-slate-800">{filteredTasks.length}</span> tasks
          </div>
          <button
            onClick={() => handleOpenAddModal('To Do')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by ID, title, assignee..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Phases</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Assignees</option>
          {Array.from(new Set(projectTasks.map((t) => t.assignedTo))).map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>

        {viewMode !== 'kanban' && (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses</option>
            {KANBAN_COLUMNS.map((c) => (
              <option key={c.status} value={c.status}>
                {c.label}
              </option>
            ))}
          </select>
        )}

        {(searchQuery || selectedPhase !== 'all' || selectedPriority !== 'all' || selectedAssignee !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPhase('all');
              setSelectedPriority('all');
              setSelectedAssignee('all');
              setSelectedStatus('all');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[600px]">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className={`w-72 shrink-0 rounded-xl border ${col.border} ${col.bg} flex flex-col max-h-[780px] shadow-sm`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200/80 flex items-center justify-between bg-white/70 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color.replace('text-', 'bg-')}`} />
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                    <span className="text-[11px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenAddModal(col.status)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Column Body / Cards */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {columnTasks.map((task) => {
                    const priorityCfg = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium;
                    const overdue = isOverdue(task.dueDate, task.status);

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
                      >
                        {/* Top: ID + Priority */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-mono font-bold text-slate-500">
                            {task.taskId}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-700 transition-colors">
                          {task.title}
                        </h4>

                        {/* Assignee & Dates */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                              {task.assignedTo.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[90px]">{task.assignedTo}</span>
                          </div>

                          <div className={`flex items-center gap-1 font-medium ${overdue ? 'text-red-600 font-bold' : ''}`}>
                            <Calendar size={12} />
                            <span>{new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>

                        {/* Footer badges: comments, hours */}
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                          {task.estimatedHours > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {task.estimatedHours}h
                            </span>
                          )}
                          {task.comments && task.comments.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare size={11} /> {task.comments.length}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 italic">
                      No tasks in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Phase</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Est / Act Hours</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTasks.map((task) => {
                  const priorityCfg = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium;
                  const overdue = isOverdue(task.dueDate, task.status);
                  const phaseObj = phases.find((p) => p.id === task.phaseId);

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {task.taskId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {phaseObj?.name || 'General'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center">
                            {task.assignedTo.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span>{task.assignedTo}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {task.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-medium ${overdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {overdue && <span className="ml-1 text-[10px] text-red-500 font-bold">(Overdue)</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {task.estimatedHours}h / <span className="text-slate-400">{task.actualHours}h</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                          className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No tasks found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="text-center font-bold text-slate-800 text-sm mb-4">
            Tasks by Due Date — Current Sprint
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="py-2 bg-slate-100 font-bold text-slate-600 rounded">
                {day}
              </div>
            ))}
            {/* Generate calendar cells for a 4-week window */}
            {Array.from({ length: 28 }).map((_, idx) => {
              const dayNum = (idx % 30) + 1;
              const dateStr = `2026-06-${String(dayNum).padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter((t) => t.dueDate.includes(String(dayNum).padStart(2, '0')));

              return (
                <div
                  key={idx}
                  className="min-h-[90px] border border-slate-100 rounded-lg p-1.5 text-left bg-slate-50/40 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="text-[10px] font-bold text-slate-400">{dayNum}</div>
                  <div className="space-y-1 mt-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTask(t)}
                        className="text-[10px] bg-white border border-slate-200 p-1 rounded font-medium text-slate-800 truncate shadow-2xs cursor-pointer hover:border-blue-400"
                        title={t.title}
                      >
                        <span className="font-bold text-blue-600">{t.taskId}:</span> {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[9px] text-blue-600 font-bold text-center">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="font-bold text-slate-800 text-sm mb-2">
            Task Execution Schedule
          </div>
          <div className="space-y-3">
            {filteredTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-4 text-xs">
                <div className="w-48 shrink-0 truncate">
                  <span className="font-mono font-bold text-blue-700">{t.taskId}</span>{' '}
                  <span className="font-medium text-slate-800">{t.title}</span>
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-4 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      t.status === 'Completed'
                        ? 'bg-emerald-500'
                        : t.status === 'In Progress'
                        ? 'bg-amber-500'
                        : t.status === 'Under Review'
                        ? 'bg-purple-500'
                        : 'bg-blue-500'
                    }`}
                    style={{
                      width: t.status === 'Completed' ? '100%' : t.status === 'In Progress' ? '55%' : '20%',
                    }}
                  />
                </div>
                <div className="w-32 text-right text-[11px] text-slate-500 shrink-0 font-medium">
                  {t.startDate} → {t.dueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL & COMMENT MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedTask.taskId}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700">
                    {selectedTask.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Status Transition Buttons */}
              <div>
                <label className="font-bold text-slate-900 mb-2 block uppercase tracking-wider text-[10px]">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {KANBAN_COLUMNS.map((col) => (
                    <button
                      key={col.status}
                      onClick={() => handleStatusChange(selectedTask, col.status)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
                        selectedTask.status === col.status
                          ? 'bg-blue-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned To</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedTask.assignedTo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Priority</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedTask.priority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Due Date</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedTask.dueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hours</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedTask.estimatedHours}h est.</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-900 mb-1.5 block uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
                  {selectedTask.description || 'No detailed description provided.'}
                </div>
              </div>

              {/* Acceptance Criteria */}
              {selectedTask.acceptanceCriteria && (
                <div>
                  <label className="font-bold text-slate-900 mb-1.5 block uppercase tracking-wider text-[10px]">
                    Acceptance Criteria
                  </label>
                  <div className="bg-emerald-50/50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 font-medium">
                    {selectedTask.acceptanceCriteria}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="pt-4 border-t border-slate-200">
                <label className="font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[10px]">Discussion & Comments</span>
                  <span className="text-slate-400 font-normal">{(selectedTask.comments || []).length} remarks</span>
                </label>

                {/* Comment List */}
                <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
                  {(selectedTask.comments || []).map((comm) => (
                    <div key={comm.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900">{comm.author}</span>
                        <span className="text-slate-400">{new Date(comm.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 text-xs">{comm.content}</p>
                    </div>
                  ))}

                  {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                    <div className="text-slate-400 italic text-center py-2">No comments yet. Start the conversation below.</div>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add an update or comment..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Create New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveNewTask} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement authentication middleware"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phase</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Assigned Team Member</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PMTaskPriority)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Est Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task scope, technical details, dependencies..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Acceptance Criteria</label>
                <textarea
                  rows={2}
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  placeholder="What must be verified for completion..."
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
