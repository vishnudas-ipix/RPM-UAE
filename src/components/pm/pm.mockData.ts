// ============================================================
// PROJECT MANAGEMENT MODULE — MOCK DATA
// Realistic sample data for the RPM UAE PM module.
// ============================================================

import {
  PMState,
  PMProject,
  PMApproval,
  PMPhase,
  PMTask,
  PMTeamMember,
  PMMilestone,
  PMBudget,
  PMRisk,
  PMIssue,
  PMChangeRequest,
  PMCommunication,
  PMDocument,
  PMTestRecord,
  PMDeployment,
  PMClosure,
  PMActivityLog,
  PMNotification,
} from './pm.types';

// ─── Projects ────────────────────────────────────────────────

const projects: PMProject[] = [
  {
    id: 'proj-001',
    code: 'PRJ-2026-001',
    name: 'ADNOC Medical Coverage System',
    description:
      'Development of a comprehensive medical coverage management system for ADNOC employees, enabling digital claims processing, provider network management, and real-time benefits tracking across Abu Dhabi facilities.',
    type: 'Software Development',
    category: 'Client',
    client: 'ADNOC Group',
    clientContact: 'Dr. Khalid Al Mansoori',
    projectManager: 'Ahmed Al Rashidi',
    projectCoordinator: 'Fatima Al Zaabi',
    department: 'Software Engineering',
    priority: 'High',
    status: 'Active',
    health: 'On Track',
    startDate: '2026-01-15',
    expectedEndDate: '2026-12-31',
    estimatedBudget: 850000,
    actualCost: 420000,
    currency: 'AED',
    location: 'Abu Dhabi',
    scopeOfWork:
      'Design, develop, test and deploy a full-stack medical coverage system including claims portal, admin dashboard, provider API integrations, and mobile app for employees.',
    businessRequirements:
      'Reduce claims processing time by 70%, provide real-time benefits balance, enable digital pre-authorization, and integrate with 150+ healthcare providers across the UAE.',
    deliverables:
      'Web application, mobile apps (iOS & Android), REST API, admin dashboard, provider portal, training materials, and technical documentation.',
    assumptions:
      'Client will provide access to existing HR systems. Healthcare provider APIs will be available within 30 days of project kickoff. UAT environment will be provided by client.',
    dependencies:
      'ADNOC HR system API access, UAE Insurance Authority regulatory guidelines, provider network onboarding',
    progressPercent: 65,
    createdAt: '2025-12-20T09:00:00Z',
    updatedAt: '2026-11-15T14:30:00Z',
    createdBy: 'Ahmed Al Rashidi',
    statusHistory: [
      {
        id: 'sh-001-1',
        status: 'Draft',
        changedBy: 'Ahmed Al Rashidi',
        changedAt: '2025-12-20T09:00:00Z',
        remarks: 'Project initiated and proposal drafted.',
      },
      {
        id: 'sh-001-2',
        status: 'Approved',
        changedBy: 'Mohammed Al Hashimi',
        changedAt: '2026-01-10T11:00:00Z',
        remarks: 'Project approved by management after scope review.',
      },
      {
        id: 'sh-001-3',
        status: 'Active',
        changedBy: 'Ahmed Al Rashidi',
        changedAt: '2026-01-15T08:00:00Z',
        remarks: 'Project kicked off. Team onboarding complete.',
      },
    ],
  },
  {
    id: 'proj-002',
    code: 'PRJ-2026-002',
    name: 'DOH Compliance Portal',
    description:
      'Government-mandated compliance reporting portal for the Department of Health (DOH) Abu Dhabi. NOTE: Project is overdue — original deadline was 2026-06-30. Currently in UAT phase with critical issues pending resolution.',
    type: 'Software Development',
    category: 'Government',
    client: 'Department of Health – Abu Dhabi',
    clientContact: 'Eng. Reem Al Marzouqi',
    projectManager: 'Sarah Johnson',
    projectCoordinator: 'Omar Al Suwaidi',
    department: 'Software Engineering',
    priority: 'Critical',
    status: 'UAT',
    health: 'At Risk',
    startDate: '2025-10-01',
    expectedEndDate: '2026-06-30',
    estimatedBudget: 1200000,
    actualCost: 1050000,
    currency: 'AED',
    location: 'Abu Dhabi',
    scopeOfWork:
      'Build a secure, DOH-integrated compliance reporting portal for healthcare providers in Abu Dhabi, including automated regulatory submissions, audit trails, and penalty tracking.',
    businessRequirements:
      'Automate 95% of manual compliance reports, reduce regulatory submission errors to below 1%, provide real-time dashboards for DOH inspectors, and support Arabic & English.',
    deliverables:
      'Compliance portal web application, DOH API integration, reporting engine, audit trail module, bilingual UI, deployment runbook, and operations handover package.',
    assumptions:
      'DOH will provide test credentials for staging environment. All regulatory requirements finalized by Q1 2026. No scope changes after February 2026.',
    dependencies:
      'DOH e-Government gateway access, TRA cybersecurity certification, client UAT sign-off',
    progressPercent: 85,
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2026-11-18T16:00:00Z',
    createdBy: 'Sarah Johnson',
    statusHistory: [
      {
        id: 'sh-002-1',
        status: 'Planning',
        changedBy: 'Sarah Johnson',
        changedAt: '2025-09-01T10:00:00Z',
        remarks: 'Project planning initiated following government contract award.',
      },
      {
        id: 'sh-002-2',
        status: 'Active',
        changedBy: 'Sarah Johnson',
        changedAt: '2025-10-01T08:30:00Z',
        remarks: 'Development commenced. All team members onboarded.',
      },
      {
        id: 'sh-002-3',
        status: 'UAT',
        changedBy: 'Sarah Johnson',
        changedAt: '2026-09-15T10:00:00Z',
        remarks:
          'UAT phase started. 3 critical defects identified during initial smoke testing.',
      },
    ],
  },
  {
    id: 'proj-003',
    code: 'PRJ-2026-003',
    name: 'Fleet Telematics Integration',
    description:
      'Internal infrastructure project to integrate real-time telematics data from the RPM UAE vehicle fleet into the central operations dashboard. Includes GPS tracking, fuel monitoring, driver behavior analytics, and predictive maintenance alerts.',
    type: 'Infrastructure',
    category: 'Internal',
    client: 'RPM UAE – Internal Operations',
    clientContact: 'Yusuf Al Hammadi',
    projectManager: 'Mohammed Al Hashimi',
    projectCoordinator: 'Layla Al Farsi',
    department: 'Infrastructure & DevOps',
    priority: 'Medium',
    status: 'Planning',
    health: 'Not Started',
    startDate: '2026-03-01',
    expectedEndDate: '2026-09-30',
    estimatedBudget: 450000,
    actualCost: 35000,
    currency: 'AED',
    location: 'Dubai',
    scopeOfWork:
      'Procure and install telematics hardware on 85 fleet vehicles. Develop data ingestion pipeline, storage layer, and dashboard integration. Configure alerting and reporting.',
    businessRequirements:
      'Achieve real-time visibility of all fleet vehicles, reduce fuel costs by 15%, improve driver safety scores, and enable predictive maintenance scheduling.',
    deliverables:
      'Telematics hardware installed, data pipeline, fleet dashboard module, alert engine, monthly reporting templates, and admin user guide.',
    assumptions:
      'Hardware vendor delivery within 6 weeks of PO issuance. Vehicles available for installation during scheduled windows. Cloud infrastructure already provisioned.',
    dependencies:
      'Telematics hardware vendor (Teltonika), vehicle availability schedule, cloud infrastructure readiness',
    progressPercent: 15,
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-11-01T12:00:00Z',
    createdBy: 'Mohammed Al Hashimi',
    statusHistory: [
      {
        id: 'sh-003-1',
        status: 'Draft',
        changedBy: 'Mohammed Al Hashimi',
        changedAt: '2026-02-10T09:00:00Z',
        remarks: 'Internal project proposal created for fleet telematics upgrade.',
      },
      {
        id: 'sh-003-2',
        status: 'Submitted',
        changedBy: 'Mohammed Al Hashimi',
        changedAt: '2026-02-20T14:00:00Z',
        remarks: 'Submitted to management for budget approval.',
      },
      {
        id: 'sh-003-3',
        status: 'Planning',
        changedBy: 'Ahmed Al Rashidi',
        changedAt: '2026-03-01T08:00:00Z',
        remarks: 'Budget approved. Project in planning phase. Vendor evaluation underway.',
      },
    ],
  },
];

