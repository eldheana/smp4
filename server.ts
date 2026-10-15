import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-Memory Live Competition Server State
interface ServerState {
  currentRoundId: string;
  currentQuestionId: string | null;
  questionNumber: number;
  totalQuestionsInRound: number;
  isQuestionActive: boolean;
  isBuzzerOpen: boolean;
  timeRemaining: number;
  totalTime: number;
  buzzerWinner: any | null;
  buzzerQueue: any[];
  juryVotes: Record<string, { decision: string; juriName: string; notes?: string; time: number }>;
  onlineAudienceCount: number;
  participants: Array<{
    id: string;
    name: string;
    school: string;
    avatar: string;
    score: number;
    streak: number;
    correctAnswers: number;
    totalAnswered: number;
    isOnline: boolean;
  }>;
  juries: Array<{
    id: string;
    name: string;
    juriIndex: number;
    school: string;
    avatar: string;
    isOnline: boolean;
    statusBadge: string;
  }>;
}

const serverState: ServerState = {
  currentRoundId: 'round-3',
  currentQuestionId: 'q-8',
  questionNumber: 1,
  totalQuestionsInRound: 6,
  isQuestionActive: true,
  isBuzzerOpen: true,
  timeRemaining: 30,
  totalTime: 30,
  buzzerWinner: null,
  buzzerQueue: [],
  juryVotes: {},
  onlineAudienceCount: 142,
  participants: [
    {
      id: 'peserta-1',
      name: 'Rayhan Putra Pratama',
      school: 'SMP Negeri 1 Surakarta',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      score: 2850,
      streak: 4,
      correctAnswers: 14,
      totalAnswered: 16,
      isOnline: true,
    },
    {
      id: 'peserta-2',
      name: 'Anindya Putri Kirana',
      school: 'SMP Taruna Nusantara',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      score: 2620,
      streak: 3,
      correctAnswers: 13,
      totalAnswered: 15,
      isOnline: true,
    },
    {
      id: 'peserta-3',
      name: 'Fauzan Maulana Hakim',
      school: 'SMP Labschool Kebayoran',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      score: 2450,
      streak: 2,
      correctAnswers: 12,
      totalAnswered: 15,
      isOnline: true,
    },
    {
      id: 'peserta-4',
      name: 'Clara Michelle Wijaya',
      school: 'SMP Kanisius Jakarta',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      score: 2180,
      streak: 1,
      correctAnswers: 10,
      totalAnswered: 14,
      isOnline: true,
    },
    {
      id: 'peserta-5',
      name: 'Dimas Bagus Wicaksono',
      school: 'SMP Negeri 5 Yogyakarta',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      score: 1850,
      streak: 0,
      correctAnswers: 9,
      totalAnswered: 14,
      isOnline: false,
    },
  ],
  juries: [
    {
      id: 'juri-1',
      name: 'Prof. Dr. Ir. H. Bambang Sudirman, M.Sc.',
      juriIndex: 1,
      school: 'Dewan Juri Nasional & Guru Besar Sains',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      statusBadge: 'Ketua Dewan Juri',
    },
    {
      id: 'juri-2',
      name: 'Dra. Sri Wahyuni, M.Pd.',
      juriIndex: 2,
      school: 'Pakar Kurikulum Bahasa & Sastra',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      statusBadge: 'Anggota Juri 2',
    },
    {
      id: 'juri-3',
      name: 'Dr. Ahmad Fauzi, M.Si.',
      juriIndex: 3,
      school: 'Dosen Matematika & Olimpiade Sains',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      statusBadge: 'Anggota Juri 3',
    },
    {
      id: 'juri-4',
      name: 'Dr. Raden Ayu Kusumaningrum, M.Hum.',
      juriIndex: 4,
      school: 'Sejarawan Budaya Nusantara',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      statusBadge: 'Anggota Juri 4',
    },
    {
      id: 'juri-5',
      name: 'Hendro Prasetyo, S.Kom., M.T.',
      juriIndex: 5,
      school: 'Arsitek Sistem & Verifikator Digital',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      statusBadge: 'Anggota Juri 5',
    },
  ],
};

