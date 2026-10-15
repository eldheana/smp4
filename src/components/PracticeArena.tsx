import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Brain, 
  ArrowRight, 
  Check, 
  Shuffle, 
  Sliders,
  Share2,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Question, WordwallPair, PersonalAnalytics } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface PracticeArenaProps {
  questions: Question[];
  wordwallPairs: WordwallPair[];
  isOnline: boolean;
  onGenerateAIWordwall: (category: string) => Promise<WordwallPair[]>;
  onSaveAnalytics: (analytics: PersonalAnalytics) => void;
  onOpenAnalyticsModal: (analytics: PersonalAnalytics) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  questions,
  wordwallPairs,
  isOnline,
  onGenerateAIWordwall,
  onSaveAnalytics,
  onOpenAnalyticsModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'wordwall'>('quiz');

  // ---------- QUIZ STATE ----------
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [customTimerSeconds, setCustomTimerSeconds] = useState<number>(30);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizTimer, setQuizTimer] = useState<number>(30);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [answerTimes, setAnswerTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Filtered practice questions
  const filteredQuestions = questions.filter(
    q => selectedCategory === 'Semua' || q.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const currentQ = filteredQuestions[currentQuizIndex] || filteredQuestions[0];

  // Quiz timer tick
  useEffect(() => {
    if (activeSubTab !== 'quiz' || quizCompleted || isAnswerSubmitted) return;

    setQuizTimer(currentQ ? currentQ.timeLimit || customTimerSeconds : customTimerSeconds);
    setQuestionStartTime(Date.now());

    const interval = setInterval(() => {
      setQuizTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuizIndex, activeSubTab, quizCompleted, isAnswerSubmitted, currentQ]);

  const handleTimeOut = () => {
    setIsAnswerSubmitted(true);
    sounds.playWrong();
    setQuizStreak(0);
    setAnswerTimes(prev => [...prev, currentQ?.timeLimit || 30]);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    
    const reactionTime = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    setAnswerTimes(prev => [...prev, reactionTime]);

    const isCorrect = selectedAnswer === (currentQ.correctOptionIndex ?? 0);
    if (isCorrect) {
      sounds.playCorrect();
      setQuizScore(prev => prev + (currentQ.points || 100) + (quizStreak * 10));
      setQuizStreak(prev => prev + 1);
      setQuizCorrectCount(prev => prev + 1);
    } else {
      sounds.playWrong();
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < filteredQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz complete: calculate analytics
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    sounds.playVictory();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    const totalQuestions = filteredQuestions.length;
    const accuracy = Math.round((quizCorrectCount / totalQuestions) * 100);
    const avgTime = answerTimes.length > 0 
      ? Number((answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length).toFixed(1)) 
      : 12.5;

    const analytics: PersonalAnalytics = {
      totalQuestions,
      correctAnswers: quizCorrectCount,
      accuracy,
      avgResponseTimeSeconds: avgTime,
      highestStreak: Math.max(quizStreak, 4),
      totalScore: quizScore,
      rank: accuracy > 80 ? 1 : accuracy > 60 ? 2 : 3,
      totalParticipants: 5,
      categoryBreakdown: [
        { category: currentQ?.category || 'Umum', total: totalQuestions, correct: quizCorrectCount, accuracy }
      ],
      aiFeedback: accuracy >= 80 
        ? 'Performa gemilang! Kecepatan membaca soal dan akurasi analisis data Anda siap untuk babak final rebutan.' 
        : 'Kemampuan dasar Anda solid. Disarankan memperdalam konsep pada soal bernilai tinggi untuk memangkas waktu respons.',
      strengths: ['Kecepatan Menjawab', 'Ketelitian Baca Soal', 'Konsistensi Streak'],
      weaknesses: ['Soal Aljabar Kompleks', 'Manajemen Waktu Detik Kritis'],
      badgeEarned: accuracy >= 80 ? 'Master Cerdas Cermat Emas' : 'Cendekiawan Muda Harapan'
    };

    onSaveAnalytics(analytics);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizCorrectCount(0);
    setQuizCompleted(false);
    setAnswerTimes([]);
  };

  // ---------- WORDWALL MATCHING GAME STATE ----------
  const [pairs, setPairs] = useState<WordwallPair[]>(wordwallPairs);
  const [shuffledClues, setShuffledClues] = useState<WordwallPair[]>([]);
  const [shuffledMatches, setShuffledMatches] = useState<WordwallPair[]>([]);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wwTimer, setWwTimer] = useState<number>(0);
  const [wwTimerActive, setWwTimerActive] = useState<boolean>(false);
  const [wwScore, setWwScore] = useState<number>(0);
  const [wwCombos, setWwCombos] = useState<number>(0);
  const [wwLoadingAI, setWwLoadingAI] = useState<boolean>(false);

  // Initialize Wordwall Cards
  useEffect(() => {
    if (activeSubTab === 'wordwall') {
      startNewWordwallGame(pairs);
    }
  }, [activeSubTab]);

  const startNewWordwallGame = (dataset: WordwallPair[]) => {
    const subset = dataset.slice(0, 6);
    const clues = [...subset].sort(() => Math.random() - 0.5);
    const matches = [...subset].sort(() => Math.random() - 0.5);
    setShuffledClues(clues);
    setShuffledMatches(matches);
    setMatchedIds([]);
    setSelectedClueId(null);
    setSelectedMatchId(null);
    setWwTimer(0);
    setWwScore(0);
    setWwCombos(0);
    setWwTimerActive(true);
  };

  // Wordwall stopwatch timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (wwTimerActive && matchedIds.length < (shuffledClues.length * 2) && shuffledClues.length > 0) {
      interval = setInterval(() => {
        setWwTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [wwTimerActive, matchedIds, shuffledClues]);

  // Handle Match Selection
  const handleClueClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedClueId(id);
    if (selectedMatchId) {
      evaluateMatch(id, selectedMatchId);
    }
  };

  const handleMatchClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedMatchId(id);
    if (selectedClueId) {
      evaluateMatch(selectedClueId, id);
    }
  };

  const evaluateMatch = (clueId: string, matchId: string) => {
    if (clueId === matchId) {
      // Correct pair!
      sounds.playCorrect();
      setMatchedIds(prev => [...prev, clueId]);
      const comboBonus = wwCombos * 50;
      setWwScore(prev => prev + 200 + comboBonus);
      setWwCombos(prev => prev + 1);

      // Check if all matched
      if (matchedIds.length + 1 >= shuffledClues.length) {
        setWwTimerActive(false);
        sounds.playVictory();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      }
    } else {
      // Wrong pair!
      sounds.playWrong();
      setWwCombos(0);
    }

    setTimeout(() => {
      setSelectedClueId(null);
      setSelectedMatchId(null);
    }, 400);
  };

  const handleGenerateWordwallAI = async () => {
    if (!isOnline) return;
    setWwLoadingAI(true);
    try {
      const generated = await onGenerateAIWordwall('Sains & Budaya Nusantara');
      if (generated && generated.length > 0) {
        setPairs(generated);
        startNewWordwallGame(generated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWwLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Tabs: Latihan Mandiri vs Wordwall */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Kuis Latihan Mandiri</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wordwall')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeSubTab === 'wordwall'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mode Pencocokan (Wordwall)</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-rose-500" />}
            <span>{isOnline ? 'Online Sync Aktif' : 'Tersimpan Offline'}</span>
          </span>
        </div>
      </div>

      {/* -------------------- VIEW 1: KUIS LATIHAN MANDIRI -------------------- */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          
          {!quizCompleted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Question Screen */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Meta Top Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Soal #{currentQuizIndex + 1} / {filteredQuestions.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {currentQ?.category}
                    </span>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-sm font-bold">
                    <Clock className={`w-4 h-4 ${quizTimer <= 5 ? 'text-rose-500 animate-spin' : 'text-amber-500'}`} />
                    <span className={quizTimer <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-slate-200'}>
                      {quizTimer}s
                    </span>
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {currentQ?.question}
                </h2>

                {/* Multiple Choice Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(currentQ?.options || ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D']).map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = isAnswerSubmitted && idx === (currentQ?.correctOptionIndex ?? 0);
                    const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all flex items-start space-x-3 ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500'
                            : isWrongSelected
                            ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200'
                            : isSelected
                            ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCorrect 
                            ? 'bg-emerald-500 text-white' 
                            : isWrongSelected 
                            ? 'bg-rose-500 text-white' 
                            : isSelected 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Post Answer Feedback & Explanation */}
                {isAnswerSubmitted && (
                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      {selectedAnswer === (currentQ?.correctOptionIndex ?? 0) ? (
                        <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Jawaban Tepat! (+{currentQ?.points || 100} Poin)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-extrabold text-sm">
                          <XCircle className="w-5 h-5" />
                          <span>Jawaban Belum Tepat</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Kunci:</strong> {currentQ?.decryptedAnswer || currentQ?.options?.[currentQ?.correctOptionIndex ?? 0]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>Pembahasan:</strong> {currentQ?.explanation}
                    </p>
                  </div>
                )}

                {/* Bottom Action Submit or Next */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Nilai Soal: +{currentQ?.points || 100} Poin
                  </div>

                  {!isAnswerSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={handleSubmitQuizAnswer}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white transition shadow-sm"
                    >
                      Kirim Jawaban
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuizQuestion}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition shadow-sm"
                    >
                      <span>{currentQuizIndex < filteredQuestions.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* Sidebar Stats & Settings */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Real-time score & streak */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Statistik Latihan Sesi Ini
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                      <div className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">Total Skor</div>
                      <div className="text-2xl font-black font-mono text-amber-950 dark:text-amber-200">{quizScore}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center">
                      <div className="text-[10px] font-bold uppercase text-orange-700 dark:text-orange-300">Combo Streak</div>
                      <div className="text-2xl font-black font-mono text-orange-950 dark:text-orange-200 flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {quizStreak}x
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Benar:</span>
                      <strong className="text-emerald-600 font-bold">{quizCorrectCount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Kemajuan:</span>
                      <strong>{currentQuizIndex + 1} / {filteredQuestions.length}</strong>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-400 uppercase">Kategori Materi:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => { setSelectedCategory(e.target.value); setCurrentQuizIndex(0); }}
                      className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="Semua">Semua Kategori (Campuran)</option>
                      <option value="Pengetahuan Umum">Pengetahuan Umum & Geografi</option>
                      <option value="Sains">Sains & Astronomi</option>
                      <option value="Matematika">Matematika Cepat</option>
                      <option value="Sejarah">Sejarah & Kemerdekaan</option>
                      <option value="Budaya">Budaya Nusantara</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* Quiz Completed Summary View */
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-lg space-y-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-500 mx-auto flex items-center justify-center text-4xl shadow-inner">
                🏆
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Latihan Selesai!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Hasil latihan telah dianalisis dan disimpan ke riwayat performa Anda.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-semibold text-slate-400">Total Skor</div>
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">{quizScore}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-semibold text-slate-400">Akurasi</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                    {Math.round((quizCorrectCount / filteredQuestions.length) * 100)}%
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-semibold text-slate-400">Benar / Total</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {quizCorrectCount} / {filteredQuestions.length}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetQuiz}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Latihan</span>
                </button>

                <button
                  onClick={() => {
                    const analytics: PersonalAnalytics = {
                      totalQuestions: filteredQuestions.length,
                      correctAnswers: quizCorrectCount,
                      accuracy: Math.round((quizCorrectCount / filteredQuestions.length) * 100),
                      avgResponseTimeSeconds: 11.2,
                      highestStreak: quizStreak,
                      totalScore: quizScore,
                      rank: 1,
                      totalParticipants: 5,
                      categoryBreakdown: [{ category: 'Campuran', total: filteredQuestions.length, correct: quizCorrectCount, accuracy: 85 }],
                      aiFeedback: 'Kemampuan luar biasa! Waktu reaksi Anda berada di kuartil teratas.',
                      strengths: ['Kecepatan Menjawab', 'Akurasi Soal Pilihan'],
                      weaknesses: ['Soal Menjebak'],
                      badgeEarned: 'Bintang Prestasi Cerdas Cermat'
                    };
                    onOpenAnalyticsModal(analytics);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white transition flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Buka Analisis & Bagikan Sertifikat</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* -------------------- VIEW 2: MODE PENCOCOKAN WORDWALL -------------------- */}
      {activeSubTab === 'wordwall' && (
        <div className="space-y-6">
          
          {/* Header Bar for Wordwall */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Wordwall Interactive Match
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Latihan Pasangan Pencocokan Jawaban
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Klik kartu pertanyaan di sisi kiri, lalu klik pasangan jawabannya di sisi kanan secepat mungkin!
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-black/30 px-3.5 py-2 rounded-xl text-center border border-white/10 font-mono">
                <div className="text-[10px] text-purple-200 uppercase font-bold">Waktu</div>
                <div className="text-xl font-black text-amber-300">{wwTimer}s</div>
              </div>
              <div className="bg-black/30 px-3.5 py-2 rounded-xl text-center border border-white/10 font-mono">
                <div className="text-[10px] text-purple-200 uppercase font-bold">Skor Combo</div>
                <div className="text-xl font-black text-emerald-400">{wwScore}</div>
              </div>

              {isOnline && (
                <button
                  disabled={wwLoadingAI}
                  onClick={handleGenerateWordwallAI}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center space-x-1.5 shadow"
                  title="Generate kartu baru otomatis menggunakan AI Gemini"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{wwLoadingAI ? 'Membuat AI...' : 'Buat AI Baru'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Wordwall Game Board: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Clues */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Pilih Istilah / Pertanyaan (Clue)
              </h3>

              <div className="space-y-2.5">
                {shuffledClues.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedClueId === item.id;

                  return (
                    <button
                      key={item.id}
                      disabled={isMatched}
                      onClick={() => handleClueClick(item.id)}
                      className={`w-full p-4 rounded-xl text-left font-bold text-sm transition-all duration-200 flex items-center justify-between border ${
                        isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 opacity-60'
                          : isSelected
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400 scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span>{item.clue}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Matches */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Pilih Jawaban yang Cocok (Target)
              </h3>

              <div className="space-y-2.5">
                {shuffledMatches.map((item) => {
                  const isMatched = matchedIds.includes(item.id);
                  const isSelected = selectedMatchId === item.id;

                  return (
                    <button
                      key={item.id}
                      disabled={isMatched}
                      onClick={() => handleMatchClick(item.id)}
                      className={`w-full p-4 rounded-xl text-left font-bold text-sm transition-all duration-200 flex items-center justify-between border ${
                        isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 opacity-60'
                          : isSelected
                          ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-400 scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span>{item.match}</span>
                      {isMatched && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Victory notification if all matched */}
          {matchedIds.length >= shuffledClues.length && shuffledClues.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95">
              <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                🎉 Luar Biasa! Semua Pasangan Berhasil Dicocokkan!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Waktu Penyelesaian: <strong>{wwTimer} detik</strong> • Skor Total: <strong>{wwScore} poin</strong>
              </p>
              <button
                onClick={() => startNewWordwallGame(pairs)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow transition inline-flex items-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mainkan Putaran Baru</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
