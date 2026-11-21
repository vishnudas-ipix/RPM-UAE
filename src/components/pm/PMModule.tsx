import React, { useState, useEffect } from 'react';
import PMLayout from './PMLayout';
import { PM_INITIAL_STATE } from './pm.mockData';
import {
  PMState,
  PMView,
  PMProject,
  PMTask,
  PMMilestone,
  PMTeamMember,
  PMRisk,
  PMIssue,
  PMChangeRequest,
  PMPhase,
  PMBudget,
  PMDocument,
  PMTestRecord,
  PMDeployment,
  PMClosure,
  PMCommunication,
  PMApproval,
  PMActivityLog,
} from './pm.types';

// Views
import PMDashboardView from './views/PMDashboardView';
import PMProjectListView from './views/PMProjectListView';
import PMCreateProjectView from './views/PMCreateProjectView';
import PMProjectOverviewView from './views/PMProjectOverviewView';
import { PMPlanningView } from './views/PMPlanningView';
import { PMTaskView } from './views/PMTaskView';
import { PMTeamView } from './views/PMTeamView';
import { PMMilestoneView } from './views/PMMilestoneView';
import { PMTimelineView } from './views/PMTimelineView';
import { PMDocumentView } from './views/PMDocumentView';
import { PMRiskView } from './views/PMRiskView';
import { PMCommunicationView } from './views/PMCommunicationView';
import { PMQAView } from './views/PMQAView';
import { PMDeploymentView } from './views/PMDeploymentView';
import { PMReportsView } from './views/PMReportsView';
import { PMClosureView } from './views/PMClosureView';
import { PMActivityView } from './views/PMActivityView';
import { PMApprovalView } from './views/PMApprovalView';

interface PMModuleProps {
  onBackToOps: () => void;
}

