import React, { useState } from 'react';
import {
  Clock,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  Shield,
  Layers,
  Flag,
  DollarSign
} from 'lucide-react';
import { PMActivityLog, PMNotification } from '../pm.types';

interface PMActivityViewProps {
  projectId: string | null;
  activityLogs: PMActivityLog[];
  notifications: PMNotification[];
  onMarkNotificationRead: (id: string) => void;
}

type TabType = 'logs' | 'notifications';

export const PMActivityView: React.FC<PMActivityViewProps> = ({
  projectId,
  activityLogs,
  notifications,
  onMarkNotificationRead,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('logs');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = activityLogs.filter((log) => {
    if (projectId && log.projectId !== projectId) return false;
    if (selectedEntity !== 'all' && log.entity.toLowerCase() !== selectedEntity.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.remarks.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'logs' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={14} />
            <span>Audit Trail & Activity Log ({filteredLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'notifications' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell size={14} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 1. ACTIVITY LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by user, action, remarks..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">All Entities</option>
              <option value="project">Projects</option>
              <option value="task">Tasks</option>
              <option value="milestone">Milestones</option>
              <option value="risk">Risks & Issues</option>
              <option value="approval">Approvals</option>
              <option value="deployment">Deployments</option>
            </select>
          </div>

          {/* Timeline Feed */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {log.performedBy.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.performedBy}</span>
                        <span className="text-slate-500">{log.action}</span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {log.entity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {new Date(log.performedAt).toLocaleString()}
                      </span>
                    </div>

                    {(log.previousValue || log.newValue) && (
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-mono bg-slate-50 p-1.5 rounded border border-slate-100 w-fit">
                        {log.previousValue && <span className="text-slate-500 line-through">{log.previousValue}</span>}
                        {log.previousValue && log.newValue && <ArrowRight size={10} className="text-slate-400" />}
                        {log.newValue && <span className="font-bold text-blue-700">{log.newValue}</span>}
                      </div>
                    )}

                    {log.remarks && (
                      <p className="text-[11px] text-slate-600 mt-1 italic">
                        "{log.remarks}"
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No activity log entries match your filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkNotificationRead(n.id)}
                className={`py-3 px-2 flex items-start justify-between gap-3 text-xs rounded-lg transition-colors cursor-pointer ${
                  !n.isRead ? 'bg-blue-50/50 hover:bg-blue-50 font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !n.isRead ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {n.type}
                    </span>
                    <p className="text-slate-800">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkNotificationRead(n.id);
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications at this time.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
