import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  ArrowRight, 
  Trophy, 
  History, 
  ShieldCheck, 
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';
import { CompetitionRound, Question } from '../types';

interface JadwalDanRiwayatProps {
  rounds: CompetitionRound[];
  activeRoundId: string;
  questions: Question[];
  onSelectRound: (roundId: string) => void;
  onSubscribeNotification: (roundTitle: string) => void;
}

export const JadwalDanRiwayat: React.FC<JadwalDanRiwayatProps> = ({
  rounds,
  activeRoundId,
  questions,
  onSelectRound,
  onSubscribeNotification
}) => {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'riwayat'>('jadwal');
  const [subscribedRounds, setSubscribedRounds] = useState<Record<string, boolean>>({});

  const handleToggleSubscribe = (round: CompetitionRound) => {
    setSubscribedRounds(prev => ({
      ...prev,
      [round.id]: !prev[round.id]
    }));
    onSubscribeNotification(round.title);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'jadwal'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal Resmi Babak Kompetisi</span>
          </button>

          <button
            onClick={() => setActiveTab('riwayat')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'riwayat'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat & Statistik Tahap Lalu</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Total 3 Babak Utama • Waktu Indonesia Barat (WIB)
        </div>
      </div>

      {/* -------------------- TAB 1: JADWAL RESMI -------------------- */}
      {activeTab === 'jadwal' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rounds.map((round) => {
              const isActive = round.id === activeRoundId;
              const isDone = round.status === 'completed';
              const isSubscribed = subscribedRounds[round.id];
              const roundQuestions = questions.filter(q => round.questionIds.includes(q.id));

              return (
                <div
                  key={round.id}
                  className={`relative rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-400 dark:border-amber-600 ring-2 ring-amber-500/30 shadow-lg'
                      : isDone
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-90'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      BABAK {round.roundNumber}
                    </span>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isActive 
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse'
                        : isDone 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {isActive ? '● SEDANG BERLANGSUNG' : isDone ? '✓ SELESAI' : 'TERJADWAL'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                      {round.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {round.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="my-5 py-3 border-y border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Waktu:
                      </span>
                      <strong className="font-semibold">{round.scheduleTime}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Mode:
                      </span>
                      <strong className="font-semibold">{round.roundNumber === 3 ? 'Bel Rebutan Interaktif' : 'Simultan Berbatas'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Jumlah Soal:
                      </span>
                      <strong className="font-semibold">{roundQuestions.length || round.questionIds.length} Soal</strong>
                    </div>
                  </div>

                  {/* Push Notification & Switch Action */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleToggleSubscribe(round)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition border ${
                        isSubscribed 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${isSubscribed ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span>{isSubscribed ? 'Notifikasi Aktif' : 'Ingatkan Saat Giliran'}</span>
                    </button>

                    <button
                      onClick={() => onSelectRound(round.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        isActive
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <span>{isActive ? 'Masuk Arena Lomba' : 'Buka Babak Ini'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: RIWAYAT & STATISTIK -------------------- */}
      {activeTab === 'riwayat' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                Rekapitulasi Riwayat Pertandingan Tahap Lalu
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Statistik akumulasi poin, tingkat kesulitan, dan validasi dewan juri
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Round 1 Record */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Status: Terverifikasi Lengkap
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  Babak I: Penyisihan Wajib Berbatas Waktu
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Rata-rata waktu menjawab peserta: <strong>14.2 detik</strong> • Akurasi kumulatif: <strong>82.5%</strong>
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Poin Maksimal</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">500 pts</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Pemimpin Sesi</div>
                  <div className="font-bold text-amber-500 text-sm">Rayhan Putra</div>
                </div>
              </div>
            </div>

            {/* Round 2 Record */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Status: Terverifikasi Lengkap
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  Babak II: Adu Kecepatan & Tebak Cepat
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Rata-rata waktu menjawab peserta: <strong>18.6 detik</strong> • Akurasi kumulatif: <strong>76.0%</strong>
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Poin Maksimal</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">600 pts</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">Pemimpin Sesi</div>
                  <div className="font-bold text-amber-500 text-sm">Anindya Putri</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
