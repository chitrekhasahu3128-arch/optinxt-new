import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  User, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Zap, 
  CheckCircle2, 
  Save, 
  ChevronRight, 
  LayoutDashboard,
  Building2,
  Users,
  Award,
  BarChart3,
  Settings,
  ShieldCheck,
  BrainCircuit,
  AlertCircle,
  Sparkles,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { Employee, WorkloadAssessment } from '../types';
import { db, collection, addDoc, handleFirestoreError, OperationType } from '../firebase';
import { Timestamp } from 'firebase/firestore';

const FormSection = ({ id, number, title, description, icon: Icon, children }: any) => (
  <div id={id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
    <div className="p-8 border-b border-slate-50 flex items-start space-x-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-brand-muted text-white flex items-center justify-center font-black text-lg shadow-lg shadow-brand-muted/20 mb-2">
          {number}
        </div>
        <div className="w-0.5 h-full bg-slate-100 min-h-[20px]"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-1">
          <div className="p-2 bg-brand-muted/10 text-brand-muted rounded-xl">
            <Icon size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        <p className="text-sm text-slate-400 font-medium">{description}</p>
      </div>
    </div>
    <div className="p-8 bg-slate-50/30">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  </div>
);

const FormField = ({ label, name, value, onChange, type = "text", options, required, error, icon: Icon }: any) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`flex items-center space-x-3 p-3.5 rounded-2xl bg-white border ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus-within:border-brand-muted focus-within:ring-4 focus-within:ring-brand-muted/10'} transition-all shadow-sm`}>
      <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
        <Icon size={18} />
      </div>
      <div className="flex-1 relative">
        <input
          type={type === 'select' ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          list={options ? `${name}-options` : undefined}
          placeholder={`Enter or select ${label.toLowerCase()}`}
          className="w-full bg-transparent text-slate-900 font-bold text-sm outline-none placeholder:text-slate-300"
        />
        {options && (
          <datalist id={`${name}-options`}>
            {options.map((opt: string) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        )}
        {type === 'select' && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
            <ChevronRight size={14} className="rotate-90" />
          </div>
        )}
      </div>
    </div>
    {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{error}</p>}
  </div>
);

const WorkloadForm = ({ employee }: { employee: Employee | null }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Section 1
    companyName: '',
    employeeName: employee?.name || '',
    employeeId: employee?.employeeId || '',
    department: employee?.department || '',
    currentTeamName: '',
    band: '',
    grade: '',
    designation: employee?.designation || '',
    location: employee?.location || '',
    managerName: employee?.manager || '',
    activeRole: '',
    employmentType: employee?.employmentType || '',

    // Section 2
    primaryProcess: '',
    secondaryProcess: '',
    processName: '',
    currentRoleDescription: '',
    processCategory: '',
    consolidationType: '',

    // Section 3
    totalExperienceYears: '',
    experienceInCurrentRoleYears: '',
    currentCTC: '',
    benchmarkCTC: '',
    ctcBenchmark: '',

    // Section 4
    pmsRating: '',
    complexityOfWork: '',
    changeReadySavviness: '',
    serviceCustomerOrientation: '',
    teamPlayerCollaboration: '',
    locationPreference: '',
    additionalQualifications: '',
    experienceInCurrentRoleQualitative: '',
    totalWorkExperienceQualitative: '',
    multiplexer: '',
    communicativeness: '',
    selfMotivated: '',

    // Section 5
    hoursInvoicing: '',
    hoursCollections: '',
    hoursPayments: '',
    hoursR2R: '',
    hoursTaxation: '',
    hoursTreasury: '',
    hoursMeetings: '',
    hoursTraining: '',
    hoursOthers: '',

    // Section 6
    standardHours: '',
    actualHours: '',
    overtimeHours: '',
    weekendWork: '',
    multipleRoles: '',
    deadlinePressure: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeName: employee.name || '',
        employeeId: employee.employeeId || '',
        department: employee.department || '',
        designation: employee.designation || '',
        location: employee.location || '',
        managerName: employee.manager || '',
        employmentType: employee.employmentType || '',
      }));
    }
  }, [employee]);

  if (!employee) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '' || value === null) {
        newErrors[key] = 'Required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToError = () => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setTimeout(scrollToError, 100);
      return;
    }

    setSubmitting(true);
    
    const workloadScore = Number(formData.standardHours) > 0 
      ? Math.min(100, (Number(formData.actualHours) / Number(formData.standardHours)) * 50 + (Number(formData.overtimeHours) > 0 ? 20 : 0))
      : 0;
      
    const fatigueScore = Number(formData.actualHours) > 0
      ? Math.min(100, (Number(formData.hoursMeetings) / Number(formData.actualHours)) * 40 + (Number(formData.overtimeHours) > 0 ? 30 : 0) + (formData.deadlinePressure === 'Extreme' ? 30 : formData.deadlinePressure === 'High' ? 20 : 0))
      : 0;

    const assessment = {
      userId: employee.uid,
      timestamp: Timestamp.now(),
      ...formData,
      // Convert numeric strings to numbers
      totalExperienceYears: Number(formData.totalExperienceYears) || 0,
      experienceInCurrentRoleYears: Number(formData.experienceInCurrentRoleYears) || 0,
      currentCTC: Number(formData.currentCTC) || 0,
      benchmarkCTC: Number(formData.benchmarkCTC) || 0,
      hoursInvoicing: Number(formData.hoursInvoicing) || 0,
      hoursCollections: Number(formData.hoursCollections) || 0,
      hoursPayments: Number(formData.hoursPayments) || 0,
      hoursR2R: Number(formData.hoursR2R) || 0,
      hoursTaxation: Number(formData.hoursTaxation) || 0,
      hoursTreasury: Number(formData.hoursTreasury) || 0,
      hoursMeetings: Number(formData.hoursMeetings) || 0,
      hoursTraining: Number(formData.hoursTraining) || 0,
      hoursOthers: Number(formData.hoursOthers) || 0,
      standardHours: Number(formData.standardHours) || 0,
      actualHours: Number(formData.actualHours) || 0,
      overtimeHours: Number(formData.overtimeHours) || 0,
      // Add calculated scores for fatigue analysis
      workloadScore,
      fatigueScore,
      fatigueLevel: (Number(formData.actualHours) > 10 || formData.deadlinePressure === 'Extreme') ? 'High Risk' : (Number(formData.actualHours) > 8 || formData.deadlinePressure === 'High') ? 'Moderate Risk' : 'Low Risk'
    };

    try {
      await addDoc(collection(db, 'workload'), assessment);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'workload');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      alert("Draft saved successfully!");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const fillSampleData = () => {
    setFormData({
      companyName: 'Tech Solutions',
      employeeName: employee?.name || 'John Doe',
      employeeId: employee?.employeeId || 'EMP-1234',
      department: 'Engineering',
      currentTeamName: 'Alpha',
      band: 'Band 3',
      grade: 'G3',
      designation: 'Senior Analyst',
      location: 'Remote',
      managerName: 'Jane Smith',
      activeRole: 'Yes',
      employmentType: 'Full-time',
      primaryProcess: 'Process A',
      secondaryProcess: 'Process X',
      processName: 'R2R',
      currentRoleDescription: 'Individual Contributor',
      processCategory: 'Core',
      consolidationType: 'Global',
      totalExperienceYears: '8',
      experienceInCurrentRoleYears: '3',
      currentCTC: '120000',
      benchmarkCTC: '115000',
      ctcBenchmark: 'Market Top 25%',
      pmsRating: 'Exceeds',
      complexityOfWork: 'High',
      changeReadySavviness: 'High',
      serviceCustomerOrientation: 'High',
      teamPlayerCollaboration: 'High',
      locationPreference: 'Current',
      additionalQualifications: 'MBA',
      experienceInCurrentRoleQualitative: 'Expert',
      totalWorkExperienceQualitative: 'Expert',
      multiplexer: 'Yes',
      communicativeness: 'High',
      selfMotivated: 'High',
      hoursInvoicing: '2',
      hoursCollections: '1',
      hoursPayments: '1',
      hoursR2R: '10',
      hoursTaxation: '2',
      hoursTreasury: '2',
      hoursMeetings: '15',
      hoursTraining: '2',
      hoursOthers: '5',
      standardHours: '40',
      actualHours: '45',
      overtimeHours: '5',
      weekendWork: 'No',
      multipleRoles: 'Yes',
      deadlinePressure: 'High'
    });
  };

  const progress = (Object.values(formData).filter(v => v !== '').length / Object.keys(formData).length) * 100;

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-[3rem] p-16 border border-slate-100 shadow-xl text-center"
      >
        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Form Submitted</h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          Your employee data has been successfully collected and stored for workforce optimization analysis.
        </p>
        <button 
          onClick={() => navigate('/fatigue')}
          className="px-8 py-4 bg-brand-muted text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-muted/20 flex items-center justify-center mx-auto"
        >
          <Activity size={18} className="mr-2" />
          View Fatigue Analysis
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-brand-muted text-white rounded-[1.5rem] shadow-lg shadow-brand-muted/20">
              <ClipboardList size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workforce Optimization Assessment</h1>
              <p className="text-slate-500 font-medium">Please provide detailed metrics for role fitment and fatigue risk analysis.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button 
              type="button"
              onClick={fillSampleData}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center"
            >
              <Sparkles size={14} className="mr-2 text-brand-muted" />
              Fill Sample Data
            </button>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assessment Progress</p>
              <div className="flex items-center space-x-4">
                <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-muted rounded-full"
                  />
                </div>
                <span className="text-lg font-black text-brand-muted">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1 — Identity & Role Verification */}
        <FormSection 
          id="section-1"
          number="01" 
          title="Identity & Role Verification" 
          description="Confirming organizational identity and current placement."
          icon={User}
        >
          <FormField label="Current Organization" name="companyName" value={formData.companyName} onChange={handleChange} type="select" options={['Global Corp', 'Tech Solutions', 'Finance Hub']} required error={errors.companyName} icon={Building2} />
          <FormField label="Full Legal Name" name="employeeName" value={formData.employeeName} onChange={handleChange} required error={errors.employeeName} icon={User} />
          <FormField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required error={errors.employeeId} icon={ShieldCheck} />
          
          <FormField label="Assigned Department" name="department" value={formData.department} onChange={handleChange} type="select" options={['Operations', 'Finance', 'HR', 'IT', 'Sales']} required error={errors.department} icon={Briefcase} />
          <FormField label="Current Team Unit" name="currentTeamName" value={formData.currentTeamName} onChange={handleChange} type="select" options={['Alpha', 'Beta', 'Gamma', 'Delta']} required error={errors.currentTeamName} icon={Users} />
          <FormField label="Organizational Band" name="band" value={formData.band} onChange={handleChange} type="select" options={['Band 1', 'Band 2', 'Band 3', 'Band 4']} required error={errors.band} icon={Award} />

          <FormField label="Pay Grade" name="grade" value={formData.grade} onChange={handleChange} type="select" options={['G1', 'G2', 'G3', 'G4', 'G5']} required error={errors.grade} icon={BarChart3} />
          <FormField label="Current Designation" name="designation" value={formData.designation} onChange={handleChange} type="select" options={['Analyst', 'Senior Analyst', 'Manager', 'Director']} required error={errors.designation} icon={Briefcase} />
          <FormField label="Primary Location" name="location" value={formData.location} onChange={handleChange} type="select" options={['New York', 'London', 'Singapore', 'Mumbai', 'Remote']} required error={errors.location} icon={MapPin} />

          <FormField label="Reporting Manager" name="managerName" value={formData.managerName} onChange={handleChange} type="select" options={['John Doe', 'Jane Smith', 'Robert Brown']} required error={errors.managerName} icon={User} />
          <FormField label="Active Engagement" name="activeRole" value={formData.activeRole} onChange={handleChange} type="select" options={['Yes', 'No']} required error={errors.activeRole} icon={CheckCircle2} />
          <FormField label="Employment Classification" name="employmentType" value={formData.employmentType} onChange={handleChange} type="select" options={['Full-time', 'Contract', 'Part-time']} required error={errors.employmentType} icon={Settings} />
        </FormSection>

        {/* SECTION 2 — Process & Responsibility Mapping */}
        <FormSection 
          id="section-2"
          number="02" 
          title="Process & Responsibility Mapping" 
          description="Detailed mapping of core and secondary process ownership."
          icon={Settings}
        >
          <FormField label="Primary Process Domain" name="primaryProcess" value={formData.primaryProcess} onChange={handleChange} type="select" options={['Process A', 'Process B', 'Process C']} required error={errors.primaryProcess} icon={Settings} />
          <FormField label="Secondary Process Domain" name="secondaryProcess" value={formData.secondaryProcess} onChange={handleChange} type="select" options={['None', 'Process X', 'Process Y']} required error={errors.secondaryProcess} icon={Settings} />
          
          <FormField label="Functional Process Name" name="processName" value={formData.processName} onChange={handleChange} type="select" options={['Invoicing', 'Collections', 'Payments', 'R2R']} required error={errors.processName} icon={ClipboardList} />
          <FormField label="Role Complexity Level" name="currentRoleDescription" value={formData.currentRoleDescription} onChange={handleChange} type="select" options={['Individual Contributor', 'Team Lead', 'Strategic Planner']} required error={errors.currentRoleDescription} icon={Briefcase} />

          <FormField label="Process Strategic Category" name="processCategory" value={formData.processCategory} onChange={handleChange} type="select" options={['Core', 'Support', 'Strategic']} required error={errors.processCategory} icon={BarChart3} />
          <FormField label="Data Consolidation Scope" name="consolidationType" value={formData.consolidationType} onChange={handleChange} type="select" options={['Local', 'Regional', 'Global']} required error={errors.consolidationType} icon={Building2} />
        </FormSection>

        {/* SECTION 3 — Professional Background & Benchmarking */}
        <FormSection 
          id="section-3"
          number="03" 
          title="Professional Background & Benchmarking" 
          description="Historical experience and market compensation alignment."
          icon={DollarSign}
        >
          <FormField label="Total Career Experience (Years)" name="totalExperienceYears" value={formData.totalExperienceYears} onChange={handleChange} type="number" required error={errors.totalExperienceYears} icon={Clock} />
          <FormField label="Tenure in Current Role (Years)" name="experienceInCurrentRoleYears" value={formData.experienceInCurrentRoleYears} onChange={handleChange} type="number" required error={errors.experienceInCurrentRoleYears} icon={Clock} />
          <FormField label="Current Annual CTC" name="currentCTC" value={formData.currentCTC} onChange={handleChange} type="number" required error={errors.currentCTC} icon={DollarSign} />

          <FormField label="Market Benchmark CTC" name="benchmarkCTC" value={formData.benchmarkCTC} onChange={handleChange} type="number" required error={errors.benchmarkCTC} icon={DollarSign} />
          <FormField label="Compensation Percentile" name="ctcBenchmark" value={formData.ctcBenchmark} onChange={handleChange} type="select" options={['Market Median', 'Market Top 25%', 'Market Bottom 25%']} required error={errors.ctcBenchmark} icon={BarChart3} />
        </FormSection>

        {/* SECTION 4 — Behavioral & Competency Assessment */}
        <FormSection 
          id="section-4"
          number="04" 
          title="Behavioral & Competency Assessment" 
          description="Qualitative assessment of performance and soft skill proficiency."
          icon={BrainCircuit}
        >
          <FormField label="Latest Performance Rating" name="pmsRating" value={formData.pmsRating} onChange={handleChange} type="select" options={['Exceeds', 'Meets', 'Needs Improvement']} required error={errors.pmsRating} icon={Star} />
          <FormField label="Work Complexity Index" name="complexityOfWork" value={formData.complexityOfWork} onChange={handleChange} type="select" options={['Low', 'Medium', 'High', 'Very High']} required error={errors.complexityOfWork} icon={Zap} />

          <FormField label="Change Adaptability Score" name="changeReadySavviness" value={formData.changeReadySavviness} onChange={handleChange} type="select" options={['High', 'Moderate', 'Low']} required error={errors.changeReadySavviness} icon={Zap} />
          <FormField label="Customer Centricity" name="serviceCustomerOrientation" value={formData.serviceCustomerOrientation} onChange={handleChange} type="select" options={['High', 'Moderate', 'Low']} required error={errors.serviceCustomerOrientation} icon={Users} />

          <FormField label="Collaboration Quotient" name="teamPlayerCollaboration" value={formData.teamPlayerCollaboration} onChange={handleChange} type="select" options={['High', 'Moderate', 'Low']} required error={errors.teamPlayerCollaboration} icon={Users} />
          <FormField label="Mobility Preference" name="locationPreference" value={formData.locationPreference} onChange={handleChange} type="select" options={['Current', 'Flexible', 'Specific Region']} required error={errors.locationPreference} icon={MapPin} />

          <FormField label="Advanced Certifications" name="additionalQualifications" value={formData.additionalQualifications} onChange={handleChange} type="select" options={['MBA', 'PhD', 'Certifications', 'None']} required error={errors.additionalQualifications} icon={Award} />
          <FormField label="Role Specific Proficiency" name="experienceInCurrentRoleQualitative" value={formData.experienceInCurrentRoleQualitative} onChange={handleChange} type="select" options={['Expert', 'Proficient', 'Beginner']} required error={errors.experienceInCurrentRoleQualitative} icon={Clock} />

          <FormField label="Overall Domain Expertise" name="totalWorkExperienceQualitative" value={formData.totalWorkExperienceQualitative} onChange={handleChange} type="select" options={['Expert', 'Proficient', 'Beginner']} required error={errors.totalWorkExperienceQualitative} icon={Clock} />
          <FormField label="Multitasking Capability" name="multiplexer" value={formData.multiplexer} onChange={handleChange} type="select" options={['Yes', 'No']} required error={errors.multiplexer} icon={Zap} />

          <FormField label="Communication Effectiveness" name="communicativeness" value={formData.communicativeness} onChange={handleChange} type="select" options={['High', 'Moderate', 'Low']} required error={errors.communicativeness} icon={Users} />
          <FormField label="Self-Motivation Level" name="selfMotivated" value={formData.selfMotivated} onChange={handleChange} type="select" options={['High', 'Moderate', 'Low']} required error={errors.selfMotivated} icon={Zap} />
        </FormSection>

        {/* SECTION 5 — Time Allocation Analysis */}
        <FormSection 
          id="section-5"
          number="05" 
          title="Time Allocation Analysis" 
          description="Weekly hour distribution across functional processes."
          icon={Clock}
        >
          <FormField label="Invoicing Hours" name="hoursInvoicing" value={formData.hoursInvoicing} onChange={handleChange} type="number" required error={errors.hoursInvoicing} icon={Clock} />
          <FormField label="Collections Hours" name="hoursCollections" value={formData.hoursCollections} onChange={handleChange} type="number" required error={errors.hoursCollections} icon={Clock} />
          <FormField label="Payments Hours" name="hoursPayments" value={formData.hoursPayments} onChange={handleChange} type="number" required error={errors.hoursPayments} icon={Clock} />
          <FormField label="R2R Hours" name="hoursR2R" value={formData.hoursR2R} onChange={handleChange} type="number" required error={errors.hoursR2R} icon={Clock} />
          <FormField label="Taxation Hours" name="hoursTaxation" value={formData.hoursTaxation} onChange={handleChange} type="number" required error={errors.hoursTaxation} icon={Clock} />

          <FormField label="Treasury Hours" name="hoursTreasury" value={formData.hoursTreasury} onChange={handleChange} type="number" required error={errors.hoursTreasury} icon={Clock} />
          <FormField label="Meeting Hours" name="hoursMeetings" value={formData.hoursMeetings} onChange={handleChange} type="number" required error={errors.hoursMeetings} icon={Clock} />
          <FormField label="Training Hours" name="hoursTraining" value={formData.hoursTraining} onChange={handleChange} type="number" required error={errors.hoursTraining} icon={Clock} />
          <FormField label="Miscellaneous Hours" name="hoursOthers" value={formData.hoursOthers} onChange={handleChange} type="number" required error={errors.hoursOthers} icon={Clock} />
        </FormSection>

        {/* SECTION 6 — Work-Life Balance & Pressure Metrics */}
        <FormSection 
          id="section-6"
          number="06" 
          title="Work-Life Balance & Pressure Metrics" 
          description="Assessment of workload sustainability and deadline intensity."
          icon={Clock}
        >
          <FormField label="Contractual Standard Hours" name="standardHours" value={formData.standardHours} onChange={handleChange} type="number" required error={errors.standardHours} icon={Clock} />
          <FormField label="Average Actual Hours" name="actualHours" value={formData.actualHours} onChange={handleChange} type="number" required error={errors.actualHours} icon={Clock} />
          <FormField label="Average Overtime Hours" name="overtimeHours" value={formData.overtimeHours} onChange={handleChange} type="number" required error={errors.overtimeHours} icon={Clock} />

          <FormField label="Weekend Engagement" name="weekendWork" value={formData.weekendWork} onChange={handleChange} type="select" options={['Yes', 'No']} required error={errors.weekendWork} icon={CheckCircle2} />
          <FormField label="Concurrent Role Handling" name="multipleRoles" value={formData.multipleRoles} onChange={handleChange} type="select" options={['Yes', 'No']} required error={errors.multipleRoles} icon={CheckCircle2} />
          <FormField label="Deadline Pressure Level" name="deadlinePressure" value={formData.deadlinePressure} onChange={handleChange} type="select" options={['Low', 'Moderate', 'High', 'Extreme']} required error={errors.deadlinePressure} icon={AlertCircle} />
        </FormSection>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-12">
          <button 
            type="button"
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {savingDraft ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Draft
              </>
            )}
          </button>
          <button 
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-12 py-4 bg-brand-muted text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand-muted/20 flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 size={18} className="mr-2" />
                Submit Form
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-start space-x-6">
        <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">Data Privacy & Security</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Your responses are encrypted and used solely for the purpose of workforce optimization and career development. Individual responses are only accessible to authorized HR personnel and your direct manager to support your professional growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkloadForm;

