import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  Building2, 
  Calendar, 
  IdCard,
  Edit2,
  Save,
  X,
  Target,
  Zap,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  RefreshCw,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'motion/react';
import { Employee, WorkloadAssessment } from '../types';
import { db, doc, setDoc, collection, query, where, orderBy, limit, onSnapshot } from '../firebase';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const StatCard = ({ title, value, icon: Icon, color, description, isEmpty }: any) => {
  const colorName = color.replace('bg-', '');
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-${colorName}/10 text-${colorName} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {!isEmpty && (
          <div className={`w-2 h-2 rounded-full ${
            value.includes('High') || (parseInt(value) < 50 && value.includes('%')) ? 'bg-red-500 animate-pulse' : 
            value.includes('Moderate') || (parseInt(value) < 75 && value.includes('%')) ? 'bg-amber-500' : 
            'bg-emerald-500'
          }`} />
        )}
      </div>
      <h3 className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-widest">{title}</h3>
      <div className="flex items-baseline space-x-2 mb-2">
        <p className="text-2xl font-black text-slate-900">{isEmpty ? 'N/A' : value}</p>
      </div>
      <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-auto">{description}</p>
    </div>
  );
};

const SkillBenchmark = ({ skill, value, teamAvg, promoBenchmark }: any) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-slate-700 capitalize">{skill}</span>
      <span className="text-sm font-black text-brand-muted">{value}%</span>
    </div>
    
    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
      {/* Employee Progress */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
        className="absolute h-full bg-brand-muted rounded-full z-10"
      />
      
      {/* Team Average Marker */}
      <div 
        className="absolute top-0 w-1 h-full bg-slate-400/50 z-20"
        style={{ left: `${teamAvg}%` }}
        title={`Team Avg: ${teamAvg}%`}
      />
      
      {/* Promotion Benchmark Marker */}
      <div 
        className="absolute top-0 w-1 h-full bg-emerald-400 z-30"
        style={{ left: `${promoBenchmark}%` }}
        title={`Promotion Benchmark: ${promoBenchmark}%`}
      />
    </div>
    
    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
      <span>Team Avg: {teamAvg}%</span>
      <span className="text-emerald-500">Promo: {promoBenchmark}%</span>
    </div>
  </div>
);

const ProfileField = ({ icon: Icon, label, value, editing, onChange, name }: any) => (
  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-b border-brand-muted outline-none text-slate-900 font-bold text-sm py-0.5"
        />
      ) : (
        <p className="text-slate-900 font-bold text-sm">{value || 'Not specified'}</p>
      )}
    </div>
  </div>
);

