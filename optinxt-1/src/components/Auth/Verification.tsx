import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Mail, ArrowRight } from 'lucide-react';

export const Verification: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle="One last step to secure your account"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-light-blue/10 flex items-center justify-center animate-pulse">
            <Mail className="w-10 h-10 text-light-blue" />
          </div>
        </div>
        
        <p className="text-slate-300 leading-relaxed">
          We have sent you a verification email to <span className="text-white font-bold">{email}</span>. 
          Please verify it and log in.
        </p>

        <div className="pt-4">
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-opti-orange to-opti-red text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(247,147,30,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Go to Login <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-sm text-slate-500">
          Didn't receive the email? Check your spam folder or try signing up again.
        </p>
      </div>
    </AuthLayout>
  );
};