export const PMModule: React.FC<PMModuleProps> = ({ onBackToOps }) => {
  const [state, setState] = useState<PMState>(() => {
    const saved = localStorage.getItem('rpm_uae_pm_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PM_INITIAL_STATE;
      }
    }
    return PM_INITIAL_STATE;
  });

  const [currentView, setCurrentView] = useState<PMView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    state.projects[0]?.id || null
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rpm_uae_pm_state', JSON.stringify(state));
    } catch (e) {
      // ignore quota errors
    }
  }, [state]);

  // Parse URL on load & popstate for seamless `/projects` routing
  useEffect(() => {
    const parseUrl = () => {
      const pathname = window.location.pathname;
      if (!pathname.startsWith('/projects')) return;

      const parts = pathname.replace(/^\/projects\/?/, '').split('/').filter(Boolean);
      const route = parts[0] || '';
      const paramId = parts[1] || null;

      if (!route) {
        setCurrentView('dashboard');
      } else if (route === 'create') {
        setCurrentView('create');
      } else if (route === 'list') {
        setCurrentView('list');
      } else if (route === 'approvals') {
        setCurrentView('approvals');
      } else if (
        [
          'overview',
          'planning',
          'tasks',
          'team',
          'milestones',
          'timeline',
          'documents',
          'risks',
          'communications',
          'qa-uat',
          'deployment',
          'reports',
          'closure',
          'activity',
        ].includes(route)
      ) {
        setCurrentView(route as PMView);
        if (paramId) {
          const exists = state.projects.find((p) => p.id === paramId || p.code === paramId);
          if (exists) {
            setSelectedProjectId(exists.id);
          }
        }
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, [state.projects]);

  // Navigate handler that synchronizes URL
  const handleNavigate = (view: PMView, projectId?: string) => {
    setCurrentView(view);
    const targetProjId = projectId || selectedProjectId;

    let targetPath = `/projects`;
    if (view === 'create') targetPath = `/projects/create`;
    else if (view === 'list') targetPath = `/projects/list`;
    else if (view === 'approvals') targetPath = `/projects/approvals`;
    else if (view === 'dashboard') targetPath = `/projects`;
    else if (targetProjId) {
      targetPath = `/projects/${view}/${targetProjId}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    handleNavigate('overview', id);
  };

  const handleBackToOpsClick = () => {
    if (window.location.pathname.startsWith('/projects')) {
      window.history.pushState(null, '', '/');
    }
    onBackToOps();
  };

  const selectedProject = state.projects.find((p) => p.id === selectedProjectId) || state.projects[0];

  // Helper to append activity log
  const logActivity = (
    action: string,
    entity: string,
    entityId: string,
    performedBy: string,
    remarks: string,
    prev?: string,
    next?: string,
    projId?: string
  ) => {
    const newLog: PMActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId: projId || selectedProjectId || 'PRJ-GEN',
      action,
      entity,
      entityId,
      previousValue: prev,
      newValue: next,
      performedBy,
      performedAt: new Date().toISOString(),
      remarks,
    };
    setState((prev) => ({
      ...prev,
      activityLogs: [newLog, ...prev.activityLogs],
    }));
  };

  // Handlers for Project Lifecycle
  const handleSaveNewProject = (projectData: Partial<PMProject>) => {
    const id = `prj-${Date.now()}`;
    const newProj: PMProject = {
      id,
      code: projectData.code || `PRJ-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      type: projectData.type || 'Software Development',
      category: projectData.category || 'Client',
      client: projectData.client || 'Client',
      clientContact: projectData.clientContact || '',
      projectManager: projectData.projectManager || 'Ahmed Al Rashidi',
      projectCoordinator: projectData.projectCoordinator || '',
      department: projectData.department || 'IT & Digital Systems',
      priority: projectData.priority || 'Medium',
      status: projectData.status || 'Draft',
      health: 'On Track',
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      expectedEndDate: projectData.expectedEndDate || new Date().toISOString().split('T')[0],
      estimatedBudget: Number(projectData.estimatedBudget) || 100000,
      actualCost: 0,
      currency: projectData.currency || 'AED',
      location: projectData.location || 'Abu Dhabi, UAE',
      scopeOfWork: projectData.scopeOfWork || '',
      businessRequirements: projectData.businessRequirements || '',
      deliverables: projectData.deliverables || '',
      assumptions: projectData.assumptions || '',
      dependencies: projectData.dependencies || '',
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Ahmed Al Rashidi',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: projectData.status || 'Draft',
          changedBy: 'Ahmed Al Rashidi',
          changedAt: new Date().toISOString(),
          remarks: 'Project created via Project Initiation form',
        },
      ],
    };

    // If submitted, create initial governance approval request
    let newApproval: PMApproval | null = null;
    if (newProj.status === 'Submitted') {
      newApproval = {
        id: `app-${Date.now()}`,
        projectId: newProj.id,
        stage: 'Stage 1 Feasibility & Scope Validation',
        reviewer: 'Project Management Office (PMO)',
        decision: 'Pending',
        remarks: 'New project initiation awaiting management assessment',
        submittedAt: new Date().toISOString(),
      };
    }

    setState((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
      approvals: newApproval ? [newApproval, ...prev.approvals] : prev.approvals,
    }));

    logActivity('Project Created', 'Project', newProj.id, 'Ahmed Al Rashidi', `Initiated project ${newProj.code}`);
    setSelectedProjectId(newProj.id);
    handleNavigate('overview', newProj.id);
  };

  const handleUpdateProject = (updated: PMProject) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === updated.id ? updated : p)),
    }));
    logActivity('Project Updated', 'Project', updated.id, 'Project Manager', `Updated details for ${updated.code}`);
  };

  const handleDecideApproval = (
    approvalId: string,
    decision: PMApproval['decision'],
    remarks: string,
    conditionNote?: string
  ) => {
    setState((prev) => {
      const app = prev.approvals.find((a) => a.id === approvalId);
      if (!app) return prev;

      const updatedApproval: PMApproval = {
        ...app,
        decision,
        remarks,
        conditionNote,
        decidedAt: new Date().toISOString().split('T')[0],
      };

      // Transition project status according to approval decision
      let newStatus = prev.projects.find((p) => p.id === app.projectId)?.status;
      if (decision === 'Approved') newStatus = 'Planning';
      else if (decision === 'Rejected') newStatus = 'Rejected';
      else if (decision === 'Clarification') newStatus = 'Clarification Required';
      else if (decision === 'Conditional') newStatus = 'Planning';

      const updatedProjects = prev.projects.map((p) =>
        p.id === app.projectId && newStatus
          ? {
              ...p,
              status: newStatus,
              statusHistory: [
                ...p.statusHistory,
                {
                  id: `sh-${Date.now()}`,
                  status: newStatus,
                  changedBy: 'Executive Approver',
                  changedAt: new Date().toISOString(),
                  remarks: `Approval ${decision}: ${remarks}`,
                },
              ],
            }
          : p
      );

      return {
        ...prev,
        approvals: prev.approvals.map((a) => (a.id === approvalId ? updatedApproval : a)),
        projects: updatedProjects,
      };
    });

    logActivity('Approval Decision', 'Approval', approvalId, 'Executive Approver', `${decision}: ${remarks}`);
  };

  // Task Handlers
  const handleAddTask = (newTask: Partial<PMTask>) => {
    const t: PMTask = {
      id: `task-${Date.now()}`,
      taskId: newTask.taskId || `TSK-${String(state.tasks.length + 1).padStart(3, '0')}`,
      projectId: newTask.projectId || selectedProjectId || '',
      phaseId: newTask.phaseId,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      assignedTo: newTask.assignedTo || 'Unassigned',
      priority: newTask.priority || 'Medium',
      status: newTask.status || 'To Do',
      startDate: newTask.startDate || new Date().toISOString().split('T')[0],
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      estimatedHours: newTask.estimatedHours || 0,
      actualHours: 0,
      dependencies: newTask.dependencies || [],
      acceptanceCriteria: newTask.acceptanceCriteria || '',
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Ahmed Al Rashidi',
    };

    setState((prev) => ({
      ...prev,
      tasks: [t, ...prev.tasks],
    }));

    logActivity('Task Created', 'Task', t.id, 'Project Manager', `Created ${t.taskId}: ${t.title}`);
  };

  const handleUpdateTask = (task: PMTask) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
    logActivity('Task Status Changed', 'Task', task.id, 'Team Member', `Status changed to ${task.status}`);
  };

  const handleAddComment = (taskId: string, commentText: string) => {
    const comm = {
      id: `comm-${Date.now()}`,
      taskId,
      author: 'Ahmed Al Rashidi',
      content: commentText,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [...(t.comments || []), comm] } : t
      ),
    }));
  };

  // Team Handlers
  const handleAddTeamMember = (member: Partial<PMTeamMember>) => {
    const m: PMTeamMember = {
      id: `tm-${Date.now()}`,
      projectId: member.projectId || selectedProjectId || '',
      name: member.name || 'Team Member',
      role: member.role || 'Developer',
      department: member.department || 'IT',
      responsibility: member.responsibility || '',
      allocationPercent: member.allocationPercent || 100,
      startDate: member.startDate || '',
      endDate: member.endDate || '',
      raciRole: member.raciRole || 'Responsible',
      email: member.email || '',
    };
    setState((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, m],
    }));
    logActivity('Team Member Assigned', 'Team', m.id, 'PM', `Assigned ${m.name} as ${m.role}`);
  };

  const handleUpdateTeamMember = (member: PMTeamMember) => {
    setState((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) => (m.id === member.id ? member : m)),
    }));
  };

  // Milestone Handlers
  const handleAddMilestone = (m: Partial<PMMilestone>) => {
    const newM: PMMilestone = {
      id: `ms-${Date.now()}`,
      projectId: m.projectId || selectedProjectId || '',
      phaseId: m.phaseId,
      name: m.name || 'New Milestone',
      description: m.description || '',
      plannedDate: m.plannedDate || '',
      responsiblePerson: m.responsiblePerson || '',
      deliverables: m.deliverables || '',
      acceptanceCriteria: m.acceptanceCriteria || '',
      status: m.status || 'Not Started',
      progressPercent: 0,
      approvalStatus: 'Pending',
    };
    setState((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newM],
    }));
    logActivity('Milestone Added', 'Milestone', newM.id, 'PM', `Created milestone ${newM.name}`);
  };

  const handleUpdateMilestone = (milestone: PMMilestone) => {
    setState((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === milestone.id ? milestone : m)),
    }));
    logActivity('Milestone Updated', 'Milestone', milestone.id, 'Lead', `Updated ${milestone.name}: ${milestone.status}`);
  };

  // Risk & Issue Handlers
  const handleAddRisk = (r: Partial<PMRisk>) => {
    const risk: PMRisk = {
      id: `risk-${Date.now()}`,
      projectId: r.projectId || selectedProjectId || '',
      title: r.title || 'New Risk',
      description: r.description || '',
      probability: r.probability || 'Medium',
      impact: r.impact || 'Medium',
      riskScore: r.riskScore || 4,
      severity: r.severity || 'Medium',
      owner: r.owner || 'Ahmed Al Rashidi',
      mitigationPlan: r.mitigationPlan || '',
      contingencyPlan: r.contingencyPlan || '',
      reviewDate: r.reviewDate || '',
      status: r.status || 'Open',
      identifiedAt: r.identifiedAt || new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      risks: [risk, ...prev.risks],
    }));
    logActivity('Risk Logged', 'Risk', risk.id, 'Risk Officer', `Identified risk: ${risk.title}`);
  };

  const handleUpdateRisk = (risk: PMRisk) => {
    setState((prev) => ({
      ...prev,
      risks: prev.risks.map((r) => (r.id === risk.id ? risk : r)),
    }));
  };

  const handleAddIssue = (i: Partial<PMIssue>) => {
    const issue: PMIssue = {
      id: `iss-${Date.now()}`,
      projectId: i.projectId || selectedProjectId || '',
      title: i.title || '',
      description: i.description || '',
      priority: i.priority || 'Medium',
      owner: i.owner || '',
      reportedDate: i.reportedDate || '',
      targetResolutionDate: i.targetResolutionDate || '',
      resolutionRemarks: '',
      status: 'Open',
    };
    setState((prev) => ({
      ...prev,
      issues: [issue, ...prev.issues],
    }));
    logActivity('Issue Raised', 'Issue', issue.id, 'Reporter', `Raised issue: ${issue.title}`);
  };

  const handleUpdateIssue = (issue: PMIssue) => {
    setState((prev) => ({
      ...prev,
      issues: prev.issues.map((i) => (i.id === issue.id ? issue : i)),
    }));
  };

  const handleAddChangeRequest = (cr: Partial<PMChangeRequest>) => {
    const newCr: PMChangeRequest = {
      id: `cr-${Date.now()}`,
      changeId: cr.changeId || `CRQ-${Date.now()}`,
      projectId: cr.projectId || selectedProjectId || '',
      requestedBy: cr.requestedBy || 'Client',
      description: cr.description || '',
      reason: cr.reason || '',
      scopeImpact: cr.scopeImpact || '',
      timelineImpact: cr.timelineImpact || '',
      budgetImpact: cr.budgetImpact || 0,
      technicalImpact: cr.technicalImpact || '',
      decision: 'Under Review',
      implementationStatus: 'Pending',
      submittedAt: cr.submittedAt || new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      changeRequests: [newCr, ...prev.changeRequests],
    }));
    logActivity('Change Request Submitted', 'ChangeRequest', newCr.id, newCr.requestedBy, `Submitted ${newCr.changeId}`);
  };

  const handleUpdateChangeRequest = (cr: PMChangeRequest) => {
    setState((prev) => ({
      ...prev,
      changeRequests: prev.changeRequests.map((c) => (c.id === cr.id ? cr : c)),
    }));
    logActivity('Change Request Decision', 'ChangeRequest', cr.id, 'PMO', `CR ${cr.changeId} decision: ${cr.decision}`);
  };

  // Phase & Budget Handlers
  const handleAddPhase = (p: Partial<PMPhase>) => {
    const phase: PMPhase = {
      id: `phase-${Date.now()}`,
      projectId: p.projectId || selectedProjectId || '',
      name: p.name || 'New Phase',
      description: p.description || '',
      plannedStart: p.plannedStart || '',
      plannedEnd: p.plannedEnd || '',
      progressPercent: 0,
      status: 'Not Started',
      order: p.order || 1,
    };
    setState((prev) => ({
      ...prev,
      phases: [...prev.phases, phase],
    }));
  };

  const handleUpdatePhase = (p: PMPhase) => {
    setState((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === p.id ? p : ph)),
    }));
  };

  const handleAddBudget = (b: Partial<PMBudget>) => {
    const budget: PMBudget = {
      id: `bg-${Date.now()}`,
      projectId: b.projectId || selectedProjectId || '',
      category: b.category || '',
      department: b.department || '',
      plannedAmount: b.plannedAmount || 0,
      actualAmount: b.actualAmount || 0,
      variance: b.variance || 0,
      notes: b.notes || '',
    };
    setState((prev) => ({
      ...prev,
      budgets: [...prev.budgets, budget],
    }));
  };

  const handleUpdateBudget = (b: PMBudget) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((bg) => (bg.id === b.id ? b : bg)),
    }));
  };

  // Document Handlers
  const handleAddDocument = (doc: Partial<PMDocument>) => {
    const d: PMDocument = {
      id: `doc-${Date.now()}`,
      projectId: doc.projectId || selectedProjectId || '',
      name: doc.name || 'Document',
      category: doc.category || 'Technical Documentation',
      description: doc.description || '',
      uploadedBy: doc.uploadedBy || 'Ahmed Al Rashidi',
      uploadedAt: doc.uploadedAt || new Date().toISOString().split('T')[0],
      version: doc.version || 'v1.0',
      approvalStatus: doc.approvalStatus || 'Draft',
      size: doc.size || '1.5 MB',
      versions: doc.versions || [],
    };
    setState((prev) => ({
      ...prev,
      documents: [d, ...prev.documents],
    }));
    logActivity('Document Uploaded', 'Document', d.id, d.uploadedBy, `Uploaded ${d.name} (${d.version})`);
  };

  const handleUpdateDocument = (doc: PMDocument) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === doc.id ? doc : d)),
    }));
  };

  // QA & Deployment Handlers
  const handleAddTestRecord = (rec: Partial<PMTestRecord>) => {
    const r: PMTestRecord = {
      id: `test-${Date.now()}`,
      projectId: rec.projectId || selectedProjectId || '',
      type: rec.type || 'Test Case',
      title: rec.title || '',
      status: rec.status || 'Draft',
      severity: rec.severity,
      assignedTo: rec.assignedTo || '',
      submittedAt: rec.submittedAt || new Date().toISOString().split('T')[0],
      clientFeedback: rec.clientFeedback,
    };
    setState((prev) => ({
      ...prev,
      testRecords: [r, ...prev.testRecords],
    }));
  };

  const handleUpdateTestRecord = (rec: PMTestRecord) => {
    setState((prev) => ({
      ...prev,
      testRecords: prev.testRecords.map((r) => (r.id === rec.id ? rec : r)),
    }));
  };

  const handleAddDeployment = (d: Partial<PMDeployment>) => {
    const dep: PMDeployment = {
      id: `dep-${Date.now()}`,
      projectId: d.projectId || selectedProjectId || '',
      releaseVersion: d.releaseVersion || 'v1.0.0',
      environment: d.environment || 'Production',
      plannedDate: d.plannedDate || '',
      status: d.status || 'Planned',
      owner: d.owner || '',
      checklist: d.checklist || [],
      rollbackPlan: d.rollbackPlan || '',
      validationResults: d.validationResults || '',
      notes: d.notes || '',
    };
    setState((prev) => ({
      ...prev,
      deployments: [dep, ...prev.deployments],
    }));
  };

  const handleUpdateDeployment = (d: PMDeployment) => {
    setState((prev) => ({
      ...prev,
      deployments: prev.deployments.map((dep) => (dep.id === d.id ? d : dep)),
    }));
    logActivity('Deployment Status Changed', 'Deployment', d.id, d.owner, `Release ${d.releaseVersion} is now ${d.status}`);
  };

  // Closure Handlers
  const handleInitiateClosure = (c: Partial<PMClosure>) => {
    const closure: PMClosure = {
      id: `cls-${Date.now()}`,
      projectId: c.projectId || selectedProjectId || '',
      actualStartDate: c.actualStartDate || '',
      actualEndDate: c.actualEndDate || '',
      finalCost: c.finalCost || 0,
      budgetVariance: c.budgetVariance || 0,
      deliverablesSummary: c.deliverablesSummary || '',
      clientAcceptance: c.clientAcceptance || 'Accepted',
      lessonsLearned: c.lessonsLearned || '',
      pmRemarks: c.pmRemarks || '',
      closureApproval: c.closureApproval || 'Approved',
      approvedBy: c.approvedBy,
      approvedAt: c.approvedAt,
      checklist: c.checklist || [],
    };
    setState((prev) => ({
      ...prev,
      closures: [...prev.closures.filter((cl) => cl.projectId !== closure.projectId), closure],
    }));
  };

  const handleUpdateClosure = (closure: PMClosure) => {
    setState((prev) => ({
      ...prev,
      closures: prev.closures.map((c) => (c.id === closure.id ? closure : c)),
    }));
  };

  const handleCloseProject = (projectId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: 'Closed',
              statusHistory: [
                ...p.statusHistory,
                {
                  id: `sh-${Date.now()}`,
                  status: 'Closed',
                  changedBy: 'General Manager',
                  changedAt: new Date().toISOString(),
                  remarks: 'Project formally validated, delivered, and closed.',
                },
              ],
            }
          : p
      ),
    }));
    logActivity('Project Closed', 'Project', projectId, 'General Manager', 'Project closed and archived.');
  };

  // Communication Handlers
  const handleAddCommunication = (c: Partial<PMCommunication>) => {
    const comm: PMCommunication = {
      id: `comm-${Date.now()}`,
      projectId: c.projectId || selectedProjectId || '',
      type: c.type || 'Discussion',
      subject: c.subject || '',
      content: c.content || '',
      author: c.author || 'Ahmed Al Rashidi',
      createdAt: c.createdAt || new Date().toISOString(),
      attachments: c.attachments || [],
      mentions: c.mentions || [],
    };
    setState((prev) => ({
      ...prev,
      communications: [comm, ...prev.communications],
    }));
  };

  const handleMarkNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  };

  const pendingApprovalsCount = state.approvals.filter((a) => a.decision === 'Pending').length;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <PMLayout
        currentView={currentView}
        selectedProjectId={selectedProjectId}
        selectedProjectName={selectedProject?.name || null}
        onNavigate={(view) => handleNavigate(view)}
        onBackToOps={handleBackToOpsClick}
        pendingApprovalsCount={pendingApprovalsCount}
      >
        {/* Render Active View */}
        {currentView === 'dashboard' && (
          <PMDashboardView
            state={state}
            onNavigate={(view) => handleNavigate(view)}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'list' && (
          <PMProjectListView
            projects={state.projects}
            onSelectProject={handleSelectProject}
            onNavigate={(view) => handleNavigate(view)}
          />
        )}

        {currentView === 'create' && (
          <PMCreateProjectView
            onSave={handleSaveNewProject}
            onCancel={() => handleNavigate('list')}
          />
        )}

        {currentView === 'overview' && selectedProject && (
          <PMProjectOverviewView
            project={selectedProject}
            tasks={state.tasks.filter((t) => t.projectId === selectedProject.id)}
            milestones={state.milestones.filter((m) => m.projectId === selectedProject.id)}
            teamMembers={state.teamMembers.filter((m) => m.projectId === selectedProject.id)}
            risks={state.risks.filter((r) => r.projectId === selectedProject.id)}
            budgets={state.budgets.filter((b) => b.projectId === selectedProject.id)}
            phases={state.phases.filter((p) => p.projectId === selectedProject.id)}
            approvals={state.approvals.filter((a) => a.projectId === selectedProject.id)}
            onNavigate={(view) => handleNavigate(view)}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {currentView === 'planning' && selectedProject && (
          <PMPlanningView
            project={selectedProject}
            phases={state.phases}
            budgets={state.budgets}
            tasks={state.tasks}
            teamMembers={state.teamMembers}
            onAddPhase={handleAddPhase}
            onUpdatePhase={handleUpdatePhase}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {currentView === 'tasks' && selectedProject && (
          <PMTaskView
            projectId={selectedProject.id}
            tasks={state.tasks}
            phases={state.phases.filter((p) => p.projectId === selectedProject.id)}
            teamMembers={state.teamMembers.filter((m) => m.projectId === selectedProject.id)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onAddComment={handleAddComment}
          />
        )}

        {currentView === 'team' && selectedProject && (
          <PMTeamView
            projectId={selectedProject.id}
            teamMembers={state.teamMembers}
            project={selectedProject}
            tasks={state.tasks}
            onAddMember={handleAddTeamMember}
            onUpdateMember={handleUpdateTeamMember}
          />
        )}

        {currentView === 'milestones' && selectedProject && (
          <PMMilestoneView
            projectId={selectedProject.id}
            milestones={state.milestones}
            phases={state.phases.filter((p) => p.projectId === selectedProject.id)}
            onAddMilestone={handleAddMilestone}
            onUpdateMilestone={handleUpdateMilestone}
          />
        )}

        {currentView === 'timeline' && selectedProject && (
          <PMTimelineView
            project={selectedProject}
            phases={state.phases}
            milestones={state.milestones}
            tasks={state.tasks}
          />
        )}

        {currentView === 'documents' && selectedProject && (
          <PMDocumentView
            projectId={selectedProject.id}
            documents={state.documents}
            onAddDocument={handleAddDocument}
            onUpdateDocument={handleUpdateDocument}
          />
        )}

        {currentView === 'risks' && selectedProject && (
          <PMRiskView
            projectId={selectedProject.id}
            risks={state.risks}
            issues={state.issues}
            changeRequests={state.changeRequests}
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            onAddIssue={handleAddIssue}
            onUpdateIssue={handleUpdateIssue}
            onAddChangeRequest={handleAddChangeRequest}
            onUpdateChangeRequest={handleUpdateChangeRequest}
          />
        )}

        {currentView === 'communications' && selectedProject && (
          <PMCommunicationView
            projectId={selectedProject.id}
            communications={state.communications}
            onAddCommunication={handleAddCommunication}
          />
        )}

        {currentView === 'qa-uat' && selectedProject && (
          <PMQAView
            projectId={selectedProject.id}
            testRecords={state.testRecords}
            onAddRecord={handleAddTestRecord}
            onUpdateRecord={handleUpdateTestRecord}
          />
        )}

        {currentView === 'deployment' && selectedProject && (
          <PMDeploymentView
            projectId={selectedProject.id}
            deployments={state.deployments}
            onAddDeployment={handleAddDeployment}
            onUpdateDeployment={handleUpdateDeployment}
          />
        )}

        {currentView === 'reports' && selectedProject && (
          <PMReportsView
            project={selectedProject}
            tasks={state.tasks}
            milestones={state.milestones}
            budgets={state.budgets}
            risks={state.risks}
          />
        )}

        {currentView === 'closure' && selectedProject && (
          <PMClosureView
            project={selectedProject}
            closure={state.closures.find((c) => c.projectId === selectedProject.id)}
            tasks={state.tasks}
            milestones={state.milestones}
            documents={state.documents}
            deployments={state.deployments}
            onInitiateClosure={handleInitiateClosure}
            onUpdateClosure={handleUpdateClosure}
            onCloseProject={handleCloseProject}
          />
        )}

        {currentView === 'activity' && (
          <PMActivityView
            projectId={selectedProjectId}
            activityLogs={state.activityLogs}
            notifications={state.notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
          />
        )}

        {currentView === 'approvals' && (
          <PMApprovalView
            approvals={state.approvals}
            projects={state.projects}
            onDecide={handleDecideApproval}
          />
        )}
      </PMLayout>
    </div>
  );
};
