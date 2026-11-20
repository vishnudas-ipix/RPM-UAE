import React, { useState, useEffect } from 'react';
import { Topbar } from './components/layout/Topbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { OperationalDashboard } from './components/dashboard/OperationalDashboard';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectInitiationModal } from './components/projects/ProjectInitiationModal';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { ApprovalWorkflowView } from './components/approvals/ApprovalWorkflowView';
import { FleetManagementView } from './components/fleet/FleetManagementView';
import { ManpowerManagementView } from './components/manpower/ManpowerManagementView';
import { ResourceSchedulingView } from './components/scheduling/ResourceSchedulingView';
import { ClinicAllocationView } from './components/clinics/ClinicAllocationView';
import { OperationalTaskView } from './components/tasks/OperationalTaskView';
import { ComplianceDocumentView } from './components/compliance/ComplianceDocumentView';
import { TicketingHubView } from './components/ticketing/TicketingHubView';
import { MasterDataHubView } from './components/masterdata/MasterDataHubView';
import { SiteStaffPortalView } from './components/sitestaff/SiteStaffPortalView';

import {
  INITIAL_PROJECTS,
  INITIAL_MANPOWER,
  INITIAL_VEHICLES,
  INITIAL_CLINICS,
  INITIAL_APPROVALS,
  INITIAL_TASKS,
  INITIAL_TICKETS,
  GENERAL_COMPANY_DOCUMENTS,
  INITIAL_DUTY_SLOTS,
} from './data/mockData';

import {
  Project,
  Manpower,
  Vehicle,
  Clinic,
  ApprovalRequest,
  OperationalTask,
  Ticket,
  GeneralCompanyDocument,
  DutyScheduleSlot,
  UserRole,
  Emirate,
} from './types';

