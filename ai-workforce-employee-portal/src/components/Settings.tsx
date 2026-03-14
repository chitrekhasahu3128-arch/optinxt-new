import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Shield, 
  Smartphone,
  CheckCircle2,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';
import { Employee } from '../types';
import { db, doc, setDoc } from '../firebase';

const SettingsSection = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-8 py-6 border-b border-slate-50 flex items-center space-x-3">
      <div className="p-2 bg-slate-100 text-slate-500 rounded-xl">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const Settings = ({ employee, setEmployee }: { employee: Employee | null, setEmployee: any }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: true
  });

  if (!employee) return null;

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings & Security</h1>
          <p className="text-slate-500 font-medium">Manage your account preferences and security protocols.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-muted text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-dark transition-all duration-200 shadow-lg shadow-brand-muted/20 flex items-center space-x-2"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : saved ? (
            <>
              <CheckCircle2 size={20} />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Security Section */}
        <SettingsSection title="Security & Authentication" icon={Shield}>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-xl text-brand-sky shadow-sm">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <button 
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-12 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-brand-muted' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${twoFactor ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-xl text-brand-dark shadow-sm">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Change Password</p>
                  <p className="text-xs text-slate-500 font-medium">Last changed 3 months ago.</p>
                </div>
              </div>
              <button className="text-sm font-bold text-brand-muted hover:text-brand-dark">Update</button>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notification Preferences" icon={Bell}>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-sm font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')} Notifications</span>
                <button 
                  onClick={() => setNotifications({...notifications, [key]: !val})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${val ? 'bg-brand-muted' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${val ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance" icon={Moon}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-xl">
                <Moon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Dark Mode</p>
                <p className="text-xs text-slate-500 font-medium">Switch between light and dark themes.</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-brand-muted' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${darkMode ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
