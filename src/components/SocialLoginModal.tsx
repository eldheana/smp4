import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  Sparkles, 
  GraduationCap, 
  School, 
  Check, 
  Globe
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SocialLoginModalProps {
  currentUser: User;
  onLoginSuccess: (user: Partial<User>) => void;
  onClose: () => void;
}

export const SocialLoginModal: React.FC<SocialLoginModalProps> = ({
  currentUser,
  onLoginSuccess,
  onClose
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('belajar_id');
  const [customName, setCustomName] = useState(currentUser.name);
  const [customSchool, setCustomSchool] = useState(currentUser.school);
  const [role, setRole] = useState<UserRole>(currentUser.role);

  const providers = [
    {
      id: 'belajar_id',
      name: 'Akun Belajar.id (Kemendikbud)',
      icon: '🇮🇩',
      color: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      badge: 'Resmi Nasional'
    },
    {
      id: 'google',
      name: 'Google Workspace for Education',
      icon: '🌐',
      color: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
      badge: '1-Klik'
    },
    {
      id: 'kemdikbud',
      name: 'SSO Dapodik / Madrasah Kemenag',
      icon: '🏛️',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      badge: 'Sinkron NISN'
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: '𝕏',
      color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      badge: 'Medsos'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'f',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      badge: 'Medsos'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: customName,
      school: customSchool,
      role: role,
      registeredVia: selectedProvider as any,
      isOnline: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-amber-500 mb-1">
          <LogIn className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Integrasi Akun & Registrasi Kilat
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Masuk / Daftarkan Profil
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hubungkan akun pendidikan atau media sosial untuk menyimpan riwayat dan sertifikat lomba secara otomatis.
        </p>

        {/* Provider Select Cards */}
        <div className="space-y-2 mt-5">
          {providers.map((p) => {
            const isSelected = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProvider(p.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                  isSelected
                    ? 'ring-2 ring-amber-500 border-amber-500 shadow-sm'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{p.icon}</span>
                  <span className="text-slate-900 dark:text-white">{p.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-normal">
                    {p.badge}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Profile Inputs */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Nama Lengkap Siswa / Tim</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Asal Sekolah / Kontingen</label>
            <input
              type="text"
              value={customSchool}
              onChange={(e) => setCustomSchool(e.target.value)}
              className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition flex items-center justify-center space-x-1.5"
            >
              <span>Konfirmasi & Simpan Profil</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
