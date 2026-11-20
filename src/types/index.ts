export type Emirate = 'Abu Dhabi' | 'Dubai' | 'Sharjah' | 'Northern Emirates';

export type UAEProjectCategory = 'ADNOC' | 'Government' | 'Semi-Government' | 'Private' | 'Event';

export type ContractType = 'ADNOC' | 'Government' | 'Semi-Government' | 'Private' | 'Event';

export type UserRole =
  | 'Corporate Admin'
  | 'Management'
  | 'Business Development (BD)'
  | 'Operations Team'
  | 'Operations Manager (OM)'
  | 'Regional Manager'
  | 'Project Lead (PL)'
  | 'Fleet Supervisor'
  | 'HR / Admin'
  | 'Dy Nurse / Nursing Supervisor'
  | 'Site Staff (Field User)'
  | 'QA Administrator';

export type ProjectLifecycleStatus =
  | 'Awaiting Management Review'
  | 'Management Reviewing'
  | 'Awaiting BD Response'
  | 'Pending Document Submission'
  | 'Account Opened'
  | 'Allocation in Progress'
  | 'Awaiting Client Document Submission'
  | 'Pending Client Confirmation'
  | 'Scheduling in Progress'
  | 'Active'
  | 'Demobilization Requested by Client/HSE'
  | 'Awaiting PL Validation'
  | 'Demobilization Complete'
  | 'Inactive'
  | 'Closed';

export type ManpowerSourceType = 'RPM Own Employee' | 'Manpower Company Staff';

export type ClinicalRole =
  | 'Driver'
  | 'Nurse'
  | 'Paramedic'
  | 'Doctor (GP/ER)'
  | 'EMT'
  | 'Lab Tech'
  | 'X-ray Tech'
  | 'Physiotherapist';

export type HealthAuthority = 'DOH' | 'DHA' | 'MOHAP';

export type AvailabilityStatus =
  | 'Eligible & Available'
  | 'Eligible but Unavailable'
  | 'Not Eligible'
  | 'Partially Available'
  | 'On Leave'
  | 'Field Break'
  | 'Notice Period'
  | 'Bench';

export type RAGStatus = 'Green' | 'Amber' | 'Yellow' | 'Red';

export type WarningLevel =
  | 'Verbal Warning'
  | 'Verbal & Written Warning'
  | 'Written Warning'
  | 'Mercy Warning';

export interface StaffPerformanceRecord {
  id: string;
  manpowerId: string;
  incidentType: 'Accident' | 'Warning Sign Violation' | 'Warning Letter' | 'Incident Report';
  warningLevel?: WarningLevel;
  validityEndDate?: string;
  incidentDate: string;
  description: string;
  blackPoints?: number;
  documentPath?: string;
  recordedBy: string;
  createdAt: string;
}

export interface CrewChangeLog {
  id: string;
  manpowerId: string;
  manpowerName: string;
  role: ClinicalRole;
  fromProjectId: string;
  fromProjectName: string;
  toProjectId: string;
  toProjectName: string;
  changeType: 'Rotation-Based' | 'Swap / Ad-Hoc';
  changeDate: string;
  rotationEndDate?: string;
  reason: string;
  initiatedBy: string;
  replacementStaffId?: string;
  replacementStaffName?: string;
  hoursSplitImpact?: string;
  createdAt: string;
}

export interface Manpower {
  id: string;
  rpmId: string;
  name: string;
  role: ClinicalRole;
  sourceType: ManpowerSourceType;
  companyName?: string;
  emirate: Emirate;
  availabilityStatus: AvailabilityStatus;
  adnocEligible: boolean;
  isNoticePeriod?: boolean;
  noticePeriodEndDate?: string;
  currentProjectId?: string;
  currentProjectName?: string;
  allowanceAED?: number;
  
  // UAE Compliance Documents
  emiratesIdNo: string;
  emiratesIdExpiry: string;
  emiratesIdDocPath?: string;
  uaeVisaNo: string;
  uaeVisaExpiry: string;
  uaeVisaDocPath?: string;
  passportNo: string;
  passportExpiry: string;
  healthInsuranceNo: string;
  healthInsuranceExpiry: string;
  
