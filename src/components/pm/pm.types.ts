// ============================================================
// PROJECT MANAGEMENT MODULE — TYPE DEFINITIONS
// Completely isolated from existing UAE operational types.
// ============================================================

export type PMProjectStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Assessment'
  | 'Clarification Required'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Planning'
  | 'Ready for Execution'
  | 'Active'
  | 'On Hold'
  | 'Under Review'
  | 'UAT'
  | 'Ready for Deployment'
  | 'Deployed'
  | 'Handover'
  | 'Pending Closure'
  | 'Completed'
  | 'Closed'
  | 'Archived';

export type PMProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type PMProjectHealth = 'On Track' | 'At Risk' | 'Critical' | 'Not Started';
export type PMProjectType = 'Software Development' | 'Infrastructure' | 'Operational' | 'Research' | 'Compliance' | 'Other';
export type PMProjectCategory = 'Internal' | 'Client' | 'Government' | 'Joint Venture' | 'R&D';

export type PMTaskStatus =
  | 'Backlog'
  | 'To Do'
  | 'In Progress'
  | 'On Hold'
  | 'Under Review'
  | 'Rework Required'
  | 'Completed'
  | 'Cancelled';

export type PMTaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type PMMilestoneStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Pending Review'
  | 'Approved'
  | 'Delayed'
  | 'Completed';

export type PMRiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type PMRiskStatus = 'Open' | 'Mitigated' | 'Accepted' | 'Closed' | 'Escalated';
export type PMIssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type PMChangeStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented';
export type PMDeploymentStatus =
  | 'Planned'
  | 'Pending Approval'
  | 'Ready for Deployment'
  | 'Deployment in Progress'
  | 'Deployed'
  | 'Validation Pending'
  | 'Successful'
  | 'Rolled Back';

export type PMRole =
  | 'Super Admin'
  | 'PM Admin'
  | 'Management'
  | 'Project Manager'
  | 'Project Coordinator'
  | 'Technical Lead'
  | 'Developer'
  | 'QA Engineer'
  | 'DevOps Engineer'
  | 'Finance Reviewer'
  | 'Client Reviewer';

export type PMRACIRole = 'Responsible' | 'Accountable' | 'Consulted' | 'Informed';

export type PMDocumentCategory =
  | 'Project Proposal'
  | 'Statement of Work'
  | 'Requirements'
  | 'Contracts'
  | 'Technical Documentation'
  | 'Design Documents'
  | 'Development Documents'
  | 'QA Documents'
  | 'UAT Documents'
  | 'Deployment Documents'
  | 'Client Approvals'
  | 'Handover Documents'
  | 'Closure Documents';

// ─── Core Entities ──────────────────────────────────────────

export interface PMProject {
  id: string;
  code: string; // Auto-generated e.g. PRJ-2026-001
  name: string;
  description: string;
  type: PMProjectType;
  category: PMProjectCategory;
  client: string;
  clientContact: string;
  projectManager: string;
  projectCoordinator: string;
  department: string;
  priority: PMProjectPriority;
  status: PMProjectStatus;
  health: PMProjectHealth;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  estimatedBudget: number;
  actualCost: number;
  currency: string;
  location: string;
  scopeOfWork: string;
  businessRequirements: string;
  deliverables: string;
  assumptions: string;
  dependencies: string;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  statusHistory: PMStatusHistoryEntry[];
}

export interface PMStatusHistoryEntry {
  id: string;
  status: PMProjectStatus;
  changedBy: string;
  changedAt: string;
  remarks: string;
}

export interface PMApproval {
  id: string;
  projectId: string;
  stage: string;
  reviewer: string;
  decision: 'Pending' | 'Approved' | 'Conditional' | 'Rejected' | 'Clarification';
  remarks: string;
  conditionNote?: string;
  submittedAt: string;
  decidedAt?: string;
}

export interface PMPhase {
  id: string;
  projectId: string;
  name: string;
  description: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  progressPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  order: number;
}