// ─── Approvals ───────────────────────────────────────────────

const approvals: PMApproval[] = [
  {
    id: 'appr-001',
    projectId: 'proj-001',
    stage: 'Scope Change Review',
    reviewer: 'Mohammed Al Hashimi',
    decision: 'Pending',
    remarks:
      'Scope change request submitted to add Arabic language support to the mobile app. Awaiting management review.',
    submittedAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'appr-002',
    projectId: 'proj-002',
    stage: 'UAT Sign-Off Approval',
    reviewer: 'Eng. Reem Al Marzouqi',
    decision: 'Approved',
    remarks:
      'UAT phase partially approved. Critical defects resolved. Minor issues documented for post-go-live patch.',
    conditionNote:
      'Go-live conditional on successful load testing results to be provided within 5 business days.',
    submittedAt: '2026-10-20T09:00:00Z',
    decidedAt: '2026-11-05T15:30:00Z',
  },
  {
    id: 'appr-003',
    projectId: 'proj-003',
    stage: 'Vendor Selection Approval',
    reviewer: 'Ahmed Al Rashidi',
    decision: 'Clarification',
    remarks:
      'Vendor evaluation report reviewed. Clarification required on Teltonika vs. Orbcomm pricing model and SLA commitments before final approval.',
    submittedAt: '2026-11-15T11:00:00Z',
  },
];

// ─── Phases ──────────────────────────────────────────────────

const phases: PMPhase[] = [
  // PRJ-2026-001 phases
  {
    id: 'phase-001',
    projectId: 'proj-001',
    name: 'Discovery & Requirements',
    description:
      'Stakeholder workshops, business requirements documentation, technical architecture design, and project plan finalization.',
    plannedStart: '2026-01-15',
    plannedEnd: '2026-02-28',
    actualStart: '2026-01-15',
    actualEnd: '2026-02-25',
    progressPercent: 100,
    status: 'Completed',
    order: 1,
  },
  {
    id: 'phase-002',
    projectId: 'proj-001',
    name: 'Development',
    description:
      'Full-stack application development including backend APIs, frontend web app, mobile apps, and third-party integrations.',
    plannedStart: '2026-03-01',
    plannedEnd: '2026-09-30',
    actualStart: '2026-03-01',
    progressPercent: 72,
    status: 'In Progress',
    order: 2,
  },
  {
    id: 'phase-003',
    projectId: 'proj-001',
    name: 'Testing & UAT',
    description:
      'System integration testing, performance testing, security audit, user acceptance testing with ADNOC pilot group.',
    plannedStart: '2026-10-01',
    plannedEnd: '2026-11-30',
    progressPercent: 0,
    status: 'Not Started',
    order: 3,
  },
  // PRJ-2026-002 phases
  {
    id: 'phase-004',
    projectId: 'proj-002',
    name: 'Development & Integration',
    description:
      'Core portal development, DOH API integration, compliance rule engine, and bilingual UI implementation.',
    plannedStart: '2025-10-01',
    plannedEnd: '2026-04-30',
    actualStart: '2025-10-01',
    actualEnd: '2026-05-15',
    progressPercent: 100,
    status: 'Completed',
    order: 1,
  },
  {
    id: 'phase-005',
    projectId: 'proj-002',
    name: 'UAT & Deployment',
    description:
      'User acceptance testing with DOH inspectors, defect resolution, staging deployment, and production go-live preparation.',
    plannedStart: '2026-05-01',
    plannedEnd: '2026-06-30',
    actualStart: '2026-09-15',
    progressPercent: 60,
    status: 'In Progress',
    order: 2,
  },
];

// ─── Tasks ───────────────────────────────────────────────────