const Profile = ({ employee, setEmployee }: { employee: Employee | null, setEmployee: any }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>(employee || {});
  const [recentAssessments, setRecentAssessments] = useState<WorkloadAssessment[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [generatingInsight, setGeneratingInsight] = useState(false);

  useEffect(() => {
    if (!employee) return;

    const q = query(
      collection(db, 'workloadAssessments'),
      where('employeeUid', '==', employee.uid),
      orderBy('date', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkloadAssessment));
      setRecentAssessments(data);
    });

    return () => unsubscribe();
  }, [employee]);

  useEffect(() => {
    if (employee && !aiInsight) {
      generateAiInsight();
    }
  }, [employee]);

  const generateAiInsight = async () => {
    if (!employee?.skills) return;
    setGeneratingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following employee skills and provide a concise, professional performance insight (max 3 sentences). 
        Skills: ${JSON.stringify(employee.skills)}. 
        Employee Name: ${employee.name}. 
        Role: ${employee.designation}.`,
        config: {
          systemInstruction: "You are an expert HR AI analyst. Provide actionable, data-driven insights.",
        }
      });
      const response = await model;
      setAiInsight(response.text || 'Unable to generate insight at this time.');
    } catch (error) {
      console.error("Error generating AI insight:", error);
      setAiInsight('Error generating AI insight. Please try again later.');
    } finally {
      setGeneratingInsight(false);
    }
  };

  if (!employee) return null;

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', employee.uid);
      await setDoc(docRef, formData);
      setEmployee(formData);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const latestLevel = recentAssessments[0]?.fatigueLevel || 'N/A';

  const benchmarks: any = {
    communication: { avg: 72, promo: 85 },
    leadership: { avg: 65, promo: 80 },
    adaptability: { avg: 78, promo: 88 },
    collaboration: { avg: 80, promo: 90 },
    innovation: { avg: 68, promo: 82 }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Action Buttons Header */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {!editing ? (
          <button 
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center space-x-2"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-brand-muted text-white text-sm font-bold hover:bg-brand-dark transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
        <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center space-x-2">
          <RefreshCw size={16} />
          <span>Update Skills</span>
        </button>
        <button className="px-4 py-2 rounded-xl bg-brand-muted text-white text-sm font-bold hover:bg-brand-dark transition-colors flex items-center space-x-2 shadow-sm">
          <Zap size={16} />
          <span>Start Assessment</span>
        </button>
        <button className="px-4 py-2 rounded-xl bg-brand-dark text-white text-sm font-bold hover:bg-slate-800 transition-colors flex items-center space-x-2 shadow-sm">
          <Award size={16} />
          <span>View Career Report</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="h-56 bg-gradient-to-br from-brand-muted via-brand-sky to-brand-light relative">
          <div className="absolute -bottom-16 left-12 flex items-end space-x-8">
            <div className="w-40 h-40 rounded-[2rem] bg-white p-2.5 shadow-2xl">
              <div className="w-full h-full rounded-[1.5rem] bg-brand-light flex items-center justify-center text-brand-dark text-5xl font-black border border-brand-muted/20">
                {employee.name.charAt(0)}
              </div>
            </div>
            <div className="mb-6 pb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{employee.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="px-3 py-1 bg-brand-muted/10 text-brand-muted rounded-full text-xs font-bold uppercase tracking-wider">{employee.designation}</span>
                <span className="text-slate-400 font-bold text-sm">•</span>
                <span className="text-slate-500 font-bold text-sm">{employee.department}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-8 right-8">
            {/* Quick Edit removed in favor of top actions */}
          </div>
        </div>

        <div className="pt-28 pb-12 px-12">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              title="Fitment Score" 
              value={`${employee.fitmentScore}%`} 
              icon={Target} 
              color="bg-brand-muted" 
              description="Skill alignment with current role."
            />
            <StatCard 
              title="Utilization" 
              value={`${Math.round((employee.utilizationRate || 0) * 100)}%`} 
              icon={Zap} 
              color="bg-brand-sky" 
              description="Monthly work capacity usage."
            />
            <StatCard 
              title="Fatigue Risk" 
              value={latestLevel} 
              icon={AlertTriangle} 
              color={latestLevel === 'High Risk' ? 'bg-red-500' : latestLevel === 'Moderate Risk' ? 'bg-amber-500' : 'bg-brand-muted'} 
              description="Burnout risk based on workload."
              isEmpty={recentAssessments.length === 0}
            />
            <StatCard 
              title="Promotion Readiness" 
              value={`${employee.promotionReadiness || 82}%`} 
              icon={Award} 
              color="bg-brand-dark" 
              description="Probability of next-level success."
            />
          </div>

          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <ProfileField icon={User} label="Full Name" value={formData.name} editing={editing} name="name" onChange={handleChange} />
            <ProfileField icon={Mail} label="Email Address" value={formData.email} editing={false} name="email" />
            <ProfileField icon={Briefcase} label="Designation" value={formData.designation} editing={editing} name="designation" onChange={handleChange} />
            <ProfileField icon={Building2} label="Department" value={formData.department} editing={editing} name="department" onChange={handleChange} />
            <ProfileField icon={User} label="Manager" value={formData.manager} editing={editing} name="manager" onChange={handleChange} />
            <ProfileField icon={MapPin} label="Location" value={formData.location} editing={editing} name="location" onChange={handleChange} />
            <ProfileField icon={Calendar} label="Employment" value={formData.employmentType} editing={editing} name="employmentType" onChange={handleChange} />
            <ProfileField icon={IdCard} label="Employee ID" value={formData.employeeId} editing={false} name="employeeId" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* AI Insights */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                    <Sparkles className="mr-2 text-brand-muted" size={24} />
                    AI Talent Insights
                  </h3>
                  <button 
                    onClick={generateAiInsight}
                    disabled={generatingInsight}
                    className="text-xs font-bold text-brand-muted hover:underline flex items-center"
                  >
                    <RefreshCw size={14} className={`mr-1 ${generatingInsight ? 'animate-spin' : ''}`} />
                    Refresh Analysis
                  </button>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <BrainCircuit size={120} />
                  </div>
                  {generatingInsight ? (
                    <div className="flex items-center space-x-3 text-slate-400">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
                        <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
                        <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">AI is analyzing skill patterns...</span>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium text-lg italic">
                      <ReactMarkdown>
                        {aiInsight || employee.performanceSummary || ''}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </section>

              {/* Career Progression */}
              <section>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Career Progression</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="bg-brand-dark p-6 rounded-3xl text-white shadow-lg">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Recommended Next Role</p>
                    <p className="text-xl font-black">{employee.recommendedNextRole || 'Senior Consultant'}</p>
                    <div className="mt-4 flex items-center text-xs font-bold text-brand-light">
                      <span>View Career Path</span>
                      <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                  <div className="bg-brand-light p-6 rounded-3xl text-brand-dark shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Promotion Readiness</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-black">{employee.promotionReadiness || 82}%</p>
                      <span className="text-xs font-bold text-emerald-600">+5% vs last Q</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 pl-4 border-l-2 border-slate-100">
                  {employee.careerTimeline?.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-muted shrink-0"></div>
                      <div className="flex flex-col">
                        <p className="text-base font-bold text-slate-900">{item.event}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{new Date(item.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Skills Benchmarking */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Skill Benchmarks</h3>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <Target size={20} />
                </div>
              </div>
              <div className="space-y-6">
                {Object.entries(employee.skills || {}).sort((a, b) => b[1] - a[1]).map(([skill, value]: any) => (
                  <SkillBenchmark 
                    key={skill}
                    skill={skill}
                    value={value}
                    teamAvg={benchmarks[skill]?.avg || 75}
                    promoBenchmark={benchmarks[skill]?.promo || 85}
                  />
                ))}
              </div>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                  <BookOpen size={16} className="mr-2 text-brand-muted" />
                  Learning Focus
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Based on your gaps in <span className="text-brand-muted font-bold">Innovation</span> and <span className="text-brand-muted font-bold">Leadership</span>, we recommend the "Strategic Thinking" workshop starting next month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