  // Health Authority License (Clinical Roles)
  healthAuthorityType?: HealthAuthority;
  healthAuthorityLicenseNo?: string;
  healthAuthorityLicenseExpiry?: string;
  licenseScopeOfPractice?: string; // e.g. FAP, GP CLINIC, SCHOOL CLINIC
  healthAuthorityDocPath?: string;
  
  // Certifications
  blsProvider?: string;
  blsExpiry?: string;
  aclsProvider?: string;
  aclsExpiry?: string;
  phtlsProvider?: string;
  phtlsExpiry?: string;
  malpracticeInsuranceExpiry?: string;
  
  // Driver specific
  uaeDrivingLicenseNo?: string;
  uaeDrivingLicenseExpiry?: string;
  defensiveDrivingCertExpiry?: string; // UAE Defensive Driving replaces EVOS
  driverQualification?: 'SSLC' | 'Higher Secondary' | 'Degree' | 'NOT PASS SSLC';
  
  // ADOSH / Site Inductions
  adoshSafetyCertExpiry?: string;
  adnocHseInductionExpiry?: string;
  siteTrainingCertExpiry?: string;
  
  // Performance Profile (Section 8.13)
  ragStatus: RAGStatus;
  accidentCount: number;
  warningSignViolations: number;
  warningLettersCount: number;
  totalBlackPoints: number;
  performanceNotes?: string;
  warningHistory: StaffPerformanceRecord[];
  
  // Crew Change Frequency (Section 8.14)
  totalCrewChangesLast12Months: number;
  lastRotationDate?: string;
  nextRotationDueDate?: string;
  crewChangeHistory: CrewChangeLog[];
}

export type VehicleType = 'ALS' | 'BLS' | 'PTV' | 'Mobile ICU';
export type DriveType = '4x2' | '4x4';
export type VehicleOperationalStatus =
  | 'Active / Available'
  | 'Allocated'
  | 'Under Maintenance'
  | 'Due for Maintenance'
  | 'Pending Approval'
  | 'Non-Compliant';

export interface BioMedicalCalibrationItem {
  id: string;
  equipmentName: string;
  serialNumber: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  certificateDocPath: string;
  status: 'Compliant' | 'Expiring Soon' | 'Expired';
}

export interface VehicleMaintenanceReport {
  id: string;
  vehicleId: string;
  plateNo: string;
  reportDate: string;
  uploadedBy: string;
  serviceProvider: string;
  workDescription: string;
  costAED: number;
  pdfDocPath: string;
}

export interface Vehicle {
  id: string;
  code: string;
  plateNo: string;
  type: VehicleType;
  driveType: DriveType;
  make: string;
  model: string;
  year: number;
  ownershipType: 'RPM-owned' | 'Rental';
  rentalCompanyName?: string;
  emirate: Emirate;
  operationalStatus: VehicleOperationalStatus;
  adnocEligible: boolean;
  currentProjectId?: string;
  currentProjectName?: string;

  // UAE Documents
  mulkiyaDocPath: string;
  mulkiyaExpiry: string;
  insurancePolicyNo: string;
  insuranceExpiry: string;
  annualFitnessCertExpiry: string; // DMT / Abu Dhabi Police
  dohClassificationCertExpiry: string; // ALS / BLS / Biomedical
  dohClassificationType: 'ALS' | 'BLS' | 'Biomedical';
  ropDocumentNo: string;
  ropExpiry: string; // Police route permit
  dohFacilityLicenseNo: string;
  dohFacilityLicenseExpiry: string;

  // Bio-Medical Calibration Items
  bioMedicalItems: BioMedicalCalibrationItem[];
  
  // Maintenance Reports Repository (Section 7.7.1)
  maintenanceReports: VehicleMaintenanceReport[];
  
