import React, { useState, useRef } from 'react';
import {
  CheckCircle,
  ChevronRight,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  BookOpen,
  X,
  Save,
  Send,
  User,
  Building2,
  DollarSign,
  MapPin,
  Briefcase,
  Tag,
  Hash,
  ClipboardList,
} from 'lucide-react';
import { PMProject, PMProjectStatus, PMProjectType, PMProjectCategory, PMProjectPriority } from '../pm.types';

interface PMCreateProjectViewProps {
  onSave: (project: Partial<PMProject>) => void;
  onCancel: () => void;
  existingProject?: PMProject;
}

type Step = 1 | 2 | 3 | 4;

interface FormErrors {
  name?: string;
  startDate?: string;
  expectedEndDate?: string;
  estimatedBudget?: string;
}

const PROJECT_MANAGERS = [
  'Ahmed Al Rashidi',
  'Sarah Johnson',
  'Mohammed Al Hashimi',
  'Fatima Al Zaabi',
  'John Williams',
];

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const STEP_INFO = [
  { step: 1 as Step, label: 'Identity', icon: FileText },
  { step: 2 as Step, label: 'Team', icon: Users },
  { step: 3 as Step, label: 'Schedule', icon: Calendar },
  { step: 4 as Step, label: 'Scope', icon: BookOpen },
];