const tasks: PMTask[] = [
  {
    id: 'task-001',
    taskId: 'TSK-001',
    projectId: 'proj-001',
    phaseId: 'phase-002',
    title: 'Develop Claims Submission API',
    description:
      'Build RESTful API endpoints for submitting, tracking, and managing medical claims. Must support bulk uploads and real-time status updates.',
    assignedTo: 'Ali Hassan',
    priority: 'High',
    status: 'In Progress',
    startDate: '2026-05-01',
    dueDate: '2026-06-30',
    estimatedHours: 120,
    actualHours: 85,
    dependencies: [],
    acceptanceCriteria:
      'API handles 500 concurrent requests, response time < 300ms, full Swagger documentation provided, all edge cases covered with unit tests.',
    comments: [
      {
        id: 'cmt-001-1',
        taskId: 'TSK-001',
        author: 'Ahmed Al Rashidi',
        content:
          'Good progress. Ensure the error handling follows the DOH API error code standard. Review the error schema document I shared.',
        createdAt: '2026-06-01T10:00:00Z',
      },
      {
        id: 'cmt-001-2',
        taskId: 'TSK-001',
        author: 'Ali Hassan',
        content:
          'Updated error handling. Load test results show 480 RPS currently — optimizing DB queries to hit 500 RPS target.',
        createdAt: '2026-06-15T14:30:00Z',
      },
    ],
    createdAt: '2026-04-28T09:00:00Z',
    updatedAt: '2026-06-15T14:30:00Z',
    createdBy: 'Ahmed Al Rashidi',
  },
  {
    id: 'task-002',
    taskId: 'TSK-002',
    projectId: 'proj-001',
    phaseId: 'phase-002',
    title: 'Provider Network Integration Module',
    description:
      'Develop integration layer connecting to 150+ healthcare provider APIs. Includes provider directory, eligibility checks, and pre-authorization workflows.',
    assignedTo: 'Priya Nair',
    priority: 'High',
    status: 'In Progress',
    startDate: '2026-05-15',
    dueDate: '2026-07-31',
    estimatedHours: 160,
    actualHours: 70,
    dependencies: ['task-001'],
    acceptanceCriteria:
      'Integration live with top 20 providers, eligibility check response < 2s, pre-auth workflow automated end-to-end.',
    comments: [
      {
        id: 'cmt-002-1',
        taskId: 'TSK-002',
        author: 'Priya Nair',
        content:
          'Integration with 12 providers completed. Remaining 8 providers have non-standard APIs — raising a risk item.',
        createdAt: '2026-06-20T11:00:00Z',
      },
    ],
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-06-20T11:00:00Z',
    createdBy: 'Ahmed Al Rashidi',
  },
  {
    id: 'task-003',
    taskId: 'TSK-003',
    projectId: 'proj-001',
    phaseId: 'phase-001',
    title: 'Business Requirements Document (BRD)',
    description:
      'Conduct stakeholder interviews and workshops to produce a comprehensive Business Requirements Document covering all functional and non-functional requirements.',
    assignedTo: 'Fatima Al Zaabi',
    priority: 'Critical',
    status: 'Completed',
    startDate: '2026-01-15',
    dueDate: '2026-02-10',
    estimatedHours: 40,
    actualHours: 38,
    dependencies: [],
    acceptanceCriteria:
      'BRD reviewed and signed off by ADNOC sponsor, all 47 user stories documented, non-functional requirements captured.',
    comments: [
      {
        id: 'cmt-003-1',
        taskId: 'TSK-003',
        author: 'Ahmed Al Rashidi',
        content: 'BRD signed off by Dr. Khalid. Excellent work on capturing all edge cases.',
        createdAt: '2026-02-12T09:30:00Z',
      },
    ],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-12T09:30:00Z',
    createdBy: 'Ahmed Al Rashidi',
  },
  {
    id: 'task-004',
    taskId: 'TSK-004',
    projectId: 'proj-001',
    phaseId: 'phase-002',
    title: 'Mobile App — iOS Development',
    description:
      'Develop native iOS application for ADNOC employees to view benefits, submit claims, find providers, and receive notifications.',
    assignedTo: 'Rahul Sharma',
    priority: 'Medium',
    status: 'To Do',
    startDate: '2026-07-01',
    dueDate: '2026-09-30',
    estimatedHours: 200,
    actualHours: 0,
    dependencies: ['task-001'],
    acceptanceCriteria:
      'App passes Apple App Store review, supports iOS 15+, offline mode for benefits card, biometric authentication.',
    comments: [
      {
        id: 'cmt-004-1',
        taskId: 'TSK-004',
        author: 'Ahmed Al Rashidi',
        content:
          'iOS development to begin once Claims API (TSK-001) is complete. Rahul to review design mockups in the meantime.',
        createdAt: '2026-05-20T10:00:00Z',
      },
    ],
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
    createdBy: 'Ahmed Al Rashidi',
  },
  {
    id: 'task-005',
    taskId: 'TSK-005',
    projectId: 'proj-002',
    phaseId: 'phase-005',
    title: 'UAT Defect — Arabic RTL Layout Rendering',
    description:
      'Critical defect identified during UAT: Arabic text in compliance report tables is not rendering correctly in RTL mode. Affects all report export PDFs.',
    assignedTo: 'Nadia Al Khalidi',
    priority: 'Critical',
    status: 'Under Review',
    startDate: '2026-10-05',
    dueDate: '2026-10-20',
    estimatedHours: 24,
    actualHours: 20,
    dependencies: [],
    acceptanceCriteria:
      'All Arabic text renders correctly in RTL, PDF exports verified with 5 report types, confirmed by DOH UAT team.',
    comments: [
      {
        id: 'cmt-005-1',
        taskId: 'TSK-005',
        author: 'Sarah Johnson',
        content: 'Fix submitted by Nadia. Under review by QA. DOH team to re-test tomorrow.',
        createdAt: '2026-10-18T16:00:00Z',
      },
      {
        id: 'cmt-005-2',
        taskId: 'TSK-005',
        author: 'Nadia Al Khalidi',
        content:
          'RTL fix applied using CSS logical properties. Also fixed the PDF generation library config. Ready for QA sign-off.',
        createdAt: '2026-10-17T14:00:00Z',
      },
    ],
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z',
    createdBy: 'Sarah Johnson',
  },
  {
    id: 'task-006',
    taskId: 'TSK-006',
    projectId: 'proj-002',
    phaseId: 'phase-005',
    title: 'Performance Load Testing — Compliance Portal',
    description:
      'Conduct load testing simulating 2,000 concurrent DOH inspector sessions to validate the portal can handle peak regulatory submission periods (end of quarter).',
    assignedTo: 'James Okafor',
    priority: 'High',
    status: 'Rework Required',
    startDate: '2026-10-10',
    dueDate: '2026-10-30',
    estimatedHours: 32,
    actualHours: 28,
    dependencies: ['task-005'],
    acceptanceCriteria:
      '99th percentile response time < 2s under 2000 concurrent users, zero data loss, auto-scaling triggers confirmed.',
    comments: [
      {
        id: 'cmt-006-1',
        taskId: 'TSK-006',
        author: 'Sarah Johnson',
        content:
          'First load test run failed at 1,400 concurrent users — DB connection pool exhausted. Rework required on connection pooling config.',
        createdAt: '2026-10-25T17:00:00Z',
      },
    ],
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-25T17:00:00Z',
    createdBy: 'Sarah Johnson',
  },
  {
    id: 'task-007',
    taskId: 'TSK-007',
    projectId: 'proj-003',
    title: 'Telematics Hardware Vendor Evaluation',
    description:
      'Evaluate and shortlist telematics hardware vendors (Teltonika, Orbcomm, Verizon Connect) based on technical specs, UAE compatibility, pricing, and after-sales support.',
    assignedTo: 'Mohammed Al Hashimi',
    priority: 'High',
    status: 'Backlog',
    startDate: '2026-03-15',
    dueDate: '2026-04-15',
    estimatedHours: 40,
    actualHours: 5,
    dependencies: [],
    acceptanceCriteria:
      'Vendor comparison matrix completed, 3 vendors assessed, recommendation report with scoring submitted to management.',
    comments: [
      {
        id: 'cmt-007-1',
        taskId: 'TSK-007',
        author: 'Mohammed Al Hashimi',
        content:
          'Initial vendor list compiled. Waiting for budget clarification approval before proceeding with RFQ.',
        createdAt: '2026-11-16T10:00:00Z',
      },
    ],
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-11-16T10:00:00Z',
    createdBy: 'Mohammed Al Hashimi',
  },
  {
    id: 'task-008',
    taskId: 'TSK-008',
    projectId: 'proj-001',
    phaseId: 'phase-002',
    title: 'Admin Dashboard — Finance & Reporting Module',
    description:
      'Develop the finance and reporting section of the ADNOC admin dashboard: claims cost analytics, budget vs actuals, provider payment reconciliation, and export to Excel/PDF.',
    assignedTo: 'Ali Hassan',
    priority: 'Medium',
    status: 'On Hold',
    startDate: '2026-06-01',
    dueDate: '2026-08-31',
    estimatedHours: 80,
    actualHours: 15,
    dependencies: ['task-001'],
    acceptanceCriteria:
      'All 12 report types implemented, Excel export working, PDF generation with ADNOC branding, role-based access enforced.',
    comments: [
      {
        id: 'cmt-008-1',
        taskId: 'TSK-008',
        author: 'Ahmed Al Rashidi',
        content:
          'Placing this on hold until Claims API is fully stable. Ali to focus on TSK-001 completion first.',
        createdAt: '2026-06-10T09:30:00Z',
      },
      {
        id: 'cmt-008-2',
        taskId: 'TSK-008',
        author: 'Ali Hassan',
        content: 'Acknowledged. Will resume after TSK-001 passes QA review.',
        createdAt: '2026-06-10T11:00:00Z',
      },
    ],
    createdAt: '2026-05-25T09:00:00Z',
    updatedAt: '2026-06-10T11:00:00Z',
    createdBy: 'Ahmed Al Rashidi',
  },
];

// ─── Team Members ─────────────────────────────────────────────

