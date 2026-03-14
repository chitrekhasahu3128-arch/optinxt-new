import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Brain, Battery, Target, TrendingUp, 
  AlertTriangle, CheckCircle2, Clock, Zap,
  ChevronRight, Search, Filter, Download
} from 'lucide-react';

// --- Types ---

export interface EmployeeFitment {
  id: string;
  name: string;
  location: string;
  primaryProcess: string;
  secondaryProcess: string;
  grade: string;
  pmsRating: string;
  complexityOfWork: string;
  changeReady: string;
  serviceOrientation: string;
  teamPlayer: string;
  locationPreference: string;
  qualifications: string;
  expInRole: string;
  totalExp: string;
  currentCTC: string;
  multiplexer: string;
  communicativeness: string;
  selfMotivated: string;
  finalScore: number;
  remark: string;
}

// --- Constants & Data ---

const FITMENT_PARAMETERS = [
  { id: 'pmsRating', label: 'PMS Rating', weight: 0.05 },
  { id: 'complexityOfWork', label: 'Complexity of work', weight: 0.10 },
  { id: 'changeReady', label: 'Change ready, Tech savviness & Innovativeness', weight: 0.10 },
  { id: 'serviceOrientation', label: 'Service and customer Orientation', weight: 0.10 },
  { id: 'teamPlayer', label: 'Team Player & Collaboration', weight: 0.08 },
  { id: 'locationPreference', label: 'Location Preference', weight: 0.05 },
  { id: 'qualifications', label: 'Additional qualifications or certifications', weight: 0.09 },
  { id: 'expInRole', label: 'Experience in the current role', weight: 0.10 },
  { id: 'totalExp', label: 'Total Work Experience', weight: 0.06 },
  { id: 'currentCTC', label: 'Current CTC', weight: 0.05 },
  { id: 'multiplexer', label: 'Multiplexer', weight: 0.07 },
  { id: 'communicativeness', label: 'Communicativeness', weight: 0.07 },
  { id: 'selfMotivated', label: 'Self Motivated', weight: 0.08 },
];

const PARAMETER_OPTIONS: Record<string, Record<string, number>> = {
  pmsRating: {
    'Needs Improvement': 10,
    'Meets Expectations': 15,
    'Exceeds Expectations': 20
  },
  complexityOfWork: {
    'The employee role is similar to Peers': 10,
    'The employee role while similar to Peers requires more stakeholders to manage': 15,
    'The employee role while similar to Peers requires more stakeholders to manage and more Analytical effort': 20
  },
  changeReady: {
    'Believes that if something works it does not need fixing': 10,
    'Needs constant persuasion explanations and reassurances': 15,
    'Volunteers with improvement ideas, use of technology and open to change': 20
  },
  serviceOrientation: {
    'Believes that out of sight and mind of the customer keeps you generally out of trouble': 10,
    'Seeks to support stakeholders but sometimes ends take precedence over means': 15,
    'Knows that win-win relationships start with good listening': 20
  },
  teamPlayer: {
    'Believe that to keep harmony uncomfortable topics must not be raised': 10,
    'Believes that life is a zero sum game where to win means that someone has to loose': 15,
    'Appreciates others Talents and strengths and in the power of consensus': 20
  },
  locationPreference: {
    'The employee may not be amenable to relocate': 10,
    'The employee could be amenable to relocate': 20
  },
  qualifications: {
    'Additional qualifications / certifications are not relevant to the current role': 10,
    'Additional qualifications or certifications are relevant to the current role': 20
  },
  expInRole: {
    'Experience in current role more than 8 years': 10,
    'Experience in current role between 5 to 8 years': 15,
    'Experience in current role less than / equal to 5 years': 20
  },
  totalExp: {
    'Total number of years of experience is more than 8 years': 10,
    'Total number of years of experience is between 5 to 8 years': 15,
    'Total number of years of experience is less than / equal to 5 years': 20
  },
  currentCTC: {
    'The CTC is greater than the industry average / organization median for the role': 10,
    'The CTC is lower than the industry average // organization median for the role': 20
  },
  multiplexer: {
    'Is not able to juggle multiple responsibilities and is not able to adhere to timelines': 10,
    'Is able to juggle multiple responsibilities and is able to adhere to timelines': 20
  },
  communicativeness: {
    'Does not communicate his / her views; does not seek alignment': 10,
    'Communicates his / her views; seeks alignment': 20
  },
  selfMotivated: {
    'Requires constant follow up and direction / hand holding': 10,
    'Is able to work on his / her own with minimum hand holding / direction / follow ups': 20
  }
};

