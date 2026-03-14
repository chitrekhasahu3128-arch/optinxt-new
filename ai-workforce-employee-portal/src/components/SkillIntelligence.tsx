import React from 'react';
import { 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Award,
  Zap,
  BookOpen,
  Users,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';
import { Employee } from '../types';

const SkillBar = ({ label, value, benchmark }: { label: string, value: number, benchmark: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="text-right">
        <span className="text-xs font-bold text-slate-400 block">Industry Avg: {benchmark}%</span>
      </div>
    </div>
    <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
      {/* Industry Benchmark Marker */}
      <div 
        className="absolute top-0 w-1 h-full bg-slate-300 z-20"
        style={{ left: `${benchmark}%` }}
      />
      {/* Employee Progress */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
        className="absolute h-full bg-brand-muted rounded-full z-10"
      />
    </div>
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Score</span>
      <span className="text-sm font-black text-slate-900">{value}%</span>
    </div>
  </div>
);

const GapItem = ({ label, value, target }: { label: string, value: number, target: number }) => {
  const gap = target - value;
  const isPositive = gap <= 0;
  
  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          {isPositive ? <ShieldCheck size={20} /> : <Target size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{label}</h4>
          <p className="text-xs text-slate-400 font-medium">Target: {target}%</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-lg font-black text-slate-900">{value}%</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isPositive ? `+${Math.abs(gap)}%` : `-${gap}%`}
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          {isPositive ? 'Above Target' : 'Gap to Target'}
        </p>
      </div>
    </div>
  );
};

const RecommendationCard = ({ title, type, actionLabel }: { title: string, type: string, actionLabel: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-brand-muted transition-colors group">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-brand-muted group-hover:bg-brand-muted group-hover:text-white transition-colors">
        {type === 'Training' ? <BookOpen size={24} /> : type === 'Course' ? <Award size={24} /> : <Zap size={24} />}
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">{type}</span>
    </div>
    <h4 className="text-base font-bold text-slate-900 mb-2 leading-tight">{title}</h4>
    <p className="text-xs text-slate-500 font-medium mb-6">Personalized recommendation based on your current skill gaps and career goals.</p>
    <button className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-brand-muted transition-all flex items-center justify-center space-x-2">
      <span>{actionLabel}</span>
      <ChevronRight size={14} />
    </button>
  </div>
);

import { db, collection, query, where, orderBy, limit, onSnapshot } from '../firebase';

const SkillIntelligence = ({ employee }: { employee: Employee | null }) => {
  const [recommendations, setRecommendations] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!employee) return;

    const recQuery = query(
      collection(db, 'recommendations'),
      where('userId', '==', employee.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(recQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecommendations(data);
    });

    return () => unsubscribe();
  }, [employee]);

  if (!employee) return null;

  const benchmarks: any = {
    communication: { industry: 78, target: 85 },
    leadership: { industry: 75, target: 80 },
    adaptability: { industry: 80, target: 88 },
    collaboration: { industry: 82, target: 90 },
    innovation: { industry: 72, target: 82 }
  };

  const skills = [
    { name: 'communication', label: 'Communication' },
    { name: 'leadership', label: 'Leadership' },
    { name: 'adaptability', label: 'Adaptability' },
    { name: 'collaboration', label: 'Collaboration' },
    { name: 'innovation', label: 'Innovation' }
  ];

  const skillEntries = skills.map(s => ({
    ...s,
    score: (employee.skills as any)?.[s.name] || 0,
    industry: benchmarks[s.name].industry,
    target: benchmarks[s.name].target
  }));

  // Calculate Strength and Growth
  const sortedByGap = [...skillEntries].sort((a, b) => (b.target - b.score) - (a.target - a.score));
  const growthArea = sortedByGap[0];
  const strengthArea = [...skillEntries].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Skill Intelligence</h1>
          <p className="text-slate-500 font-medium mt-1">Comprehensive analysis of your behavioral skill architecture.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-3">
            <div className="p-2 bg-brand-muted/10 text-brand-muted rounded-xl">
              <BrainCircuit size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Confidence</p>
              <p className="text-sm font-black text-slate-900">94% Accurate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* SECTION 1 — Skill Score Overview */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Skill Score Overview</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-muted rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">You</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Industry</span>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {skillEntries.map(s => (
              <SkillBar key={s.name} label={s.label} value={s.score} benchmark={s.industry} />
            ))}
          </div>
        </div>

        {/* SECTION 2 — Skill Gap Analysis */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Skill Gap Analysis</h3>
            <p className="text-xs font-bold text-brand-muted hover:underline cursor-pointer">View Detailed Report</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {skillEntries.map(s => (
              <GapItem key={s.name} label={s.label} value={s.score} target={s.target} />
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 — Strength vs Growth Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-brand-muted to-brand-dark p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Award size={140} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-6">
              <TrendingUp size={28} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Top Strength</p>
            <h4 className="text-3xl font-black mb-4">{strengthArea.label}</h4>
            <p className="text-sm font-medium opacity-80 leading-relaxed max-w-xs">
              You are performing significantly above the industry average in {strengthArea.label.toLowerCase()}. This is a key differentiator for your profile.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold">
                Score: {strengthArea.score}%
              </div>
              <div className="px-4 py-2 bg-emerald-400/20 text-emerald-300 rounded-xl text-xs font-bold">
                +{(strengthArea.score - strengthArea.industry)}% vs Industry
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Compass size={140} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-6">
              <Lightbulb size={28} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Growth Area</p>
            <h4 className="text-3xl font-black text-slate-900 mb-4">{growthArea.label}</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
              Your {growthArea.label.toLowerCase()} score has the highest potential for impact. Closing this gap will accelerate your promotion readiness.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                Score: {growthArea.score}%
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold">
                -{growthArea.target - growthArea.score}% to Target
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 — AI Development Plan */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Development Plan</h3>
            <p className="text-slate-500 font-medium mt-1">Recommended actions to bridge your current skill gaps.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
            <Users size={24} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <RecommendationCard 
                key={rec.id}
                title={rec.title} 
                type={rec.category === 'training' ? 'Training' : rec.category === 'skill' ? 'Skill' : 'Career'} 
                actionLabel={rec.category === 'training' ? 'Start Training' : 'View Details'} 
              />
            ))
          ) : (
            <div className="col-span-3 bg-slate-50 rounded-3xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-slate-500 font-bold">No development plans generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillIntelligence;
