import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Megaphone,
  Calendar,
  CheckCircle,
  FileText,
  User,
  Paperclip,
  AtSign,
  X,
  Send,
  HelpCircle
} from 'lucide-react';
import { PMCommunication } from '../pm.types';

interface PMCommunicationViewProps {
  projectId: string;
  communications: PMCommunication[];
  onAddCommunication: (c: Partial<PMCommunication>) => void;
}

const TYPE_CONFIG: Record<
  PMCommunication['type'],
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  Discussion: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Announcement: { icon: Megaphone, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  'Meeting Minutes': { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  'Client Communication': { icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Decision: { icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  'Action Item': { icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export const PMCommunicationView: React.FC<PMCommunicationViewProps> = ({
  projectId,
  communications,
  onAddCommunication,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [commType, setCommType] = useState<PMCommunication['type']>('Discussion');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState('@ahmed, @sarah');

  const projectComms = communications.filter((c) => c.projectId === projectId);
  const filteredComms = projectComms.filter((c) =>
    selectedType === 'all' ? true : c.type === selectedType
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    const mentionList = mentions
      .split(',')
      .map((m) => m.trim().replace(/^@/, ''))
      .filter(Boolean);

    onAddCommunication({
      projectId,
      type: commType,
      subject,
      content,
      author: 'Ahmed Al Rashidi (PM)',
      createdAt: new Date().toISOString(),
      attachments: [],
      mentions: mentionList,
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Communication & Collaboration Hub</h2>
          <p className="text-xs text-slate-500">
            Discussion threads, meeting minutes, client communications, and decision logs
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus size={14} />
          <span>New Communication</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-3 shadow-sm h-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
            Stream Filter
          </span>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                selectedType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>All Messages</span>
              <span className="text-[11px] font-bold text-slate-400">{projectComms.length}</span>
            </button>
            {Object.keys(TYPE_CONFIG).map((k) => {
              const count = projectComms.filter((c) => c.type === k).length;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedType(k)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                    selectedType === k ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{k}</span>
                  {count > 0 && (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Feed */}
        <div className="lg:col-span-3 space-y-4">
          {filteredComms.map((comm) => {
            const cfg = TYPE_CONFIG[comm.type] || TYPE_CONFIG.Discussion;
            const Icon = cfg.icon;

            return (
              <div
                key={comm.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{comm.subject}</h4>
                      <span className="text-[10px] text-slate-400">
                        {comm.author} • {new Date(comm.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {comm.type}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-wrap">
                  {comm.content}
                </div>

                {comm.mentions && comm.mentions.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mentions:</span>
                    <div className="flex flex-wrap gap-1">
                      {comm.mentions.map((m) => (
                        <span key={m} className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                          @{m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredComms.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              No messages found in this category.
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Post Communication</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Type</label>
                <select
                  value={commType}
                  onChange={(e) => setCommType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {Object.keys(TYPE_CONFIG).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Weekly Stakeholder Sync Minutes"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Content *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Key decisions, discussion points, action owners..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mentions (comma separated)</label>
                <input
                  type="text"
                  value={mentions}
                  onChange={(e) => setMentions(e.target.value)}
                  placeholder="@ahmed, @sarah, @adnoc-hse"
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
                  Post Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
