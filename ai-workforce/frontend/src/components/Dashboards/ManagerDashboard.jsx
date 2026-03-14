import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

export const ManagerDashboard = () => {
  const { user, logout } = useAuth();

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
            <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.firstName}!</p>
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
          <StatCard icon={Users} label="Total Employees" value="42" color="bg-blue-500/20" />
          <StatCard icon={TrendingUp} label="Productivity" value="88%" color="bg-green-500/20" />
          <StatCard icon={BarChart3} label="Active Tasks" value="156" color="bg-purple-500/20" />
          <StatCard icon={Clock} label="Avg Workload" value="8.2h" color="bg-orange-500/20" />
        </motion.div>

        {/* Section: Team Performance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Team Performance</h2>
          <div className="space-y-4">
            {[
              { name: 'John Doe', role: 'Senior Developer', status: 'Active', productivity: 92 },
              { name: 'Jane Smith', role: 'Designer', status: 'Active', productivity: 88 },
              { name: 'Mike Johnson', role: 'Developer', status: 'On Leave', productivity: 0 },
              { name: 'Sarah Williams', role: 'QA Engineer', status: 'Active', productivity: 84 },
            ].map((employee, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-blue-500/50 transition"
              >
                <div>
                  <p className="font-semibold text-white">{employee.name}</p>
                  <p className="text-sm text-slate-400">{employee.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      employee.status === 'Active'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {employee.status}
                  </span>
                  <div className="w-24 bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${employee.productivity}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold w-12 text-right">{employee.productivity}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section: Upcoming Tasks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Pending Approvals</h2>
          <div className="space-y-4">
            {[
              { title: 'Q4 Budget Review', requester: 'Finance Team', priority: 'High' },
              { title: 'Project Timeline Update', requester: 'Project Manager', priority: 'Medium' },
              { title: 'Leave Request', requester: 'John Doe', priority: 'Low' },
            ].map((task, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600"
              >
                <div>
                  <p className="font-semibold text-white">{task.title}</p>
                  <p className="text-sm text-slate-400">from {task.requester}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.priority === 'High'
                        ? 'bg-red-500/20 text-red-300'
                        : task.priority === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">
                    Review
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};
