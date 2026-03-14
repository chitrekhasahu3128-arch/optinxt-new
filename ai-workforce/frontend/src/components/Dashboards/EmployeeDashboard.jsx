import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Clock, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TaskCard = ({ title, status, dueDate, priority }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-slate-700 hover:border-blue-500/50 transition"
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-semibold text-white flex-1">{title}</h3>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
          priority === 'high'
            ? 'bg-red-500/20 text-red-300'
            : priority === 'medium'
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-green-500/20 text-green-300'
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span
        className={`px-3 py-1 rounded-lg text-sm font-medium ${
          status === 'completed'
            ? 'bg-green-500/20 text-green-300'
            : status === 'in-progress'
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-slate-700 text-slate-300'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      <span className="text-slate-400 text-sm">{dueDate}</span>
    </div>
  </motion.div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </motion.div>
);

export const EmployeeDashboard = () => {
  const { user, logout } = useAuth();

  const tasks = [
    { title: 'Complete project report', status: 'in-progress', dueDate: 'Today', priority: 'high' },
    { title: 'Code review for feature X', status: 'pending', dueDate: 'Tomorrow', priority: 'medium' },
    { title: 'Team meeting preparation', status: 'completed', dueDate: 'Yesterday', priority: 'low' },
    { title: 'API documentation', status: 'pending', dueDate: 'Friday', priority: 'medium' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome, {user?.firstName}! 👋</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard icon={Briefcase} label="My Tasks" value="12" color="bg-blue-500/20" />
          <StatCard icon={Clock} label="Hours This Week" value="38" color="bg-green-500/20" />
          <StatCard icon={Target} label="Productivity" value="92%" color="bg-purple-500/20" />
          <StatCard icon={TrendingUp} label="Performance" value="A+" color="bg-orange-500/20" />
        </motion.div>

        {/* Tasks Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">My Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task, idx) => (
              <TaskCard key={idx} {...task} />
            ))}
          </div>
        </motion.section>

        {/* Weekly Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Weekly Overview</h2>
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600"
              >
                <span className="text-white font-medium">{day}</span>
                <div className="flex items-center gap-4">
                  <div className="w-40 bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${75 + (idx * 5)}%` }}></div>
                  </div>
                  <span className="text-white font-semibold w-12 text-right">{75 + (idx * 5)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};
