import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  Clock, 
  Coffee, 
  Moon,
  TrendingDown,
  Info,
  BrainCircuit,
  ShieldAlert,
  BarChart3,
  LineChart as LineChartIcon,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { Employee, WorkloadAssessment } from '../types';
import { db, collection, query, where, orderBy, limit, onSnapshot } from '../firebase';

const FatigueAnalysis = ({ employee }: { employee: Employee | null }) => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<WorkloadAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee) return;

    const q = query(
      collection(db, 'workload'),
      where('userId', '==', employee.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Convert Firestore timestamp to date for chart
        formattedDate: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
      } as any));
      
      // Sort client-side to avoid index requirement
      data.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });

      setAssessments(data.slice(0, 10));
      setLoading(false);
    }, (error) => {
      console.error("Fatigue Analysis Fetch Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [employee]);

  if (!employee) return null;

  const latest = assessments[0];
  const hasData = assessments.length > 0;

  if (!hasData && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">No Fatigue Insights Yet</h2>
        <p className="text-slate-500 max-w-md mb-8 font-medium">
          Complete your first Workload Assessment to generate AI-driven fatigue insights and burnout risk analysis.
        </p>
        <button 
          onClick={() => navigate('/workload')}
          className="px-8 py-4 bg-brand-muted text-white rounded-2xl font-bold hover:bg-brand-dark transition-all flex items-center space-x-2 shadow-lg shadow-brand-muted/20"
        >
          <span>Start Workload Assessment</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const score = latest?.fatigueScore || 0;
  const level = latest?.fatigueLevel || 'N/A';

  const trendData = [...assessments].reverse().map(a => ({
    date: a.formattedDate,
    score: a.fatigueScore
  }));

  const totalHours = latest?.actualHours || 8;
  const meetingHours = latest?.hoursMeetings || 2;
  const focusHours = (latest?.actualHours || 8) - (latest?.hoursMeetings || 0) - (latest?.hoursTraining || 0);
  
  const focusPercent = Math.round((focusHours / totalHours) * 100);
  const meetingPercent = Math.round((meetingHours / totalHours) * 100);
  const overtimePercent = (latest?.overtimeHours || 0) > 0 ? 15 : 0;
  const switchingPercent = Math.max(0, 100 - focusPercent - meetingPercent - overtimePercent);

  const workloadData = [
    { name: 'Focus Work', value: focusPercent, color: '#6A89A7' },
    { name: 'Meetings', value: meetingPercent, color: '#88BDF2' },
    { name: 'Context Switching', value: switchingPercent, color: '#BDDDFC' },
    { name: 'Overtime', value: overtimePercent, color: '#ef4444' },
  ];

  const getLevelStyles = (lvl: string) => {
    switch (lvl) {
      case 'High Risk': return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: <AlertTriangle className="text-red-500" /> };
      case 'Moderate Risk': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertTriangle className="text-amber-500" /> };
      case 'Low Risk': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <ShieldAlert className="text-emerald-500" /> };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: <Activity className="text-slate-400" /> };
    }
  };

  const styles = getLevelStyles(level);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fatigue Risk Analysis</h1>
          <p className="text-slate-500 font-medium mt-1">AI-driven monitoring of cognitive load and burnout risk.</p>
        </div>
        <button 
          onClick={() => navigate('/workload')}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center space-x-2 shadow-sm"
        >
          <Activity size={18} className="text-brand-muted" />
          <span>New Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 1 — Fatigue Risk Summary */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Risk Summary</h3>
            <div className={`p-2 rounded-xl ${styles.bg}`}>
              {styles.icon}
            </div>
          </div>
          
          <div className="space-y-8 flex-1">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fatigue Risk Level</p>
              <div className={`inline-flex items-center px-4 py-2 rounded-2xl font-black text-lg ${styles.bg} ${styles.text} border ${styles.border}`}>
                {level}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cognitive Load Score</p>
                <span className="text-2xl font-black text-slate-900">{score}<span className="text-sm text-slate-300 font-bold">/100</span></span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${score > 70 ? 'bg-red-500' : score > 40 ? 'bg-amber-500' : 'bg-brand-muted'}`}
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center space-x-3 mb-2">
                <BrainCircuit size={18} className="text-brand-muted" />
                <p className="text-sm font-bold text-slate-900">Burnout Risk Indicator</p>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {score > 70 ? 'Critical risk detected. Immediate workload reduction required to prevent burnout.' : 
                 score > 40 ? 'Elevated risk. Monitor context switching and overtime frequency closely.' : 
                 'Low risk. Current workload is sustainable and optimized for performance.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Workload Breakdown */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Workload Breakdown</h3>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
              <BarChart3 size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              {workloadData.map(item => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-4">
                <Info size={20} className="text-brand-muted" />
                <h4 className="text-sm font-bold text-slate-900">Workload Insight</h4>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Your <span className="text-slate-900 font-bold">Focus Work</span> accounts for {focusPercent}% of your time, which is {focusPercent > 40 ? 'optimal' : 'below target'}. However, <span className={meetingPercent > 30 ? "text-red-500 font-bold" : "text-slate-900 font-bold"}>Meetings</span> are {meetingPercent > 30 ? 'trending higher than average' : 'within normal range'}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 3 — Fatigue Trend */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Fatigue Trend</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Tracking your cognitive load score over the last 7 assessments.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
              <LineChartIcon size={20} />
            </div>
          </div>

          {trendData.length === 1 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-3">
              <Info size={18} className="text-blue-500" />
              <p className="text-xs text-blue-700 font-medium">
                Submit more assessments to see your fatigue trend over time. Currently showing your first data point.
              </p>
            </div>
          )}

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6A89A7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6A89A7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  domain={[0, 100]}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value) => [`${value}/100`, 'Fatigue Score']}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6A89A7" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#6A89A7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 5 — Wellbeing Insights */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Wellbeing Insights</h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-brand-sky/10 text-brand-sky rounded-2xl">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Energy Peaks</p>
                  <p className="text-sm font-black text-slate-900">9 AM — 11 AM</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-brand-dark/10 text-brand-dark rounded-2xl">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimal Task Time</p>
                  <p className="text-sm font-black text-slate-900">Early Morning</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-brand-muted/10 text-brand-muted rounded-2xl">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sleep Impact</p>
                  <p className="text-sm font-black text-slate-900">Low Impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 — AI Risk Mitigation */}
      <div className="bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
              <TrendingDown size={24} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">AI Risk Mitigation Plan</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Priority: High</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-lg font-bold mb-2">Reduce Meeting Load</h4>
              <p className="text-sm opacity-60 leading-relaxed">Decrease meeting hours by 20% next week to lower cognitive strain.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Priority: Medium</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-lg font-bold mb-2">Deep Work Sessions</h4>
              <p className="text-sm opacity-60 leading-relaxed">Schedule 3-hour deep work blocks on Tuesday and Thursday mornings.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Priority: Low</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-lg font-bold mb-2">Cognitive Breaks</h4>
              <p className="text-sm opacity-60 leading-relaxed">Take 15-minute breaks after high-complexity tasks to reset focus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatigueAnalysis;