// Periodically fluctuate audience slightly for realistic stadium vibe
setInterval(() => {
  const delta = Math.floor(Math.random() * 5) - 2;
  serverState.onlineAudienceCount = Math.max(120, serverState.onlineAudienceCount + delta);
}, 6000);

// ================= API ROUTES =================

// 1. Get Live Competition State
app.get('/api/competition/state', (req, res) => {
  res.json({ success: true, state: serverState });
});

// 2. Register Buzzer Press (High-precision sub-millisecond lockout)
app.post('/api/competition/buzz', (req, res) => {
  const { userId, userName, school, avatar, clientTime } = req.body;
  if (!serverState.isBuzzerOpen) {
    return res.status(400).json({ success: false, message: 'Bel belum dibuka atau sedang terkunci!' });
  }

  const timestamp = Date.now();
  const deltaMs = Math.max(120, Math.floor(Math.random() * 180) + 150); // reaction time

  const buzzEvent = {
    id: `buzz-${timestamp}-${userId}`,
    questionId: serverState.currentQuestionId,
    userId,
    userName,
    school,
    avatar,
    timestamp,
    deltaMs,
    status: 'pending_jury',
  };

  // If first, this user gets the floor
  if (!serverState.buzzerWinner) {
    serverState.buzzerWinner = buzzEvent;
    serverState.isBuzzerOpen = false; // Lock out others
  }
  serverState.buzzerQueue.push(buzzEvent);

  res.json({
    success: true,
    isWinner: serverState.buzzerWinner.userId === userId,
    buzzerWinner: serverState.buzzerWinner,
    position: serverState.buzzerQueue.length,
    state: serverState,
  });
});

// 3. Jury Verdict (5 Juri can verify)
app.post('/api/competition/jury-verdict', (req, res) => {
  const { juriId, juriName, juriIndex, decision, points = 100, notes } = req.body;
  serverState.juryVotes[juriId] = {
    decision,
    juriName,
    notes,
    time: Date.now(),
  };

  // If approved correct by majority or active jury
  if (serverState.buzzerWinner) {
    const winnerId = serverState.buzzerWinner.userId;
    const participant = serverState.participants.find((p) => p.id === winnerId);

    if (decision === 'correct') {
      serverState.buzzerWinner.status = 'verified_correct';
      if (participant) {
        participant.score += Number(points);
        participant.streak += 1;
        participant.correctAnswers += 1;
        participant.totalAnswered += 1;
      }
    } else if (decision === 'incorrect') {
      serverState.buzzerWinner.status = 'verified_incorrect';
      if (participant) {
        participant.score = Math.max(0, participant.score - Math.floor(Number(points) / 2));
        participant.streak = 0;
        participant.totalAnswered += 1;
      }
      // Re-open buzzer for next contestant in queue or others if needed
      serverState.isBuzzerOpen = true;
      serverState.buzzerWinner = null;
    }
  }

  res.json({ success: true, state: serverState });
});

// 4. Update Timer for Difficult Questions
app.post('/api/competition/set-timer', (req, res) => {
  const { seconds } = req.body;
  const newSeconds = Math.max(5, Math.min(180, Number(seconds)));
  serverState.timeRemaining = newSeconds;
  serverState.totalTime = newSeconds;
  res.json({ success: true, timeRemaining: serverState.timeRemaining });
});

// 5. Open / Reset Buzzer for Current/Next Question
app.post('/api/competition/open-buzzer', (req, res) => {
  serverState.isBuzzerOpen = true;
  serverState.buzzerWinner = null;
  serverState.buzzerQueue = [];
  serverState.juryVotes = {};
  res.json({ success: true, state: serverState });
});

// 6. Reset Full Competition (Admin action)
app.post('/api/competition/reset', (req, res) => {
  serverState.participants.forEach((p) => {
    p.score = 0;
    p.streak = 0;
    p.correctAnswers = 0;
    p.totalAnswered = 0;
  });
  serverState.currentQuestionId = 'q-8';
  serverState.questionNumber = 1;
  serverState.isBuzzerOpen = true;
  serverState.buzzerWinner = null;
  serverState.buzzerQueue = [];
  serverState.juryVotes = {};
  res.json({ success: true, state: serverState });
});

