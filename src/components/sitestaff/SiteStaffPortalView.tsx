import React, { useState } from 'react';
import {
  Send,
  Plus,
  Search,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Wrench,
  ShoppingCart,
  Plane,
  Building,
  User,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Ticket, Project, UserRole, TicketingStream } from '../../types';

interface SiteStaffPortalViewProps {
  tickets: Ticket[];
  project: Project;
  onAddTicket: (ticket: Partial<Ticket>) => void;
  onSwitchBackRole: () => void;
}

export const SiteStaffPortalView: React.FC<SiteStaffPortalViewProps> = ({
  tickets,
  project,
  onAddTicket,
  onSwitchBackRole,
}) => {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState<TicketingStream>('Stream 1: Payment Request');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<Ticket['priority']>('High');

  // Filter tickets to only those raised by site staff for this assigned project
  const siteStaffTickets = tickets.filter(
    (t) => t.projectId === project.id || t.raisedByProjectScopedLogin
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let assignedDept: Ticket['assignedDepartment'] = 'Finance';
    if (selectedStream === 'Stream 2: Service Request') assignedDept = 'Biomedical';
    if (selectedStream === 'Stream 3: Purchase Request') assignedDept = 'Procurement';
    if (selectedStream === 'Stream 4: Travel Request') assignedDept = 'Travel';

    const newTicket: Partial<Ticket> = {
      ticketNo: `TKT-SITE-2026-${Math.floor(100 + Math.random() * 900)}`,
      stream: selectedStream,
      projectId: project.id,
      projectName: project.name,
      raisedBy: 'Tariq Al-Balooshi (Site Staff)',
      raisedByRole: 'Ambulance Driver',
      raisedByProjectScopedLogin: true,
      assignedDepartment: assignedDept,
      title: ticketTitle,
      description: ticketDesc,
      priority: ticketPriority,
      currentStatus: 'Submitted',
      tlReviewed: false,
      plApproved: false,
      slaHoursTarget: 24,
      slaHoursElapsed: 0,
      isSlaBreached: false,
      escalationStage: 'TL Review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTicket(newTicket);
    setShowNewTicketModal(false);
    setTicketTitle('');
    setTicketDesc('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner: Project Scoped Security Notice */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Project-Scoped Credentials Active
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">
            Site Staff Operational Portal — {project.name}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Logged in as: <strong>Tariq Al-Balooshi</strong> (Driver / Field First Responder) • Restricted to this project only
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSwitchBackRole}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            Exit Scoped View →
          </button>
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center space-x-1.5 bg-rpm-red hover:bg-rpm-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Site Ticket</span>
          </button>
        </div>
      </div>

      {/* Rules & Permissions Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2 text-slate-600">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <Lock className="w-4 h-4 text-rpm-navy-600" />
          <span>Field Staff Access Scope (Section 3.2.10):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">Allowed Categories:</strong>
            <span>Travel, Purchase, Service, Payment Requests</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">Ticket Routing:</strong>
            <span>Auto-routed to Team Leader (TL) & Project Lead (PL)</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block">Visibility Isolation:</strong>
            <span>Strictly limited to own submissions for this project only</span>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
            My Raised Field Tickets ({siteStaffTickets.length})
          </h3>
          <span className="text-xs text-slate-500">Live Status from Head Office</span>
        </div>

        <div className="divide-y divide-slate-100">
          {siteStaffTickets.map((tkt) => (
            <div key={tkt.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-rpm-navy-700 bg-rpm-navy-50 px-2 py-0.5 rounded border border-rpm-navy-200">
                    {tkt.ticketNo}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{tkt.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  tkt.currentStatus === 'Resolved' || tkt.currentStatus === 'Closed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : tkt.currentStatus === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {tkt.currentStatus}
                </span>
              </div>

              <p className="text-xs text-slate-600">{tkt.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <div className="flex items-center space-x-3">
                  <span>Stream: <strong>{tkt.stream}</strong></span>
                  <span>Dept: <strong>{tkt.assignedDepartment}</strong></span>
                </div>
                <span className="text-purple-700 font-bold">
                  Workflow Stage: {tkt.escalationStage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3.5 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold">Submit Field Ticket</h3>
                <span className="text-[10px] text-slate-300">{project.name}</span>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Request Category *</label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold text-rpm-navy-700"
                >
                  <option value="Stream 1: Payment Request">Payment Request (Finance / Fees / Mobile)</option>
                  <option value="Stream 2: Service Request">Service Request (IT / Biomedical / Facility)</option>
                  <option value="Stream 3: Purchase Request">Purchase Request (Consumables / Spares)</option>
                  <option value="Stream 4: Travel Request">Travel Request (Flights / Car Hire)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. Need Defibrillator Gel Pads Replacement"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgency / Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                >
                  <option value="High">High Urgency</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Details & Justification *</label>
                <textarea
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Detail the operational issue or item needed on site..."
                  className="w-full p-2 border border-slate-300 rounded h-24"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded hover:bg-rpm-navy-700"
                >
                  Submit to Team Leader (TL)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

