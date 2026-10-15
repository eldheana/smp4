import { Question, WordwallPair, CompetitionRound, User } from '../types';

export const INITIAL_JURIES: User[] = [
  {
    id: 'juri-1',
    name: 'Prof. Dr. Ir. H. Bambang Sudirman, M.Sc.',
    role: 'juri',
    juriIndex: 1,
    school: 'Dewan Juri Nasional & Guru Besar Sains',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    totalTimeMs: 0,
    statusBadge: 'Ketua Dewan Juri'
  },
  {
    id: 'juri-2',
    name: 'Dra. Sri Wahyuni, M.Pd.',
    role: 'juri',
    juriIndex: 2,
    school: 'Pakar Kurikulum Bahasa & Sastra',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    totalTimeMs: 0,
    statusBadge: 'Anggota Juri 2'
  },
  {
    id: 'juri-3',
    name: 'Dr. Ahmad Fauzi, M.Si.',
    role: 'juri',
    juriIndex: 3,
    school: 'Dosen Matematika & Olimpiade Sains',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    totalTimeMs: 0,
    statusBadge: 'Anggota Juri 3'
  },
  {
    id: 'juri-4',
    name: 'Dr. Raden Ayu Kusumaningrum, M.Hum.',
    role: 'juri',
    juriIndex: 4,
    school: 'Sejarawan Budaya Nusantara',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    totalTimeMs: 0,
    statusBadge: 'Anggota Juri 4'
  },
  {
    id: 'juri-5',
    name: 'Hendro Prasetyo, S.Kom., M.T.',
    role: 'juri',
    juriIndex: 5,
    school: 'Arsitek Sistem & Verifikator Digital',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    totalTimeMs: 0,
    statusBadge: 'Anggota Juri 5'
  }
];

export const INITIAL_CONTESTANTS: User[] = [
  {
    id: 'peserta-1',
    name: 'Rayhan Putra Pratama',
    role: 'peserta',
    school: 'SMP Negeri 1 Surakarta',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 2850,
    streak: 4,
    correctAnswers: 14,
    totalAnswered: 16,
    totalTimeMs: 38200,
    registeredVia: 'belajar_id',
    statusBadge: 'Juara Bertahan'
  },
  {
    id: 'peserta-2',
    name: 'Anindya Putri Kirana',
    role: 'peserta',
    school: 'SMP Taruna Nusantara',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 2620,
    streak: 3,
    correctAnswers: 13,
    totalAnswered: 15,
    totalTimeMs: 41000,
    registeredVia: 'google',
    statusBadge: 'Top Speed'
  },
  {
    id: 'peserta-3',
    name: 'Fauzan Maulana Hakim',
    role: 'peserta',
    school: 'SMP Labschool Kebayoran',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 2450,
    streak: 2,
    correctAnswers: 12,
    totalAnswered: 15,
    totalTimeMs: 44500,
    registeredVia: 'kemdikbud',
    statusBadge: 'Konsisten'
  },
  {
    id: 'peserta-4',
    name: 'Clara Michelle Wijaya',
    role: 'peserta',
    school: 'SMP Kanisius Jakarta',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    score: 2180,
    streak: 1,
    correctAnswers: 10,
    totalAnswered: 14,
    totalTimeMs: 47200,
    registeredVia: 'twitter',
    statusBadge: 'Penantang Baru'
  },
  {
    id: 'peserta-5',
    name: 'Dimas Bagus Wicaksono',
    role: 'peserta',
    school: 'SMP Negeri 5 Yogyakarta',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    score: 1850,
    streak: 0,
    correctAnswers: 9,
    totalAnswered: 14,
    totalTimeMs: 51200,
    registeredVia: 'facebook',
    statusBadge: 'Peserta Reguler'
  }
];

