import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken, getStoredUser, authApi } from '../../services/api';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAuthToken();
  const user = getStoredUser();

  // 1. If not authenticated, redirect to login preserving intended target
  if (!token || !user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} state={{ from: location }} replace />;
  }

  // Normalize role matching (passenger <-> citizen, etc.)
  const userRole = (user.role || '').toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

  // Allow 'citizen' when 'passenger' is requested and vice versa
  const hasAccess = 
    normalizedAllowed.includes(userRole) ||
    (userRole === 'citizen' && normalizedAllowed.includes('passenger')) ||
    (userRole === 'passenger' && normalizedAllowed.includes('citizen')) ||
    userRole === 'admin';

  // Check if authority account is pending approval
  if ((userRole === 'traffic_authority' || userRole === 'traffic_police') && (user.is_active === false || user.status === 'Pending Approval')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">Authority Access Pending Approval</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your municipal credentials ({user.badge_number || user.username}) are currently under review by Traffic Operations Command.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                authApi.logout();
                navigate('/login?role=authority');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. If authenticated but unauthorized for this specific role, block access
  if (!hasAccess) {
    const defaultPortal = 
      userRole === 'employer' ? '/employer' :
      (userRole === 'traffic_authority' || userRole === 'traffic_police' || userRole === 'admin') ? '/authority' :
      '/passenger';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are not authorized to access this portal. This area is reserved exclusively for authorized {allowedRoles.join(' / ')} accounts.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate(defaultPortal)}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to Your Authorized Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children ? children : null;
}
