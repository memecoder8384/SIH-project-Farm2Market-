import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { ShieldCheck, FileCheck, Landmark, Bell, Check, Upload, User, MapPin, LogOut } from 'lucide-react';

interface ProfileSettingsProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onNavigate: (tab: string, param?: any) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsProps> = ({
  currentRole,
  setCurrentRole,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [name, setName] = useState(currentUser?.name || 'Dnyaneshwar Shinde');
  const [entityName, setEntityName] = useState(currentUser?.entityName || 'Sahyadri Organic Harvest Producer Co.');
  const [phone, setPhone] = useState(currentUser?.emailOrPhone || '+91 98220 18492');
  const [email, setEmail] = useState('lead@sahyadricluster.org');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      if (currentUser.entityName) setEntityName(currentUser.entityName);
      if (currentUser.emailOrPhone) setPhone(currentUser.emailOrPhone);
    }
  }, [currentUser]);
  const [upiId, setUpiId] = useState('sahyadri.fpo@icici');
  const [bankAccount, setBankAccount] = useState('50100482914492');
  const [ifsc, setIfsc] = useState('MAHB0001289');
  const [notifySms, setNotifySms] = useState(true);
  const [notifyTempSpike, setNotifyTempSpike] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="pb-8 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow-badge text-farm-orange">ACCOUNT SETTINGS</span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Profile &amp; Payment Details
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage your account information, bank details for fast payments, and farm certificates.
          </p>
        </div>

        {currentUser && (
          <button
            type="button"
            onClick={() => onLogout && onLogout()}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out ({currentUser.name.split(' ')[0]})</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        {/* Active Account Info Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Account Type</span>
              <h3 className="font-serif-heading text-2xl font-bold text-stone-900 mt-0.5">
                {currentRole === 'farmer' ? '🌾 Farmer Account' : '🛒 Buyer Account'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {currentRole === 'farmer'
                  ? 'You are registered as a Farmer and can list crops for sale on the marketplace.'
                  : 'You are registered as a Buyer and can purchase fresh produce directly from farmers.'}
              </p>
            </div>
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shrink-0 ${
              currentRole === 'farmer'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {currentRole === 'farmer' ? 'Farmer (Seller)' : 'Buyer'}
            </span>
          </div>
        </div>

        {/* Stakeholder Info & Organization */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
            Personal &amp; Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Farm or Store Name</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>
        </div>

        {/* Bank & Escrow Auto-Disbursement Setup */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-2">
            <Landmark className="w-5 h-5 text-emerald-700" />
            <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
              Direct Payment &amp; Bank Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">UPI ID (for fast payments)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Bank Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Bank IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 bg-white text-stone-900 p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-farm-orange"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Payments are transferred directly to your bank account within 15 minutes of delivery confirmation.</span>
          </div>
        </div>

        {/* Verified Agricultural & Food Safety Certifications */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
              Quality Certificates &amp; Farm Verification
            </h3>
            <button
              type="button"
              onClick={() => alert('Certificate document upload dialog simulated.')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border border-stone-200"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950 block">NPOP Organic India</span>
                <span className="text-[10px] text-emerald-800 mt-0.5 block">Cert #NPOP-ORG-2026-991</span>
                <span className="text-[10px] text-stone-500 mt-2 block">Expires: Dec 2027</span>
              </div>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Soil Health Card</span>
                <span className="text-[10px] text-emerald-800 mt-0.5 block">Nashik Agricultural Center</span>
                <span className="text-[10px] text-stone-500 mt-2 block">Top Soil Grade (A+)</span>
              </div>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Safe Food Certified</span>
                <span className="text-[10px] text-emerald-800 mt-0.5 block">Standard Quality Checked</span>
                <span className="text-[10px] text-stone-500 mt-2 block">Verified 2026</span>
              </div>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Submit & Save */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-stone-500">
            {savedSuccess && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile and bank details saved successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
