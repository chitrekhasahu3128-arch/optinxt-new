import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  Award, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Employee, WorkloadAssessment } from '../types';
import { db, collection, query, where, orderBy, limit, onSnapshot, handleFirestoreError, OperationType } from '../firebase';

const StatCard = ({ title, value, icon: Icon, color, description, subtitle, action, isEmpty }: any) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        {!isEmpty && (
          <div className={`w-2.5 h-2.5 rounded-full ${
            value.includes('High') || (parseInt(value) < 50 && value.includes('%')) ? 'bg-red-500 animate-pulse' : 
            value.includes('Moderate') || (parseInt(value) < 75 && value.includes('%')) ? 'bg-amber-500' : 
            'bg-emerald-500'
          }`} />
        )}
      </div>
      <h3 className="text-slate-400 text-[10px] font-black mb-1.5 uppercase tracking-[0.2em]">{title}</h3>
      
      {isEmpty ? (
        <div className="flex-1 flex flex-col justify-center py-4">
          <p className="text-sm text-slate-400 font-semibold mb-6 leading-relaxed">{description}</p>
          {action}
        </div>
      ) : (
        <>
          <div className="flex items-baseline space-x-2 mb-3">
            <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
            {subtitle && <span className="text-xs text-slate-400 font-bold tracking-tight">{subtitle}</span>}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-auto">{description}</p>
        </>
      )}
    </div>
  );
};

const SkillProgressBar = ({ label, value, target, type, colorClass }: { label: string, value: number, target: number, type: 'strength' | 'gap', colorClass: string }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end">
      <div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1.5">{label}</span>
        <span className="text-xl font-black text-slate-900 tracking-tight">Proficiency: {value}%</span>
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">{type === 'strength' ? 'Team Avg' : 'Target'}</span>
        <span className="text-sm font-bold text-slate-500">{target}%</span>
      </div>
    </div>
    <div className="relative pt-2">
      <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${colorClass} rounded-full shadow-inner`}
        />
      </div>
      {/* Benchmark Indicator */}
      <div 
        className="absolute top-0 w-1 h-8 bg-slate-200 z-10 rounded-full"
        style={{ left: `${target}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-white border-2 border-slate-300 shadow-sm" />
      </div>
    </div>
  </div>
);

const RecommendationCard = ({ title, description, icon: Icon, color, actionLabel, onAction }: any) => {
  // Extract color name from bg class
  const colorName = color.replace('bg-', '');

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full hover:border-brand-light transition-colors">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 rounded-xl bg-${colorName}/10 text-${colorName} shrink-0`}>
          <Icon size={20} />
        </div>
        <h4 className="text-sm font-bold text-slate-900 leading-tight">{title}</h4>
      </div>
      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1">{description}</p>
      <button 
        onClick={onAction}
        className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-brand-muted hover:text-white transition-all duration-200 border border-slate-100"
      >
        {actionLabel}
      </button>
    </div>
  );
};

