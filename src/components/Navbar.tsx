import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  ShieldCheck, 
  Eye, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Bell, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  LogIn, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UserRole, User, PushNotification } from '../types';
import { sounds } from '../utils/sound';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole, juriIndex?: number) => void;
  currentUser: User;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOnline: boolean;
  onlineCounts: {
    participants: number;
    juries: number;
    audience: number;
  };
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  onOpenSocialLogin: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  isOnline,
  onlineCounts,
  notifications,
  onOpenNotifications,
  onOpenSocialLogin,
  activeTab,
  onTabChange
}) => {
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('arena')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-extrabold text-lg">
              <Trophy className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  CerdasCermat<span className="text-amber-500 dark:text-amber-400">PRO</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Nasional 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Arena Lomba Daring & Latihan Mandiri Real-Time
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Tabs) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { id: 'arena', label: 'Arena Lomba', icon: Trophy },
              { id: 'latihan', label: 'Latihan & Wordwall', icon: Sparkles },
              { id: 'leaderboard', label: 'Papan Peringkat', icon: Users },
              { id: 'jadwal', label: 'Jadwal & Riwayat', icon: ShieldCheck },
              { id: 'admin', label: 'Admin & Soal', icon: UserCheck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Realtime Presence Pills */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/70 px-2.5 py-1 rounded-full text-[11px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span className="flex items-center space-x-1 font-medium" title="5 Juri Terdaftar & Hadir">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{onlineCounts.juries} Juri</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center space-x-1" title="Peserta Terhubung">
                <span>{onlineCounts.participants} Peserta</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center space-x-1" title="Penonton Live">
                <Eye className="w-3 h-3 text-indigo-500" />
                <span>{onlineCounts.audience}</span>
              </span>
            </div>

            {/* Offline/Online Status */}
            <div 
              className={`hidden sm:flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse'
              }`}
              title={isOnline ? 'Terhubung ke Server Cerdas Cermat' : 'Mode Offline Aktif - Latihan Lokal Siap'}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Audio Mute/Unmute */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isMuted ? 'Aktifkan Suara Bel & Efek' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* Push Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Notifikasi Jadwal & Kompetisi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-500"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-tight capitalize text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{currentRole}</span>
                    {currentUser.juriIndex && (
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1 rounded">
                        #{currentUser.juriIndex}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                    {currentUser.name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pilih Peran Pengguna</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                      Hak akses disesuaikan untuk simulasi lengkap
                    </p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => { onRoleChange('peserta'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                        currentRole === 'peserta' ? 'bg-amber-500 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-amber-300" />
                        <div>
                          <div className="font-semibold">Peserta Lomba</div>
                          <div className={`text-[10px] ${currentRole === 'peserta' ? 'text-amber-100' : 'text-slate-400'}`}>Akses Bel, Jawab Soal, Analitik</div>
                        </div>
                      </div>
                      {currentRole === 'peserta' && <span className="text-[10px]">Aktif</span>}
                    </button>

                    <div className="pt-1 pb-0.5 px-3 text-[10px] font-bold text-slate-400 uppercase">
                      Panel 5 Dewan Juri (Pilih Juri)
                    </div>

                    {[1, 2, 3, 4, 5].map(idx => (
                      <button
                        key={idx}
                        onClick={() => { onRoleChange('juri', idx); setShowRoleMenu(false); }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                          currentRole === 'juri' && currentUser.juriIndex === idx
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Juri #{idx} {idx === 1 ? '(Ketua)' : ''}</span>
                        </div>
                        <span className="text-[10px] opacity-75">Kunci E2EE</span>
                      </button>
                    ))}

                    <div className="border-t border-slate-100 dark:border-slate-700/60 my-1"></div>

                    <button
                      onClick={() => { onRoleChange('admin'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                        currentRole === 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-emerald-300" />
                        <div>
                          <div className="font-semibold">Admin Master & Bank Soal</div>
                          <div className={`text-[10px] ${currentRole === 'admin' ? 'text-emerald-100' : 'text-slate-400'}`}>Generator AI, Kelola Peserta & Reset</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onRoleChange('penonton'); setShowRoleMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                        currentRole === 'penonton' ? 'bg-purple-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-purple-300" />
                        <div>
                          <div className="font-semibold">Layar Penonton / Panggung</div>
                          <div className={`text-[10px] ${currentRole === 'penonton' ? 'text-purple-100' : 'text-slate-400'}`}>Tampilan Live Broadcast Proyektor</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/80 rounded-b-xl">
                    <button
                      onClick={() => { setShowRoleMenu(false); onOpenSocialLogin(); }}
                      className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition"
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-500" />
                      <span>Masuk Akun Medsos / Belajar.id</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation bar at bottom of header */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-200 dark:border-slate-800 overflow-x-auto gap-1">
          {[
            { id: 'arena', label: 'Lomba', icon: Trophy },
            { id: 'latihan', label: 'Latihan & Wordwall', icon: Sparkles },
            { id: 'leaderboard', label: 'Peringkat', icon: Users },
            { id: 'jadwal', label: 'Jadwal', icon: ShieldCheck },
            { id: 'admin', label: 'Admin', icon: UserCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
