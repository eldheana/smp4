import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  Zap, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  ShieldAlert, 
  Volume2, 
  Users, 
  Sparkles,
  ArrowRight,
  Maximize2,
  Sliders,
  Send,
  Radio
} from 'lucide-react';
import { User, UserRole, Question, CompetitionRound, BuzzerEvent, JuryVote } from '../types';
import { sounds } from '../utils/sound';

interface CompetitionArenaProps {
  currentUser: User;
  currentRole: UserRole;
  currentRound: CompetitionRound;
  currentQuestion: Question;
  questionsInRound: Question[];
  currentQuestionIndex: number;
  participants: User[];
  juries: User[];
  timeRemaining: number;
  totalTime: number;
  isBuzzerOpen: boolean;
  buzzerWinner: BuzzerEvent | null;
  buzzerQueue: BuzzerEvent[];
  juryVotes: Record<string, JuryVote>;
  onPressBuzzer: () => void;
  onSubmitAnswer: (answer: string) => void;
  onJuryVote: (decision: 'correct' | 'incorrect', notes?: string) => void;
  onSetTimer: (seconds: number) => void;
  onNextQuestion: () => void;
  onOpenBuzzer: () => void;
  onOpenAnalytics: () => void;
}

export const CompetitionArena: React.FC<CompetitionArenaProps> = ({
  currentUser,
  currentRole,
  currentRound,
  currentQuestion,
  questionsInRound,
  currentQuestionIndex,
  participants,
  juries,
  timeRemaining,
  totalTime,
  isBuzzerOpen,
  buzzerWinner,
  buzzerQueue,
  juryVotes,
  onPressBuzzer,
  onSubmitAnswer,
  onJuryVote,
  onSetTimer,
  onNextQuestion,
  onOpenBuzzer,
  onOpenAnalytics
}) => {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [juryNote, setJuryNote] = useState('');
  const [customTimeInput, setCustomTimeInput] = useState('');
  const [showTimeAdjuster, setShowTimeAdjuster] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [userNotification, setUserNotification] = useState<{ type: 'correct' | 'wrong' | 'info'; text: string } | null>(null);

  const isRebutan = currentRound.roundNumber === 3 || currentQuestion.round === 'rebutan';
  const isContestant = currentRole === 'peserta';
  const isJury = currentRole === 'juri';
  const isAdmin = currentRole === 'admin';
  const isSpectator = currentRole === 'penonton';

  // Check if current contestant won the buzzer
  const hasWonBuzzer = buzzerWinner && buzzerWinner.userId === currentUser.id;

  // Timer percentage
  const timerPercentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  // Handle contestant submitting an answer
  const handleAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedAnswer.trim() && selectedOption === null) return;
    
    const ans = selectedOption !== null && currentQuestion.options 
      ? currentQuestion.options[selectedOption] 
      : typedAnswer;

    onSubmitAnswer(ans);
    setIsAnswering(false);
    setUserNotification({
      type: 'info',
      text: 'Jawaban terkirim! Menunggu dewan juri memverifikasi.'
    });
    setTypedAnswer('');
  };

  // Sound cues for buzzer win or timer running out
  useEffect(() => {
    if (timeRemaining <= 5 && timeRemaining > 0) {
      sounds.playTick();
    }
  }, [timeRemaining]);

  const sortedLeaderboard = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Round Header & Status Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                SIARAN LANGSUNG
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {currentRound.title}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Soal Ke-{currentQuestionIndex + 1} dari {questionsInRound.length}: <span className="text-amber-600 dark:text-amber-400">{currentQuestion.category}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tingkat Kesulitan: <strong className="capitalize font-semibold text-slate-700 dark:text-slate-300">{currentQuestion.difficulty}</strong> • Nilai: <strong className="text-emerald-600 dark:text-emerald-400">+{currentQuestion.points} Poin</strong> • Penalti Salah: <strong className="text-rose-600 dark:text-rose-400">-50 Poin</strong>
            </p>
          </div>

          {/* Countdown Clock with Circular / Bar Graphic */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Clock className={`w-6 h-6 ${timeRemaining <= 5 ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Sisa Waktu</div>
                <div className={`text-2xl font-mono font-black ${timeRemaining <= 5 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                  {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Admin/Jury Timer Adjuster Quick Menu */}
            {(isJury || isAdmin) && (
              <div className="relative">
                <button
                  onClick={() => setShowTimeAdjuster(!showTimeAdjuster)}
                  className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
                  title="Atur waktu khusus untuk soal sulit"
                >
                  <Sliders className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Waktu</span>
                </button>

                {showTimeAdjuster && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-30">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Ubah Waktu Soal Ini</p>
                    <div className="grid grid-cols-3 gap-1.5 mt-2">
                      {[15, 30, 45, 60, 90, 120].map((s) => (
                        <button
                          key={s}
                          onClick={() => { onSetTimer(s); setShowTimeAdjuster(false); }}
                          className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-white text-slate-700 dark:text-slate-200 transition"
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar of Timer */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              timeRemaining <= 5 
                ? 'bg-rose-500' 
                : timeRemaining <= 10 
                ? 'bg-amber-500' 
                : 'bg-emerald-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Question Prompt & Stage vs Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Center Column: Question Display & Buzzer / Answer Input */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Question Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pertanyaan Resmi Dewan Juri
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                ID: {currentQuestion.id}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Multiple Choice Options (If applicable, e.g. Babak Penyisihan) */}
            {currentQuestion.options && currentQuestion.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {currentQuestion.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      disabled={!isContestant || !isBuzzerOpen && !hasWonBuzzer}
                      onClick={() => setSelectedOption(idx)}
                      className={`flex items-start space-x-3 p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/50 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm font-semibold pt-0.5 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* E2EE Answer Status for Contestants vs Decrypted for Panitia/Juri */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              {isJury || isAdmin ? (
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase">
                      <Lock className="w-3.5 h-3.5" />
                      Kunci Jawaban Resmi (Terdekripsi Khusus Juri & Panitia)
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                      E2EE Verified
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-black text-indigo-950 dark:text-indigo-100 mt-1">
                    {currentQuestion.decryptedAnswer || 'Memuat jawaban...'}
                  </p>
                  <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-1">
                    <strong>Pembahasan:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Kerahasiaan Terjamin:</strong> Kunci jawaban dienkripsi secara end-to-end (E2EE 256-bit AES) dan hanya dapat dibuka oleh 5 Dewan Juri Nasional untuk memverifikasi.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* INTERACTIVE BUZZER SECTION FOR BABAK REBUTAN */}
          {isRebutan && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-red-400">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Sistem Bel Rebutan Sinkron (Real-Time Buzzer)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sistem mendeteksi penekan pertama dengan akurasi sub-milidetik.
                  </p>
                </div>
                
                {/* Buzzer status pill */}
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isBuzzerOpen 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isBuzzerOpen ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {isBuzzerOpen ? 'Bel Terbuka: SIAP TEKAN!' : 'Bel Terkunci'}
                  </span>
                </div>
              </div>

              {/* Buzzer Arena Center Stage */}
              <div className="py-8 flex flex-col items-center justify-center text-center">
                
                {/* Active Buzzer Winner Announcement */}
                {buzzerWinner ? (
                  <div className="space-y-4 max-w-md w-full animate-in zoom-in-95 duration-200">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 shadow-lg text-center">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                        ⚡ PENELITI TERCEPAT MEMPEROLEH HAK JAWAB ⚡
                      </div>
                      <div className="flex items-center justify-center space-x-3 mt-3">
                        <img 
                          src={buzzerWinner.avatar} 
                          alt={buzzerWinner.userName}
                          className="w-12 h-12 rounded-full ring-2 ring-amber-400 object-cover" 
                        />
                        <div className="text-left">
                          <h4 className="text-lg font-black text-white">{buzzerWinner.userName}</h4>
                          <p className="text-xs text-amber-200/80">{buzzerWinner.school}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs font-mono bg-black/40 py-1 px-3 rounded-full inline-block text-amber-300">
                        Waktu Reaksi: {buzzerWinner.deltaMs} ms
                      </div>
                    </div>

                    {/* If user is the winner, show answer input */}
                    {hasWonBuzzer && (
                      <form onSubmit={handleAnswerSubmit} className="space-y-3">
                        <div className="text-sm font-semibold text-emerald-400">
                          Giliran Anda menjawab! Ketik atau ucapkan jawaban Anda:
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={typedAnswer}
                            onChange={(e) => setTypedAnswer(e.target.value)}
                            placeholder="Tuliskan jawaban lengkap Anda di sini..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/30"
                          >
                            <Send className="w-4 h-4" />
                            <span>Kirim</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  /* BIG 3D BUZZER BUTTON */
                  <div className="flex flex-col items-center">
                    <button
                      disabled={!isBuzzerOpen || !isContestant}
                      onClick={onPressBuzzer}
                      className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full font-black text-white text-xl sm:text-2xl transition-all duration-200 select-none flex flex-col items-center justify-center border-8 shadow-2xl active:scale-95 ${
                        isBuzzerOpen && isContestant
                          ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-red-500 border-red-700 cursor-pointer animate-buzzer-ready hover:scale-105 active:border-red-900 active:shadow-inner'
                          : 'bg-slate-800 border-slate-700 opacity-60 cursor-not-allowed text-slate-500'
                      }`}
                    >
                      <Zap className={`w-10 h-10 mb-1 ${isBuzzerOpen && isContestant ? 'text-yellow-300 animate-bounce' : 'text-slate-600'}`} />
                      <span>{isBuzzerOpen ? 'TEKAN BEL' : 'TERKUNCI'}</span>
                      <span className="text-[11px] font-normal tracking-wide opacity-80 mt-1">
                        {isBuzzerOpen ? 'KLIK SEKARANG!' : 'Menunggu Juri'}
                      </span>
                    </button>

                    <p className="text-xs text-slate-400 mt-4 max-w-xs">
                      {isContestant 
                        ? 'Pastikan jari Anda siap. Peserta tercepat akan langsung mengunci bel dan mendapatkan kesempatan menjawab.' 
                        : isJury || isAdmin 
                        ? 'Anda login sebagai Panitia/Juri. Tekan "Buka Bel" untuk memulai babak rebutan.'
                        : 'Mode Penonton: Menikmati kompetisi real-time.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Buzzer Lockout Log / Queue */}
              {buzzerQueue.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-2">Urutan Penekanan Bel:</div>
                  <div className="flex flex-wrap gap-2">
                    {buzzerQueue.map((item, idx) => (
                      <span 
                        key={item.id} 
                        className={`text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1.5 ${
                          idx === 0 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span>#{idx + 1}</span>
                        <span>{item.userName}</span>
                        <span className="font-mono text-[10px] opacity-75">+{item.deltaMs}ms</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JURY PANEL CONTROLS (Only visible if user is Juri or Admin) */}
          {(isJury || isAdmin) && (
            <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Panel Verifikasi 5 Dewan Juri Nasional
                  </h3>
                </div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                  Hak Khusus Juri
                </div>
              </div>

              {/* 5-Juries Voting Status */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {juries.map((juri) => {
                  const vote = juryVotes[juri.id];
                  return (
                    <div 
                      key={juri.id}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        vote?.decision === 'correct' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                          : vote?.decision === 'incorrect'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Juri #{juri.juriIndex}
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {juri.name.split(' ')[0]}
                      </div>
                      <div className="text-[11px] font-semibold mt-1">
                        {vote ? (
                          <span className={vote.decision === 'correct' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {vote.decision === 'correct' ? 'BENAR' : 'SALAH'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Menunggu</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Jury Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onJuryVote('correct', juryNote)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi BENAR (+100)</span>
                  </button>

                  <button
                    onClick={() => onJuryVote('incorrect', juryNote)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Verifikasi SALAH (-50)</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={onOpenBuzzer}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 hover:bg-amber-200 transition"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Buka Ulang Bel</span>
                  </button>

                  <button
                    onClick={onNextQuestion}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                  >
                    <span>Soal Berikutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Leaderboard ala Wayground & Presence */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Wayground Style Live Leaderboard Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Klasemen Real-Time (Wayground)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Live Sinkron
              </span>
            </div>

            {/* Top 3 Wayground Podium Visual */}
            <div className="grid grid-cols-3 gap-2 pt-2 pb-1 items-end text-center">
              {/* Rank 2 */}
              {sortedLeaderboard[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={sortedLeaderboard[1].avatar} 
                      alt={sortedLeaderboard[1].name} 
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-300"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-300 text-slate-800 font-extrabold text-[10px] flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full mt-1.5">
                    {sortedLeaderboard[1].name.split(' ')[0]}
                  </div>
                  <div className="text-xs font-mono font-extrabold text-slate-600 dark:text-slate-300">
                    {sortedLeaderboard[1].score}
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-10 rounded-t-lg mt-1 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    🥈 Perak
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Winner) */}
              {sortedLeaderboard[0] && (
                <div className="flex flex-col items-center -mt-3">
                  <div className="relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">👑</div>
                    <img 
                      src={sortedLeaderboard[0].avatar} 
                      alt={sortedLeaderboard[0].name} 
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-amber-400"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow">
                      1
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate w-full mt-1.5">
                    {sortedLeaderboard[0].name.split(' ')[0]}
                  </div>
                  <div className="text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                    {sortedLeaderboard[0].score}
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 h-16 rounded-t-lg mt-1 flex items-center justify-center text-xs font-black text-amber-950 shadow-sm">
                    🥇 Emas
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {sortedLeaderboard[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={sortedLeaderboard[2].avatar} 
                      alt={sortedLeaderboard[2].name} 
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-700"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-extrabold text-[10px] flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full mt-1.5">
                    {sortedLeaderboard[2].name.split(' ')[0]}
                  </div>
                  <div className="text-xs font-mono font-extrabold text-slate-600 dark:text-slate-300">
                    {sortedLeaderboard[2].score}
                  </div>
                  <div className="w-full bg-amber-100 dark:bg-amber-900/50 h-8 rounded-t-lg mt-1 flex items-center justify-center text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    🥉 Perunggu
                  </div>
                </div>
              )}
            </div>

            {/* Full Ranking List with Streak & Delta */}
            <div className="space-y-2 pt-2">
              {sortedLeaderboard.map((contestant, idx) => {
                const isMe = contestant.id === currentUser.id;
                return (
                  <div 
                    key={contestant.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                      isMe 
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-1 ring-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={`w-5 font-bold font-mono text-center ${idx < 3 ? 'text-amber-500 font-extrabold' : 'text-slate-400'}`}>
                        #{idx + 1}
                      </span>
                      <img 
                        src={contestant.avatar} 
                        alt={contestant.name} 
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                          <span>{contestant.name}</span>
                          {isMe && <span className="text-[9px] bg-amber-500 text-white px-1 rounded">Saya</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {contestant.school}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {contestant.score}
                      </div>
                      {contestant.streak > 1 && (
                        <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-0.5">
                          <span>🔥 {contestant.streak}x Streak</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Personalized Analytics Button */}
            <div className="pt-2">
              <button
                onClick={onOpenAnalytics}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Lihat Analisis Performa & Bagikan</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