export const INITIAL_ROUNDS: CompetitionRound[] = [
  {
    id: 'round-1',
    roundNumber: 1,
    title: 'Babak I: Penyisihan Wajib Berbatas Waktu',
    description: 'Seluruh peserta menjawab paket pertanyaan pilihan ganda secara simultan. Poin diberikan berdasarkan kecepatan dan ketepatan.',
    scheduleTime: '09:00 - 09:45 WIB',
    status: 'completed',
    timeLimitDefault: 20,
    questionIds: ['q-1', 'q-2', 'q-3', 'q-4']
  },
  {
    id: 'round-2',
    roundNumber: 2,
    title: 'Babak II: Adu Kecepatan & Tebak Cepat',
    description: 'Pertanyaan jawaban singkat tanpa pilihan ganda. Akurasi penulisan diverifikasi oleh dewan juri.',
    scheduleTime: '10:00 - 10:45 WIB',
    status: 'completed',
    timeLimitDefault: 25,
    questionIds: ['q-5', 'q-6', 'q-7']
  },
  {
    id: 'round-3',
    roundNumber: 3,
    title: 'Babak III: Babak Rebutan Final (Interactive Buzzer)',
    description: 'Peserta tercepat menekan tombol bel (buzzer) berhak menjawab. Jawaban benar +100 poin, jawaban salah penalti -50 poin!',
    scheduleTime: '11:00 - 12:00 WIB',
    status: 'active',
    timeLimitDefault: 30,
    questionIds: ['q-8', 'q-9', 'q-10', 'q-11', 'q-12', 'q-13']
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    category: 'Pengetahuan Umum & Geografi',
    difficulty: 'mudah',
    round: 'penyisihan',
    timeLimit: 20,
    points: 100,
    question: 'Ibu Kota Nusantara (IKN) berlokasi di wilayah provinsi...',
    options: [
      'Kalimantan Selatan',
      'Kalimantan Timur',
      'Kalimantan Barat',
      'Kalimantan Tengah'
    ],
    correctOptionIndex: 1,
    encryptedAnswer: 'E2EE::sP+8mK==::xZ90Qk==',
    decryptedAnswer: 'Kalimantan Timur',
    explanation: 'Ibu Kota Nusantara (IKN) berlokasi di wilayah administratif Kabupaten Penajam Paser Utara dan Kutai Kartanegara, Provinsi Kalimantan Timur.',
    source: 'bank'
  },
  {
    id: 'q-2',
    category: 'Sains & Astronomi',
    difficulty: 'sedang',
    round: 'penyisihan',
    timeLimit: 25,
    points: 150,
    question: 'Planet dalam tata surya yang memiliki satelit alami terbesar bernama Ganymede adalah...',
    options: ['Saturnus', 'Jupiter', 'Neptunus', 'Uranus'],
    correctOptionIndex: 1,
    encryptedAnswer: 'E2EE::bT20yL==::uW88Lk==',
    decryptedAnswer: 'Jupiter',
    explanation: 'Ganymede adalah satelit alami terbesar milik Jupiter dan merupakan satelit terbesar di tata surya, bahkan lebih besar dari planet Merkurius.',
    source: 'bank'
  },
  {
    id: 'q-3',
    category: 'Sejarah & Kemerdekaan RI',
    difficulty: 'mudah',
    round: 'penyisihan',
    timeLimit: 20,
    points: 100,
    question: 'Naskah Proklamasi Kemerdekaan Indonesia diketik oleh tokoh bangsa bernama...',
    options: ['Sayuti Melik', 'Sukarni', 'BM Diah', 'Chaerul Saleh'],
    correctOptionIndex: 0,
    encryptedAnswer: 'E2EE::jM19qZ==::tP34Rw==',
    decryptedAnswer: 'Sayuti Melik',
    explanation: 'Sayuti Melik mengetik naskah proklamasi yang disusun oleh Ir. Soekarno, Drs. Moh. Hatta, dan Mr. Achmad Soebardjo di rumah Laksamana Maeda.',
    source: 'bank'
  },
  {
    id: 'q-4',
    category: 'Matematika Cepat',
    difficulty: 'sedang',
    round: 'penyisihan',
    timeLimit: 30,
    points: 150,
    question: 'Berapakah hasil dari 25% dari 480 ditambah akar pangkat dua dari 625?',
    options: ['135', '145', '155', '165'],
    correctOptionIndex: 1,
    encryptedAnswer: 'E2EE::rX99oV==::yN22Lz==',
    decryptedAnswer: '145',
    explanation: '25% dari 480 = 120. Akar pangkat dua dari 625 = 25. Maka 120 + 25 = 145.',
    source: 'bank'
  },
  {
    id: 'q-5',
    category: 'Budaya Nusantara',
    difficulty: 'sedang',
    round: 'tebak_cepat',
    timeLimit: 25,
    points: 150,
    question: 'Tari Saman yang telah diakui UNESCO sebagai Warisan Budaya Takbenda berasal dari suku...',
    encryptedAnswer: 'E2EE::qA77kJ==::zK11Wq==',
    decryptedAnswer: 'Gayo (Aceh)',
    explanation: 'Tari Saman adalah tarian suku Gayo yang mendiami dataran tinggi Gayo, Provinsi Aceh.',
    source: 'bank'
  },
  {
    id: 'q-6',
    category: 'Sains & Biologi',
    difficulty: 'sulit',
    round: 'tebak_cepat',
    timeLimit: 35,
    points: 200,
    question: 'Organel sel eukariotik yang berfungsi sebagai "pabrik energi" penghasil molekul ATP adalah...',
    encryptedAnswer: 'E2EE::wE44rT==::mM55Uo==',
    decryptedAnswer: 'Mitokondria',
    explanation: 'Mitokondria merupakan tempat berlangsungnya respirasi seluler yang menghasilkan adenosin trifosfat (ATP) sebagai sumber energi utama sel.',
    source: 'bank'
  },
  {
    id: 'q-7',
    category: 'Matematika Geometri',
    difficulty: 'sulit',
    round: 'tebak_cepat',
    timeLimit: 40,
    points: 200,
    question: 'Sebuah segitiga siku-siku memiliki panjang alas 12 cm dan hipotenusa 15 cm. Berapakah luas segitiga tersebut dalam cm²?',
    encryptedAnswer: 'E2EE::zC11xV==::bB22Kk==',
    decryptedAnswer: '54 cm²',
    explanation: 'Tinggi segitiga = √(15² - 12²) = √(225 - 144) = √81 = 9 cm. Luas = 1/2 × 12 × 9 = 54 cm².',
    source: 'bank'
  },
  {
    id: 'q-8',
    category: 'Pengetahuan Umum Nasional',
    difficulty: 'sulit',
    round: 'rebutan',
    timeLimit: 30,
    points: 100,
    question: '[BABAK REBUTAN 1] Siapakah pahlawan nasional dari Maluku yang memimpin perlawanan rakyat terhadap VOC di Benteng Duurstede Saparua pada tahun 1817?',
    encryptedAnswer: 'E2EE::aA00bB==::cC99dD==',
    decryptedAnswer: 'Kapitan Pattimura (Thomas Matulessy)',
    explanation: 'Thomas Matulessy atau Kapitan Pattimura mengobarkan perlawanan di Benteng Duurstede pada 16 Mei 1817.',
    source: 'bank'
  },
  {
    id: 'q-9',
    category: 'Sains Fisika',
    difficulty: 'sedang',
    round: 'rebutan',
    timeLimit: 25,
    points: 100,
    question: '[BABAK REBUTAN 2] Apakah nama fenomena pembelokan arah gelombang cahaya ketika melewati medium yang berbeda kerapatan optiknya?',
    encryptedAnswer: 'E2EE::eE22fF==::gG33hH==',
    decryptedAnswer: 'Pembiasan (Refraksi)',
    explanation: 'Pembiasan atau refraksi adalah pembelokan berkas cahaya saat berpindah dari satu medium ke medium lain yang memiliki indeks bias berbeda.',
    source: 'bank'
  },
  {
    id: 'q-10',
    category: 'UUD 1945 & Kenegaraan',
    difficulty: 'sedang',
    round: 'rebutan',
    timeLimit: 25,
    points: 100,
    question: '[BABAK REBUTAN 3] Menurut Pasal 1 Ayat 1 UUD Negara Republik Indonesia Tahun 1945, Indonesia adalah negara kesatuan yang berbentuk apa?',
    encryptedAnswer: 'E2EE::iI44jJ==::kK55lL==',
    decryptedAnswer: 'Republik',
    explanation: 'Bunyi Pasal 1 Ayat 1 UUD 1945: "Negara Indonesia ialah Negara Kesatuan, yang berbentuk Republik."',
    source: 'bank'
  },
  {
    id: 'q-11',
    category: 'Bahasa & Sastra Indonesia',
    difficulty: 'mudah',
    round: 'rebutan',
    timeLimit: 20,
    points: 100,
    question: '[BABAK REBUTAN 4] Majas yang membandingkan benda mati seolah-olah memiliki sifat dan perilaku seperti manusia hidup disebut majas apa?',
    encryptedAnswer: 'E2EE::mN66oO==::pP77qQ==',
    decryptedAnswer: 'Personifikasi',
    explanation: 'Personifikasi adalah gaya bahasa kiasan yang menggambarkan benda mati bertingkah laku layaknya insan hidup (contoh: "angin membelai pipiku").',
    source: 'bank'
  },
  {
    id: 'q-12',
    category: 'Matematika Aljabar Cepat',
    difficulty: 'sulit',
    round: 'rebutan',
    timeLimit: 45,
    points: 150,
    question: '[BABAK REBUTAN 5] Jika 3x + 7 = 31, berapakah nilai dari 5x - 4?',
    encryptedAnswer: 'E2EE::rR88sS==::tT99uU==',
    decryptedAnswer: '36',
    explanation: '3x = 31 - 7 = 24 => x = 8. Maka 5(8) - 4 = 40 - 4 = 36.',
    source: 'bank'
  },
  {
    id: 'q-13',
    category: 'Teknologi & Digital',
    difficulty: 'sedang',
    round: 'rebutan',
    timeLimit: 25,
    points: 100,
    question: '[BABAK REBUTAN 6] Protokol keamanan jaringan internet yang menggunakan enkripsi SSL/TLS untuk melindungi data pengguna berawalan huruf...',
    encryptedAnswer: 'E2EE::vV00wW==::xX11yY==',
    decryptedAnswer: 'HTTPS (Hypertext Transfer Protocol Secure)',
    explanation: 'HTTPS merupakan ekstensi dari HTTP yang menggunakan protokol enkripsi SSL/TLS.',
    source: 'bank'
  }
];

