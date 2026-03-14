import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { AuthLayout } from './AuthLayout';
import { Mail, Lock, Briefcase, User, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Employee' | 'Manager'>('Employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(location.state?.signupSuccess || false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.signupSuccess) {
      setSignupSuccess(true);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSignupSuccess(false); // Hide success message on new login attempt

    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        navigate('/verify', { state: { email } });
        return;
      }

      // Check role in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        setError('User profile not found.');
        await auth.signOut();
        return;
      }

      const userData = userDoc.data();
      if (userData.role !== role) {
        setError(`Your account is not associated with the ${role} role. Please select the correct option.`);
        await auth.signOut();
        return;
      }

      navigate(role === 'Manager' ? '/manager-dashboard' : '/employee-dashboard');
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/network-request-failed') {
        setError('Unable to reach Firebase. Check your internet connection or any firewall/proxy settings.');
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your OptiNXt account">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-light-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {signupSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Your account has been created. Please check your email and verify your address before logging in.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password reset email sent! Check your inbox.</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-light-blue/50 transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-light-blue hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-light-blue/50 transition-all"
              placeholder="••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Sign in as</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('Employee')}
              className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                role === 'Employee'
                  ? 'bg-light-blue/20 border-light-blue text-light-blue'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Employee</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('Manager')}
              className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                role === 'Manager'
                  ? 'bg-opti-orange/20 border-opti-orange text-opti-orange'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Manager</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-opti-orange to-opti-red text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(247,147,30,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>

        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-light-blue hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