const generateProjectCode = () =>
  `PRJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

const CharCount: React.FC<{ value: string; max?: number }> = ({ value, max = 2000 }) => (
  <span className={`text-xs ${value.length > max ? 'text-red-500' : 'text-slate-400'}`}>
    {value.length}/{max}
  </span>
);

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle?: string }> = ({
  icon: Icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
    <div className="p-2 rounded-lg bg-blue-50">
      <Icon className="w-5 h-5 text-[#064E86]" />
    </div>
    <div>
      <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

const FieldLabel: React.FC<{ label: string; required?: boolean; htmlFor?: string }> = ({
  label,
  required,
  htmlFor,
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const inputClass = (hasError?: boolean) =>
  `w-full px-3 py-2 rounded-lg border text-sm text-slate-800 placeholder-slate-400 
   focus:outline-none focus:ring-2 focus:ring-[#064E86]/30 focus:border-[#064E86] transition-colors
   ${hasError ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'}`;

const PMCreateProjectView: React.FC<PMCreateProjectViewProps> = ({
  onSave,
  onCancel,
  existingProject,
}) => {
  const isEdit = !!existingProject;
  const [projectCode] = useState(existingProject?.code ?? generateProjectCode());
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PMProjectStatus>('Draft');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // ── Section 1: Identity ────────────────────────────────────
  const [name, setName] = useState(existingProject?.name ?? '');
  const [type, setType] = useState(existingProject?.type ?? 'Software Development');
  const [category, setCategory] = useState(existingProject?.category ?? 'Internal');
  const [department, setDepartment] = useState(existingProject?.department ?? '');
  const [priority, setPriority] = useState(existingProject?.priority ?? 'Medium');
  const [description, setDescription] = useState(existingProject?.description ?? '');

  // ── Section 2: Client & Team ───────────────────────────────
  const [client, setClient] = useState(existingProject?.client ?? '');
  const [clientContact, setClientContact] = useState(existingProject?.clientContact ?? '');
  const [projectManager, setProjectManager] = useState(existingProject?.projectManager ?? '');
  const [projectCoordinator, setProjectCoordinator] = useState(existingProject?.projectCoordinator ?? '');

  // ── Section 3: Schedule & Budget ──────────────────────────
  const [startDate, setStartDate] = useState(existingProject?.startDate ?? '');
  const [expectedEndDate, setExpectedEndDate] = useState(existingProject?.expectedEndDate ?? '');
  const [estimatedBudget, setEstimatedBudget] = useState(
    existingProject?.estimatedBudget?.toString() ?? ''
  );
  const [currency, setCurrency] = useState(existingProject?.currency ?? 'AED');
  const [location, setLocation] = useState(existingProject?.location ?? '');

  // ── Section 4: Scope & Requirements ───────────────────────
  const [businessRequirements, setBusinessRequirements] = useState(existingProject?.businessRequirements ?? '');
  const [scopeOfWork, setScopeOfWork] = useState(existingProject?.scopeOfWork ?? '');
  const [deliverables, setDeliverables] = useState(existingProject?.deliverables ?? '');
  const [assumptions, setAssumptions] = useState(existingProject?.assumptions ?? '');
  const [dependencies, setDependencies] = useState(existingProject?.dependencies ?? '');

  // ── Refs for section scroll ───────────────────────────────
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Project name is required.';
    if (startDate && expectedEndDate && expectedEndDate <= startDate)
      e.expectedEndDate = 'End date must be after start date.';
    if (estimatedBudget && Number(estimatedBudget) <= 0)
      e.estimatedBudget = 'Budget must be a positive number.';
    return e;
  };

  const scrollToStep = (step: Step) => {
    setCurrentStep(step);
    sectionRefs[step - 1]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buildProjectPayload = (status: PMProjectStatus): Partial<PMProject> => ({
    ...(existingProject ?? {}),
    code: projectCode,
    name: name.trim(),
    type: type as PMProject['type'],
    category: category as PMProject['category'],
    department,
    priority: priority as PMProject['priority'],
    description,
    client,
    clientContact,
    projectManager,
    projectCoordinator,
    startDate,
    expectedEndDate,
    estimatedBudget: Number(estimatedBudget) || 0,
    currency,
    location,
    businessRequirements,
    scopeOfWork,
    deliverables,
    assumptions,
    dependencies,
    status,
    health: 'Not Started',
    progressPercent: 0,
    actualCost: 0,
    createdAt: existingProject?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: existingProject?.createdBy ?? 'Current User',
    statusHistory: existingProject?.statusHistory ?? [],
  });

  const handleSave = (status: PMProjectStatus) => {
    setSubmitted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Scroll to first error section
      if (e.name) scrollToStep(1);
      else if (e.startDate || e.expectedEndDate || e.estimatedBudget) scrollToStep(3);
      return;
    }
    if (status === 'Submitted') {
      setPendingStatus('Submitted');
      setShowConfirm(true);
    } else {
      onSave(buildProjectPayload(status));
    }
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    onSave(buildProjectPayload(pendingStatus));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#064E86]">
              {isEdit ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? `Editing ${existingProject.code}` : 'Fill in the details below to register a new project'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Stepper ─────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 sticky top-[73px] z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STEP_INFO.map(({ step, label, icon: Icon }, idx) => {
              const isActive = currentStep === step;
              const isDone = currentStep > step;
              return (
                <React.Fragment key={step}>
                  <button
                    onClick={() => scrollToStep(step)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${isActive
                        ? 'bg-[#064E86] text-white shadow-sm'
                        : isDone
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span>
                      Step {step}: {label}
                    </span>
                  </button>
                  {idx < STEP_INFO.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Form Body ───────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">

        {/* ─── Section 1: Project Identity ─────────────── */}
        <div ref={sectionRefs[0]} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader icon={FileText} title="Project Identity" subtitle="Basic project information and classification" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Project Name */}
            <div className="md:col-span-2">
              <FieldLabel label="Project Name" required htmlFor="proj-name" />
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter project name"
                  className={`${inputClass(submitted && !!errors.name)} pl-9`}
                />
              </div>
              {submitted && errors.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Project Code */}
            <div>
              <FieldLabel label="Project Code" htmlFor="proj-code" />
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-code"
                  type="text"
                  value={projectCode}
                  readOnly
                  className="w-full px-3 py-2 pl-9 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">Auto-generated project code</p>
            </div>

            {/* Project Type */}
            <div>
              <FieldLabel label="Project Type" htmlFor="proj-type" />
              <select
                id="proj-type"
                value={type}
                onChange={e => setType(e.target.value as PMProjectType)}
                className={inputClass()}
              >
                {['Software Development', 'Infrastructure', 'Operational', 'Research', 'Compliance', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Project Category */}
            <div>
              <FieldLabel label="Project Category" htmlFor="proj-category" />
              <select
                id="proj-category"
                value={category}
                onChange={e => setCategory(e.target.value as PMProjectCategory)}
                className={inputClass()}
              >
                {['Internal', 'Client', 'Government', 'Joint Venture', 'R&D'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <FieldLabel label="Department" htmlFor="proj-department" />
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-department"
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. IT, Operations"
                  className={`${inputClass()} pl-9`}
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <FieldLabel label="Priority" htmlFor="proj-priority" />
              <select
                id="proj-priority"
                value={priority}
                onChange={e => setPriority(e.target.value as PMProjectPriority)}
                className={inputClass()}
              >
                {['Critical', 'High', 'Medium', 'Low'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {priority && (
                <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[priority]}`}>
                  {priority}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <FieldLabel label="Description" htmlFor="proj-desc" />
                <CharCount value={description} max={1000} />
              </div>
              <textarea
                id="proj-desc"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the project..."
                className={inputClass()}
                maxLength={1000}
              />
            </div>
          </div>
        </div>

        {/* ─── Section 2: Client & Team ─────────────────── */}
        <div ref={sectionRefs[1]} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader icon={Users} title="Client & Team" subtitle="Client information and project team assignment" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Client */}
            <div>
              <FieldLabel label="Client / Customer" htmlFor="proj-client" />
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-client"
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="Client or customer name"
                  className={`${inputClass()} pl-9`}
                />
              </div>
            </div>

            {/* Client Contact */}
            <div>
              <FieldLabel label="Client Contact Person" htmlFor="proj-contact" />
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-contact"
                  type="text"
                  value={clientContact}
                  onChange={e => setClientContact(e.target.value)}
                  placeholder="Primary contact name"
                  className={`${inputClass()} pl-9`}
                />
              </div>
            </div>

            {/* Project Manager */}
            <div>
              <FieldLabel label="Project Manager" htmlFor="proj-pm" />
              <select
                id="proj-pm"
                value={projectManager}
                onChange={e => setProjectManager(e.target.value)}
                className={inputClass()}
              >
                <option value="">— Select Project Manager —</option>
                {PROJECT_MANAGERS.map(pm => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>

            {/* Project Coordinator */}
            <div>
              <FieldLabel label="Project Coordinator" htmlFor="proj-coordinator" />
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-coordinator"
                  type="text"
                  value={projectCoordinator}
                  onChange={e => setProjectCoordinator(e.target.value)}
                  placeholder="Coordinator name"
                  className={`${inputClass()} pl-9`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 3: Schedule & Budget ─────────────── */}
        <div ref={sectionRefs[2]} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader icon={Calendar} title="Schedule & Budget" subtitle="Project timeline and financial planning" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Start Date */}
            <div>
              <FieldLabel label="Start Date" htmlFor="proj-start" />
              <input
                id="proj-start"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className={inputClass(submitted && !!errors.startDate)}
              />
              {submitted && errors.startDate && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.startDate}
                </p>
              )}
            </div>

            {/* Expected End Date */}
            <div>
              <FieldLabel label="Expected Completion Date" htmlFor="proj-end" />
              <input
                id="proj-end"
                type="date"
                value={expectedEndDate}
                min={startDate || undefined}
                onChange={e => setExpectedEndDate(e.target.value)}
                className={inputClass(submitted && !!errors.expectedEndDate)}
              />
              {submitted && errors.expectedEndDate && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.expectedEndDate}
                </p>
              )}
            </div>

            {/* Estimated Budget */}
            <div>
              <FieldLabel label="Estimated Budget" htmlFor="proj-budget" />
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-budget"
                  type="number"
                  min={0}
                  value={estimatedBudget}
                  onChange={e => setEstimatedBudget(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass(submitted && !!errors.estimatedBudget)} pl-9`}
                />
              </div>
              {submitted && errors.estimatedBudget && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.estimatedBudget}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <FieldLabel label="Currency" htmlFor="proj-currency" />
              <select
                id="proj-currency"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className={inputClass()}
              >
                {['AED', 'USD', 'EUR', 'GBP'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Project Location */}
            <div className="md:col-span-2">
              <FieldLabel label="Project Location" htmlFor="proj-location" />
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="proj-location"
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Abu Dhabi, Dubai, Remote"
                  className={`${inputClass()} pl-9`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 4: Scope & Requirements ──────────── */}
        <div ref={sectionRefs[3]} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader icon={BookOpen} title="Scope & Requirements" subtitle="Define the project scope, requirements and expectations" />
          <div className="space-y-5">

            {/* Business Requirements */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel label="Business Requirements" htmlFor="proj-biz-req" />
                <CharCount value={businessRequirements} />
              </div>
              <textarea
                id="proj-biz-req"
                rows={4}
                value={businessRequirements}
                onChange={e => setBusinessRequirements(e.target.value)}
                placeholder="Describe the business requirements and objectives..."
                className={inputClass()}
                maxLength={2000}
              />
            </div>

            {/* Scope of Work */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel label="Scope of Work" htmlFor="proj-scope" />
                <CharCount value={scopeOfWork} />
              </div>
              <textarea
                id="proj-scope"
                rows={4}
                value={scopeOfWork}
                onChange={e => setScopeOfWork(e.target.value)}
                placeholder="Describe what is in scope (and out of scope) for this project..."
                className={inputClass()}
                maxLength={2000}
              />
            </div>

            {/* Expected Deliverables */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel label="Expected Deliverables" htmlFor="proj-deliverables" />
                <CharCount value={deliverables} />
              </div>
              <textarea
                id="proj-deliverables"
                rows={3}
                value={deliverables}
                onChange={e => setDeliverables(e.target.value)}
                placeholder="List the key deliverables expected from this project..."
                className={inputClass()}
                maxLength={2000}
              />
            </div>

            {/* Initial Assumptions */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel label="Initial Assumptions" htmlFor="proj-assumptions" />
                <CharCount value={assumptions} />
              </div>
              <textarea
                id="proj-assumptions"
                rows={3}
                value={assumptions}
                onChange={e => setAssumptions(e.target.value)}
                placeholder="State any assumptions made when defining this project..."
                className={inputClass()}
                maxLength={2000}
              />
            </div>

            {/* Dependencies */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel label="Dependencies" htmlFor="proj-dependencies" />
                <CharCount value={dependencies} />
              </div>
              <textarea
                id="proj-dependencies"
                rows={3}
                value={dependencies}
                onChange={e => setDependencies(e.target.value)}
                placeholder="List external dependencies, predecessor projects, or required resources..."
                className={inputClass()}
                maxLength={2000}
              />
            </div>
          </div>
        </div>

        {/* ─── Action Buttons ───────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 justify-center"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={() => handleSave('Draft')}
              className="px-5 py-2.5 rounded-lg border border-[#064E86] text-[#064E86] text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              onClick={() => handleSave('Submitted')}
              className="px-5 py-2.5 rounded-lg bg-[#064E86] text-white text-sm font-semibold hover:bg-[#053d6a] transition-colors flex items-center gap-2 justify-center shadow-sm"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          </div>
          {submitted && Object.keys(errors).length > 0 && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Please fix the highlighted errors before submitting.</span>
            </div>
          )}
        </div>

        <div className="h-6" />
      </div>

      {/* ── Confirmation Dialog ──────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-50 flex-shrink-0">
                <ClipboardList className="w-6 h-6 text-[#064E86]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Submit for Approval?</h3>
                <p className="text-slate-500 text-sm mt-1">
                  This will submit <span className="font-semibold text-slate-700">{name || 'this project'}</span> ({projectCode}) for management approval.
                  You won't be able to edit it until feedback is received.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 rounded-lg bg-[#064E86] text-white text-sm font-semibold hover:bg-[#053d6a] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMCreateProjectView;