const teamMembers: PMTeamMember[] = [
  // PRJ-2026-001 — 5 members
  {
    id: 'tm-001',
    projectId: 'proj-001',
    name: 'Ahmed Al Rashidi',
    role: 'Project Manager',
    department: 'Project Management Office',
    responsibility: 'Overall project delivery, client communication, risk management, and stakeholder reporting.',
    allocationPercent: 100,
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    raciRole: 'Accountable',
    email: 'ahmed.rashidi@rpmuae.ae',
  },
  {
    id: 'tm-002',
    projectId: 'proj-001',
    name: 'Ali Hassan',
    role: 'Developer',
    department: 'Software Engineering',
    responsibility: 'Backend API development, database design, claims processing engine, and third-party integrations.',
    allocationPercent: 100,
    startDate: '2026-02-01',
    endDate: '2026-10-31',
    raciRole: 'Responsible',
    email: 'ali.hassan@rpmuae.ae',
  },
  {
    id: 'tm-003',
    projectId: 'proj-001',
    name: 'Priya Nair',
    role: 'Developer',
    department: 'Software Engineering',
    responsibility: 'Provider integration APIs, middleware development, and mobile backend services.',
    allocationPercent: 100,
    startDate: '2026-02-01',
    endDate: '2026-10-31',
    raciRole: 'Responsible',
    email: 'priya.nair@rpmuae.ae',
  },
  {
    id: 'tm-004',
    projectId: 'proj-001',
    name: 'Fatima Al Zaabi',
    role: 'QA Engineer',
    department: 'Quality Assurance',
    responsibility: 'Test planning, test case design, automation framework, UAT coordination, and defect tracking.',
    allocationPercent: 75,
    startDate: '2026-03-01',
    endDate: '2026-12-15',
    raciRole: 'Responsible',
    email: 'fatima.zaabi@rpmuae.ae',
  },
  {
    id: 'tm-005',
    projectId: 'proj-001',
    name: 'Rahul Sharma',
    role: 'Technical Lead',
    department: 'Software Engineering',
    responsibility: 'Technical architecture decisions, code reviews, mobile app development, and DevOps coordination.',
    allocationPercent: 80,
    startDate: '2026-01-20',
    endDate: '2026-12-31',
    raciRole: 'Responsible',
    email: 'rahul.sharma@rpmuae.ae',
  },
  // PRJ-2026-002 — 3 members
  {
    id: 'tm-006',
    projectId: 'proj-002',
    name: 'Sarah Johnson',
    role: 'Project Manager',
    department: 'Project Management Office',
    responsibility: 'Government client liaison, project governance, risk and issue escalation, delivery ownership.',
    allocationPercent: 100,
    startDate: '2025-10-01',
    endDate: '2026-12-31',
    raciRole: 'Accountable',
    email: 'sarah.johnson@rpmuae.ae',
  },
  {
    id: 'tm-007',
    projectId: 'proj-002',
    name: 'Nadia Al Khalidi',
    role: 'Developer',
    department: 'Software Engineering',
    responsibility: 'Frontend development, Arabic RTL implementation, DOH portal UI, and PDF generation engine.',
    allocationPercent: 100,
    startDate: '2025-10-15',
    endDate: '2026-11-30',
    raciRole: 'Responsible',
    email: 'nadia.khalidi@rpmuae.ae',
  },
  {
    id: 'tm-008',
    projectId: 'proj-002',
    name: 'James Okafor',
    role: 'DevOps Engineer',
    department: 'Infrastructure & DevOps',
    responsibility: 'CI/CD pipelines, cloud infrastructure setup, performance testing, and production deployment management.',
    allocationPercent: 60,
    startDate: '2025-11-01',
    endDate: '2026-11-30',
    raciRole: 'Responsible',
    email: 'james.okafor@rpmuae.ae',
  },
  // PRJ-2026-003 — 2 members
  {
    id: 'tm-009',
    projectId: 'proj-003',
    name: 'Mohammed Al Hashimi',
    role: 'Project Manager',
    department: 'Project Management Office',
    responsibility: 'Internal project management, vendor coordination, infrastructure planning, and fleet stakeholder communication.',
    allocationPercent: 50,
    startDate: '2026-03-01',
    endDate: '2026-09-30',
    raciRole: 'Accountable',
    email: 'mohammed.hashimi@rpmuae.ae',
  },
  {
    id: 'tm-010',
    projectId: 'proj-003',
    name: 'Khalid Al Nuaimi',
    role: 'DevOps Engineer',
    department: 'Infrastructure & DevOps',
    responsibility: 'Hardware installation planning, data pipeline development, cloud infrastructure, and dashboard integration.',
    allocationPercent: 100,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    raciRole: 'Responsible',
    email: 'khalid.nuaimi@rpmuae.ae',
  },
];

// ─── Milestones ───────────────────────────────────────────────

const milestones: PMMilestone[] = [
  {
    id: 'ms-001',
    projectId: 'proj-001',
    phaseId: 'phase-001',
    name: 'BRD & Technical Architecture Sign-Off',
    description:
      'Formal sign-off by ADNOC sponsor on the Business Requirements Document and Technical Architecture design. Gate to proceed to development.',
    plannedDate: '2026-02-28',
    actualDate: '2026-02-25',
    responsiblePerson: 'Ahmed Al Rashidi',
    deliverables: 'Business Requirements Document v1.0, Technical Architecture Document v1.0, project plan baseline',
    acceptanceCriteria: 'Both documents signed by ADNOC Group IT Director and RPM UAE PM.',
    status: 'Completed',
    progressPercent: 100,
    approvalStatus: 'Approved',
  },
  {
    id: 'ms-002',
    projectId: 'proj-001',
    phaseId: 'phase-002',
    name: 'Core API Release — v1.0 Alpha',
    description:
      'Internal release of all core backend APIs (Claims, Eligibility, Provider Directory) for integration testing.',
    plannedDate: '2026-07-31',
    responsiblePerson: 'Rahul Sharma',
    deliverables: 'REST APIs deployed to staging, API documentation (Swagger), integration test report',
    acceptanceCriteria: 'All 23 API endpoints passing integration tests, Swagger docs complete, staging environment stable.',
    status: 'Approved',
    progressPercent: 90,
    approvalStatus: 'Approved',
  },
  {
    id: 'ms-003',
    projectId: 'proj-002',
    phaseId: 'phase-005',
    name: 'DOH UAT Completion & Sign-Off',
    description: 'Formal completion of UAT by Department of Health inspectors and sign-off on all agreed test scenarios.',
    plannedDate: '2026-11-30',
    responsiblePerson: 'Sarah Johnson',
    deliverables: 'UAT sign-off letter, resolved defects log, go-live readiness report',
    acceptanceCriteria:
      'All P1 and P2 defects resolved, DOH inspector sign-off obtained, go-live checklist 100% complete.',
    status: 'In Progress',
    progressPercent: 60,
    approvalStatus: 'Pending',
  },
  {
    id: 'ms-004',
    projectId: 'proj-003',
    name: 'Hardware Procurement & Installation Complete',
    description: 'All 85 fleet vehicles fitted with telematics hardware units and transmitting live data to the cloud.',
    plannedDate: '2026-06-30',
    responsiblePerson: 'Mohammed Al Hashimi',
    deliverables: 'Installation completion report, device IMEI register, first live data feed confirmation',
    acceptanceCriteria: '100% of vehicles transmitting GPS + fuel data, data latency < 60 seconds.',
    status: 'Not Started',
    progressPercent: 0,
    approvalStatus: 'Pending',
  },
];

// ─── Budgets ─────────────────────────────────────────────────