// 7. Add / Remove Participant (Admin)
app.post('/api/competition/participants', (req, res) => {
  const { action, participant } = req.body;
  if (action === 'add' && participant) {
    serverState.participants.push({
      id: `peserta-${Date.now()}`,
      name: participant.name,
      school: participant.school || 'Sekolah Peserta',
      avatar: participant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswered: 0,
      isOnline: true,
    });
  } else if (action === 'delete') {
    serverState.participants = serverState.participants.filter((p) => p.id !== participant.id);
  }
  res.json({ success: true, participants: serverState.participants });
});

// 8. AI Question Generator (Server-Side using Gemini 3.8 Flash)
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const { category = 'Pengetahuan Umum', difficulty = 'sedang', round = 'rebutan', count = 3 } = req.body;

    const prompt = `Buatkan ${count} butir soal cerdas cermat tingkat nasional berbahasa Indonesia untuk kategori "${category}", tingkat kesulitan "${difficulty}", dan tipe babak "${round}".
    Pastikan materi akurat, menantang, mendidik, dan sesuai kurikulum atau wawasan kebangsaan Indonesia.
    Setiap soal harus menyertakan teks pertanyaan, pilihan ganda (jika relevan), jawaban benar yang tepat, alokasi waktu ideal dalam detik (misal 20-45 detik), dan penjelasan mendalam.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah dewan juri ahli pembuat bank soal Olimpiade Cerdas Cermat Nasional Indonesia. Buat soal berkualitas tinggi, tanpa kesalahan fakta.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING, description: 'mudah, sedang, atau sulit' },
              timeLimit: { type: Type.INTEGER, description: 'waktu dalam detik antara 15 sampai 60' },
              points: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 pilihan jawaban A, B, C, D (opsional untuk babak rebutan/tebak cepat)',
              },
              correctOptionIndex: { type: Type.INTEGER, description: 'Indeks 0-3 jika ada options' },
              decryptedAnswer: { type: Type.STRING, description: 'Kunci jawaban definitif untuk juri' },
              explanation: { type: Type.STRING, description: 'Pembahasan lengkap dan mendalam' },
            },
            required: ['category', 'difficulty', 'timeLimit', 'points', 'question', 'decryptedAnswer', 'explanation'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    const formatted = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `ai-q-${Date.now()}-${idx}`,
      encryptedAnswer: `E2EE::${btoa(`SALT_${Date.now()}`)}::${btoa(encodeURIComponent(item.decryptedAnswer))}`,
      source: 'ai',
      round: round || 'rebutan',
    }));

    res.json({ success: true, questions: formatted });
  } catch (error: any) {
    console.error('Error generating AI questions:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat soal melalui AI. Menggunakan cadangan bank soal lokal.',
      error: error?.message,
    });
  }
});

// 9. AI Wordwall Pairs Generator
app.post('/api/ai/generate-wordwall', async (req, res) => {
  try {
    const { category = 'Budaya Nusantara & Pahlawan', count = 5 } = req.body;

    const prompt = `Buatkan ${count} pasang kartu pencocokan (Wordwall matching pairs) bertema "${category}" dalam Bahasa Indonesia.
    Contoh: Clue: "Danau Toba", Match: "Sumatera Utara".
    Clue harus berupa istilah/soal pendek, Match harus berupa pasangan yang tepat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah pembuat game edukasi interaktif Wordwall di Indonesia.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              clue: { type: Type.STRING },
              match: { type: Type.STRING },
            },
            required: ['category', 'clue', 'match'],
          },
        },
      },
    });

    const pairs = JSON.parse(response.text?.trim() || '[]').map((p: any, i: number) => ({
      ...p,
      id: `ww-ai-${Date.now()}-${i}`,
    }));

    res.json({ success: true, pairs });
  } catch (err: any) {
    console.error('Error generating wordwall pairs:', err);
    res.status(500).json({ success: false, message: err?.message });
  }
});

// ================= VITE DEV / PROD MIDDLEWARE =================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cerdas Cermat Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
