import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Database, 
  BarChart3, 
  Cpu, 
  Zap, 
  LineChart, 
  LayoutGrid, 
  ShieldCheck, 
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Globe,
  LogOut
} from 'lucide-react';
import { Logo } from './components/Logo';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { Verification } from './components/Auth/Verification';
import { ManagerDashboard } from './components/Dashboard/ManagerDashboard';
import { EmployeeDashboard } from './components/Dashboard/EmployeeDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FeatureCard = ({ title, features, icon: Icon, delay = 0 }: { title: string, features: string[], icon: any, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-8 flex flex-col h-full hover:bg-white/10 transition-colors duration-300"
  >
    <div className="w-12 h-12 rounded-lg bg-light-blue/20 flex items-center justify-center mb-6">
      <Icon className="text-light-blue w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <ul className="space-y-3 flex-grow">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-opti-orange shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const LandingPage = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter">
              <span className="text-white">Opti</span>
              <span className="text-gradient-orange">NXt</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-light-blue transition-colors">Platform</a>
            <a href="#outcomes" className="hover:text-light-blue transition-colors">Outcomes</a>
            <Link to="/login" className="bg-light-blue hover:bg-light-blue/90 text-navy-900 px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-light-blue/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-opti-orange/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <Logo />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight mb-8"
            >
              Transforming Global Capability Centres with <span className="text-light-blue">AI Intelligence</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
            >
              The specialist partner for global enterprises to set up, scale, and transform GBS and GCCs through data-driven workforce optimization.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/signup" className="bg-gradient-to-r from-opti-orange to-opti-red text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(247,147,30,0.4)] transition-all">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Explore Platform
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-navy-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.3em] text-opti-orange font-bold mb-4">Capability Framework</h2>
            <p className="text-3xl md:text-4xl font-bold text-white">Comprehensive AI Workforce Optimization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Data Ingestion & Integration"
              icon={Database}
              features={[
                "ERP & HRMS Connectors (SAP, Workday)",
                "API Integration with PeopleStrat",
                "Automated JD/CV & Worklog Ingestion",
                "AI-driven Activity Normalization"
              ]}
              delay={0.1}
            />
            <FeatureCard 
              title="Workforce Productivity Analytics"
              icon={BarChart3}
              features={[
                "Activity-level Time Analytics",
                "Automated Task Tagging by Tower",
                "Heatmap of Workforce Utilization",
                "Manual Effort & Duplication Detection"
              ]}
              delay={0.2}
            />
            <FeatureCard 
              title="Capability & Role Fitment"
              icon={Cpu}
              features={[
                "AI-based Fitment Scoring",
                "Predictive Role Recommendation",
                "NLP-driven JD/CV Semantic Analysis",
                "Automated Skill Gap Identification"
              ]}
              delay={0.3}
            />
            <FeatureCard 
              title="Optimization Intelligence"
              icon={Zap}
              features={[
                "Process-wise FTE Optimization",
                "Automation Opportunity Identification",
                "Process Maturity Correlation",
                "Scenario Simulation Engine"
              ]}
              delay={0.4}
            />
            <FeatureCard 
              title="Benchmarking & Insights"
              icon={LineChart}
              features={[
                "Global Industry Benchmarks",
                "Role-level Productivity Metrics",
                "Custom KPI Dashboarding",
                "Narrative AI Executive Summaries"
              ]}
              delay={0.1}
            />
            <FeatureCard 
              title="Org Design & Future Structure"
              icon={LayoutGrid}
              features={[
                "AI-driven To-Be Org Design",
                "Redundant Role Rationalization",
                "Automated Transition Planning",
                "Capability Distribution Heatmaps"
              ]}
              delay={0.2}
            />
            <FeatureCard 
              title="Learning & Governance"
              icon={ShieldCheck}
              features={[
                "Continuous AI Learning Loop",
                "Explainable AI Audit Trails",
                "GDPR-compliant Data Handling",
                "Role-based Access Controls"
              ]}
              delay={0.3}
            />
            <FeatureCard 
              title="Experience & Collaboration"
              icon={Users}
              features={[
                "Configurable Role-based Dashboards",
                "Collaborative Approval Workflows",
                "Action Tracking for Reskilling",
                "Conversational AI Insights Layer"
              ]}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section id="outcomes" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-light-blue/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Strategic End Outcomes</h2>
                <div className="space-y-6">
                  {[
                    "360° visibility into workforce capability and utilization",
                    "Clear 'As-Is' vs. 'To-Be' org structure and role alignment",
                    "Quantified FTE optimization potential (with/without automation)",
                    "Skill gap mapping and upskilling roadmap",
                    "Predictive readiness for future operating models"
                  ].map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-opti-orange/20 flex items-center justify-center group-hover:bg-opti-orange transition-colors">
                        <ChevronRight className="w-4 h-4 text-opti-orange group-hover:text-white" />
                      </div>
                      <span className="text-lg text-slate-300">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-full border-2 border-dashed border-white/10 flex items-center justify-center animate-[spin_60s_linear_infinite]">
                  <div className="w-4/5 h-4/5 rounded-full border border-light-blue/20 flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                    <div className="w-3/5 h-3/5 rounded-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center shadow-2xl">
                      <Globe className="w-16 h-16 text-light-blue opacity-50" />
                    </div>
                  </div>
                </div>
                {/* Floating stats */}
                <div className="absolute top-0 left-0 glass-card px-6 py-4 animate-bounce" style={{ animationDuration: '4s' }}>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Productivity</p>
                  <p className="text-2xl font-bold text-white">+24%</p>
                </div>
                <div className="absolute bottom-10 right-0 glass-card px-6 py-4 animate-bounce" style={{ animationDuration: '5s' }}>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">FTE Optimized</p>
                  <p className="text-2xl font-bold text-white">15-20%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Optimize Your Global Workforce?</h2>
          <p className="text-xl text-slate-400 mb-10">Join leading enterprises in transforming their GCCs with AI-driven intelligence.</p>
          <button className="bg-white text-navy-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-light-blue hover:text-white transition-all">
            Schedule a Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter">
                <span className="text-white">Opti</span>
                <span className="text-gradient-orange">NXt</span>
              </span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-sm text-slate-500">
              © {currentYear} OptiNXt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-light-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verification />} />
          <Route 
            path="/employee-dashboard" 
            element={user ? <EmployeeDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/manager-dashboard" 
            element={user ? <ManagerDashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