const calculateScore = (employee: Partial<EmployeeFitment>) => {
  let weightedSum = 0;
  FITMENT_PARAMETERS.forEach(param => {
    const selectedOption = (employee as any)[param.id];
    const score = PARAMETER_OPTIONS[param.id]?.[selectedOption] || 10;
    weightedSum += score * param.weight;
  });
  return Math.round(weightedSum * 2 * 10) / 10; // Scale to 0-40
};

const getFitmentStatus = (score: number) => {
  if (score < 10) return { label: 'UNFIT', color: 'text-red-400', bg: 'bg-red-400/10' };
  if (score < 20) return { label: 'TRAIN TO FIT', color: 'text-orange-400', bg: 'bg-orange-400/10' };
  if (score < 31) return { label: 'FIT', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  return { label: 'OVERFIT', color: 'text-light-blue', bg: 'bg-light-blue/10' };
};

export const DUMMY_EMPLOYEES: EmployeeFitment[] = [
  {
    id: '1',
    name: 'A',
    location: 'aa',
    primaryProcess: 'pa',
    secondaryProcess: 'ppa',
    grade: 'G1',
    pmsRating: 'Needs Improvement',
    complexityOfWork: 'The employee role while similar to Peers requires more stakeholders to manage',
    changeReady: 'Needs constant persuasion explanations and reassurances',
    serviceOrientation: 'Seeks to support stakeholders but sometimes ends take precedence over means',
    teamPlayer: 'Believes that life is a zero sum game where to win means that someone has to loose',
    locationPreference: 'The employee could be amenable to relocate',
    qualifications: 'Additional qualifications or certifications are relevant to the current role',
    expInRole: 'Experience in current role more than 8 years',
    totalExp: 'Total number of years of experience is more than 8 years',
    currentCTC: 'The CTC is lower than the industry average // organization median for the role',
    multiplexer: 'Is able to juggle multiple responsibilities and is able to adhere to timelines',
    communicativeness: 'Does not communicate his / her views; does not seek alignment',
    selfMotivated: 'Requires constant follow up and direction / hand holding',
    finalScore: 0,
    remark: 'Requires constant follow up'
  },
  {
    id: '2',
    name: 'B',
    location: 'bb',
    primaryProcess: 'pb',
    secondaryProcess: 'ppb',
    grade: 'G2',
    pmsRating: 'Meets Expectations',
    complexityOfWork: 'The employee role while similar to Peers requires more stakeholders to manage and more Analytical effort',
    changeReady: 'Needs constant persuasion explanations and reassurances',
    serviceOrientation: 'Knows that win-win relationships start with good listening',
    teamPlayer: 'Appreciates others Talents and strengths and in the power of consensus',
    locationPreference: 'The employee could be amenable to relocate',
    qualifications: 'Additional qualifications or certifications are relevant to the current role',
    expInRole: 'Experience in current role between 5 to 8 years',
    totalExp: 'Total number of years of experience is between 5 to 8 years',
    currentCTC: 'The CTC is lower than the industry average // organization median for the role',
    multiplexer: 'Is able to juggle multiple responsibilities and is able to adhere to timelines',
    communicativeness: 'Communicates his / her views; seeks alignment',
    selfMotivated: 'Is able to work on his / her own with minimum hand holding / direction / follow ups',
    finalScore: 0,
    remark: 'Strong performer'
  },
  {
    id: '3',
    name: 'C',
    location: 'cc',
    primaryProcess: 'pc',
    secondaryProcess: 'ppc',
    grade: 'G1',
    pmsRating: 'Meets Expectations',
    complexityOfWork: 'The employee role while similar to Peers requires more stakeholders to manage',
    changeReady: 'Needs constant persuasion explanations and reassurances',
    serviceOrientation: 'Seeks to support stakeholders but sometimes ends take precedence over means',
    teamPlayer: 'Believe that to keep harmony uncomfortable topics must not be raised',
    locationPreference: 'The employee could be amenable to relocate',
    qualifications: 'Additional qualifications or certifications are relevant to the current role',
    expInRole: 'Experience in current role between 5 to 8 years',
    totalExp: 'Total number of years of experience is more than 8 years',
    currentCTC: 'The CTC is lower than the industry average // organization median for the role',
    multiplexer: 'Is able to juggle multiple responsibilities and is able to adhere to timelines',
    communicativeness: 'Does not communicate his / her views; does not seek alignment',
    selfMotivated: 'Is able to work on his / her own with minimum hand holding / direction / follow ups',
    finalScore: 0,
    remark: 'Stable contributor'
  },
  {
    id: '4',
    name: 'D',
    location: 'dd',
    primaryProcess: 'pd',
    secondaryProcess: 'ppd',
    grade: 'G3',
    pmsRating: 'Exceeds Expectations',
    complexityOfWork: 'The employee role while similar to Peers requires more stakeholders to manage',
    changeReady: 'Volunteers with improvement ideas, use of technology and open to change',
    serviceOrientation: 'Believes that out of sight and mind of the customer keeps you generally out of trouble',
    teamPlayer: 'Believes that life is a zero sum game where to win means that someone has to loose',
    locationPreference: 'The employee could be amenable to relocate',
    qualifications: 'Additional qualifications / certifications are not relevant to the current role',
    expInRole: 'Experience in current role less than / equal to 5 years',
    totalExp: 'Total number of years of experience is less than / equal to 5 years',
    currentCTC: 'The CTC is lower than the industry average // organization median for the role',
    multiplexer: 'Is not able to juggle multiple responsibilities and is not able to adhere to timelines',
    communicativeness: 'Communicates his / her views; seeks alignment',
    selfMotivated: 'Is able to work on his / her own with minimum hand holding / direction / follow ups',
    finalScore: 0,
    remark: 'High potential, needs focus'
  },
  {
    id: '5',
    name: 'E',
    location: 'ee',
    primaryProcess: 'pe',
    secondaryProcess: 'ppe',
    grade: 'G3',
    pmsRating: 'Exceeds Expectations',
    complexityOfWork: 'The employee role while similar to Peers requires more stakeholders to manage',
    changeReady: 'Needs constant persuasion explanations and reassurances',
    serviceOrientation: 'Knows that win-win relationships start with good listening',
    teamPlayer: 'Believe that to keep harmony uncomfortable topics must not be raised',
    locationPreference: 'The employee could be amenable to relocate',
    qualifications: 'Additional qualifications / certifications are not relevant to the current role',
    expInRole: 'Experience in current role more than 8 years',
    totalExp: 'Total number of years of experience is more than 8 years',
    currentCTC: 'The CTC is lower than the industry average // organization median for the role',
    multiplexer: 'Is not able to juggle multiple responsibilities and is not able to adhere to timelines',
    communicativeness: 'Communicates his / her views; seeks alignment',
    selfMotivated: 'Is able to work on his / her own with minimum hand holding / direction / follow ups',
    finalScore: 0,
    remark: 'Experienced, needs challenge'
  }
].map(emp => ({ ...emp, finalScore: calculateScore(emp) }));

// --- Components ---

export const FitmentAnalysisTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[2000px]">
        <thead>
          <tr className="bg-navy-800/80 border-b border-white/10">
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-navy-900 z-10">S.No</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider sticky left-12 bg-navy-900 z-10">Employee Name</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee ID</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Process</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Secondary Process</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Grade</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">PMS Rating</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Complexity of work</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Change Ready</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Service Orientation</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Team Player</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location Preference</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Qualifications</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Exp in Role</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Exp</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Current CTC</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Multiplexer</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Communicativeness</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Self Motivated</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Final Score</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fitment</th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Remark</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {DUMMY_EMPLOYEES.map((emp, idx) => {
            const fitment = getFitmentStatus(emp.finalScore);
            return (
              <tr key={emp.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-sm text-slate-400 sticky left-0 bg-navy-900 group-hover:bg-navy-800 transition-colors">{idx + 1}</td>
                <td className="p-4 text-sm font-bold text-white sticky left-12 bg-navy-900 group-hover:bg-navy-800 transition-colors">{emp.name}</td>
                <td className="p-4 text-sm text-slate-300">{emp.id}</td>
                <td className="p-4 text-sm text-slate-300">{emp.location}</td>
                <td className="p-4 text-sm text-slate-300">{emp.primaryProcess}</td>
                <td className="p-4 text-sm text-slate-300">{emp.secondaryProcess}</td>
                <td className="p-4 text-sm text-slate-300">{emp.grade}</td>
                <td className="p-4 text-sm text-slate-300">{emp.pmsRating}</td>
                <td className="p-4 text-sm text-slate-300 max-w-xs truncate" title={emp.complexityOfWork}>{emp.complexityOfWork}</td>
                <td className="p-4 text-sm text-slate-300 max-w-xs truncate" title={emp.changeReady}>{emp.changeReady}</td>
                <td className="p-4 text-sm text-slate-300 max-w-xs truncate" title={emp.serviceOrientation}>{emp.serviceOrientation}</td>
                <td className="p-4 text-sm text-slate-300 max-w-xs truncate" title={emp.teamPlayer}>{emp.teamPlayer}</td>
                <td className="p-4 text-sm text-slate-300">{emp.locationPreference}</td>
                <td className="p-4 text-sm text-slate-300">{emp.qualifications}</td>
                <td className="p-4 text-sm text-slate-300">{emp.expInRole}</td>
                <td className="p-4 text-sm text-slate-300">{emp.totalExp}</td>
                <td className="p-4 text-sm text-slate-300">{emp.currentCTC}</td>
                <td className="p-4 text-sm text-slate-300">{emp.multiplexer}</td>
                <td className="p-4 text-sm text-slate-300">{emp.communicativeness}</td>
                <td className="p-4 text-sm text-slate-300">{emp.selfMotivated}</td>
                <td className="p-4 text-sm font-bold text-light-blue">{emp.finalScore}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${fitment.bg} ${fitment.color}`}>
                    {fitment.label}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-400 italic">{emp.remark}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const SoftSkillsRadar: React.FC = () => {
  const data = [
    { subject: 'Communication', A: 120, B: 110, fullMark: 150 },
    { subject: 'Leadership', A: 98, B: 130, fullMark: 150 },
    { subject: 'Teamwork', A: 86, B: 130, fullMark: 150 },
    { subject: 'Problem Solving', A: 99, B: 100, fullMark: 150 },
    { subject: 'Adaptability', A: 85, B: 90, fullMark: 150 },
    { subject: 'Time Mgmt', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#ffffff10" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar name="Employee A" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
          <Radar name="Employee B" dataKey="B" stroke="#f7931e" fill="#f7931e" fillOpacity={0.5} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FatigueAnalysis: React.FC = () => {
  const data = [
    { name: 'Mon', fatigue: 20, workload: 40 },
    { name: 'Tue', fatigue: 35, workload: 65 },
    { name: 'Wed', fatigue: 55, workload: 85 },
    { name: 'Thu', fatigue: 75, workload: 90 },
    { name: 'Fri', fatigue: 85, workload: 95 },
    { name: 'Sat', fatigue: 40, workload: 20 },
    { name: 'Sun', fatigue: 15, workload: 10 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '8px' }}
          />
          <Area type="monotone" dataKey="fatigue" stroke="#f43f5e" fillOpacity={1} fill="url(#colorFatigue)" />
          <Line type="monotone" dataKey="workload" stroke="#0ea5e9" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GapAnalysis: React.FC = () => {
  const data = [
    { name: 'Python', actual: 80, required: 95 },
    { name: 'Cloud', actual: 65, required: 90 },
    { name: 'AI/ML', actual: 45, required: 85 },
    { name: 'SQL', actual: 90, required: 90 },
    { name: 'DevOps', actual: 30, required: 75 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '8px' }}
          />
          <Bar dataKey="required" fill="#ffffff10" radius={[0, 4, 4, 0]} barSize={20} />
          <Bar dataKey="actual" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const WorkforceIntelligence: React.FC = () => {
  const stats = [
    { label: 'Total FTE', value: '1,240', change: '+12%', icon: Users, color: 'text-light-blue' },
    { label: 'Avg Productivity', value: '84%', change: '+5.2%', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Attrition Risk', value: 'Low', change: '-2%', icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'Skill Index', value: '7.8/10', change: '+0.4', icon: Brain, color: 'text-opti-orange' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/5 ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