const budgets: PMBudget[] = [
  // PRJ-2026-001 — 4 line items
  {
    id: 'bud-001',
    projectId: 'proj-001',
    category: 'Resource',
    department: 'Software Engineering',
    plannedAmount: 500000,
    actualAmount: 265000,
    variance: 235000,
    notes: 'Team salaries and contractor fees for 8-month development period.',
  },
  {
    id: 'bud-002',
    projectId: 'proj-001',
    category: 'Infrastructure',
    department: 'Infrastructure & DevOps',
    plannedAmount: 150000,
    actualAmount: 85000,
    variance: 65000,
    notes: 'AWS cloud infrastructure, CDN, WAF, and DevOps tooling costs.',
  },
  {
    id: 'bud-003',
    projectId: 'proj-001',
    category: 'Licensing',
    department: 'Software Engineering',
    plannedAmount: 120000,
    actualAmount: 55000,
    variance: 65000,
    notes: 'Third-party software licenses: PDF generation, SMS gateway, identity management.',
  },
  {
    id: 'bud-004',
    projectId: 'proj-001',
    category: 'Operations',
    department: 'Project Management Office',
    plannedAmount: 80000,
    actualAmount: 15000,
    variance: 65000,
    notes: 'Travel, workshops, training, and miscellaneous project management costs.',
  },
  // PRJ-2026-002 — 2 line items
  {
    id: 'bud-005',
    projectId: 'proj-002',
    category: 'Resource',
    department: 'Software Engineering',
    plannedAmount: 850000,
    actualAmount: 820000,
    variance: 30000,
    notes: 'Team salaries for 13-month project. Overtime incurred due to scope additions.',
  },
  {
    id: 'bud-006',
    projectId: 'proj-002',
    category: 'Infrastructure',
    department: 'Infrastructure & DevOps',
    plannedAmount: 350000,
    actualAmount: 230000,
    variance: 120000,
    notes: 'Government-grade secure cloud hosting, TRA-compliant WAF, and load testing tools.',
  },
];

// ─── Risks ───────────────────────────────────────────────────

const risks: PMRisk[] = [
  {
    id: 'risk-001',
    projectId: 'proj-001',
    title: 'Non-Standard Provider API Protocols',
    description:
      '8 of the target healthcare providers use non-standard or legacy API protocols that are not documented. Integration may require significant custom development effort, impacting timeline.',
    probability: 'High',
    impact: 'High',
    riskScore: 9,
    severity: 'High',
    owner: 'Priya Nair',
    mitigationPlan:
      'Assign a dedicated integration specialist for non-standard providers. Prioritize API discovery sessions with each affected provider. Consider middleware adapter pattern to normalize all APIs.',
    contingencyPlan:
      'If integration cannot be completed within 3 weeks per provider, implement manual batch upload workaround and document as a known limitation for phase 2.',
    reviewDate: '2026-07-15',
    status: 'Open',
    identifiedAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'risk-002',
    projectId: 'proj-002',
    title: 'DOH Regulatory Requirement Changes',
    description:
      'UAE health regulations subject to periodic updates. Mid-project regulatory changes could require significant rework of the compliance rule engine.',
    probability: 'Medium',
    impact: 'High',
    riskScore: 6,
    severity: 'Medium',
    owner: 'Sarah Johnson',
    mitigationPlan:
      'Implement a configuration-driven compliance rule engine to allow rule updates without code changes. Maintain weekly contact with DOH regulatory affairs team for advance notice of changes.',
    contingencyPlan:
      'Raise a formal change request with client for any regulatory changes post-baseline. Time and materials billing for rework caused by regulatory changes.',
    reviewDate: '2026-10-01',
    status: 'Mitigated',
    identifiedAt: '2025-11-15T09:00:00Z',
  },
  {
    id: 'risk-003',
    projectId: 'proj-002',
    title: 'Production Go-Live Blocked by Pending TRA Security Certification',
    description:
      'The Telecommunications and Digital Government Regulatory Authority (TDRA) security certification is a mandatory pre-requisite for government portal go-live. Certification review is pending and timelines are uncertain.',
    probability: 'High',
    impact: 'High',
    riskScore: 9,
    severity: 'Critical',
    owner: 'Sarah Johnson',
    mitigationPlan:
      'Engage TDRA-accredited security consultant immediately. Submit penetration test report and security architecture to TDRA. Escalate through government relations channel for expedited review.',
    contingencyPlan:
      'If certification delayed beyond 60 days, seek interim temporary operating approval from DOH to allow controlled pilot launch. Formally escalate to RPM UAE management and DOH for joint decision.',
    reviewDate: '2026-11-30',
    status: 'Escalated',
    identifiedAt: '2026-10-01T10:00:00Z',
  },
];

// ─── Issues ──────────────────────────────────────────────────

const issues: PMIssue[] = [
  {
    id: 'iss-001',
    projectId: 'proj-002',
    title: 'DOH Staging Environment Access Not Provided',
    description:
      'Despite three formal requests, the DOH IT team has not provided credentials and network access for the staging environment. This is blocking UAT testing on the government side.',
    priority: 'Critical',
    owner: 'Sarah Johnson',
    reportedDate: '2026-10-01',
    targetResolutionDate: '2026-10-10',
    resolutionRemarks: '',
    status: 'Open',
  },
  {
    id: 'iss-002',
    projectId: 'proj-001',
    title: 'AWS Cost Overrun in Development Environment',
    description:
      'Development environment costs exceeded monthly budget by 40% in June due to un-terminated EC2 instances and oversized RDS instances. Finance team flagged the variance.',
    priority: 'High',
    owner: 'Rahul Sharma',
    reportedDate: '2026-07-02',
    targetResolutionDate: '2026-07-15',
    resolutionRemarks:
      'AWS Cost Explorer alerts configured, development instances rightsized, nightly auto-shutdown policy enforced. Monthly budget back on track from July onwards.',
    status: 'In Progress',
  },
  {
    id: 'iss-003',
    projectId: 'proj-001',
    title: 'ADNOC HR System API Rate Limiting',
    description:
      'ADNOC HR system API imposed a 100 req/min rate limit that was not disclosed during requirements phase. This impacts the employee eligibility check feature performance.',
    priority: 'Medium',
    owner: 'Ali Hassan',
    reportedDate: '2026-05-20',
    targetResolutionDate: '2026-06-10',
    resolutionRemarks:
      'Implemented server-side caching for eligibility data with 1-hour TTL. Bulk eligibility pre-fetch on login. Performance tests confirm acceptable response times within rate limits.',
    status: 'Resolved',
  },
];

// ─── Change Requests ──────────────────────────────────────────

const changeRequests: PMChangeRequest[] = [
  {
    id: 'cr-001',
    changeId: 'CRQ-2026-001',
    projectId: 'proj-001',
    requestedBy: 'Dr. Khalid Al Mansoori',
    description:
      'Add full Arabic language support (UI text, notifications, PDF reports) to the ADNOC Medical Coverage System mobile and web applications.',
    reason:
      'ADNOC mandate requires all employee-facing systems to be bilingual (Arabic/English) per UAE Arabization policy. This was not in original scope.',
    scopeImpact:
      'Adds approximately 3 weeks of frontend development. All UI strings to be externalized and translated. PDF generation library to be upgraded for Arabic font support.',
    timelineImpact:
      'Expected end date shift from 2026-12-31 to 2027-01-21 (3 weeks delay) if approved.',
    budgetImpact: 85000,
    technicalImpact:
      'Requires i18n framework integration, RTL CSS overhaul, translation memory system, and PDF library upgrade from PDFKit to Puppeteer for Arabic rendering.',
    decision: 'Approved',
    implementationStatus: 'In Progress',
    submittedAt: '2026-10-15T10:00:00Z',
    decidedAt: '2026-11-01T14:00:00Z',
    decisionBy: 'Mohammed Al Hashimi',
  },
  {
    id: 'cr-002',
    changeId: 'CRQ-2026-002',
    projectId: 'proj-002',
    requestedBy: 'Sarah Johnson',
    description:
      'Request to add automated email and SMS notification system to alert healthcare providers 30/14/7 days before compliance submission deadlines.',
    reason:
      'During UAT, DOH inspectors noted that providers frequently miss deadlines due to lack of reminders. This feature would significantly reduce non-compliance penalties.',
    scopeImpact:
      'New notification module: email templates, SMS gateway integration, configurable schedule management, and notification audit log.',
    timelineImpact:
      'Estimated 2-week additional development effort. Would delay go-live if approved without additional resources.',
    budgetImpact: 45000,
    technicalImpact:
      'Integration with Twilio for SMS, SendGrid for email. New database tables for notification schedules. Background job scheduler required.',
    decision: 'Under Review',
    implementationStatus: 'Pending',
    submittedAt: '2026-11-08T09:00:00Z',
  },
];

