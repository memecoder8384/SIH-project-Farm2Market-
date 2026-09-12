import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { authService, DEMO_PROFILES } from '../services/authService';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Tractor, 
  Building2, 
  Eye, 
  EyeOff,
  Sparkles,
  X
} from 'lucide-react';

interface SignInPageProps {
  onNavigate: (tab: string, param?: any) => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
  isModal?: boolean;
  onClose?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigate,
  onLoginSuccess,
  initialRole = 'farmer',
  isModal = false,
  onClose,
}) => {
  // Only two stakeholder roles: Farmer (lists only) and Buyer (buys only)
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer'>(
    initialRole === 'buyer' ? 'buyer' : 'farmer'
  );

  useEffect(() => {
    if (initialRole === 'farmer' || initialRole === 'buyer') {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');

  // Credentials
  const [identifier, setIdentifier] = useState('9822018492'); // default sample
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [location, setLocation] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleSelect = (role: 'farmer' | 'buyer') => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'farmer') {
      setIdentifier('9822018492');
      setPassword('1234');
    } else {
      setIdentifier('9819920145');
      setPassword('1234');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your mobile number or email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password or PIN.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setSuccessMessage(`Authenticated successfully as ${selectedRole === 'farmer' ? 'Farmer Producer' : 'Buyer'}!`);

    const defaultProfile = DEMO_PROFILES[selectedRole];
    const profile: UserProfile = {
      id: defaultProfile.id,
      name: fullName.trim() || defaultProfile.name,
      role: selectedRole,
      emailOrPhone: identifier.trim(),
      entityName: entityName.trim() || defaultProfile.entityName,
      location: location.trim() || defaultProfile.location,
      avatar: defaultProfile.avatar,
    };

    authService.setCurrentUser(profile);

    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      onLoginSuccess(profile);
      const targetTab = selectedRole === 'farmer' ? 'farmer-dashboard' : 'marketplace';
      onNavigate(targetTab);
      setIsSubmitting(false);
    }, 450);
  };

  const handleQuickDemoLogin = (role: 'farmer' | 'buyer') => {
    setSelectedRole(role);
    const demo = DEMO_PROFILES[role];
    setIsSubmitting(true);
    setSuccessMessage(`Logging in as demo ${role === 'farmer' ? 'Farmer' : 'Buyer'} (${demo.name})...`);
    authService.setCurrentUser(demo);

    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      onLoginSuccess(demo);
      const targetTab = role === 'farmer' ? 'farmer-dashboard' : 'marketplace';
      onNavigate(targetTab);
      setIsSubmitting(false);
    }, 400);
  };

  const formCard = (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xl relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
      {/* If modal, show Close (X) button at top right */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <span className="eyebrow-badge text-farm-orange">DIRECT FROM FARM</span>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1.5">
          {authMode === 'signin' ? 'Sign In to Farm2Market' : 'Create an Account'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {selectedRole === 'farmer'
            ? '🌾 Farmer Account: List your vegetables and sell directly at fair prices'
            : '🛒 Buyer Account: Buy fresh vegetables directly from verified local farmers'}
        </p>
      </div>

        {/* Primary Role Selector (Farmer vs Buyer) */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 text-center">
            Choose Account Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => handleRoleSelect('farmer')}
              className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'farmer'
                  ? 'bg-white text-amber-950 shadow-sm border border-amber-200/80 ring-1 ring-amber-300/50'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tractor className="w-4 h-4 text-amber-600" />
              <span>Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('buyer')}
              className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'buyer'
                  ? 'bg-white text-blue-950 shadow-sm border border-blue-200/80 ring-1 ring-blue-300/50'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Buyer</span>
            </button>
          </div>

          {/* Role Capability Indicator */}
          <div className="mt-2.5 text-center">
            <span className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border ${
              selectedRole === 'farmer'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {selectedRole === 'farmer'
                ? '🌾 Farmer: Can list crops for sale'
                : '🛒 Buyer: Can buy fresh crops directly'}
            </span>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex border-b border-stone-100 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              authMode === 'signin'
                ? 'border-farm-orange text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              authMode === 'signup'
                ? 'border-farm-orange text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'farmer' ? 'e.g. Dnyaneshwar Shinde' : 'e.g. Priya Sharma'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedRole === 'farmer' ? 'Farm Name' : 'Company or Store Name (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={selectedRole === 'farmer' ? 'e.g. Green Valley Farm' : 'e.g. Fresh Mart Grocery'}
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Location (District, State)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nashik Valley, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Mobile Number or Email
            </label>
            <div className="relative flex rounded-xl border border-stone-300 focus-within:ring-2 focus-within:ring-farm-orange/30 focus-within:border-farm-orange overflow-hidden bg-white">
              <span className="inline-flex items-center px-3 border-r border-stone-200 bg-stone-50 text-stone-500 text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                required
                placeholder="Mobile number or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs text-stone-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                Password / PIN
              </label>
              <span className="text-[10px] text-stone-400">Default PIN: 1234</span>
            </div>
            <div className="relative flex rounded-xl border border-stone-300 focus-within:ring-2 focus-within:ring-farm-orange/30 focus-within:border-farm-orange overflow-hidden bg-white">
              <span className="inline-flex items-center px-3 border-r border-stone-200 bg-stone-50 text-stone-500 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password or 4-digit PIN"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs text-stone-900 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>
              {isSubmitting
                ? 'Signing In...'
                : authMode === 'signin'
                ? `Sign In as ${selectedRole === 'farmer' ? 'Farmer' : 'Buyer'}`
                : `Create ${selectedRole === 'farmer' ? 'Farmer' : 'Buyer'} Account`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo One-Click Access */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('farmer')}
              className="py-2 px-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🌾 As Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('buyer')}
              className="py-2 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🛒 As Buyer</span>
            </button>
          </div>
        </div>
      </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
          {formCard}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto flex flex-col justify-center">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-full border border-stone-200/90 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>
      {formCard}
    </div>
  );
};
