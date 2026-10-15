import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CompetitionArena } from './components/CompetitionArena';
import { PracticeArena } from './components/PracticeArena';
import { LeaderboardWayground } from './components/LeaderboardWayground';
import { JadwalDanRiwayat } from './components/JadwalDanRiwayat';
import { AdminDashboard } from './components/AdminDashboard';
import { PersonalAnalyticsModal } from './components/PersonalAnalyticsModal';
import { SocialLoginModal } from './components/SocialLoginModal';
import { PushNotificationDrawer } from './components/PushNotificationDrawer';
import { 
  UserRole, 
  User, 
  Question, 
  WordwallPair, 
  CompetitionRound, 
  BuzzerEvent, 
  JuryVote, 
  PersonalAnalytics, 
  PushNotification 
} from './types';
import { 
  INITIAL_CONTESTANTS, 
  INITIAL_JURIES, 
  INITIAL_ROUNDS, 
  INITIAL_QUESTIONS, 
  INITIAL_WORDWALL_PAIRS 
} from './data/seedData';
import { 
  getOfflineQuestions, 
  saveOfflineQuestions, 
  getOfflineWordwallPairs, 
  saveOfflineWordwallPairs,
  savePracticeSession 
} from './utils/offlineStorage';
import { sounds } from './utils/sound';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cerdas_cermat_theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Online / Offline network state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Active Role and User
  const [currentRole, setCurrentRole] = useState<UserRole>('peserta');
  const [participants, setParticipants] = useState<User[]>(INITIAL_CONTESTANTS);
  const [juries, setJuries] = useState<User[]>(INITIAL_JURIES);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CONTESTANTS[0]);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('arena');

  // Competition Rounds and Questions
  const [rounds, setRounds] = useState<CompetitionRound[]>(INITIAL_ROUNDS);
  const [activeRoundId, setActiveRoundId] = useState<string>('round-3'); // Default to Babak Rebutan
  const [questions, setQuestions] = useState<Question[]>(() => getOfflineQuestions());
  const [wordwallPairs, setWordwallPairs] = useState<WordwallPair[]>(() => getOfflineWordwallPairs());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Competition Timer & Live Buzzer State
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [totalTime, setTotalTime] = useState<number>(30);
  const [isBuzzerOpen, setIsBuzzerOpen] = useState<boolean>(true);
  const [buzzerWinner, setBuzzerWinner] = useState<BuzzerEvent | null>(null);
  const [buzzerQueue, setBuzzerQueue] = useState<BuzzerEvent[]>([]);
  const [juryVotes, setJuryVotes] = useState<Record<string, JuryVote>>({});
  const [onlineAudienceCount, setOnlineAudienceCount] = useState<number>(142);

  // Notifications
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'notif-1',
      title: 'Babak III: Rebutan Telah Dimulai!',
      message: 'Dewan juri telah membuka bel rebutan. Peserta diharapkan bersiap di posisi masing-masing.',
      timestamp: 'Baru saja',
      type: 'round_start',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Jadwal Penutupan & Final Nasional',
      message: 'Sesi pengumuman juara dan penyerahan piala akan dimulai pukul 13:00 WIB.',
      timestamp: '15 mnt lalu',
      type: 'schedule',
      read: false
    }
  ]);

  // Modals
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [activeAnalytics, setActiveAnalytics] = useState<PersonalAnalytics | null>(null);
  const [showSocialLogin, setShowSocialLogin] = useState<boolean>(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // Sync theme class with HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cerdas_cermat_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cerdas_cermat_theme', 'light');
    }
  }, [isDarkMode]);

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Poll server state every 3 seconds if online
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/competition/state');
        if (res.ok) {
          const data = await res.json();
          if (data.state) {
            setOnlineAudienceCount(data.state.onlineAudienceCount);
            if (data.state.participants) {
              setParticipants(data.state.participants);
            }
          }
        }
      } catch {
        // server offline fallback
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOnline]);

  // Active round object & questions in round
  const activeRound = rounds.find((r) => r.id === activeRoundId) || rounds[2];
  const roundQuestions = questions.filter((q) => activeRound.questionIds.includes(q.id));
  const currentQuestion = roundQuestions[currentQuestionIndex] || roundQuestions[0] || questions[0];

  // Timer countdown tick
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Role change handler
  const handleRoleChange = (role: UserRole, juriIndex?: number) => {
    setCurrentRole(role);
    if (role === 'peserta') {
      setCurrentUser(participants[0]);
    } else if (role === 'juri') {
      const targetJuri = juries.find((j) => j.juriIndex === (juriIndex || 1)) || juries[0];
      setCurrentUser(targetJuri);
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-master',
        name: 'Panitia Pelaksana Nasional',
        role: 'admin',
        school: 'Kementerian Pendidikan & Kebudayaan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        isOnline: true,
        score: 0,
        streak: 0,
        correctAnswers: 0,
        totalAnswered: 0,
        totalTimeMs: 0
      });
    } else if (role === 'penonton') {
      setCurrentUser({
        id: 'penonton-1',
        name: 'Penonton / Supporter Sekolah',
        role: 'penonton',
        school: 'Supporter Nusantara',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isOnline: true,
        score: 0,
        streak: 0,
        correctAnswers: 0,
        totalAnswered: 0,
        totalTimeMs: 0
      });
    }
  };

  // Participant presses buzzer
  const handlePressBuzzer = async () => {
    if (!isBuzzerOpen) return;

    sounds.playBuzzer();

    const timestamp = Date.now();
    const buzzEvent: BuzzerEvent = {
      id: `buzz-${timestamp}-${currentUser.id}`,
      questionId: currentQuestion.id,
      userId: currentUser.id,
      userName: currentUser.name,
      school: currentUser.school,
      avatar: currentUser.avatar,
      timestamp,
      deltaMs: Math.floor(Math.random() * 150) + 120,
      status: 'pending_jury'
    };

    setBuzzerWinner(buzzEvent);
    setIsBuzzerOpen(false);
    setBuzzerQueue((prev) => [buzzEvent, ...prev]);

    // Send push alert
    addNotification({
      title: '⚡ Bel Ditekan!',
      message: `${currentUser.name} menekan bel terlebih dahulu (${buzzEvent.deltaMs} ms).`,
      type: 'buzzer_turn'
    });

    if (isOnline) {
      try {
        await fetch('/api/competition/buzz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            userName: currentUser.name,
            school: currentUser.school,
            avatar: currentUser.avatar,
            clientTime: timestamp
          })
        });
      } catch {
        // local fallback
      }
    }
  };

  // Contestant submits answer
  const handleSubmitAnswer = (answer: string) => {
    // Notify juries
    addNotification({
      title: 'Jawaban Diterima',
      message: `${currentUser.name} telah mengirimkan jawaban: "${answer}". Menunggu verifikasi juri.`,
      type: 'buzzer_turn'
    });
  };

  // Jury votes & verifies
  const handleJuryVote = async (decision: 'correct' | 'incorrect', notes?: string) => {
    const juriId = currentUser.id;
    const vote: JuryVote = {
      juriId,
      juriName: currentUser.name,
      juriIndex: currentUser.juriIndex || 1,
      decision,
      notes,
      timestamp: Date.now()
    };

    setJuryVotes((prev) => ({ ...prev, [juriId]: vote }));

    if (decision === 'correct') {
      sounds.playCorrect();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (buzzerWinner) {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === buzzerWinner.userId
              ? {
                  ...p,
                  score: p.score + currentQuestion.points,
                  streak: p.streak + 1,
                  correctAnswers: p.correctAnswers + 1,
                  totalAnswered: p.totalAnswered + 1
                }
              : p
          )
        );
      }
    } else {
      sounds.playWrong();
      if (buzzerWinner) {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === buzzerWinner.userId
              ? {
                  ...p,
                  score: Math.max(0, p.score - 50),
                  streak: 0,
                  totalAnswered: p.totalAnswered + 1
                }
              : p
          )
        );
        // Re-open buzzer for others
        setIsBuzzerOpen(true);
        setBuzzerWinner(null);
      }
    }

    if (isOnline) {
      try {
        await fetch('/api/competition/jury-verdict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            juriId,
            juriName: currentUser.name,
            juriIndex: currentUser.juriIndex || 1,
            decision,
            points: currentQuestion.points
          })
        });
      } catch {
        // fallback
      }
    }
  };

  // Set custom timer for difficult questions
  const handleSetTimer = async (seconds: number) => {
    setTimeRemaining(seconds);
    setTotalTime(seconds);
    if (isOnline) {
      try {
        await fetch('/api/competition/set-timer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seconds })
        });
      } catch {
        // fallback
      }
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < roundQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
    setIsBuzzerOpen(true);
    setBuzzerWinner(null);
    setBuzzerQueue([]);
    setJuryVotes({});
    setTimeRemaining(30);
    setTotalTime(30);
  };

  // Open / Reset buzzer
  const handleOpenBuzzer = () => {
    setIsBuzzerOpen(true);
    setBuzzerWinner(null);
    setBuzzerQueue([]);
    setJuryVotes({});
    setTimeRemaining(currentQuestion.timeLimit || 30);
    setTotalTime(currentQuestion.timeLimit || 30);
  };

  // Add Notification Helper
  const addNotification = (item: { title: string; message: string; type: PushNotification['type'] }) => {
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: item.title,
      message: item.message,
      timestamp: 'Baru saja',
      type: item.type,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Native browser push notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(item.title, { body: item.message });
      } catch {
        // fallback
      }
    }
  };

  const handleRequestWebNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          addNotification({
            title: 'Notifikasi Diaktifkan',
            message: 'Anda akan menerima notifikasi giliran dan jadwal pertandingan.',
            type: 'schedule'
          });
        }
      });
    }
  };

  // Generate AI Questions via server
  const handleGenerateAIQuestions = async (params: { category: string; difficulty: string; round: string; count: number }) => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && data.questions) {
        const updated = [...data.questions, ...questions];
        setQuestions(updated);
        saveOfflineQuestions(updated);

        // Also add new question IDs to current round
        setRounds((prev) =>
          prev.map((r) =>
            r.id === activeRoundId
              ? { ...r, questionIds: [...data.questions.map((q: any) => q.id), ...r.questionIds] }
              : r
          )
        );

        addNotification({
          title: 'Soal AI Ditambahkan',
          message: `${data.questions.length} butir soal baru berhasil di-generate menggunakan Gemini 3.8 Flash!`,
          type: 'round_start'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Generate AI Wordwall Pairs
  const handleGenerateAIWordwall = async (category: string): Promise<WordwallPair[]> => {
    try {
      const res = await fetch('/api/ai/generate-wordwall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, count: 6 })
      });
      const data = await res.json();
      if (data.success && data.pairs) {
        const updated = [...data.pairs, ...wordwallPairs];
        setWordwallPairs(updated);
        saveOfflineWordwallPairs(updated);
        return data.pairs;
      }
    } catch {
      // fallback
    }
    return wordwallPairs;
  };

  // Reset Full Competition
  const handleResetCompetition = async () => {
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        streak: 0,
        correctAnswers: 0,
        totalAnswered: 0
      }))
    );
    setCurrentQuestionIndex(0);
    setIsBuzzerOpen(true);
    setBuzzerWinner(null);
    setBuzzerQueue([]);
    setJuryVotes({});

    if (isOnline) {
      try {
        await fetch('/api/competition/reset', { method: 'POST' });
      } catch {
        // fallback
      }
    }

    addNotification({
      title: 'Kompetisi Direset',
      message: 'Seluruh skor dan antrean telah dikembalikan ke awal oleh Panitia.',
      type: 'schedule'
    });
  };

  // Add Participant
  const handleAddParticipant = async (p: { name: string; school: string }) => {
    const newParticipant: User = {
      id: `peserta-${Date.now()}`,
      name: p.name,
      school: p.school,
      role: 'peserta',
      avatar: `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
      isOnline: true,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswered: 0,
      totalTimeMs: 0
    };

    setParticipants((prev) => [...prev, newParticipant]);

    if (isOnline) {
      try {
        await fetch('/api/competition/participants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add', participant: newParticipant })
        });
      } catch {
        // fallback
      }
    }
  };

  // Delete Participant
  const handleDeleteParticipant = async (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    if (isOnline) {
      try {
        await fetch('/api/competition/participants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', participant: { id } })
        });
      } catch {
        // fallback
      }
    }
  };

  // Add Question
  const handleAddQuestion = (newQ: Question) => {
    const updated = [newQ, ...questions];
    setQuestions(updated);
    saveOfflineQuestions(updated);
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveOfflineQuestions(updated);
  };

  // Update Question Time
  const handleUpdateQuestionTime = (id: string, newTime: number) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, timeLimit: newTime } : q));
    setQuestions(updated);
    saveOfflineQuestions(updated);
  };

  // Open default personal analytics
  const handleOpenMyAnalytics = () => {
    const myRank = [...participants].sort((a, b) => b.score - a.score).findIndex((p) => p.id === currentUser.id) + 1;
    const accuracy = currentUser.totalAnswered > 0 ? Math.round((currentUser.correctAnswers / currentUser.totalAnswered) * 100) : 88;

    const analytics: PersonalAnalytics = {
      totalQuestions: currentUser.totalAnswered || 15,
      correctAnswers: currentUser.correctAnswers || 13,
      accuracy,
      avgResponseTimeSeconds: 2.1,
      highestStreak: currentUser.streak || 4,
      totalScore: currentUser.score || 2850,
      rank: myRank || 1,
      totalParticipants: participants.length,
      categoryBreakdown: [
        { category: 'Pengetahuan Umum', total: 6, correct: 5, accuracy: 83 },
        { category: 'Sains & Fisika', total: 5, correct: 5, accuracy: 100 },
        { category: 'Budaya & Sejarah', total: 4, correct: 3, accuracy: 75 }
      ],
      aiFeedback: 'Performa luar biasa dalam kecepatan refleks babak rebutan. Anda berhasil mengamankan 4 jawaban benar berurutan dengan waktu reaksi rata-rata 180ms.',
      strengths: ['Refleks Bel Rebutan', 'Pemahaman Sains', 'Akurasi Soal Pilihan'],
      weaknesses: ['Soal Menjebak Berbatas Waktu'],
      badgeEarned: 'Bintang Emas Olimpiade Cerdas Cermat'
    };

    setActiveAnalytics(analytics);
    setShowAnalyticsModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOnline={isOnline}
        onlineCounts={{
          participants: participants.filter((p) => p.isOnline).length,
          juries: juries.filter((j) => j.isOnline).length,
          audience: onlineAudienceCount
        }}
        notifications={notifications}
        onOpenNotifications={() => setShowNotificationDrawer(true)}
        onOpenSocialLogin={() => setShowSocialLogin(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: ARENA LOMBA */}
        {activeTab === 'arena' && (
          <CompetitionArena
            currentUser={currentUser}
            currentRole={currentRole}
            currentRound={activeRound}
            currentQuestion={currentQuestion}
            questionsInRound={roundQuestions}
            currentQuestionIndex={currentQuestionIndex}
            participants={participants}
            juries={juries}
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            isBuzzerOpen={isBuzzerOpen}
            buzzerWinner={buzzerWinner}
            buzzerQueue={buzzerQueue}
            juryVotes={juryVotes}
            onPressBuzzer={handlePressBuzzer}
            onSubmitAnswer={handleSubmitAnswer}
            onJuryVote={handleJuryVote}
            onSetTimer={handleSetTimer}
            onNextQuestion={handleNextQuestion}
            onOpenBuzzer={handleOpenBuzzer}
            onOpenAnalytics={handleOpenMyAnalytics}
          />
        )}

        {/* VIEW 2: LATIHAN MANDIRI & WORDWALL */}
        {activeTab === 'latihan' && (
          <PracticeArena
            questions={questions}
            wordwallPairs={wordwallPairs}
            isOnline={isOnline}
            onGenerateAIWordwall={handleGenerateAIWordwall}
            onSaveAnalytics={savePracticeSession}
            onOpenAnalyticsModal={(ana) => {
              setActiveAnalytics(ana);
              setShowAnalyticsModal(true);
            }}
          />
        )}

        {/* VIEW 3: PAPAN PERINGKAT WAYGROUND */}
        {activeTab === 'leaderboard' && (
          <LeaderboardWayground
            participants={participants}
            currentUserId={currentUser.id}
          />
        )}

        {/* VIEW 4: JADWAL DAN RIWAYAT */}
        {activeTab === 'jadwal' && (
          <JadwalDanRiwayat
            rounds={rounds}
            activeRoundId={activeRoundId}
            questions={questions}
            onSelectRound={(roundId) => {
              setActiveRoundId(roundId);
              setActiveTab('arena');
            }}
            onSubscribeNotification={(title) => {
              addNotification({
                title: 'Pengingat Terpasang',
                message: `Anda akan diberitahu saat ${title} dimulai.`,
                type: 'schedule'
              });
            }}
          />
        )}

        {/* VIEW 5: ADMIN & SOAL */}
        {activeTab === 'admin' && (
          <AdminDashboard
            questions={questions}
            participants={participants}
            juries={juries}
            onlineAudienceCount={onlineAudienceCount}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onUpdateQuestionTime={handleUpdateQuestionTime}
            onAddParticipant={handleAddParticipant}
            onDeleteParticipant={handleDeleteParticipant}
            onResetCompetition={handleResetCompetition}
            onGenerateAIQuestions={handleGenerateAIQuestions}
            isLoadingAI={isLoadingAI}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>CerdasCermat PRO</strong> — Sistem Lomba Cerdas Cermat Daring Real-Time Nasional Indonesia.
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Enkripsi E2EE 256-bit</span>
            <span>•</span>
            <span>5 Dewan Juri Nasional</span>
            <span>•</span>
            <span>Offline PWA Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {showAnalyticsModal && activeAnalytics && (
        <PersonalAnalyticsModal
          analytics={activeAnalytics}
          user={currentUser}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {showSocialLogin && (
        <SocialLoginModal
          currentUser={currentUser}
          onLoginSuccess={(updated) => {
            setCurrentUser((prev) => ({ ...prev, ...updated }));
            setParticipants((prev) =>
              prev.map((p) => (p.id === currentUser.id ? { ...p, ...updated } : p))
            );
            addNotification({
              title: 'Profil Terhubung',
              message: `Selamat datang, ${updated.name || currentUser.name}! Akun terdaftar via ${updated.registeredVia || 'SSO'}.`,
              type: 'schedule'
            });
          }}
          onClose={() => setShowSocialLogin(false)}
        />
      )}

      <PushNotificationDrawer
        notifications={notifications}
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onRequestWebNotificationPermission={handleRequestWebNotificationPermission}
      />

    </div>
  );
}