  // Inspection Checklist
  dohEquipmentChecklistPassed: boolean;
  ambulanceCoordinatorSigned: boolean;
  lastInspectionDate: string;
}

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  type: 'Project' | 'Event';
  category: UAEProjectCategory;
  contractType: ContractType;
  operatingEmirate: Emirate;
  regionLocation: string;
  clientName: string;
  clientContactEmail: string;
  clientContactPerson: string;
  bdName: string;
  bdId: string;
  bdPosition: string;
  
  adoshPermitRequired: boolean;
  adoshPermitRef?: string;
  
  dutyScheduleType: 'Rotation-Based' | 'Normal Duty';
  rotationCycleDays?: number;
  
  startDate: string;
  demobilizationDateTentative: string;
  actualDemobilizationDate?: string;
  status: ProjectLifecycleStatus;
  
  // Documents
  poStatus: 'PO Uploaded' | 'Alternate Document Uploaded' | 'PO Pending';
  poDocPath?: string;
  boqReference: string; // Mandatory UAE
  boqDocPath: string;    // Mandatory UAE
  deliverablesListDocPath: string; // Mandatory UAE
  remarks?: string;

  // Stage 3A UAE Document Compilation
  stage3ACompiled: boolean;
  stage3ADispatchDate?: string;
  stage3ADispatchStatus?: 'Draft' | 'Submitted to Client' | 'Client Viewed';
  clientDocAccessSetting: 'View Only' | 'Download Enabled';
  authorizedClientEmails: string[];
  docPackWatermarkApplied: boolean;
  docPackUrlToken?: string;
  
  // Stage 3B Client Acceptance Gate
  clientConfirmationDate?: string;
  clientConfirmationAttachment?: string;
  clientConfirmationStatus: 'Pending' | 'Confirmed' | 'Rejected';
  
  // Stage 5 Mobilization
  mobilizationConfirmedDate?: string;
  mobilizationConfirmedBy?: string;
  mobilizationSummaryPdfUrl?: string;
  
  // Stage 7 Demobilization (UAE)
  demobRequestReceivedDate?: string;
  demobRequestAttachment?: string; // Client/HSE email
  demobInternalInitiatedDate?: string;
  nurseDemobFormSubmitted: boolean;
  nurseDemobFormAttachment?: string;
  nurseDemobChecklistValidatedBy?: string;
  clientSatisfactionSurveySent: boolean;
  clientSatisfactionRating?: number; // 1-5
  clientSatisfactionFeedback?: string;

  // Allocations
  assignedPL?: string;
  allocatedVehicles: string[]; // vehicle IDs
  allocatedManpower: string[]; // manpower IDs
  clinicId?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Clinic {
  id: string;
  clinicId: string;
  name: string;
  type: 'Type A Clinic' | 'Type B Clinic' | 'Type C Clinic (First Aid Clinic)';
  emirate: Emirate;
  associatedProjectId?: string;
  associatedProjectName?: string;
  isLicensed: boolean;
  qaLicensingStage?: 'Initiated' | 'DOH Inspection Scheduled' | 'Audit Passed' | 'License Issued';
  adoshPermitRef?: string;
  eventRiskCategory?: 'Low Risk' | 'Medium Risk' | 'High Risk';
  status: 'Pending Mobilization' | 'Operational' | 'Closed (Mobilized)';
  mobilizationDate?: string;
  supervisorName: string;
  supervisorContact: string;
  ambulanceCoordinatorSignoff: boolean;
  clientDocGateCleared: boolean;
}

export interface ApprovalRequest {
  id: string;
  requestId: string;
  moduleType: 'Project Initiation' | 'Event Mobilization' | 'Resource Allocation' | 'Manpower Swap' | 'Demobilization' | 'Ambulance Request' | 'MRF Request';
  projectId?: string;
  projectName: string;
  requestedBy: string;
  submittedAt: string;
  lockTimerRemainingSeconds: number; // 24-hr countdown (86400s)
  isEscalated: boolean;
  status: 'Pending' | 'Approved' | 'Conditional' | 'Clarification' | 'Declined';
  conditionNote?: string;
  conditionDeadlineDays?: number;
  clarificationComment?: string;
  escalationLevel: number;
}

export interface OperationalTask {
  id: string;
  taskTitle: string;
  description: string;
  assignedTo: string;
  assignedToRole: string;
  linkedProjectId?: string;
  linkedProjectName?: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  attachmentsCount: number;
  createdBy: string;
  createdAt: string;
}

export type TicketingStream =
  | 'Stream 1: Payment Request'
  | 'Stream 2: Service Request'
  | 'Stream 3: Purchase Request'
  | 'Stream 4: Travel Request'
  | 'Stream 5: Ambulance Request'
  | 'Stream 6: Clinic Licensing Request'
  | 'Stream 7: Manpower Request (MRF)';

