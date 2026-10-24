import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { authApi } from '../../services/api';
import { 
  Navigation, 
  User, 
  Building2, 
  Activity, 
  Lock, 
  Mail, 
  ArrowRight,
  Phone,
  MapPin,
  Shield,
  Building,
  AlertCircle,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole, showToast } = useRouteWise();

  const initialRole = searchParams.get('role') || 'passenger';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Common Passwords
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 1. Passenger Registration Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [city, setCity] = useState('Mangaluru');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');

  // 2. Employer Registration Fields
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [officialCompanyEmail, setOfficialCompanyEmail] = useState('');
  const [orgContactNumber, setOrgContactNumber] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [employerCity, setEmployerCity] = useState('Mangaluru');
  const [hrAdminName, setHrAdminName] = useState('');
  const [hrAdminEmail, setHrAdminEmail] = useState('');

  // 3. Authority Registration Fields
  const [authorityFullName, setAuthorityFullName] = useState('');
  const [authorityId, setAuthorityId] = useState('');
  const [officialGovEmail, setOfficialGovEmail] = useState('');
  const [department, setDepartment] = useState('Traffic Operations & Enforcement');
  const [designation, setDesignation] = useState('Traffic Control Inspector');
  const [officeZone, setOfficeZone] = useState('Mangaluru Central Zone');
  const [authorityContactNumber, setAuthorityContactNumber] = useState('');
  const [officialKey, setOfficialKey] = useState('ROADTRUTH_OFFICIAL_AUTH_2026');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const r = searchParams.get('role');
    if (r && ['passenger', 'employer', 'authority'].includes(r)) {
      setSelectedRole(r);
    }
  }, [searchParams]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validatePhone = (val) => {
    return /^[0-9+\s-]{8,15}$/.test(val);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Common Password Validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must meet the required security criteria (at least 6 characters).');
      return;
    }

    // Role Specific Validations
    if (selectedRole === 'passenger') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!validateEmail(emailAddress)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!validatePhone(mobileNumber)) {
        setErrorMessage('Please enter a valid mobile number.');
        return;
      }
      if (!city.trim()) {
        setErrorMessage('Please enter your city.');
        return;
      }
    } else if (selectedRole === 'employer') {
      if (!orgName.trim() || !orgId.trim()) {
        setErrorMessage('Please enter your organization name and organization ID.');
        return;
      }
      if (!validateEmail(officialCompanyEmail)) {
        setErrorMessage('Please enter a valid official company email.');
        return;
      }
      if (!hrAdminName.trim()) {
        setErrorMessage('Please enter the HR / Admin lead name.');
        return;
      }
      if (!validatePhone(orgContactNumber)) {
        setErrorMessage('Please enter a valid contact number.');
        return;
      }
      if (!companyAddress.trim() || !employerCity.trim()) {
        setErrorMessage('Please enter the complete company address and city.');
        return;
      }
    } else if (selectedRole === 'authority') {
      if (!authorityFullName.trim() || !authorityId.trim()) {
        setErrorMessage('Please enter your official name and Authority ID.');
        return;
      }
      if (!validateEmail(officialGovEmail)) {
        setErrorMessage('Please enter a valid official government/authority email.');
        return;
      }
      if (!department.trim() || !designation.trim() || !officeZone.trim()) {
        setErrorMessage('Please fill in your department, designation and office zone.');
        return;
      }
      if (!validatePhone(authorityContactNumber)) {
        setErrorMessage('Please enter a valid contact number.');
        return;
      }
    }

    setIsLoading(true);

    try {
      let username = '';
      let emailToSubmit = '';
      let badgeNumber = null;
      let agency = null;
      let backendRole = 'citizen';

      if (selectedRole === 'passenger') {
        backendRole = 'citizen';
        username = fullName.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 25);
        emailToSubmit = emailAddress.trim().toLowerCase();
        agency = `${city} | Mobile: ${mobileNumber}${emergencyContactName ? ` | Emergency: ${emergencyContactName} (${emergencyContactNumber})` : ''}`;
      } else if (selectedRole === 'employer') {
        backendRole = 'employer';
        username = hrAdminName.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 25);
        emailToSubmit = (officialCompanyEmail || hrAdminEmail).trim().toLowerCase();
        badgeNumber = orgId.trim().toUpperCase();
        agency = `${orgName.trim()} (${employerCity}) | HR: ${hrAdminName} | Ph: ${orgContactNumber}`;
      } else {
        backendRole = 'traffic_authority';
        username = authorityFullName.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 25);
        emailToSubmit = officialGovEmail.trim().toLowerCase();
        badgeNumber = authorityId.trim().toUpperCase();
        agency = `${department} (${officeZone}) | Desig: ${designation} | Ph: ${authorityContactNumber}`;
      }

      if (username.length < 3) {
        username = `${username}_${Date.now().toString().slice(-4)}`;
      }

      const res = await authApi.register({
        username,
        email: emailToSubmit,
        password,
        role: backendRole,
        badge_number: badgeNumber,
        agency,
        official_key: backendRole === 'traffic_authority' ? officialKey : null
      });

      const returnedRole = (res.user?.role || backendRole).toLowerCase();
      const mappedRole = 
        (returnedRole === 'citizen' || returnedRole === 'passenger') ? 'passenger' :
        returnedRole === 'employer' ? 'employer' :
        'authority';

      setRole(mappedRole);
      showToast('Account Created', `Welcome to RouteWise AI, ${res.user?.username || 'User'}.`, 'success');

      // Redirect strictly to the role-specific dashboard
      if (mappedRole === 'employer') {
        navigate('/employer', { replace: true });
      } else if (mappedRole === 'authority') {
        navigate('/authority', { replace: true });
      } else {
        navigate('/passenger', { replace: true });
      }

    } catch (err) {
      console.warn('Registration error:', err);
      if (err.status === 409) {
        setErrorMessage('An account with this email, ID or username already exists. Try logging in instead.');
      } else if (err.status >= 500) {
        setErrorMessage('Unable to connect to the server. Please try again.');
      } else {
        setErrorMessage(err.message || 'Unable to complete registration. Please verify your details.');
      }
    } finally {
      setIsLoading(false);
    }
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
    <div className="max-w-xl mx-auto py-8 sm:py-12 space-y-6">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
          <Navigation className="w-6 h-6 fill-slate-950 rotate-45" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Create RouteWise Account</h1>
        <p className="text-xs text-slate-400">
          Register for your dedicated RouteWise AI mobility and transit portal
        </p>
      </div>

      <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-5 text-xs">
        {/* Role Type Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold block text-[11px] uppercase tracking-wider">
            Registration Category:
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
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-0.5">
              <span className="font-bold block">Validation Notice</span>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* ========================================================
              1. PASSENGER REGISTRATION
          ======================================================== */}
          {selectedRole === 'passenger' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Bhandary"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Email Address *</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="commuter@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mangaluru"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Emergency Contacts (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px] block">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="e.g. Spouse / Parent"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px] block">Contact Number</label>
                    <input
                      type="tel"
                      value={emergencyContactNumber}
                      onChange={(e) => setEmergencyContactNumber(e.target.value)}
                      placeholder="+91 91234 56789"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. EMPLOYER REGISTRATION
          ======================================================== */}
          {selectedRole === 'employer' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Organization / Company Name *</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Coastal Infotech Ltd."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Organization ID *</label>
                  <input
                    type="text"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    placeholder="e.g. ORG-MYS-001"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Official Company Email *</label>
                  <input
                    type="email"
                    value={officialCompanyEmail}
                    onChange={(e) => setOfficialCompanyEmail(e.target.value)}
                    placeholder="hr@organization.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Contact Number *</label>
                  <input
                    type="tel"
                    value={orgContactNumber}
                    onChange={(e) => setOrgContactNumber(e.target.value)}
                    placeholder="+91 824 222 3344"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">HR / Admin Name *</label>
                  <input
                    type="text"
                    value={hrAdminName}
                    onChange={(e) => setHrAdminName(e.target.value)}
                    placeholder="e.g. Sarah D'Souza"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">HR / Admin Email (Optional)</label>
                  <input
                    type="email"
                    value={hrAdminEmail}
                    onChange={(e) => setHrAdminEmail(e.target.value)}
                    placeholder="sarah.admin@organization.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-semibold block">Company Address *</label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="e.g. Kottara Chowki IT Hub"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">City *</label>
                  <input
                    type="text"
                    value={employerCity}
                    onChange={(e) => setEmployerCity(e.target.value)}
                    placeholder="Mangaluru"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. AUTHORITY REGISTRATION / REQUEST ACCESS
          ======================================================== */}
          {selectedRole === 'authority' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Official Municipal & Police Clearance Protocol</span>
                </div>
                <p className="text-amber-300/80">
                  Authority registrations are validated against the municipal clearance registry. Unverified credentials are held in <strong>Pending Approval</strong> status.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Full Name *</label>
                  <input
                    type="text"
                    value={authorityFullName}
                    onChange={(e) => setAuthorityFullName(e.target.value)}
                    placeholder="e.g. Inspector K. Rao"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Authority ID *</label>
                  <input
                    type="text"
                    value={authorityId}
                    onChange={(e) => setAuthorityId(e.target.value)}
                    placeholder="e.g. TA-MYS-001"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Official Government Email *</label>
                  <input
                    type="email"
                    value={officialGovEmail}
                    onChange={(e) => setOfficialGovEmail(e.target.value)}
                    placeholder="inspector.rao@traffic.gov.in"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Contact Number *</label>
                  <input
                    type="tel"
                    value={authorityContactNumber}
                    onChange={(e) => setAuthorityContactNumber(e.target.value)}
                    placeholder="+91 824 222 9999"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Department *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Traffic Operations"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Designation *</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Traffic Inspector"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Office / Zone *</label>
                  <input
                    type="text"
                    value={officeZone}
                    onChange={(e) => setOfficeZone(e.target.value)}
                    placeholder="Central Zone"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Clearance Key (Official Invite Code)</label>
                <input
                  type="text"
                  value={officialKey}
                  onChange={(e) => setOfficialKey(e.target.value)}
                  placeholder="ROADTRUTH_OFFICIAL_AUTH_2026"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500 block">
                  *Default clearance key grants immediate verified privileges.
                </span>
              </div>
            </div>
          )}

          {/* COMMON PASSWORD & CONFIRM PASSWORD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-98'
            }`}
          >
            <span>
              {isLoading 
                ? 'Processing Registration...' 
                : (selectedRole === 'passenger' 
                    ? 'Create Passenger Account' 
                    : (selectedRole === 'employer' 
                        ? 'Register Organization' 
                        : 'Submit Authority Request'))}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Existing account link */}
        <div className="text-center pt-3 border-t border-slate-800 text-slate-400 text-[11px]">
          Already have an account?{' '}
          <Link to={`/login?role=${selectedRole}`} className="text-cyan-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
