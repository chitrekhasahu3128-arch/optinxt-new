import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Brain, 
  Battery, 
  Target, 
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Filter,
  Download,
  Grid,
  Zap,
  Upload,
  Bot,
  PieChart,
  FileText,
  Plus,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  FitmentAnalysisTable, 
  SoftSkillsRadar, 
  FatigueAnalysis, 
  GapAnalysis, 
  WorkforceIntelligence 
} from './ManagerDashboardComponents';
import { auth, db } from '../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type View = 'Dashboard' | 'Employees' | 'Fitment' | 'Softskills' | 'Fatigue' | 'Intelligence' | 'Gap' | '6x6' | 'Upload' | 'Assistant' | 'Optimization' | 'Analytics' | 'Settings' | 'Documentation';

export const ManagerDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as { name: string; role: string });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-light-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userInitials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'AM';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-600 flex overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] flex flex-col sticky top-0 h-screen shrink-0 z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-light-blue flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">AI Workforce</span>
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Enterprise Analytics</span>
          </div>
        </div>

        {/* User Profile in Sidebar */}
        <div className="px-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-sm truncate">{userData?.name || 'Manager'}</span>
              <span className="text-slate-500 text-xs truncate">{userData?.role || 'Manager'}</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-6 overflow-y-auto custom-scrollbar pb-8">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Main</p>
            <div className="space-y-1">
              <NavItem icon={Grid} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => setActiveView('Dashboard')} />
              <NavItem icon={Users} label="Employees" active={activeView === 'Employees'} onClick={() => setActiveView('Employees')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Insights</p>
            <div className="space-y-1">
              <NavItem icon={Target} label="Fitment Analysis" active={activeView === 'Fitment'} onClick={() => setActiveView('Fitment')} />
              <NavItem icon={Brain} label="Softskills" active={activeView === 'Softskills'} onClick={() => setActiveView('Softskills')} />
              <NavItem icon={Battery} label="Fatigue Analysis" active={activeView === 'Fatigue'} onClick={() => setActiveView('Fatigue')} />
              <NavItem icon={LayoutDashboard} label="Workforce Intelligence" active={activeView === 'Intelligence'} onClick={() => setActiveView('Intelligence')} />
              <NavItem icon={BarChart3} label="Gap Analysis" active={activeView === 'Gap'} onClick={() => setActiveView('Gap')} />
              <NavItem icon={PieChart} label="6×6 Workforce Analysis" active={activeView === '6x6'} onClick={() => setActiveView('6x6')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Admin Data</p>
            <div className="space-y-1">
              <NavItem icon={Upload} label="Upload Data" active={activeView === 'Upload'} onClick={() => setActiveView('Upload')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Optimization</p>
            <div className="space-y-1">
              <NavItem icon={Bot} label="AI Assistant" active={activeView === 'Assistant'} onClick={() => setActiveView('Assistant')} />
              <NavItem icon={Zap} label="Optimization" active={activeView === 'Optimization'} onClick={() => setActiveView('Optimization')} />
              <NavItem icon={BarChart3} label="Analytics" active={activeView === 'Analytics'} onClick={() => setActiveView('Analytics')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">System</p>
            <div className="space-y-1">
              <NavItem icon={Settings} label="Settings" active={activeView === 'Settings'} onClick={() => setActiveView('Settings')} />
              <NavItem icon={FileText} label="Documentation" active={activeView === 'Documentation'} onClick={() => setActiveView('Documentation')} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 overflow-x-hidden flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-400">AI Workforce Optimization</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold">Manager Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Brain className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">{userData?.name || 'Manager'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{userData?.role || 'Manager'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-300">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-grow p-8 bg-[#F8FAFC]">
          {activeView === 'Dashboard' && <DashboardOverview />}
          {activeView === 'Employees' && <EmployeesView />}
          {activeView === 'Fitment' && <FitmentAnalysisView />}
          {activeView === 'Softskills' && <SoftskillsView />}
          {activeView === 'Intelligence' && <WorkforceIntelligenceView />}
          {activeView === 'Gap' && <GapAnalysisView />}
          {activeView === 'Settings' && <SettingsView />}
          {/* Fallback for views not yet fully implemented */}
          {!['Dashboard', 'Employees', 'Fitment', 'Softskills', 'Intelligence', 'Gap', 'Settings'].includes(activeView) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
              <h2 className="text-xl font-bold">{activeView} View</h2>
              <p>This section is currently being optimized.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
    active ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
  }`}>
    <Icon className={`w-4 h-4 ${active ? 'text-light-blue' : 'group-hover:text-light-blue'}`} />
    <span className="text-sm">{label}</span>
  </button>
);

// --- View Components ---

const DashboardOverview = () => (
  <div className="space-y-8">
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Workforce Intelligence</h2>
          <p className="text-sm text-slate-500">Real-time holistic monitoring across the organization</p>
        </div>
      </div>
      <WorkforceIntelligence />
    </section>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-500" /> Soft Skills Analysis
        </h3>
        <SoftSkillsRadar />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Battery className="w-4 h-4 text-red-500" /> Fatigue Analysis
        </h3>
        <FatigueAnalysis />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Target className="w-4 h-4 text-orange-500" /> Gap Analysis
        </h3>
        <GapAnalysis />
      </div>
    </div>
  </div>
);

const EmployeesView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Employees</h1>
        <p className="text-slate-500">Monitor and manage workforce performance and wellbeing</p>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" /> Export
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">AI Workforce Insights</h3>
          <p className="text-slate-600">7 potential skill misalignments detected</p>
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all">
        View Recommendations <ChevronRight className="w-4 h-4" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard icon={Users} label="Total Employees" value="7" trend="+8%" trendColor="text-emerald-500" />
      <StatCard icon={Target} label="Avg Fitment Score" value="0%" trend="+12%" trendColor="text-emerald-500" />
      <StatCard icon={Battery} label="Burnout Risk" value="0%" trend="-5%" trendColor="text-red-500" />
      <StatCard icon={Zap} label="Automation Savings" value="$0.0M" trend="+15%" trendColor="text-emerald-500" />
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Workforce Overview</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search employees..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Fitment</th>
              <th className="px-6 py-4">Productivity</th>
              <th className="px-6 py-4">Utilization %</th>
              <th className="px-6 py-4">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Jane Doe', role: 'Software Engineer', dept: 'Engineering', fit: '0%', prod: '0%', util: '0%', risk: 'low' },
              { name: 'Jane Doe', role: 'Backend Dev', dept: 'Engineering', fit: '0%', prod: '0%', util: '0%', risk: 'low' },
            ].map((emp, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JD</div>
                    <span className="font-bold text-slate-900">{emp.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{emp.role}</td>
                <td className="px-6 py-4 text-sm">{emp.dept}</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">{emp.fit}</td>
                <td className="px-6 py-4">
                   <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full" style={{ width: emp.prod }}></div>
                   </div>
                </td>
                <td className="px-6 py-4 text-sm">{emp.util}</td>
                <td className="px-6 py-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, trendColor }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
    <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
      <span className={`text-[10px] font-bold ${trendColor}`}>{trend}</span>
    </div>
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900">{value}</p>
  </div>
);

const FitmentAnalysisView = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">Workforce Fitment Intelligence</h1>
      <p className="text-slate-500">Enterprise-grade workforce optimization insights driven by AI Analysis</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <InsightCard label="Workforce Fitment" value="50.0%" sub="Fit + Overfit Combined" trend="+2.1%" />
      <InsightCard label="Misaligned Workforce" value="2" sub="Unfit + Train-to-Fit" trend="-1.3%" />
      <InsightCard label="At-Risk FTE" value="2" sub="Employees Misaligned" trend="-8" />
      <InsightCard label="Cost at Risk" value="$0.2M" sub="Annual Salary @ Risk" trend="-$0.5M" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <h3 className="text-xl font-bold text-slate-900 mr-auto">Employee Fitment Explorer</h3>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>All Departments</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>All Fitment Status</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search employees..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none" />
          </div>
        </div>
        <FitmentAnalysisTable />
      </div>
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center min-h-[300px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Role Alignment Details</h3>
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm">Select an employee for drill-down analysis</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Fitment Distribution</h3>
           {/* Simplified Pie Chart placeholder */}
           <div className="aspect-square rounded-full border-[16px] border-slate-100 relative">
             <div className="absolute inset-0 rounded-full border-[16px] border-orange-400 border-t-transparent border-l-transparent rotate-45"></div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const InsightCard = ({ label, value, sub, trend }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
    <div className="absolute top-4 right-4 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">{trend}</div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
    <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
  </div>
);

const SoftskillsView = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">Soft Skills Intelligence</h1>
      <p className="text-slate-500">Behavioral assessment and cognitive performance analytics</p>
    </div>

    <div className="bg-[#1E293B] rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
         <Brain className="w-full h-full" />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Mayamaya Cognitive Engine</span>
      </div>
      <h2 className="text-3xl font-bold mb-4">Workforce Core Capabilities</h2>
      <p className="text-slate-300 max-w-2xl mb-6">
        Organizational empathy and communication scores are <span className="text-blue-400 font-bold">8.4% above benchmark</span>. 
        However, stress resilience is trending down in Finance & IT units.
      </p>
      <div className="flex gap-6">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Strong Cultural Alignment</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          <span>Resilience Warning</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Behavioral Assessment Overview</h3>
          <p className="text-sm text-slate-500">Granular soft-skill breakdown across workforce</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search assets..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Comm.</th>
              <th className="px-6 py-4">Leadership</th>
              <th className="px-6 py-4">Resilience</th>
              <th className="px-6 py-4">Adaptability</th>
              <th className="px-6 py-4">Alignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Robert Taylor', role: 'DevOps Engineer', comm: '94%', lead: 'Expert', res: '8%', adapt: '92.5%', align: '94%' },
              { name: 'Priya Sharma', role: 'Team Lead', comm: '92%', lead: 'Expert', res: '72%', adapt: '90%', align: '89%' },
              { name: 'Ramesh Kumar', role: 'Senior Analyst', comm: '78%', lead: 'Proficient', res: '55%', adapt: '80%', align: '68%' },
              { name: 'James Wilson', role: 'Data Analyst', comm: '68%', lead: 'Developing', res: '65%', adapt: '65%', align: '64%' },
            ].map((asset, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">{asset.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{asset.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{asset.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: asset.comm }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{asset.comm} Proficiency</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    asset.lead === 'Expert' ? 'bg-blue-50 text-blue-600' : 
                    asset.lead === 'Proficient' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>{asset.lead}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${parseInt(asset.res) < 20 ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <span className="text-[10px] font-bold text-slate-600">{asset.res} Sustainability</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{asset.adapt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-blue-600 font-bold text-sm group cursor-pointer">
                    {asset.align} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const WorkforceIntelligenceView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Suggested Questions</h3>
        <p className="text-sm text-slate-500 mb-8">Click to ask about workforce intelligence</p>
        <div className="space-y-3">
          {[
            "Who is at burnout risk?",
            "Who should be reskilled?",
            "Who is underutilized?",
            "Show me high-risk employees",
            "Who are our top performers?",
            "Tell me about Sarah Johnson"
          ].map((q, i) => (
            <button key={i} className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all">
              {q}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Workforce Intelligence Chat</h3>
              <p className="text-xs text-slate-500">Ask questions about your team and get AI-powered insights</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100">Clear Chat</button>
        </div>
        
        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Workforce Assistant Ready</h3>
          <p className="text-slate-500 max-w-md">Ask me anything about your workforce intelligence, employee performance, or optimization opportunities.</p>
        </div>

        <div className="p-6 border-t border-slate-100">
           <div className="relative">
             <input type="text" placeholder="Ask about workforce intelligence, employee performance, or optimization opportunities..." className="w-full pl-6 pr-24 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
             <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all">
               <Zap className="w-4 h-4 fill-white" /> Send
             </button>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const GapAnalysisView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Gap Analysis</h1>
        <p className="text-slate-500">Skill, performance & development gaps across 4 employees</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
        <Download className="w-4 h-4" /> Export Report
      </button>
    </div>

    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input type="text" placeholder="Search employee or role..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none shadow-sm" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Gap Count by Employee (Top 10)</h3>
        <div className="h-64 flex items-end gap-8 px-4">
          <div className="flex-grow flex flex-col items-center gap-2">
            <div className="w-full bg-blue-600 rounded-t-lg h-full"></div>
            <span className="text-xs font-bold text-slate-500">Ramesh</span>
          </div>
          <div className="flex-grow flex flex-col items-center gap-2">
            <div className="w-full bg-blue-600 rounded-t-lg h-full"></div>
            <span className="text-xs font-bold text-slate-500">James</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Gap Severity Distribution</h3>
        <div className="aspect-square max-w-[240px] mx-auto rounded-full border-[32px] border-orange-400 border-t-transparent relative">
        </div>
      </div>
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-900">Employee Gap Overview</h3>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          <tr>
            <th className="px-8 py-4">Employee</th>
            <th className="px-8 py-4">Primary Gap</th>
            <th className="px-8 py-4">Severity</th>
            <th className="px-8 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
           {[
             { name: 'Ramesh Kumar', gap: 'Cloud Architecture', sev: 'High', status: 'In Training' },
             { name: 'James Wilson', gap: 'Data Visualization', sev: 'Medium', status: 'Planned' }
           ].map((gap, i) => (
             <tr key={i}>
               <td className="px-8 py-6 font-bold text-slate-900">{gap.name}</td>
               <td className="px-8 py-6 text-sm">{gap.gap}</td>
               <td className="px-8 py-6">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${gap.sev === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>{gap.sev}</span>
               </td>
               <td className="px-8 py-6 text-sm text-slate-500">{gap.status}</td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-100 rounded-2xl">
          <Settings className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Governance Hub</span>
            <h1 className="text-3xl font-black text-slate-900">System Configuration</h1>
          </div>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Enterprise Architecture & Logic Mapping</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-600/20">Organization Map</button>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">Workforce Allotment</button>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">Data Processing</button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-[#0F172A] rounded-3xl p-8 text-white">
        <h3 className="text-xl font-bold mb-8">Global Hierarchy Health</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Operational Units</span>
            <span className="text-2xl font-bold">4</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Active Teams</span>
            <span className="text-2xl font-bold">6</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Mapping Integrity</span>
            <span className="text-2xl font-bold text-emerald-400">98%</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeptCard name="Engineering" code="DEPT-ENGI" fte="1.1" fit="94.0" util="98.0" nodes="0" />
        <DeptCard name="IT" code="DEPT-IT" fte="1.0" fit="89.0" util="88.0" nodes="3" tags={['Development', 'Infrastructure', 'Security']} />
        <DeptCard name="Finance" code="DEPT-FINA" fte="1.0" fit="68.0" util="85.0" nodes="3" />
        <DeptCard name="Analytics" code="DEPT-ANAL" fte="0.9" fit="64.0" util="52.0" nodes="0" />
      </div>
    </div>

    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 max-w-md">
      <h3 className="text-xl font-bold text-slate-900 mb-6">New Strategic Unit</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Department Name</label>
          <input type="text" placeholder="Enter department name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" />
        </div>
        <button className="w-full py-4 bg-slate-400 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Initialize Unit</button>
      </div>
    </div>
  </div>
);

const DeptCard = ({ name, code, fte, fit, util, nodes, tags }: any) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-6">
      <h4 className="text-lg font-bold text-slate-900">{name}</h4>
      <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">{code}</span>
    </div>
    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">FTE Count</p>
        <p className="text-xl font-bold text-slate-900">{fte}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Fitment %</p>
        <p className="text-xl font-bold text-slate-900">{fit}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Utilization %</p>
        <p className="text-xl font-bold text-slate-900">{util}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Nodes</p>
        <p className="text-xl font-bold text-slate-900">{nodes}</p>
      </div>
    </div>
    <div className="mt-6 pt-6 border-t border-slate-100">
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Active Team Nodes</p>
       <div className="flex flex-wrap gap-2">
         {tags ? tags.map((t: string, i: number) => (
           <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">{t}</span>
         )) : (
           <span className="text-[10px] font-bold text-slate-300 italic">No logical teams mapped</span>
         )}
       </div>
    </div>
  </div>
);