export interface Ticket {
  id: string;
  ticketNo: string;
  stream: TicketingStream;
  projectId?: string;
  projectName?: string;
  raisedBy: string;
  raisedByRole: string;
  raisedByProjectScopedLogin?: boolean;
  assignedDepartment: 'Finance' | 'IT' | 'Biomedical' | 'Facility' | 'Procurement' | 'Travel' | 'Fleet' | 'QA' | 'HR/Admin';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  currentStatus: 'Submitted' | 'In Review' | 'In Progress' | 'Resolved' | 'Closed';
  
  // Dual hierarchy routing & SLA escalation
  tlReviewed: boolean;
  plApproved: boolean;
  slaHoursTarget: number;
  slaHoursElapsed: number;
  isSlaBreached: boolean;
  escalationStage: 'TL Review' | 'PL Action' | 'OM/GM Escalated' | 'Higher Management Escalated' | 'Resolved';
  plSuperActionLogs?: string[];

  // Specific stream metadata
  streamData?: {
    // Stream 1: Payment
    paymentType?: 'Visa & Gov Fees' | 'HR Payment' | 'Mobile Bills' | 'Rent & Utilities' | 'Licence Renewal' | 'Other';
    amountAED?: number;
    paymentRef?: string;
    
    // Stream 2: Service
    serviceCategory?: 'IT Hardware/Software' | 'Biomedical Calibration' | 'Facility Repair';
    
    // Stream 3: Purchase
    purchaseCategory?: 'Medical Consumables' | 'Medications' | 'Fleet Spares' | 'Office Stationeries';
    itemsList?: { name: string; qty: number; unitPriceAED: number; isCustomItem?: boolean }[];
    approvalChainStatus?: string;
    
    // Stream 4: Travel
    travelType?: 'Flight Only' | 'Car Rental Only' | 'Flight & Car Rental';
    destination?: string;
    travelDates?: string;
    flightClass?: 'Economy' | 'Business';
    carType?: 'Sedan' | 'SUV 4x4' | 'Van';
    bookingAttachment?: string;
    
    // Stream 5: Ambulance Request
    onboardingStage?: 'Request Raised' | 'Vendor Sourcing' | 'Document Collection' | 'Fleet Supervisor Sign-off' | 'Active';
    vehicleTypeRequested?: VehicleType;
    driveTypeRequested?: DriveType;
    
    // Stream 6: Clinic Licensing
    licensingStage?: 'Initiation' | 'Civil Defence Clearance' | 'DOH Inspection' | 'Audited' | 'Final License Issued';
    
    // Stream 7: MRF Request
    mrfStage?: 'Request Raised' | 'Sourcing (RPM/Vendor)' | 'Document Collection' | 'HR Activation' | 'Allocated';
    rolesNeeded?: { role: ClinicalRole; count: number }[];
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface GeneralCompanyDocument {
  id: string;
  name: string;
  category: 'Trade Licence' | 'DOH Ambulance Facility Licence' | 'Civil Defence Certificate' | 'Corporate Insurance' | 'Biomedical Master SLA' | 'IT / Telecom Agreement';
  issuingAuthority: string;
  issueDate: string;
  expiryDate?: string;
  hasNoExpiry: boolean;
  emirate: Emirate;
  businessDivision: string;
  docPath: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  daysToExpiry?: number;
  uploadedBy: string;
  uploadDate: string;
}

export interface DutyScheduleSlot {
  id: string;
  projectId: string;
  resourceId: string;
  resourceName: string;
  role: ClinicalRole;
  date: string;
  shiftType: 'Fixed (8h)' | 'Flexible (10h)' | 'Split' | '12h Day' | '12h Night' | '24h Duty';
  dutyPattern: '8 Hours – 6 Days/Week' | '8 Hours – 5 Days/Week' | '10 Hours' | '12 Hours – 7 Days/Week' | '24/7 Duty';
  startHour: string;
  endHour: string;
  hoursWorked: number;
  allowanceAED: number;
  overrideNote?: string;
  isOverridden?: boolean;
}

