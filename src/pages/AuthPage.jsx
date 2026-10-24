import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../context/RouteWiseContext';
import { 
  Navigation, 
  User, 
  Building2, 
  Activity, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { role, setRole, showToast } = useRouteWise();

  const [isRegister, setIsRegister] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('passenger');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Validation Error', 'Please enter email and password.', 'warning');
      return;
    }

    setRole(selectedPersona);
    showToast('Demo Login Successful', `Logged in as ${selectedPersona.toUpperCase()} demo user.`, 'success');
    
    if (selectedPersona === 'passenger') navigate('/passenger');
    else if (selectedPersona === 'employer') navigate('/employer');
    else navigate('/intelligence');
  };

  const handleQuickLogin = (targetRole) => {
    setRole(targetRole);
    showToast(`Quick Access: ${targetRole.toUpperCase()}`, 'Demo session activated instantly.', 'success');
    if (targetRole === 'passenger') navigate('/passenger');
    else if (targetRole === 'employer') navigate('/employer');
    else navigate('/intelligence');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    showToast('Reset Simulated', `Password reset token simulated for ${resetEmail}`, 'info');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
            <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            RouteWise <span className="text-cyan-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Create your simulated demo account' : 'Sign in to access personalized traffic & commute tools'}
          </p>
        </div>

        {/* Demo Fast-Login Strip (One-Click) */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            One-Click Demo Instant Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('passenger')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold text-center"
            >
              Passenger
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('employer')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold text-center"
            >
              Employer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('authority')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[11px] font-bold text-center"
            >
              Authority
            </button>
          </div>
        </div>

        {/* Persona Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 block">Select Access Persona:</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedPersona('passenger')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                selectedPersona === 'passenger' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Passenger</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPersona('employer')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                selectedPersona === 'employer' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Employer</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPersona('authority')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                selectedPersona === 'authority' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Authority</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Rao"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          )}

          {isRegister && selectedPersona === 'employer' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Company / Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Mangaluru Tech Hub Ltd"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@routewise.ai"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold block">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Create Simulated Account' : 'Sign In with Demo Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="text-cyan-400 font-bold hover:underline">
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button onClick={() => setIsRegister(true)} className="text-cyan-400 font-bold hover:underline">
                Register Demo Profile
              </button>
            </span>
          )}
        </div>

        <div className="text-[10px] text-slate-500 text-center leading-relaxed">
          *Frontend demo only: No passwords or credentials are sent to external servers or retained insecurely.
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-slate-100 space-y-4">
            <h3 className="font-bold text-white text-base">Reset Demo Password</h3>
            {resetSent ? (
              <div className="text-xs text-emerald-300 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-center">
                  Simulated password reset instructions dispatched for <strong>{resetEmail}</strong>.
                </p>
                <button
                  onClick={() => { setForgotPasswordOpen(false); setResetSent(false); }}
                  className="w-full py-2 bg-slate-800 text-slate-200 rounded-xl font-bold mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
                <p className="text-slate-400 leading-relaxed">
                  Enter your email address to receive a simulated recovery token:
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  required
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-cyan-600 text-slate-950 font-bold rounded-xl"
                  >
                    Send Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
