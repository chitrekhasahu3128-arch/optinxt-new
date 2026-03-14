export interface Employee {
  uid: string;
  name: string;
  email: string;
  designation?: string;
  department?: string;
  manager?: string;
  location?: string;
  employmentType?: string;
  employeeId?: string;
  fitmentScore?: number;
  utilizationRate?: number;
  skills?: {
    communication: number;
    leadership: number;
    adaptability: number;
    collaboration: number;
    innovation: number;
  };
  performanceSummary?: string;
  careerTimeline?: { date: string; event: string }[];
  recommendedNextRole?: string;
  promotionReadiness?: number;
  role?: 'employee' | 'manager' | 'admin';
  createdAt?: string;
}

export interface WorkloadAssessment {
  id?: string;
  userId: string;
  timestamp: any; // Firestore Timestamp
  
  // SECTION 1 — Employee Information
  companyName: string;
  employeeName: string;
  employeeId: string;
  department: string;
  currentTeamName: string;
  band: string;
  grade: string;
  designation: string;
  location: string;
  managerName: string;
  activeRole: string;
  employmentType: string;

  // SECTION 2 — Role & Process Details
  primaryProcess: string;
  secondaryProcess: string;
  processName: string;
  currentRoleDescription: string;
  processCategory: string;
  consolidationType: string;

  // SECTION 3 — Experience & Compensation
  totalExperienceYears: number;
  experienceInCurrentRoleYears: number;
  currentCTC: number;
  benchmarkCTC: number;
  ctcBenchmark: string;

  // SECTION 4 — Fitment Qualitative Inputs
  pmsRating: string;
  complexityOfWork: string;
  changeReadySavviness: string;
  serviceCustomerOrientation: string;
  teamPlayerCollaboration: string;
  locationPreference: string;
  additionalQualifications: string;
  experienceInCurrentRoleQualitative: string;
  totalWorkExperienceQualitative: string;
  multiplexer: string;
  communicativeness: string;
  selfMotivated: string;

  // SECTION 5 — Working Hours Process Wise
  hoursInvoicing: number;
  hoursCollections: number;
  hoursPayments: number;
  hoursR2R: number;
  hoursTaxation: number;
  hoursTreasury: number;
  hoursMeetings: number;
  hoursTraining: number;
  hoursOthers: number;

  // SECTION 6 — Working Hours General
  standardHours: number;
  actualHours: number;
  overtimeHours: number;
  weekendWork: string;
  multipleRoles: string;
  deadlinePressure: string;

  fatigueScore?: number;
  fatigueLevel?: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  formattedDate?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: any[];
  }
}
