import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  BrainCircuit, 
  Activity, 
  ClipboardList, 
  Sparkles, 
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, onAuthStateChanged, signInWithGoogle, logout, db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from './firebase';
import { Employee } from './types';

// Components
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SkillIntelligence from './components/SkillIntelligence';
import FatigueAnalysis from './components/FatigueAnalysis';
import WorkloadForm from './components/WorkloadForm';
import AICareerAssistant from './components/AICareerAssistant';
import Settings from './components/Settings';
import Logo from './components/Logo';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-brand-muted text-white shadow-lg shadow-brand-muted/25' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-brand-muted'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-brand-muted transition-colors'} />
    <span className="font-semibold tracking-tight">{label}</span>
  </Link>
);

const Layout = ({ children, user, employee }: any) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/skills', icon: BrainCircuit, label: 'Skill Intelligence' },
    { to: '/fatigue', icon: Activity, label: 'Fatigue Analysis' },
    { to: '/workload', icon: ClipboardList, label: 'Workload Assessment' },
    { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-100 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center mb-12 px-2">
            <Logo />
          </div>

          <nav className="flex-1 space-y-3">
            {navItems.map((item) => (
              <SidebarItem
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-50">
            <button
              onClick={logout}
              className="flex items-center space-x-4 px-5 py-3.5 w-full rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-tight">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 py-2.5 w-[400px] focus-within:ring-2 focus-within:ring-brand-muted/20 transition-all">
              <Search size={18} className="text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search analytics, skills, reports..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-brand-muted rounded-xl transition-all group">
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-4 pl-8 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 tracking-tight">{employee?.name || user?.displayName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{employee?.designation || 'Employee'}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-dark font-black text-lg border-2 border-white shadow-sm ring-1 ring-brand-muted/10">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6 scale-150">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">AI Workforce Optimization Platform</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-slate-200 py-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span className="font-semibold text-slate-700">Continue with Google</span>
        </button>

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Secure Enterprise Access</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const path = `users/${user.uid}`;
        try {
          // Fetch or create employee profile
          const docRef = doc(db, 'users', user.uid);
          let docSnap;
          try {
            docSnap = await getDoc(docRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, path);
          }
          
          if (docSnap && docSnap.exists()) {
            setEmployee(docSnap.data() as Employee);
          } else {
            const newEmployee: Employee = {
              uid: user.uid,
              name: user.displayName || 'New Employee',
              email: user.email || '',
              role: 'employee',
              createdAt: new Date().toISOString(),
              designation: 'Associate Consultant',
              department: 'Engineering',
              manager: 'Sarah Jenkins',
              location: 'San Francisco, CA',
              employmentType: 'Full-time',
              employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
              fitmentScore: 85,
              utilizationRate: 0.78,
              skills: {
                communication: 75,
                leadership: 60,
                adaptability: 85,
                collaboration: 90,
                innovation: 70
              },
              performanceSummary: 'Consistently delivers high-quality code and collaborates effectively with cross-functional teams.',
              careerTimeline: [
                { date: '2023-01-15', event: 'Joined as Junior Developer' },
                { date: '2024-02-01', event: 'Promoted to Associate Consultant' }
              ]
            };
            try {
              await setDoc(docRef, newEmployee);
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, path);
            }
            setEmployee(newEmployee);
          }
        } catch (error) {
          console.error("Error in employee profile lifecycle:", error);
        }
      } else {
        setEmployee(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-muted border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout user={user} employee={employee}>
        <Routes>
          <Route path="/" element={<Dashboard employee={employee} />} />
          <Route path="/profile" element={<Profile employee={employee} setEmployee={setEmployee} />} />
          <Route path="/skills" element={<SkillIntelligence employee={employee} />} />
          <Route path="/fatigue" element={<FatigueAnalysis employee={employee} />} />
          <Route path="/workload" element={<WorkloadForm employee={employee} />} />
          <Route path="/ai-assistant" element={<AICareerAssistant employee={employee} />} />
          <Route path="/settings" element={<Settings employee={employee} setEmployee={setEmployee} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
