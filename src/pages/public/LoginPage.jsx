import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { authApi } from '../../services/api';
import { 
  Navigation, 
  User, 
  Building2, 
  Activity, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  Building,
  Shield,
  Briefcase,
  MapPin
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setRole, showToast } = useRouteWise();

  const initialRole = searchParams.get('role') || 'passenger';
  const redirectTarget = searchParams.get('redirect') || location.state?.from?.pathname || null;

  const [selectedRole, setSelectedRole] = useState(initialRole);
  
  // Passenger / Employer / Authority credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Authority specific extra fields (Department, Designation, Office / Zone)
  const [dept, setDept] = useState('Traffic Operations & Enforcement');
  const [designation, setDesignation] = useState('Inspector');
  const [zone, setZone] = useState('Mangaluru Central Zone');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Update role if query parameter changes
  useEffect(() => {
    const r = searchParams.get('role');
    if (r && ['passenger', 'employer', 'authority'].includes(r)) {
      setSelectedRole(r);
    }
  }, [searchParams]);

  // Set default sample credentials when role switches for effortless testing
  useEffect(() => {
    setErrorMessage('');
    if (selectedRole === 'passenger') {
      setIdentifier('commuter@routewise.ai');
      setPassword('password123');
    } else if (selectedRole === 'employer') {
      setIdentifier('ORG-MYS-001');
      setPassword('password123');
    } else if (selectedRole === 'authority') {
      setIdentifier('TA-MYS-001');
      setPassword('password123');
    }
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        selectedRole === 'passenger' ? 'Please enter your email or mobile number.' :
        selectedRole === 'employer' ? 'Please enter your official email or organization ID.' :
        'Please enter your authority ID or official government email.'
      );
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.login({
        username: identifier.trim(),
        email: identifier.trim(),
        password
      });

      const user = res.user;
      const returnedRole = (user?.role || selectedRole).toLowerCase();

      // Normalize role
      const mappedRole = 
        (returnedRole === 'citizen' || returnedRole === 'passenger') ? 'passenger' :
        returnedRole === 'employer' ? 'employer' :
        (returnedRole === 'traffic_authority' || returnedRole === 'traffic_police' || returnedRole === 'admin') ? 'authority' :
        'passenger';

      // Role check: verify that the user's role matches the selected portal
      if (selectedRole === 'passenger' && mappedRole !== 'passenger') {
        setErrorMessage('You are not authorized to access this portal with this account type.');
        setIsLoading(false);
        return;
      }
      if (selectedRole === 'employer' && mappedRole !== 'employer') {
        setErrorMessage('You are not authorized to access this portal with this account type.');
        setIsLoading(false);
        return;
      }
      if (selectedRole === 'authority' && mappedRole !== 'authority') {
        setErrorMessage('You are not authorized to access this portal with this account type.');
        setIsLoading(false);
        return;
      }

      // Check account approval status if present
      if (user.is_active === false || user.status === 'Pending Approval') {
        setErrorMessage('Your authority account is pending approval.');
        setIsLoading(false);
        return;
      }

      setRole(mappedRole);
      showToast('Login Successful', `Welcome back, ${user.username || 'User'}.`, 'success');

      // Safe redirection to intended target or dedicated role dashboard
      if (redirectTarget && !redirectTarget.includes('/login') && !redirectTarget.includes('/select-role')) {
        navigate(decodeURIComponent(redirectTarget), { replace: true });
      } else {
        if (mappedRole === 'employer') {
          navigate('/employer', { replace: true });
        } else if (mappedRole === 'authority') {
          navigate('/authority', { replace: true });
        } else {
          navigate('/passenger', { replace: true });
        }
      }
    } catch (err) {
      console.warn('Login error:', err);
      if (err.status === 401) {
        setErrorMessage('Invalid email/mobile number or password.');
      } else if (err.status === 403) {
        if (selectedRole === 'authority') {
          setErrorMessage('Your authority account is pending approval.');
        } else {
          setErrorMessage('Your account is currently inactive. Please contact an administrator.');
        }
      } else if (err.status >= 500) {
        setErrorMessage('Unable to connect to the server. Please try again.');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setErrorMessage('Unable to connect to the server. Please try again.');
      } else {
        setErrorMessage('Invalid email/mobile number or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleHeader = () => {
    if (selectedRole === 'passenger') return 'Passenger Login';
    if (selectedRole === 'employer') return 'Employer Login';
    return 'Traffic Authority Login';
  };

  const getRoleBadgeStyle = (r) => {
    if (selectedRole === r) {
      if (r === 'passenger') return 'bg-cyan-500 text-slate-950 font-black shadow-sm';
      if (r === 'employer') return 'bg-emerald-500 text-slate-950 font-black shadow-sm';
      return 'bg-amber-500 text-slate-950 font-black shadow-sm';
    }
    return 'text-slate-400 hover:text-white';
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
          <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-cyan-400">
          <span>{selectedRole === 'passenger' ? '🚗' : selectedRole === 'employer' ? '🏢' : '🚦'}</span>
          <span>{getRoleHeader()}</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Sign In to RouteWise AI</h1>
        <p className="text-xs text-slate-400">
          Enter your authorized credentials to access your dedicated dashboard
        </p>
      </div>

      <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-5 text-xs">
        {/* Role Type Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold block text-[11px] uppercase tracking-wider">
            Portal Workspace:
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {[
              { id: 'passenger', label: 'Passenger' },
              { id: 'employer', label: 'Employer' },
              { id: 'authority', label: 'Authority' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedRole(r.id);
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-center font-bold text-xs transition-all ${getRoleBadgeStyle(r.id)}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-0.5">
              <span className="font-bold block">Authentication Notice</span>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IDENTIFIER FIELD (Role-Specific) */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">
              {selectedRole === 'passenger' && 'Email or Mobile Number'}
              {selectedRole === 'employer' && 'Official Email / Organization ID'}
              {selectedRole === 'authority' && 'Authority ID or Official Government Email'}
            </label>
            <div className="relative">
              {selectedRole === 'passenger' && (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
              {selectedRole === 'employer' && (
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
              {selectedRole === 'authority' && (
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === 'passenger' ? 'e.g. commuter@routewise.ai or mobile' :
                  selectedRole === 'employer' ? 'e.g. ORG-MYS-001 or official email' :
                  'e.g. TA-MYS-001 or authority@mangaluru.gov.in'
                }
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                required
              />
            </div>
          </div>

          {/* ADDITIONAL AUTHORITY FIELDS (Department, Designation, Office/Zone) */}
          {selectedRole === 'authority' && (
            <div className="p-3 bg-slate-950/80 border border-amber-500/20 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                <span>Official Authority Details</span>
                <span>Restricted</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">Department / Organization</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      placeholder="Traffic Operations & Enforcement"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px] block">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Inspector / Lead"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px] block">Office / Zone</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        placeholder="Central Zone"
                        className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD FIELD */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-semibold block">Password</label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* PRIMARY LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-98'
            }`}
          >
            <span>{isLoading ? 'Authenticating...' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* REGISTRATION CALLOUT LINKS */}
        <div className="text-center pt-3 border-t border-slate-800 text-slate-400 text-[11px]">
          {selectedRole === 'passenger' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span>New commuter?</span>
              <Link to="/register?role=passenger" className="text-cyan-400 font-bold hover:underline">
                Create Passenger Account
              </Link>
            </div>
          )}
          {selectedRole === 'employer' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span>Enterprise organization?</span>
              <Link to="/register?role=employer" className="text-emerald-400 font-bold hover:underline">
                Register Organization
              </Link>
            </div>
          )}
          {selectedRole === 'authority' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span>Municipal / Police official?</span>
              <Link to="/register?role=authority" className="text-amber-400 font-bold hover:underline">
                Request Authority Access
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-slate-100 space-y-3 text-xs shadow-2xl">
            <h4 className="font-bold text-white text-sm">Reset Password</h4>
            {resetSent ? (
              <p className="text-emerald-300">
                Password reset instructions have been dispatched for {identifier || 'your account'}.
              </p>
            ) : (
              <p className="text-slate-400 leading-relaxed">
                Enter your registered email or account ID and our system will generate a secure authorization link.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setForgotModal(false); setResetSent(false); }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  onClick={() => setResetSent(true)}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