// ─── Communications ───────────────────────────────────────────

const communications: PMCommunication[] = [
  {
    id: 'comm-001',
    projectId: 'proj-001',
    type: 'Discussion',
    subject: 'Provider API Integration Strategy — Non-Standard Protocols',
    content:
      'Team discussion on approach to handle the 8 healthcare providers using non-standard API protocols. Three approaches considered: (1) Custom adapter per provider, (2) Universal middleware normalizer, (3) Hybrid approach with common gateway. Decision: proceed with Option 2 (middleware normalizer) using Apache Camel. Ali and Priya to collaborate on the design.',
    author: 'Rahul Sharma',
    createdAt: '2026-06-22T14:00:00Z',
    attachments: ['API_Integration_Strategy_v1.pdf'],
    mentions: ['Ali Hassan', 'Priya Nair', 'Ahmed Al Rashidi'],
  },
  {
    id: 'comm-002',
    projectId: 'proj-002',
    type: 'Meeting Minutes',
    subject: 'DOH UAT Review Meeting — 2026-10-15',
    content:
      'Attendees: Sarah Johnson (RPM UAE), Nadia Al Khalidi (RPM UAE), Eng. Reem Al Marzouqi (DOH), Hassan Al Mulla (DOH IT). Key outcomes: (1) P1 defect RTL rendering — fix accepted, (2) Load test to be rerun by Oct 30, (3) DOH to provide staging access by Oct 20, (4) Next review scheduled for Nov 15. Action items: Sarah to follow up on staging access daily, James to rerun load test with optimized config.',
    author: 'Sarah Johnson',
    createdAt: '2026-10-15T17:00:00Z',
    attachments: ['DOH_UAT_Meeting_Minutes_20261015.docx'],
    mentions: ['Nadia Al Khalidi', 'James Okafor'],
  },
  {
    id: 'comm-003',
    projectId: 'proj-001',
    type: 'Discussion',
    subject: 'CRQ-2026-001 Arabic Localization — Technical Approach',
    content:
      'Following approval of CRQ-2026-001, the team discussed technical implementation. Decided to use react-i18next for the web app, Flutter l10n package for mobile. Translation vendor: Lionbridge MENA. Estimated 2,500 strings to be translated. Translation kickoff next Monday. RTL CSS to use CSS Logical Properties for future-proofing.',
    author: 'Rahul Sharma',
    createdAt: '2026-11-05T10:30:00Z',
    attachments: ['Localization_Plan_v1.pdf'],
    mentions: ['Priya Nair', 'Nadia Al Khalidi', 'Ahmed Al Rashidi'],
  },
  {
    id: 'comm-004',
    projectId: 'proj-002',
    type: 'Announcement',
    subject: 'DOH Compliance Portal — Go-Live Target Date Updated',
    content:
      'Team announcement: Following resolution of load testing issues and pending TRA certification, the revised go-live target for the DOH Compliance Portal is set to 2026-12-15. This is subject to successful completion of: (1) Load test re-run passing, (2) TRA certification received, (3) DOH final sign-off. All team members to maintain current sprint velocity. Any blockers to be escalated to Sarah Johnson immediately.',
    author: 'Sarah Johnson',
    createdAt: '2026-11-01T09:00:00Z',
    attachments: [],
    mentions: ['Nadia Al Khalidi', 'James Okafor', 'Mohammed Al Hashimi'],
  },
];

// ─── Documents ────────────────────────────────────────────────

const documents: PMDocument[] = [
  {
    id: 'doc-001',
    projectId: 'proj-001',
    name: 'ADNOC Medical Coverage System — Business Requirements Document',
    category: 'Requirements',
    description:
      'Comprehensive BRD capturing all functional and non-functional requirements for the ADNOC Medical Coverage System, including 47 user stories and system architecture overview.',
    uploadedBy: 'Fatima Al Zaabi',
    uploadedAt: '2026-02-25T10:00:00Z',
    version: 'v2.1',
    approvalStatus: 'Approved',
    size: '4.2 MB',
    versions: [
      {
        version: 'v1.0',
        uploadedBy: 'Fatima Al Zaabi',
        uploadedAt: '2026-02-10T14:00:00Z',
        changeNote: 'Initial draft submitted for ADNOC review.',
      },
      {
        version: 'v2.0',
        uploadedBy: 'Fatima Al Zaabi',
        uploadedAt: '2026-02-20T16:00:00Z',
        changeNote: 'Updated based on ADNOC feedback. Added mobile app requirements section.',
      },
      {
        version: 'v2.1',
        uploadedBy: 'Fatima Al Zaabi',
        uploadedAt: '2026-02-25T10:00:00Z',
        changeNote: 'Minor corrections to data retention requirements. Final approved version.',
      },
    ],
  },
  {
    id: 'doc-002',
    projectId: 'proj-001',
    name: 'Technical Architecture Document — Claims Processing System',
    category: 'Technical Documentation',
    description:
      'Detailed technical architecture including system design diagrams, database schema, API architecture, security model, and deployment topology for AWS.',
    uploadedBy: 'Rahul Sharma',
    uploadedAt: '2026-03-10T11:00:00Z',
    version: 'v1.3',
    approvalStatus: 'Approved',
    size: '8.7 MB',
    versions: [
      {
        version: 'v1.0',
        uploadedBy: 'Rahul Sharma',
        uploadedAt: '2026-02-20T09:00:00Z',
        changeNote: 'Initial architecture draft.',
      },
      {
        version: 'v1.3',
        uploadedBy: 'Rahul Sharma',
        uploadedAt: '2026-03-10T11:00:00Z',
        changeNote: 'Added Arabic localization architecture. Updated security model for ADNOC compliance.',
      },
    ],
  },
  {
    id: 'doc-003',
    projectId: 'proj-002',
    name: 'DOH Compliance Portal — Statement of Work',
    category: 'Statement of Work',
    description:
      'Signed Statement of Work between RPM UAE and Department of Health Abu Dhabi, defining scope, deliverables, timelines, payment schedule, and acceptance criteria.',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2025-09-20T14:00:00Z',
    version: 'v1.0',
    approvalStatus: 'Approved',
    size: '2.1 MB',
    versions: [
      {
        version: 'v1.0',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2025-09-20T14:00:00Z',
        changeNote: 'Signed SOW uploaded. Effective date 2025-10-01.',
      },
    ],
  },
  {
    id: 'doc-004',
    projectId: 'proj-002',
    name: 'UAT Test Plan — DOH Compliance Portal v2.0',
    category: 'UAT Documents',
    description:
      'Comprehensive UAT test plan including test scenarios, test data requirements, entry/exit criteria, defect severity definitions, and DOH sign-off process.',
    uploadedBy: 'Fatima Al Zaabi',
    uploadedAt: '2026-09-20T10:00:00Z',
    version: 'v2.0',
    approvalStatus: 'Approved',
    size: '3.4 MB',
    versions: [
      {
        version: 'v1.0',
        uploadedBy: 'Fatima Al Zaabi',
        uploadedAt: '2026-05-01T09:00:00Z',
        changeNote: 'Initial UAT plan based on original go-live schedule.',
      },
      {
        version: 'v2.0',
        uploadedBy: 'Fatima Al Zaabi',
        uploadedAt: '2026-09-20T10:00:00Z',
        changeNote: 'Revised test plan following project timeline extension and scope additions.',
      },
    ],
  },
  {
    id: 'doc-005',
    projectId: 'proj-003',
    name: 'Fleet Telematics Integration — Project Proposal',
    category: 'Project Proposal',
    description:
      'Internal project proposal for the Fleet Telematics Integration initiative, including business case, ROI analysis, vendor options, and resource plan.',
    uploadedBy: 'Mohammed Al Hashimi',
    uploadedAt: '2026-02-15T09:00:00Z',
    version: 'v1.1',
    approvalStatus: 'Approved',
    size: '1.8 MB',
    versions: [
      {
        version: 'v1.0',
        uploadedBy: 'Mohammed Al Hashimi',
        uploadedAt: '2026-02-10T14:00:00Z',
        changeNote: 'Initial proposal draft for management review.',
      },
      {
        version: 'v1.1',
        uploadedBy: 'Mohammed Al Hashimi',
        uploadedAt: '2026-02-15T09:00:00Z',
        changeNote: 'Updated ROI figures. Added Orbcomm to vendor shortlist.',
      },
    ],
  },
];

