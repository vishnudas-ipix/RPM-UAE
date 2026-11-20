import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  CreditCard,
  Wrench,
  ShoppingCart,
  Plane,
  Truck,
  Building,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Lock,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Ticket, TicketingStream, Project, UserRole, ClinicalRole, VehicleType, DriveType } from '../../types';

interface TicketingHubViewProps {
  tickets: Ticket[];
  projects: Project[];
  currentRole: UserRole;
  onAddTicket: (ticket: Partial<Ticket>) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: Ticket['currentStatus']) => void;
  onPlSuperAction: (ticketId: string, action: 'cancel' | 'close' | 'reroute', department?: any) => void;
}

export const TicketingHubView: React.FC<TicketingHubViewProps> = ({
  tickets,
  projects,
  currentRole,
  onAddTicket,
  onUpdateTicketStatus,
  onPlSuperAction,
}) => {
  const [activeStream, setActiveStream] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStreamForCreate, setSelectedStreamForCreate] = useState<TicketingStream>('Stream 1: Payment Request');

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [linkedPrj, setLinkedPrj] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<Ticket['priority']>('High');

  // Stream-specific form inputs
  const [paymentType, setPaymentType] = useState<'Visa & Gov Fees' | 'HR Payment' | 'Mobile Bills' | 'Rent & Utilities' | 'Licence Renewal' | 'Other'>('Visa & Gov Fees');
  const [paymentAmount, setPaymentAmount] = useState(1500);
  const [serviceCat, setServiceCat] = useState<'IT Hardware/Software' | 'Biomedical Calibration' | 'Facility Repair'>('IT Hardware/Software');
  const [purchaseCat, setPurchaseCat] = useState<'Medical Consumables' | 'Medications' | 'Fleet Spares' | 'Office Stationeries'>('Medical Consumables');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQty, setCustomItemQty] = useState(10);
  const [travelType, setTravelType] = useState<'Flight Only' | 'Car Rental Only' | 'Flight & Car Rental'>('Flight & Car Rental');
  const [destination, setDestination] = useState('Das Island Offshore Heliport');
  const [requestedAmbType, setRequestedAmbType] = useState<VehicleType>('BLS');
  const [requestedDriveType, setRequestedDriveType] = useState<DriveType>('4x4');
  const [mrfRole, setMrfRole] = useState<ClinicalRole>('Paramedic');
  const [mrfCount, setMrfCount] = useState(2);

  const streamsList: TicketingStream[] = [
    'Stream 1: Payment Request',
    'Stream 2: Service Request',
    'Stream 3: Purchase Request',
    'Stream 4: Travel Request',
    'Stream 5: Ambulance Request',
    'Stream 6: Clinic Licensing Request',
    'Stream 7: Manpower Request (MRF)',
  ];

  const filteredTickets = tickets.filter((t) => {
    const matchStream = activeStream === 'All' || t.stream === activeStream;
    const matchSearch =
      t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.raisedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.projectName && t.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStream && matchSearch;
  });

  const getStreamIcon = (stream: TicketingStream) => {
    switch (stream) {
      case 'Stream 1: Payment Request':
        return CreditCard;
      case 'Stream 2: Service Request':
        return Wrench;
      case 'Stream 3: Purchase Request':
        return ShoppingCart;
      case 'Stream 4: Travel Request':
        return Plane;
      case 'Stream 5: Ambulance Request':
        return Truck;
      case 'Stream 6: Clinic Licensing Request':
        return Building;
      case 'Stream 7: Manpower Request (MRF)':
        return Users;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === linkedPrj);

    let assignedDept: Ticket['assignedDepartment'] = 'Finance';
    if (selectedStreamForCreate === 'Stream 2: Service Request') {
      assignedDept = serviceCat === 'IT Hardware/Software' ? 'IT' : serviceCat === 'Biomedical Calibration' ? 'Biomedical' : 'Facility';
    } else if (selectedStreamForCreate === 'Stream 3: Purchase Request') {
      assignedDept = 'Procurement';
    } else if (selectedStreamForCreate === 'Stream 4: Travel Request') {
      assignedDept = 'Travel';
    } else if (selectedStreamForCreate === 'Stream 5: Ambulance Request') {
      assignedDept = 'Fleet';
    } else if (selectedStreamForCreate === 'Stream 6: Clinic Licensing Request') {
      assignedDept = 'QA';
    } else if (selectedStreamForCreate === 'Stream 7: Manpower Request (MRF)') {
      assignedDept = 'HR/Admin';
    }

    const newTicket: Partial<Ticket> = {
      ticketNo: `TKT-${selectedStreamForCreate.substring(10, 13).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      stream: selectedStreamForCreate,
      projectId: linkedPrj,
      projectName: prj?.name,
      raisedBy: `${currentRole} User`,
      raisedByRole: currentRole,
      assignedDepartment: assignedDept,
      title,
      description: desc,
      priority,
      currentStatus: 'Submitted',
      tlReviewed: false,
      plApproved: false,
      slaHoursTarget: selectedStreamForCreate === 'Stream 5: Ambulance Request' ? 72 : 24,
      slaHoursElapsed: 0,
      isSlaBreached: false,
      escalationStage: 'TL Review',
      streamData: {
        paymentType,
        amountAED: paymentAmount,
        serviceCategory: serviceCat,
        purchaseCategory: purchaseCat,
        itemsList: customItemName ? [{ name: customItemName, qty: customItemQty, unitPriceAED: 50, isCustomItem: true }] : undefined,
        travelType,
        destination,
        vehicleTypeRequested: requestedAmbType,
        driveTypeRequested: requestedDriveType,
        onboardingStage: 'Request Raised',
        licensingStage: 'Initiation',
        mrfStage: 'Request Raised',
        rolesNeeded: [{ role: mrfRole, count: mrfCount }],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTicket(newTicket);
    setShowCreateModal(false);
    setTitle('');
    setDesc('');
  };

  const isProjectLead = currentRole === 'Project Lead (PL)' || currentRole === 'Corporate Admin' || currentRole === 'Operations Manager (OM)';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Inter-Department Service Request & Ticketing System
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 13 (7 Streams)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dual hierarchy routing: Site Staff → TL Review → PL Super Access → OM/GM Escalation → Higher Management. 7 dedicated operational streams.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 bg-rpm-red hover:bg-rpm-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Request (7 Streams)</span>
        </button>
      </div>

      {/* 7 Streams Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <button
          onClick={() => setActiveStream('All')}
          className={`p-2.5 rounded-xl text-left border transition-all ${
            activeStream === 'All'
              ? 'bg-rpm-navy-600 text-white border-rpm-navy-700 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <span className="text-xs font-bold block">All Streams</span>
          <span className="text-[10px] opacity-80">{tickets.length} Total</span>
        </button>

        {streamsList.map((stream, idx) => {
          const Icon = getStreamIcon(stream);
          const count = tickets.filter(t => t.stream === stream).length;
          const isActive = activeStream === stream;
          return (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                isActive
                  ? 'bg-rpm-navy-600 text-white border-rpm-navy-700 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rpm-red'}`} />
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-rpm-navy-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {count}
                </span>
              </div>
              <span className="text-[11px] font-bold block truncate">
                Stream {idx + 1}
              </span>
              <span className="text-[9px] block truncate opacity-75">
                {stream.split(': ')[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* PL Super Access Callout Banner */}
      {isProjectLead && (
        <div className="bg-purple-900 text-white p-3.5 rounded-xl border border-purple-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-4 h-4 text-purple-300" />
            <span>
              <strong>PL Super Access Enabled:</strong> You have override authority to Cancel, Close, or Reroute any active ticket to other departments.
            </span>
          </div>
          <span className="text-[10px] bg-purple-800 text-purple-200 font-mono font-bold px-2 py-0.5 rounded">
            Role: {currentRole}
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by ticket #, title, project, requester..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rpm-navy-500 focus:bg-white"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filteredTickets.length}</strong> service requests
        </span>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ticket No & Stream</th>
                <th className="py-3 px-3">Title & Summary</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Raised By</th>
                <th className="py-3 px-3">SLA & Escalation</th>
                <th className="py-3 px-3">Workflow State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((tkt) => (
                <tr
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-rpm-navy-700 block">
                      {tkt.ticketNo}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{tkt.stream}</span>
                  </td>

                  <td className="py-3.5 px-3 max-w-xs">
                    <span className="font-bold text-slate-900 block text-xs">{tkt.title}</span>
                    <span className="text-[11px] text-slate-500 truncate block mt-0.5">{tkt.description}</span>
                    {tkt.projectName && (
                      <span className="text-[10px] text-rpm-navy-700 font-semibold block mt-0.5">
                        Prj: {tkt.projectName}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {tkt.assignedDepartment}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700">
                    <span className="font-semibold block">{tkt.raisedBy}</span>
                    <span className="text-[10px] text-slate-400">{tkt.raisedByRole}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <Clock className={`w-3.5 h-3.5 ${tkt.isSlaBreached ? 'text-red-600' : 'text-slate-400'}`} />
                        <span className={`font-mono text-[11px] font-bold ${tkt.isSlaBreached ? 'text-red-700 animate-pulse' : 'text-slate-700'}`}>
                          {tkt.slaHoursElapsed}h / {tkt.slaHoursTarget}h
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-700 font-bold block">
                        Stage: {tkt.escalationStage}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tkt.currentStatus === 'Resolved' || tkt.currentStatus === 'Closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tkt.currentStatus === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tkt.currentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedTicket(tkt)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-xs transition-colors"
                    >
                      View & Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & PL Super Action Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-rpm-red bg-white px-2 py-0.5 rounded">
                  {selectedTicket.ticketNo}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{selectedTicket.title}</h3>
                <span className="text-xs text-slate-300">{selectedTicket.stream}</span>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-white hover:text-slate-300 font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Dual Hierarchy Routing Status */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                  Dual Hierarchy Routing Progression
                </h4>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="text-center">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span className="block mt-1 text-slate-700">Site Staff</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-emerald-500 mx-2"></div>
                  <div className="text-center">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span className="block mt-1 text-slate-700">TL Review</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-purple-500 mx-2"></div>
                  <div className="text-center">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white inline-flex items-center justify-center font-bold text-[10px]">PL</span>
                    <span className="block mt-1 text-purple-800 font-bold">PL Super Access</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
                  <div className="text-center">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 inline-flex items-center justify-center font-bold text-[10px]">OM</span>
                    <span className="block mt-1 text-slate-500">Dept Closure</span>
                  </div>
                </div>
              </div>

              {/* Stream Specific Data Display */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide">Stream Details</h4>
                {selectedTicket.streamData?.amountAED && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Amount:</span>
                    <span className="font-mono font-bold text-slate-900">AED {selectedTicket.streamData.amountAED} ({selectedTicket.streamData.paymentType})</span>
                  </div>
                )}
                {selectedTicket.streamData?.purchaseCategory && (
                  <div>
                    <span className="text-slate-500">Purchase Items:</span>
                    <div className="mt-1 space-y-1">
                      {selectedTicket.streamData.itemsList?.map((it, i) => (
                        <div key={i} className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                          <span>{it.name} (x{it.qty}) {it.isCustomItem && <strong className="text-emerald-700">(Custom Learned)</strong>}</span>
                          <span className="font-mono font-bold">AED {it.qty * it.unitPriceAED}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTicket.streamData?.onboardingStage && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fleet Onboarding Stage:</span>
                    <span className="font-bold text-rpm-navy-700">{selectedTicket.streamData.onboardingStage}</span>
                  </div>
                )}
                {selectedTicket.streamData?.mrfStage && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">MRF Manpower Sourcing Stage:</span>
                    <span className="font-bold text-rpm-navy-700">{selectedTicket.streamData.mrfStage}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wide mb-1">Issue Description</h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* PL Super Access Controls */}
              {isProjectLead && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-3">
                  <div className="flex items-center space-x-2 text-purple-900 font-bold">
                    <Lock className="w-4 h-4 text-purple-700" />
                    <span>Project Lead Super Access Actions</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    The PL has super access to cancel, close, or reroute tickets to the concerned department.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        onPlSuperAction(selectedTicket.id, 'reroute', 'Biomedical');
                        setSelectedTicket(null);
                      }}
                      className="py-1.5 px-2 bg-white text-purple-900 font-bold rounded border border-purple-300 hover:bg-purple-100"
                    >
                      Reroute Dept ↗
                    </button>
                    <button
                      onClick={() => {
                        onPlSuperAction(selectedTicket.id, 'close');
                        setSelectedTicket(null);
                      }}
                      className="py-1.5 px-2 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700"
                    >
                      PL Close Ticket ✓
                    </button>
                    <button
                      onClick={() => {
                        onPlSuperAction(selectedTicket.id, 'cancel');
                        setSelectedTicket(null);
                      }}
                      className="py-1.5 px-2 bg-red-100 text-red-800 font-bold rounded hover:bg-red-200"
                    >
                      Cancel Ticket ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Department Status Progression */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className="text-slate-500 font-semibold">Change Department Status:</span>
                <select
                  value={selectedTicket.currentStatus}
                  onChange={(e) => {
                    onUpdateTicketStatus(selectedTicket.id, e.target.value as any);
                    setSelectedTicket({ ...selectedTicket, currentStatus: e.target.value as any });
                  }}
                  className="p-1.5 bg-slate-50 border border-slate-300 rounded font-bold"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="In Review">In Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rpm-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Raise Inter-Department Service Request</h3>
                <span className="text-xs text-slate-300">Select 1 of 7 tailored operational streams</span>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Request Stream *</label>
                <select
                  value={selectedStreamForCreate}
                  onChange={(e) => setSelectedStreamForCreate(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-rpm-navy-700"
                >
                  {streamsList.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Request Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Visa Renewal Fees for Das Island Relief Crew"
                  className="w-full p-2 border border-slate-300 rounded font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Linked Project *</label>
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

              {/* Stream-Specific Fields */}
              {selectedStreamForCreate === 'Stream 1: Payment Request' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Payment Category</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-300 rounded"
                    >
                      <option value="Visa & Gov Fees">Visa & Gov Fees</option>
                      <option value="HR Payment">HR Payment</option>
                      <option value="Mobile Bills">Mobile Bills</option>
                      <option value="Rent & Utilities">Rent & Utilities</option>
                      <option value="Licence Renewal">Licence Renewal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Amount (AED)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full p-1.5 border border-slate-300 rounded font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {selectedStreamForCreate === 'Stream 3: Purchase Request' && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-800">
                    <span>Self-Learning Purchase Master Item</span>
                    <span className="text-emerald-700">Auto-saved for future</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      placeholder="Item name (e.g. Sterile Saline 1000ml)"
                      className="col-span-2 p-1.5 border border-slate-300 rounded"
                    />
                    <input
                      type="number"
                      value={customItemQty}
                      onChange={(e) => setCustomItemQty(Number(e.target.value))}
                      placeholder="Qty"
                      className="p-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedStreamForCreate === 'Stream 5: Ambulance Request' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Ambulance Type</label>
                    <select
                      value={requestedAmbType}
                      onChange={(e) => setRequestedAmbType(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-300 rounded font-bold"
                    >
                      <option value="BLS">BLS (Basic Life Support)</option>
                      <option value="ALS">ALS (Advanced Life Support)</option>
                      <option value="Mobile ICU">Mobile ICU</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Drive Type</label>
                    <select
                      value={requestedDriveType}
                      onChange={(e) => setRequestedDriveType(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-300 rounded font-medium"
                    >
                      <option value="4x4">4x4 (Offshore/Desert)</option>
                      <option value="4x2">4x2 (Highway/City)</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedStreamForCreate === 'Stream 7: Manpower Request (MRF)' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Clinical Role Required</label>
                    <select
                      value={mrfRole}
                      onChange={(e) => setMrfRole(e.target.value as any)}
                      className="w-full p-1.5 border border-slate-300 rounded font-bold"
                    >
                      <option value="Paramedic">Paramedic (ALS)</option>
                      <option value="Nurse">Registered Nurse (RN)</option>
                      <option value="Driver">Ambulance Driver</option>
                      <option value="Doctor (GP/ER)">Doctor (GP/ER)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Personnel Count</label>
                    <input
                      type="number"
                      value={mrfCount}
                      onChange={(e) => setMrfCount(Number(e.target.value))}
                      min={1}
                      max={20}
                      className="w-full p-1.5 border border-slate-300 rounded font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Provide complete request context and reason..."
                  className="w-full p-2 border border-slate-300 rounded h-20"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rpm-navy-600 text-white font-bold rounded"
                >
                  Submit Request (Routes to TL)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