const Dashboard = ({ employee }: { employee: Employee | null }) => {
  const [recentAssessments, setRecentAssessments] = useState<WorkloadAssessment[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee) return;

    // Fetch Workload Data
    const workloadQuery = query(
      collection(db, 'workload'),
      where('userId', '==', employee.uid)
    );

    const unsubscribeWorkload = onSnapshot(workloadQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkloadAssessment));
      
      // Sort client-side
      data.sort((a, b) => {
        const timeA = (a.timestamp as any)?.seconds || 0;
        const timeB = (b.timestamp as any)?.seconds || 0;
        return timeB - timeA;
      });

      setRecentAssessments(data.slice(0, 7));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'workload'));

    // Fetch Recommendations
    const recQuery = query(
      collection(db, 'recommendations'),
      where('userId', '==', employee.uid)
    );

    const unsubscribeRecs = onSnapshot(recQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort client-side
      data.sort((a, b) => {
        const timeA = (a as any).createdAt?.seconds || 0;
        const timeB = (b as any).createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setRecommendations(data.slice(0, 3));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'recommendations'));

    return () => {
      unsubscribeWorkload();
      unsubscribeRecs();
    };
  }, [employee]);

  const latestFatigue = recentAssessments[0]?.fatigueScore || 0;
  const latestLevel = recentAssessments[0]?.fatigueLevel || 'N/A';

  // Calculate Top Strength and Biggest Gap
  const skills = employee?.skills ? Object.entries(employee.skills) : [];
  const sortedSkills = [...skills].sort((a, b) => b[1] - a[1]);
  const topStrength = sortedSkills[0] || ['N/A', 0];
  
  const benchmarks: any = {
    communication: 78,
    leadership: 75,
    adaptability: 80,
    collaboration: 82,
    innovation: 72
  };
  
  const gaps = skills.map(([name, score]) => ({
    name,
    score,
    gap: (benchmarks[name] || 80) - score
  })).sort((a, b) => b.gap - a.gap);
  
  const biggestGap = gaps[0] || { name: 'N/A', score: 0, gap: 0 };

  // Prepare chart data
  const chartData = [...recentAssessments].reverse().map(a => {
    const total = a.actualHours || 0;
    const meetings = a.hoursMeetings || 0;
    return {
      name: a.timestamp ? new Date(a.timestamp.seconds * 1000).toLocaleDateString(undefined, { weekday: 'short' }) : '',
      'Focus Work': Math.max(0, total - meetings),
      'Meetings': meetings,
      'Overtime': (a.overtimeHours || 0) > 0 ? 2 : 0
    };
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance and workload intelligence.</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 flex items-center shadow-sm">
          <Clock size={18} className="mr-2 text-brand-muted" />
          {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Top Section: 4 Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Fitment Score" 
          value={`${employee?.fitmentScore}%`} 
          icon={Target} 
          color="bg-brand-muted" 
          description="How well your skills match your current role requirements."
        />
        <StatCard 
          title="Utilization Rate" 
          value={`${Math.round((employee?.utilizationRate || 0) * 100)}%`} 
          icon={Zap} 
          color="bg-brand-sky" 
          description="Percentage of monthly work capacity currently used."
        />
        <StatCard 
          title="Fatigue Risk" 
          value={recentAssessments.length > 0 ? latestLevel : ''} 
          icon={AlertTriangle} 
          color={latestLevel === 'High Risk' ? 'bg-red-500' : latestLevel === 'Moderate Risk' ? 'bg-amber-500' : 'bg-brand-muted'} 
          description={recentAssessments.length > 0 ? "Calculated burnout risk based on recent workload." : "Complete workload assessment to calculate fatigue risk"}
          isEmpty={recentAssessments.length === 0}
          action={
            <Link 
              to="/workload-form" 
              className="bg-brand-muted text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-brand-dark transition-colors inline-block text-center"
            >
              Start Assessment
            </Link>
          }
        />
        <StatCard 
          title="Promotion Readiness" 
          value="82%" 
          icon={Award} 
          color="bg-brand-dark" 
          description="Probability of successful promotion to next level."
        />
      </div>

      {/* Second Section: Skill Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Top Strength</h3>
            <div className="p-2 bg-brand-light/20 text-brand-muted rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex-1">
            <SkillProgressBar 
              label={topStrength[0] as string} 
              value={topStrength[1] as number} 
              target={benchmarks[topStrength[0] as string] || 80}
              type="strength"
              colorClass="bg-brand-muted" 
            />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50">
            <Link to="/skill-intelligence" className="text-sm font-bold text-brand-muted flex items-center hover:underline">
              View Skill Intelligence <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Biggest Skill Gap</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Target size={20} />
            </div>
          </div>
          <div className="flex-1">
            <SkillProgressBar 
              label={biggestGap.name} 
              value={biggestGap.score} 
              target={benchmarks[biggestGap.name] || 80}
              type="gap"
              colorClass="bg-amber-500" 
            />
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50">
            <Link to="/skill-intelligence" className="text-sm font-bold text-brand-muted flex items-center hover:underline">
              View Skill Intelligence <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Third Section: Workload Health */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Workload Health</h3>
            <p className="text-sm text-slate-400 font-medium">Weekly breakdown of focus vs. collaborative time.</p>
          </div>
          {recentAssessments.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-muted rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">Focus Work</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-sky rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">Meetings</span>
              </div>
            </div>
          )}
        </div>
        
        {recentAssessments.length > 0 ? (
          <>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="Focus Work" stackId="a" fill="#6A89A7" radius={[0, 0, 0, 0]} barSize={40} />
                  <Bar dataKey="Meetings" stackId="a" fill="#88BDF2" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="p-2 bg-white rounded-xl text-brand-muted shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Focus Time</p>
                  <p className="text-lg font-black text-slate-900">5.2h / day</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="p-2 bg-white rounded-xl text-brand-sky shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meeting Load</p>
                  <p className="text-lg font-black text-slate-900">3.2h / day</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="p-2 bg-white rounded-xl text-red-500 shadow-sm">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overtime Risk</p>
                  <p className="text-lg font-black text-red-600">Low</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 text-slate-300">
              <Briefcase size={32} />
            </div>
            <p className="text-slate-500 font-bold mb-4">No workload data yet</p>
            <Link 
              to="/workload-form" 
              className="bg-brand-muted text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-brand-dark transition-colors"
            >
              Add Workload Data
            </Link>
          </div>
        )}
      </div>

      {/* Fourth Section: Career Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Career Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <RecommendationCard 
                key={rec.id}
                title={rec.title}
                description={rec.description}
                icon={rec.category === 'training' ? BookOpen : rec.category === 'skill' ? ArrowUpRight : Briefcase}
                color={rec.priority === 'high' ? 'bg-brand-dark' : rec.priority === 'medium' ? 'bg-brand-sky' : 'bg-brand-muted'}
                actionLabel={rec.category === 'training' ? 'Start Training' : 'View Details'}
                onAction={() => {}}
              />
            ))
          ) : (
            <div className="col-span-3 bg-slate-50 rounded-3xl p-8 text-center border border-dashed border-slate-200">
              <Sparkles size={32} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold">No recommendations generated yet</p>
              <p className="text-xs text-slate-400 mt-1">Complete more assessments to receive AI-driven career insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
