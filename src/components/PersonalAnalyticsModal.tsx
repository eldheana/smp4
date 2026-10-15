import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Award, 
  TrendingUp, 
  BrainCircuit,
  MessageCircle,
  Twitter,
  Facebook
} from 'lucide-react';
import { PersonalAnalytics, User } from '../types';

interface PersonalAnalyticsModalProps {
  analytics: PersonalAnalytics;
  user: User;
  onClose: () => void;
}

export const PersonalAnalyticsModal: React.FC<PersonalAnalyticsModalProps> = ({
  analytics,
  user,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🏆 Saya baru saja meraih skor ${analytics.totalScore} poin (Akurasi: ${analytics.accuracy}%, Peringkat #${analytics.rank}) dalam Kompetisi Cerdas Cermat Pro 2026! Ayo uji wawasanmu!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-2 text-amber-500 mb-1">
          <BrainCircuit className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Laporan Analitik Cerdas Cermat Dipersonalisasi
          </span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Analisis Performa: {user.name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {user.school} • Evaluasi Real-Time berbasis AI
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
            <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Akurasi</div>
            <div className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-200 mt-0.5">
              {analytics.accuracy}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Kecepatan</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-200 mt-0.5">
              {analytics.avgResponseTimeSeconds}s
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
            <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">Max Streak</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-950 dark:text-indigo-200 mt-0.5 flex items-center justify-center gap-0.5">
              <Flame className="w-4 h-4 text-orange-500" />
              {analytics.highestStreak}x
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">Peringkat</div>
            <div className="text-xl sm:text-2xl font-black text-purple-950 dark:text-purple-200 mt-0.5">
              #{analytics.rank}
            </div>
          </div>
        </div>

        {/* AI Personalized Coach Feedback */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 text-xs space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Rekomendasi Pelatih Cerdas Cermat:</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {analytics.aiFeedback}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
            {analytics.strengths.map((str, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {str}
              </span>
            ))}
          </div>
        </div>

        {/* Digital Achievement Card to Share */}
        <div className="mt-5 p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-center space-y-2">
          <Award className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {analytics.badgeEarned}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Diterbitkan secara digital untuk {user.name} ({user.school})
          </p>
        </div>

        {/* Social Media Share Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Bagikan Pencapaian Anda ke Media Sosial
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition shadow-sm"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter / X</span>
            </button>

            <button
              onClick={handleShareFacebook}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
