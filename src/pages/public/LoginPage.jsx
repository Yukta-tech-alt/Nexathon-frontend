import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { Navigation, User, Building2, Activity, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole, showToast } = useRouteWise();

  const [selectedRole, setSelectedRole] = useState('passenger');
  const [email, setEmail] = useState('commuter@routewise.ai');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRole(selectedRole);
    showToast('Signed In', `Loaded ${selectedRole.toUpperCase()} workspace.`, 'success');

    if (selectedRole === 'passenger') navigate('/passenger');
    else if (selectedRole === 'employer') navigate('/employer');
    else navigate('/authority');
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
          <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
        </div>
        <h2 className="text-2xl font-black text-white">Sign In to RouteWise AI</h2>
        <p className="text-xs text-slate-400">Select your role to access your dedicated mobility dashboard</p>
      </div>

      <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-5 text-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold block">Select Workspace Portal:</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {[
                { id: 'passenger', label: 'Passenger', color: 'bg-cyan-500' },
                { id: 'employer', label: 'Employer', color: 'bg-emerald-500' },
                { id: 'authority', label: 'Authority', color: 'bg-amber-500' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`py-2 rounded-lg text-center font-bold capitalize transition-colors ${
                    selectedRole === r.id ? `${r.color} text-slate-950` : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-semibold block">Password</label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Enter RouteWise Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register Demo Account
          </Link>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-500 text-center">
          *Frontend Demo Notice: Authentication is simulated for prototype demonstration.
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-slate-100 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Reset Password</h4>
            {resetSent ? (
              <p className="text-emerald-300">
                Simulated reset token generated for {email}.
              </p>
            ) : (
              <p className="text-slate-400">
                Clicking confirm will simulate an email password reset link.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setForgotModal(false); setResetSent(false); }}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  onClick={() => setResetSent(true)}
                  className="px-3.5 py-1.5 bg-cyan-600 text-slate-950 font-bold rounded-lg"
                >
                  Send Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