// ─── Test Records ─────────────────────────────────────────────

const testRecords: PMTestRecord[] = [
  {
    id: 'tr-001',
    projectId: 'proj-001',
    type: 'Test Case',
    title: 'TC-CLAIMS-042: Submit Medical Claim with Supporting Documents',
    status: 'Passed',
    severity: 'High',
    assignedTo: 'Fatima Al Zaabi',
    submittedAt: '2026-07-10T10:00:00Z',
    resolvedAt: '2026-07-10T14:00:00Z',
    clientFeedback: 'Claim submission workflow is intuitive and fast. Approved.',
  },
  {
    id: 'tr-002',
    projectId: 'proj-001',
    type: 'Test Case',
    title: 'TC-PROVIDER-015: Real-Time Eligibility Check — Network Provider',
    status: 'Failed',
    severity: 'High',
    assignedTo: 'Fatima Al Zaabi',
    submittedAt: '2026-07-15T09:00:00Z',
    clientFeedback:
      'Eligibility check returning incorrect benefit tier for 2 employee categories. Needs rework before UAT.',
  },
  {
    id: 'tr-003',
    projectId: 'proj-002',
    type: 'Defect',
    title: 'DEF-DOH-007: Compliance Report PDF Export — Arabic Text Garbled',
    status: 'In Progress',
    severity: 'Critical',
    assignedTo: 'Nadia Al Khalidi',
    submittedAt: '2026-10-05T11:00:00Z',
    clientFeedback:
      'All Arabic text in exported PDFs appears as question marks or boxes. Completely unusable for DOH submissions.',
  },
  {
    id: 'tr-004',
    projectId: 'proj-002',
    type: 'UAT',
    title: 'UAT-DOH-ROUND2: Full Portal UAT — Round 2',
    status: 'In Progress',
    assignedTo: 'Sarah Johnson',
    submittedAt: '2026-10-20T09:00:00Z',
    clientFeedback:
      'Round 2 UAT in progress. P1 defects resolved. P2 items being tested. Overall portal quality improved significantly.',
  },
];

// ─── Deployments ─────────────────────────────────────────────

const deployments: PMDeployment[] = [
  {
    id: 'dep-001',
    projectId: 'proj-002',
    releaseVersion: 'v1.4.2',
    environment: 'Staging',
    plannedDate: '2026-10-10',
    actualDate: '2026-10-10',
    status: 'Successful',
    owner: 'James Okafor',
    checklist: [
      { item: 'Database migration scripts reviewed and approved', completed: true },
      { item: 'Environment variables configured in staging secrets manager', completed: true },
      { item: 'Blue/green deployment configured — traffic split at 0% new', completed: true },
      { item: 'Smoke test suite executed — all 47 tests passed', completed: true },
      { item: 'Application logs and monitoring dashboards verified', completed: true },
      { item: 'Rollback procedure tested and documented', completed: true },
    ],
    rollbackPlan:
      'Revert to v1.4.1 container image. Run rollback DB migration script (migration_rollback_v142.sql). Redirect traffic to previous ECS task set. Estimated rollback time: 8 minutes.',
    validationResults:
      'All 47 smoke tests passed. API response times within SLA (avg 180ms). No errors in CloudWatch for 2 hours post-deploy. DOH API integration confirmed active.',
    notes:
      'Deployment completed successfully in 23 minutes. Zero downtime achieved via blue/green strategy. Notify DOH UAT team to begin round 2 testing.',
  },
  {
    id: 'dep-002',
    projectId: 'proj-002',
    releaseVersion: 'v2.0.0',
    environment: 'Production',
    plannedDate: '2026-12-15',
    status: 'Planned',
    owner: 'James Okafor',
    checklist: [
      { item: 'TRA security certification received and filed', completed: false },
      { item: 'DOH formal go-live approval obtained', completed: false },
      { item: 'Production database hardening and backup verified', completed: false },
      { item: 'DDoS protection and WAF rules configured for production', completed: false },
      { item: 'All P1 and P2 defects resolved and regression tested', completed: false },
      { item: 'Operations handover and runbook completed and signed off', completed: false },
    ],
    rollbackPlan:
      'Maintain v1.4.2 on staging for 30 days post go-live as rollback target. Production rollback: redirect DNS, restore database snapshot from pre-migration backup. Estimated RTO: 30 minutes.',
    validationResults: 'Pending — production deployment not yet executed.',
    notes:
      'Go-live date of 2026-12-15 is conditional on TRA certification and DOH sign-off. Daily status updates required from Nov 15 onwards.',
  },
];

// ─── Closures ─────────────────────────────────────────────────

const closures: PMClosure[] = [
  {
    id: 'clos-001',
    projectId: 'proj-002',
    actualStartDate: '2025-10-01',
    actualEndDate: '2026-12-15',
    finalCost: 1095000,
    budgetVariance: -105000,
    deliverablesSummary:
      'DOH Compliance Portal v2.0 delivered including: compliance reporting engine (95% automation achieved), DOH API integration, bilingual (Arabic/English) UI, audit trail module, provider notification system, and operations runbook. 3 minor post-go-live enhancement requests documented for phase 2.',
    clientAcceptance: 'Pending',
    lessonsLearned:
      'Key lessons: (1) Government client API access must be formally contracted with SLAs — staging access delay cost 3 weeks. (2) Arabic RTL requirements must be in BRD — discovered late added cost and time. (3) TDRA certification timeline must be built into project plan from day 1 — 6–8 week certification window not anticipated. (4) Load testing environment must mirror production more closely — initial under-provisioning caused re-testing.',
    pmRemarks:
      'Despite timeline overruns due to scope additions (Arabic localization, notification system) and external dependencies (TDRA certification, DOH staging access), the project delivered strong client value. DOH expressed high satisfaction with the compliance automation achieved. Recommend early engagement of TDRA for all future government projects.',
    closureApproval: 'Pending',
    checklist: [
      { item: 'All project deliverables formally accepted by client', completed: false },
      { item: 'Final invoice raised and approved by Finance', completed: false },
      { item: 'Source code and documentation handed over to DOH IT', completed: false },
      { item: 'Production environment monitoring transferred to operations team', completed: false },
      { item: 'Lessons learned document published to PM knowledge base', completed: false },
      { item: 'Team performance reviews completed by PM', completed: false },
    ],
  },
];

