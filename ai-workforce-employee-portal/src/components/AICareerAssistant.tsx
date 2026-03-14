import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BrainCircuit, 
  Target, 
  TrendingUp,
  Award,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { Employee, WorkloadAssessment } from '../types';
import { db, collection, query, where, orderBy, limit, onSnapshot } from '../firebase';

const AICareerAssistant = ({ employee }: { employee: Employee | null }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assessments, setAssessments] = useState<WorkloadAssessment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!employee) return;

    const q = query(
      collection(db, 'workload'),
      where('userId', '==', employee.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkloadAssessment));
      setAssessments(data);
    });

    // Initial AI greeting
    setMessages([
      {
        role: 'assistant',
        content: `Hello ${employee.name.split(' ')[0]}! I'm your AI Career Assistant. I've analyzed your skill profile and recent workload data. How can I help you with your career progression today?`
      }
    ]);

    return () => unsubscribe();
  }, [employee]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !employee) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are an AI Career Coach for an Employee Portal. 
          Employee Data:
          Name: ${employee.name}
          Role: ${employee.designation}
          Department: ${employee.department}
          Skills: ${JSON.stringify(employee.skills)}
          Fitment Score: ${employee.fitmentScore}%
          Utilization: ${employee.utilizationRate}
          Recent Fatigue Risk: ${assessments[0]?.fatigueLevel || 'Low'}
          
          Provide career insights, skill gap analysis, and promotion eligibility advice. 
          Be professional, encouraging, and data-driven. Use markdown for formatting.`
        },
        contents: [
          ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })), 
          { role: 'user', parts: [{ text: userMessage }] }
        ]
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    "How can I improve my leadership skills?",
    "Am I eligible for a promotion?",
    "Analyze my burnout risk",
    "What skills should I learn next?"
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Career Assistant</h1>
          <p className="text-slate-500 font-medium">Personalized coaching based on your unique performance data.</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-brand-muted to-brand-dark text-white rounded-2xl shadow-lg shadow-brand-muted/20">
          <Sparkles size={28} />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant' ? 'bg-brand-light/20 text-brand-muted mr-4' : 'bg-brand-sky/20 text-brand-sky ml-4'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-5 rounded-2xl ${
                  msg.role === 'assistant' 
                    ? 'bg-slate-50 text-slate-800 rounded-tl-none' 
                    : 'bg-brand-sky text-white rounded-tr-none shadow-md shadow-brand-sky/20'
                }`}>
                  <div className="prose prose-slate max-w-none prose-sm prose-headings:text-slate-900 prose-strong:text-slate-900 prose-p:leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                <Loader2 size={18} className="animate-spin text-brand-muted" />
                <span className="text-sm font-bold text-slate-400">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(action);
                  // Optional: auto-send
                }}
                className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-full hover:border-brand-muted hover:text-brand-muted transition-all duration-200"
              >
                {action}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your career, skills, or workload..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-brand-muted transition-colors shadow-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-brand-muted text-white rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-muted/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistant;