export function App() {
  // Topbar and Navigation States
  const [currentRole, setCurrentRole] = useState<UserRole>('Operations Manager (OM)');
  const [selectedEmirate, setSelectedEmirate] = useState<Emirate | 'All'>('All');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Application Data States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [manpower, setManpower] = useState<Manpower[]>(INITIAL_MANPOWER);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [clinics, setClinics] = useState<Clinic[]>(INITIAL_CLINICS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [tasks, setTasks] = useState<OperationalTask[]>(INITIAL_TASKS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [generalDocs, setGeneralDocs] = useState<GeneralCompanyDocument[]>(GENERAL_COMPANY_DOCUMENTS);
  const [dutySlots, setDutySlots] = useState<DutyScheduleSlot[]>(INITIAL_DUTY_SLOTS);

  // Selected Records for Deep Views
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showInitiateModal, setShowInitiateModal] = useState(false);

  // 24-hr countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setApprovals((prev) =>
        prev.map((app) => {
          if (app.status === 'Pending' && app.lockTimerRemainingSeconds > 0) {
            const nextSec = app.lockTimerRemainingSeconds - 1;
            return {
              ...app,
              lockTimerRemainingSeconds: nextSec,
              isEscalated: nextSec <= 0 ? true : app.isEscalated,
            };
          }
          return app;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers for Projects
  const handleSaveNewProject = (newPrj: Partial<Project>) => {
    const prjWithId: Project = {
      ...(newPrj as Project),
      id: `prj-${Date.now()}`,
    };
    setProjects([prjWithId, ...projects]);
    // Also create approval request with 24-hr lock timer
    const newApproval: ApprovalRequest = {
      id: `app-${Date.now()}`,
      requestId: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      moduleType: 'Project Initiation',
      projectId: prjWithId.id,
      projectName: prjWithId.name,
      requestedBy: `${prjWithId.bdName} (BD)`,
      submittedAt: new Date().toISOString(),
      lockTimerRemainingSeconds: 86400, // 24-hr initial countdown
      isEscalated: false,
      status: 'Pending',
      escalationLevel: 1,
    };
    setApprovals([newApproval, ...approvals]);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
  };

  // Handlers for Approvals
  const handleApproveRequest = (id: string, comment?: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved', comment } : a))
    );
  };

  const handleConditionalApprove = (id: string, condition: string, days: number) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'Conditional',
              conditionNote: condition,
              conditionDeadlineDays: days,
            }
          : a
      )
    );
  };

  const handleClarifyRequest = (id: string, query: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'Clarification', clarificationComment: query } : a
      )
    );
  };

  const handleDeclineRequest = (id: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'Declined', clarificationComment: reason } : a
      )
    );
  };

  const handleOverrideRequest = (id: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'Approved', conditionNote: `OVERRIDDEN: ${reason}` } : a
      )
    );
  };

  // Handlers for Fleet
  const handleAddVehicle = (newVeh: Partial<Vehicle>) => {
    const v: Vehicle = {
      ...(newVeh as Vehicle),
      id: `veh-${Date.now()}`,
    };
    setVehicles([v, ...vehicles]);
  };

  const handleUploadMaintenanceReport = (vehicleId: string, report: any) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            maintenanceReports: [report, ...v.maintenanceReports],
          };
        }
        return v;
      })
    );
  };

  const handleUpdateInspection = (vehicleId: string, passed: boolean) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            dohEquipmentChecklistPassed: passed,
            ambulanceCoordinatorSigned: passed,
          };
        }
        return v;
      })
    );
  };

  // Handlers for Manpower
  const handleAddManpower = (newStaff: Partial<Manpower>) => {
    const s: Manpower = {
      ...(newStaff as Manpower),
      id: `man-${Date.now()}`,
    };
    setManpower([s, ...manpower]);
  };

  const handleRequestSwap = (manpowerId: string, targetProjectId: string, reason: string) => {
    const staff = manpower.find((m) => m.id === manpowerId);
    const targetPrj = projects.find((p) => p.id === targetProjectId);
    const newApproval: ApprovalRequest = {
      id: `app-${Date.now()}`,
      requestId: `SWAP-2026-${Math.floor(100 + Math.random() * 900)}`,
      moduleType: 'Manpower Swap',
      projectId: targetProjectId,
      projectName: `${staff?.name} → ${targetPrj?.name}`,
      requestedBy: `${currentRole}`,
      submittedAt: new Date().toISOString(),
      lockTimerRemainingSeconds: 86400,
      isEscalated: false,
      status: 'Pending',
      conditionNote: reason,
      escalationLevel: 1,
    };
    setApprovals([newApproval, ...approvals]);
    alert(`Manpower swap request submitted for ${staff?.name}. Routes to GM for approval with 24-hr lock timer.`);
  };

  const handleRecordIncident = (manpowerId: string, incident: any) => {
    setManpower((prev) =>
      prev.map((m) => {
        if (m.id === manpowerId) {
          const newPts = m.totalBlackPoints + (incident.blackPoints || 0);
          let newRag: Manpower['ragStatus'] = m.ragStatus;
          if (newPts >= 6) newRag = 'Red';
          else if (newPts >= 3) newRag = 'Yellow';
          else if (newPts >= 1) newRag = 'Amber';

          return {
            ...m,
            totalBlackPoints: newPts,
            ragStatus: newRag,
            warningLettersCount: m.warningLettersCount + (incident.incidentType === 'Warning Letter' ? 1 : 0),
            warningHistory: [incident, ...m.warningHistory],
          };
        }
        return m;
      })
    );
  };

  // Handlers for Scheduling
  const handleAddDutySlot = (slot: Partial<DutyScheduleSlot>) => {
    const s: DutyScheduleSlot = {
      ...(slot as DutyScheduleSlot),
      id: `slot-${Date.now()}`,
    };
    setDutySlots([s, ...dutySlots]);
  };

  const handleOverrideSlot = (slotId: string, newHours: number, note: string) => {
    setDutySlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            hoursWorked: newHours,
            isOverridden: true,
            overrideNote: note,
          };
        }
        return s;
      })
    );
  };

  // Handlers for Clinics
  const handleUpdateClinicStatus = (clinicId: string, newStatus: Clinic['status']) => {
    setClinics((prev) =>
      prev.map((c) =>
        c.id === clinicId
          ? {
              ...c,
              status: newStatus,
              mobilizationDate: newStatus === 'Operational' ? new Date().toISOString().split('T')[0] : c.mobilizationDate,
            }
          : c
      )
    );
  };

  const handleAddClinic = (newClinic: Partial<Clinic>) => {
    const c: Clinic = {
      ...(newClinic as Clinic),
      id: `cln-${Date.now()}`,
    };
    setClinics([c, ...clinics]);
  };

  // Handlers for Tasks
  const handleAddTask = (newTask: Partial<OperationalTask>) => {
    const t: OperationalTask = {
      ...(newTask as OperationalTask),
      id: `tsk-${Date.now()}`,
    };
    setTasks([t, ...tasks]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: OperationalTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  // Handlers for Ticketing
  const handleAddTicket = (ticket: Partial<Ticket>) => {
    const t: Ticket = {
      ...(ticket as Ticket),
      id: `tkt-${Date.now()}`,
    };
    setTickets([t, ...tickets]);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: Ticket['currentStatus']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStatus: newStatus } : t))
    );
  };

  const handlePlSuperAction = (
    ticketId: string,
    action: 'cancel' | 'close' | 'reroute',
    department?: any
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          if (action === 'cancel') {
            return {
              ...t,
              currentStatus: 'Closed',
              escalationStage: 'Resolved',
              plSuperActionLogs: [...(t.plSuperActionLogs || []), `Cancelled by PL at ${new Date().toLocaleTimeString()}`],
            };
          }
          if (action === 'close') {
            return {
              ...t,
              currentStatus: 'Resolved',
              escalationStage: 'Resolved',
              plSuperActionLogs: [...(t.plSuperActionLogs || []), `Closed & Resolved by PL at ${new Date().toLocaleTimeString()}`],
            };
          }
          if (action === 'reroute' && department) {
            return {
              ...t,
              assignedDepartment: department,
              plSuperActionLogs: [...(t.plSuperActionLogs || []), `Rerouted to ${department} by PL`],
            };
          }
        }
        return t;
      })
    );
    alert(`Project Lead Super Action applied: Ticket ${action.toUpperCase()}`);
  };

  // Handlers for General Docs
  const handleAddGeneralDoc = (doc: Partial<GeneralCompanyDocument>) => {
    const d: GeneralCompanyDocument = {
      ...(doc as GeneralCompanyDocument),
      id: `gcd-${Date.now()}`,
    };
    setGeneralDocs([d, ...generalDocs]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Topbar */}
      <Topbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedEmirate={selectedEmirate}
        onEmirateChange={setSelectedEmirate}
        pendingApprovals={approvals.filter((a) => a.status === 'Pending')}
        tickets={tickets}
        onOpenApprovals={() => setActiveTab('approvals')}
        onOpenNotifications={() => setActiveTab('compliance')}
        onOpenSiteStaffView={() => {
          setCurrentRole('Site Staff (Field User)');
          setActiveTab('sitestaff');
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedProject(null);
          }}
          currentRole={currentRole}
          pendingApprovalsCount={approvals.filter((a) => a.status === 'Pending').length}
          openTicketsCount={tickets.filter((t) => t.currentStatus !== 'Closed' && t.currentStatus !== 'Resolved').length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-61px)]">
          {activeTab === 'dashboard' && (
            <OperationalDashboard
              projects={projects}
              manpower={manpower}
              vehicles={vehicles}
              approvals={approvals.filter((a) => a.status === 'Pending')}
              tasks={tasks}
              tickets={tickets}
              selectedEmirate={selectedEmirate}
              onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
              onOpenNewProjectModal={() => setShowInitiateModal(true)}
              onOpenMRFModal={() => {
                setActiveTab('ticketing');
              }}
              onOpenAmbulanceReqModal={() => {
                setActiveTab('ticketing');
              }}
            />
          )}

          {activeTab === 'projects' && !selectedProject && (
            <ProjectList
              projects={projects}
              selectedEmirate={selectedEmirate}
              currentRole={currentRole}
              onSelectProject={(prj) => setSelectedProject(prj)}
              onOpenInitiateModal={() => setShowInitiateModal(true)}
            />
          )}

          {activeTab === 'projects' && selectedProject && (
            <ProjectDetailView
              project={selectedProject}
              allManpower={manpower}
              allVehicles={vehicles}
              currentRole={currentRole}
              onBack={() => setSelectedProject(null)}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === 'approvals' && (
            <ApprovalWorkflowView
              approvals={approvals.filter((a) => a.status === 'Pending')}
              currentRole={currentRole}
              onApprove={handleApproveRequest}
              onConditionalApprove={handleConditionalApprove}
              onClarify={handleClarifyRequest}
              onDecline={handleDeclineRequest}
              onOverride={handleOverrideRequest}
            />
          )}

          {activeTab === 'fleet' && (
            <FleetManagementView
              vehicles={vehicles}
              selectedEmirate={selectedEmirate}
              currentRole={currentRole}
              onAddVehicle={handleAddVehicle}
              onUploadMaintenanceReport={handleUploadMaintenanceReport}
              onUpdateInspection={handleUpdateInspection}
            />
          )}

          {activeTab === 'manpower' && (
            <ManpowerManagementView
              manpowerList={manpower}
              selectedEmirate={selectedEmirate}
              currentRole={currentRole}
              onAddManpower={handleAddManpower}
              onRequestSwap={handleRequestSwap}
              onRecordIncident={handleRecordIncident}
            />
          )}

          {activeTab === 'scheduling' && (
            <ResourceSchedulingView
              dutySlots={dutySlots}
              projects={projects}
              manpowerList={manpower}
              currentRole={currentRole}
              onAddSlot={handleAddDutySlot}
              onOverrideSlot={handleOverrideSlot}
            />
          )}

          {activeTab === 'clinics' && (
            <ClinicAllocationView
              clinics={clinics}
              selectedEmirate={selectedEmirate}
              currentRole={currentRole}
              onUpdateClinicStatus={handleUpdateClinicStatus}
              onAddClinic={handleAddClinic}
            />
          )}

          {activeTab === 'tasks' && (
            <OperationalTaskView
              tasks={tasks}
              projects={projects}
              currentRole={currentRole}
              onAddTask={handleAddTask}
              onUpdateStatus={handleUpdateTaskStatus}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceDocumentView
              generalDocs={generalDocs}
              manpowerList={manpower}
              vehicles={vehicles}
              selectedEmirate={selectedEmirate}
              currentRole={currentRole}
              onAddGeneralDoc={handleAddGeneralDoc}
            />
          )}

          {activeTab === 'ticketing' && (
            <TicketingHubView
              tickets={tickets}
              projects={projects}
              currentRole={currentRole}
              onAddTicket={handleAddTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onPlSuperAction={handlePlSuperAction}
            />
          )}

          {activeTab === 'masterdata' && (
            <MasterDataHubView currentRole={currentRole} />
          )}

          {activeTab === 'sitestaff' && (
            <SiteStaffPortalView
              tickets={tickets}
              project={projects[0]}
              onAddTicket={handleAddTicket}
              onSwitchBackRole={() => {
                setCurrentRole('Operations Manager (OM)');
                setActiveTab('dashboard');
              }}
            />
          )}
        </main>
      </div>

      {/* Project Initiation Modal */}
      <ProjectInitiationModal
        isOpen={showInitiateModal}
        onClose={() => setShowInitiateModal(false)}
        onSave={handleSaveNewProject}
      />
    </div>
  );
}

export default App;

