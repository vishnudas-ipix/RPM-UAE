import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Project, Emirate, UAEProjectCategory, UserRole } from '../../types';

interface ProjectListProps {
  projects: Project[];
  selectedEmirate: Emirate | 'All';
  currentRole: UserRole;
  onSelectProject: (project: Project) => void;
  onOpenInitiateModal: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedEmirate,
  currentRole,
  onSelectProject,
  onOpenInitiateModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<UAEProjectCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = projects.filter((p) => {
    const matchEmirate = selectedEmirate === 'All' || p.operatingEmirate === selectedEmirate;
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEmirate && matchCategory && matchStatus && matchSearch;
  });

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending Client Confirmation':
        return 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
      case 'Awaiting Client Document Submission':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Awaiting Management Review':
      case 'Management Reviewing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Demobilization Requested by Client/HSE':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Demobilization Complete':
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadge = (cat: UAEProjectCategory) => {
    switch (cat) {
      case 'ADNOC':
        return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
      case 'Government':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Semi-Government':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Private':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Event':
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Projects & Events Management (UAE)
            </h1>
            <span className="text-xs bg-rpm-navy-100 text-rpm-navy-700 font-bold px-2 py-0.5 rounded border border-rpm-navy-200">
              Module 1 Lifecycle
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governs full operational lifecycle: Initiation (BOQ/Deliverables) → Review → Allocation → Stage 3A Doc Pack → Stage 3B Client Gate → Mobilization → Stage 7 Demobilization.
          </p>
        </div>

        <button
          onClick={onOpenInitiateModal}
          className="flex items-center space-x-2 bg-rpm-navy-600 hover:bg-rpm-navy-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate New Account (BD / Ops)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project name, code, or client..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rpm-navy-500 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All UAE Categories</option>
              <option value="ADNOC">ADNOC Offshore/HSE</option>
              <option value="Government">Government</option>
              <option value="Semi-Government">Semi-Government</option>
              <option value="Private">Private Sector</option>
              <option value="Event">Event Standby</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active / Mobilized</option>
              <option value="Pending Client Confirmation">Pending Client Confirmation (Gate 3B)</option>
              <option value="Awaiting Client Document Submission">Awaiting Client Doc Submission (3A)</option>
              <option value="Awaiting Management Review">Awaiting Management Review</option>
              <option value="Demobilization Requested by Client/HSE">Demobilization Requested</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filtered.length}</strong> deployment records
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Code & Project</th>
                <th className="py-3 px-3">Client & Location</th>
                <th className="py-3 px-3">Category & Emirate</th>
                <th className="py-3 px-3">Duty Schedule</th>
                <th className="py-3 px-3">Compliance & Gate Status</th>
                <th className="py-3 px-3">Allocated Resources</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-rpm-navy-600 font-bold block">
                      {project.projectCode}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-rpm-navy-600 transition-colors block text-xs">
                      {project.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {project.type} • BD: {project.bdName}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800 block">
                      {project.clientName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {project.regionLocation}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-col items-start space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getCategoryBadge(project.category)}`}>
                        {project.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {project.operatingEmirate}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-slate-800 font-medium block">
                      {project.dutyScheduleType}
                    </span>
                    {project.dutyScheduleType === 'Rotation-Based' && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {project.rotationCycleDays} Days Cycle
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                      {project.adoshPermitRequired && (
                        <span className="block text-[10px] text-emerald-700 font-medium">
                          ✓ ADOSH Permit Linked
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-[11px] text-slate-600">
                      <span>🚑 {project.allocatedVehicles.length} Ambulances</span>
                      <span className="block">👨‍⚕️ {project.allocatedManpower.length} Clinical Crew</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-rpm-navy-50 text-rpm-navy-700 font-bold rounded-md border border-slate-200 transition-colors text-xs"
                    >
                      <span>Manage Flow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