export interface PMTask {
  id: string;
  taskId: string; // display ID e.g. TSK-001
  projectId: string;
  phaseId?: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: PMTaskPriority;
  status: PMTaskStatus;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  acceptanceCriteria: string;
  comments: PMTaskComment[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PMTaskComment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PMTeamMember {
  id: string;
  projectId: string;
  name: string;
  role: PMRole;
  department: string;
  responsibility: string;
  allocationPercent: number;
  startDate: string;
  endDate: string;
  raciRole: PMRACIRole;
  email: string;
}

export interface PMMilestone {
  id: string;
  projectId: string;
  phaseId?: string;
  name: string;
  description: string;
  plannedDate: string;
  actualDate?: string;
  responsiblePerson: string;
  deliverables: string;
  acceptanceCriteria: string;
  status: PMMilestoneStatus;
  progressPercent: number;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

export interface PMBudget {
  id: string;
  projectId: string;
  category: string;
  department: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  notes: string;
}

export interface PMRisk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  riskScore: number; // probability * impact
  severity: PMRiskSeverity;
  owner: string;
  mitigationPlan: string;
  contingencyPlan: string;
  reviewDate: string;
  status: PMRiskStatus;
  identifiedAt: string;
}

export interface PMIssue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: PMTaskPriority;
  owner: string;
  reportedDate: string;
  targetResolutionDate: string;
  resolutionRemarks: string;
  status: PMIssueStatus;
}

export interface PMChangeRequest {
  id: string;
  changeId: string;
  projectId: string;
  requestedBy: string;
  description: string;
  reason: string;
  scopeImpact: string;
  timelineImpact: string;
  budgetImpact: number;
  technicalImpact: string;
  decision: PMChangeStatus;
  implementationStatus: 'Pending' | 'In Progress' | 'Completed';
  submittedAt: string;
  decidedAt?: string;
  decisionBy?: string;
}

export interface PMCommunication {
  id: string;
  projectId: string;
  type: 'Discussion' | 'Announcement' | 'Meeting Minutes' | 'Client Communication' | 'Decision' | 'Action Item';
  subject: string;
  content: string;
  author: string;
  createdAt: string;
  attachments: string[];
  mentions: string[];
}

export interface PMDocument {
  id: string;
  projectId: string;
  name: string;
  category: PMDocumentCategory;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  version: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected' | 'Draft';
  size: string;
  versions: PMDocumentVersion[];
}

export interface PMDocumentVersion {
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  changeNote: string;
}

export interface PMTestRecord {
  id: string;
  projectId: string;
  type: 'Test Plan' | 'Test Case' | 'Defect' | 'UAT';
  title: string;
  status: 'Draft' | 'In Progress' | 'Passed' | 'Failed' | 'Blocked' | 'Signed Off';
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedTo: string;
  submittedAt: string;
  resolvedAt?: string;
  clientFeedback?: string;
  signOffAttachment?: string;
}

export interface PMDeployment {
  id: string;
  projectId: string;
  releaseVersion: string;
  environment: string;
  plannedDate: string;
  actualDate?: string;
  status: PMDeploymentStatus;
  owner: string;
  checklist: { item: string; completed: boolean }[];
  rollbackPlan: string;
  validationResults: string;
  notes: string;
}

export interface PMClosure {
  id: string;
  projectId: string;
  actualStartDate: string;
  actualEndDate: string;
  finalCost: number;
  budgetVariance: number;
  deliverablesSummary: string;
  clientAcceptance: 'Pending' | 'Accepted' | 'Rejected';
  lessonsLearned: string;
  pmRemarks: string;
  closureApproval: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
  checklist: { item: string; completed: boolean }[];
}

export interface PMActivityLog {
  id: string;
  projectId: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  performedBy: string;
  performedAt: string;
  remarks: string;
}

export interface PMNotification {
  id: string;
  projectId?: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetRole: PMRole[];
}

// ─── PM Module State ─────────────────────────────────────────

export interface PMState {
  projects: PMProject[];
  approvals: PMApproval[];
  phases: PMPhase[];
  tasks: PMTask[];
  teamMembers: PMTeamMember[];
  milestones: PMMilestone[];
  budgets: PMBudget[];
  risks: PMRisk[];
  issues: PMIssue[];
  changeRequests: PMChangeRequest[];
  communications: PMCommunication[];
  documents: PMDocument[];
  testRecords: PMTestRecord[];
  deployments: PMDeployment[];
  closures: PMClosure[];
  activityLogs: PMActivityLog[];
  notifications: PMNotification[];
}

// ─── PM Navigation ───────────────────────────────────────────

export type PMView =
  | 'dashboard'
  | 'list'
  | 'create'
  | 'overview'
  | 'planning'
  | 'tasks'
  | 'team'
  | 'milestones'
  | 'timeline'
  | 'documents'
  | 'risks'
  | 'communications'
  | 'approvals'
  | 'qa-uat'
  | 'deployment'
  | 'reports'
  | 'closure'
  | 'activity';