// ─── Activity Logs ────────────────────────────────────────────

const activityLogs: PMActivityLog[] = [
  {
    id: 'act-001',
    projectId: 'proj-001',
    action: 'Status Changed',
    entity: 'Project',
    entityId: 'proj-001',
    previousValue: 'Approved',
    newValue: 'Active',
    performedBy: 'Ahmed Al Rashidi',
    performedAt: '2026-01-15T08:00:00Z',
    remarks: 'Project kicked off. Team onboarding complete.',
  },
  {
    id: 'act-002',
    projectId: 'proj-001',
    action: 'Task Created',
    entity: 'Task',
    entityId: 'task-001',
    newValue: 'TSK-001: Develop Claims Submission API',
    performedBy: 'Ahmed Al Rashidi',
    performedAt: '2026-04-28T09:00:00Z',
    remarks: 'Task created and assigned to Ali Hassan.',
  },
  {
    id: 'act-003',
    projectId: 'proj-001',
    action: 'Risk Identified',
    entity: 'Risk',
    entityId: 'risk-001',
    newValue: 'Non-Standard Provider API Protocols — Severity: High',
    performedBy: 'Priya Nair',
    performedAt: '2026-06-20T11:00:00Z',
    remarks: 'Risk logged following discovery of non-standard APIs during provider integration work.',
  },
  {
    id: 'act-004',
    projectId: 'proj-001',
    action: 'Change Request Approved',
    entity: 'Change Request',
    entityId: 'cr-001',
    previousValue: 'Submitted',
    newValue: 'Approved',
    performedBy: 'Mohammed Al Hashimi',
    performedAt: '2026-11-01T14:00:00Z',
    remarks: 'CRQ-2026-001 Arabic localization approved. Budget impact AED 85,000.',
  },
  {
    id: 'act-005',
    projectId: 'proj-002',
    action: 'Status Changed',
    entity: 'Project',
    entityId: 'proj-002',
    previousValue: 'Active',
    newValue: 'UAT',
    performedBy: 'Sarah Johnson',
    performedAt: '2026-09-15T10:00:00Z',
    remarks: 'Development phase complete. Entering UAT phase.',
  },
  {
    id: 'act-006',
    projectId: 'proj-002',
    action: 'Deployment Completed',
    entity: 'Deployment',
    entityId: 'dep-001',
    newValue: 'v1.4.2 deployed to Staging — Successful',
    performedBy: 'James Okafor',
    performedAt: '2026-10-10T15:30:00Z',
    remarks: 'Staging deployment v1.4.2 completed. All smoke tests passed.',
  },
  {
    id: 'act-007',
    projectId: 'proj-002',
    action: 'Risk Escalated',
    entity: 'Risk',
    entityId: 'risk-003',
    previousValue: 'Open',
    newValue: 'Escalated',
    performedBy: 'Sarah Johnson',
    performedAt: '2026-10-01T10:00:00Z',
    remarks: 'TRA certification risk escalated to management. Go-live at risk.',
  },
  {
    id: 'act-008',
    projectId: 'proj-002',
    action: 'Task Status Changed',
    entity: 'Task',
    entityId: 'task-006',
    previousValue: 'In Progress',
    newValue: 'Rework Required',
    performedBy: 'Sarah Johnson',
    performedAt: '2026-10-25T17:00:00Z',
    remarks: 'Load test failed at 1,400 concurrent users. DB connection pooling rework required.',
  },
  {
    id: 'act-009',
    projectId: 'proj-003',
    action: 'Project Created',
    entity: 'Project',
    entityId: 'proj-003',
    newValue: 'PRJ-2026-003: Fleet Telematics Integration',
    performedBy: 'Mohammed Al Hashimi',
    performedAt: '2026-02-10T09:00:00Z',
    remarks: 'Internal project proposal created and submitted for budget approval.',
  },
  {
    id: 'act-010',
    projectId: 'proj-001',
    action: 'Progress Updated',
    entity: 'Project',
    entityId: 'proj-001',
    previousValue: '58%',
    newValue: '65%',
    performedBy: 'Ahmed Al Rashidi',
    performedAt: '2026-11-15T14:30:00Z',
    remarks: 'Monthly progress update. Claims API 90% done. Provider integration at 55%.',
  },
];

// ─── Notifications ────────────────────────────────────────────

const notifications: PMNotification[] = [
  {
    id: 'notif-001',
    projectId: 'proj-002',
    type: 'Risk Alert',
    message:
      'CRITICAL RISK: TRA security certification for DOH Compliance Portal is still pending. Go-live target of Dec 15 is at risk. Immediate escalation required.',
    isRead: false,
    createdAt: '2026-11-18T09:00:00Z',
    targetRole: ['Project Manager', 'PM Admin', 'Management'],
  },
  {
    id: 'notif-002',
    projectId: 'proj-001',
    type: 'Approval Required',
    message:
      'Approval pending: Scope change request for ADNOC Medical Coverage System (CRQ-2026-001 Arabic localization) requires your review.',
    isRead: false,
    createdAt: '2026-11-10T10:00:00Z',
    targetRole: ['PM Admin', 'Management'],
  },
  {
    id: 'notif-003',
    projectId: 'proj-002',
    type: 'Deadline Approaching',
    message:
      'Milestone "DOH UAT Completion & Sign-Off" is due on 2026-11-30 — 9 days remaining. Current progress: 60%. Expedite UAT testing.',
    isRead: false,
    createdAt: '2026-11-21T08:00:00Z',
    targetRole: ['Project Manager', 'QA Engineer'],
  },
  {
    id: 'notif-004',
    projectId: 'proj-001',
    type: 'Task Overdue',
    message:
      'Task TSK-002 "Provider Network Integration Module" is approaching its deadline (2026-07-31). Current progress at 44%. Review resource allocation.',
    isRead: false,
    createdAt: '2026-11-19T08:30:00Z',
    targetRole: ['Project Manager', 'Technical Lead'],
  },
  {
    id: 'notif-005',
    projectId: 'proj-002',
    type: 'Deployment Reminder',
    message:
      'Production deployment v2.0.0 for DOH Compliance Portal is planned for 2026-12-15. 6 checklist items pending. Begin pre-deployment preparations.',
    isRead: false,
    createdAt: '2026-11-15T09:00:00Z',
    targetRole: ['DevOps Engineer', 'Project Manager'],
  },
  {
    id: 'notif-006',
    projectId: 'proj-003',
    type: 'Clarification Required',
    message:
      'Approval APR-003 for Fleet Telematics vendor selection requires clarification. Provide Teltonika vs Orbcomm SLA comparison to proceed.',
    isRead: false,
    createdAt: '2026-11-15T11:30:00Z',
    targetRole: ['Project Manager', 'PM Admin'],
  },
];

// ─── Assembled State ──────────────────────────────────────────

export const PM_INITIAL_STATE: PMState = {
  projects,
  approvals,
  phases,
  tasks,
  teamMembers,
  milestones,
  budgets,
  risks,
  issues,
  changeRequests,
  communications,
  documents,
  testRecords,
  deployments,
  closures,
  activityLogs,
  notifications,
};