export const INITIAL_WORDWALL_PAIRS: WordwallPair[] = [
  {
    id: 'ww-1',
    category: 'Ibu Kota Provinsi di Indonesia',
    clue: 'Sumatera Barat',
    match: 'Kota Padang'
  },
  {
    id: 'ww-2',
    category: 'Ibu Kota Provinsi di Indonesia',
    clue: 'Jawa Timur',
    match: 'Kota Surabaya'
  },
  {
    id: 'ww-3',
    category: 'Ibu Kota Provinsi di Indonesia',
    clue: 'Sulawesi Selatan',
    match: 'Kota Makassar'
  },
  {
    id: 'ww-4',
    category: 'Ibu Kota Provinsi di Indonesia',
    clue: 'Papua Barat',
    match: 'Kota Manokwari'
  },
  {
    id: 'ww-5',
    category: 'Rumus Fisika & Besaran',
    clue: 'Hukum II Newton',
    match: 'F = m × a'
  },
  {
    id: 'ww-6',
    category: 'Rumus Fisika & Besaran',
    clue: 'Energi Potensial',
    match: 'Ep = m × g × h'
  },
  {
    id: 'ww-7',
    category: 'Rumus Fisika & Besaran',
    clue: 'Kecepatan Cahaya',
    match: '3 × 10⁸ m/s'
  },
  {
    id: 'ww-8',
    category: 'Alat Musik Tradisional',
    clue: 'Sasando',
    match: 'Nusa Tenggara Timur (NTT)'
  },
  {
    id: 'ww-9',
    category: 'Alat Musik Tradisional',
    clue: 'Angklung',
    match: 'Jawa Barat'
  },
  {
    id: 'ww-10',
    category: 'Alat Musik Tradisional',
    clue: 'Tifa',
    match: 'Papua & Maluku'
  }
];
