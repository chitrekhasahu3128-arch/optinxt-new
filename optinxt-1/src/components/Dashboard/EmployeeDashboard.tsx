import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Award, 
  BookOpen, 
  Clock, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Zap,
  Bell,
  Search,
  Settings,
  Brain,
  Target,
  Battery,
  CheckCircle2,
  Plus,
  Grid,
  FileText
} from 'lucide-react';
import { auth, db } from '../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type View = 'Overview' | 'Profile' | 'Skills' | 'Learning' | 'Worklogs' | 'Settings';

export const EmployeeDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Overview');
  const [userData, setUserData] = useState<{ name: string; role: string; department?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as { name: string; role: string; department?: string });
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
    : 'JD';

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
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Employee Portal</span>
          </div>
        </div>

        {/* User Profile in Sidebar */}
        <div className="px-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-sm truncate">{userData?.name || 'Employee'}</span>
              <span className="text-slate-500 text-xs truncate">{userData?.role || 'Employee'}</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-6 overflow-y-auto custom-scrollbar pb-8">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Main</p>
            <div className="space-y-1">
              <NavItem icon={Grid} label="Overview" active={activeView === 'Overview'} onClick={() => setActiveView('Overview')} />
              <NavItem icon={User} label="My Profile" active={activeView === 'Profile'} onClick={() => setActiveView('Profile')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Growth</p>
            <div className="space-y-1">
              <NavItem icon={Award} label="My Skills" active={activeView === 'Skills'} onClick={() => setActiveView('Skills')} />
              <NavItem icon={BookOpen} label="Learning" active={activeView === 'Learning'} onClick={() => setActiveView('Learning')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Activity</p>
            <div className="space-y-1">
              <NavItem icon={Clock} label="Worklogs" active={activeView === 'Worklogs'} onClick={() => setActiveView('Worklogs')} />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">System</p>
            <div className="space-y-1">
              <NavItem icon={Settings} label="Settings" active={activeView === 'Settings'} onClick={() => setActiveView('Settings')} />
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
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold">Employee Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">2</span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">{userData?.name || 'Employee'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{userData?.role || 'Employee'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-300">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-grow p-8 bg-[#F8FAFC]">
          {activeView === 'Overview' && (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Performance Overview</h1>
                <p className="text-slate-500">Welcome back, {userData?.name || 'Employee'}. Here's your current standing.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Fitment</p>
                      <p className="text-2xl font-black text-slate-900">28.4 / 40</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[71%]"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-wider">You are currently a <span className="text-emerald-500">Fit</span> for your role.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upskilling Progress</p>
                      <p className="text-2xl font-black text-slate-900">65%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full w-[65%]"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-wider">3 courses in progress</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skill Badges</p>
                      <p className="text-2xl font-black text-slate-900">12</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <Award className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-2 font-bold">+7 more</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Worklogs</h2>
                  <div className="space-y-4">
                    {[
                      { task: 'Process Optimization Analysis', time: '4h 20m', date: 'Today' },
                      { task: 'Stakeholder Meeting - Q1 Review', time: '1h 30m', date: 'Yesterday' },
                      { task: 'Data Ingestion Pipeline Setup', time: '6h 00m', date: '10 Mar' },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <Clock className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{log.task}</p>
                            <p className="text-xs text-slate-500">{log.date}</p>
                          </div>
                        </div>
                        <span className="text-sm font-mono text-blue-600 font-bold">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Recommended Learning</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Advanced AI in Operations', provider: 'Coursera', duration: '12h' },
                      { title: 'Strategic Stakeholder Mgmt', provider: 'LinkedIn Learning', duration: '4h' },
                      { title: 'Python for Data Engineering', provider: 'Udemy', duration: '24h' },
                    ].map((course, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:bg-blue-50 transition-colors shadow-sm">
                            <BookOpen className={`w-5 h-5 ${idx === 0 ? 'text-blue-600' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{course.title}</p>
                            <p className="text-xs text-slate-500">{course.provider}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeView !== 'Overview' && (
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
