import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Clock, 
  Target, 
  Award, 
  Filter, 
  Download, 
  RefreshCw,
  Search
} from 'lucide-react';
import { User } from '../types';

interface LeaderboardWaygroundProps {
  participants: User[];
  currentUserId: string;
}

export const LeaderboardWayground: React.FC<LeaderboardWaygroundProps> = ({
  participants,
  currentUserId
}) => {
  const [filterRound, setFilterRound] = useState<'total' | 'babak1' | 'babak2' | 'babak3'>('total');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort participants by score
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  const filtered = sorted.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Wayground Real-Time Engine
              </span>
              <span className="text-xs text-slate-400">Pembaruan Langsung Sub-Detik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Papan Peringkat Kompetisi Nasional
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Perhitungan peringkat menggabungkan akurasi jawaban, kecepatan respons (milidetik), dan multiplier streak kemenangan beruntun.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama peserta / sekolah..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3D WAYGROUND PODIUM (Top 3) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Podium Kejuaraan Sementara
        </h2>

        <div className="grid grid-cols-3 max-w-2xl mx-auto items-end gap-3 sm:gap-6 text-center">
          
          {/* Juara 2 (Perak) */}
          {sorted[1] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <img 
                  src={sorted[1].avatar} 
                  alt={sorted[1].name} 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-slate-300 shadow-md"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-900 font-black text-xs px-2 py-0.5 rounded-full shadow">
                  #2
                </span>
              </div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-full">
                {sorted[1].name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                {sorted[1].school}
              </div>
              <div className="font-mono font-black text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
                {sorted[1].score} pts
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-24 sm:h-32 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-4 border-slate-300">
                <span className="text-xl sm:text-2xl">🥈</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">Juara II</span>
              </div>
            </div>
          )}

          {/* Juara 1 (Emas - Wayground King) */}
          {sorted[0] && (
            <div className="flex flex-col items-center -mt-6">
              <div className="relative mb-2">
                <div className="text-2xl sm:text-3xl animate-bounce mb-1">👑</div>
                <img 
                  src={sorted[0].avatar} 
                  alt={sorted[0].name} 
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-full shadow-lg">
                  #1
                </span>
              </div>
              <div className="font-black text-xs sm:text-base text-slate-900 dark:text-white truncate max-w-full">
                {sorted[0].name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                {sorted[0].school}
              </div>
              <div className="font-mono font-black text-base sm:text-lg text-amber-600 dark:text-amber-400 mt-1">
                {sorted[0].score} pts
              </div>
              <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 h-32 sm:h-44 rounded-t-2xl mt-2 flex flex-col items-center justify-center text-amber-950 shadow-md border-t-4 border-amber-500">
                <span className="text-2xl sm:text-3xl">🥇</span>
                <span className="text-xs sm:text-sm font-black">Juara I</span>
                <span className="text-[10px] font-bold bg-amber-950/20 px-2 py-0.5 rounded-full mt-1">Wayground Leader</span>
              </div>
            </div>
          )}

          {/* Juara 3 (Perunggu) */}
          {sorted[2] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <img 
                  src={sorted[2].avatar} 
                  alt={sorted[2].name} 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-amber-700 shadow-md"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-xs px-2 py-0.5 rounded-full shadow">
                  #3
                </span>
              </div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-full">
                {sorted[2].name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                {sorted[2].school}
              </div>
              <div className="font-mono font-black text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
                {sorted[2].score} pts
              </div>
              <div className="w-full bg-amber-100 dark:bg-amber-950/40 h-20 sm:h-28 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-4 border-amber-700">
                <span className="text-xl sm:text-2xl">🥉</span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-800 dark:text-amber-300">Juara III</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Comprehensive Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Tabel Lengkap Peserta & Metrik Kecepatan ({filtered.length} Peserta)
          </div>
          <div className="text-xs text-slate-400">
            Akurasi & Waktu Respons
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">Peserta / Asal Sekolah</th>
                <th className="py-3 px-4 text-center">Tren</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-center">Akurasi</th>
                <th className="py-3 px-4 text-center">Rata-rata Waktu</th>
                <th className="py-3 px-4 text-right">Total Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item, idx) => {
                const isCurrent = item.id === currentUserId;
                const accuracy = item.totalAnswered > 0 
                  ? Math.round((item.correctAnswers / item.totalAnswered) * 100) 
                  : 88;
                const avgSpeed = item.totalAnswered > 0 
                  ? (item.totalTimeMs / item.totalAnswered / 1000).toFixed(1) 
                  : '2.4';

                return (
                  <tr 
                    key={item.id}
                    className={`transition-colors ${
                      isCurrent 
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 font-bold' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-sm">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
                        idx === 0 ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
                        idx === 1 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                        idx === 2 ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                        'text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {isCurrent && <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-semibold">Anda</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.school}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Trend Icon (Wayground simulation) */}
                    <td className="py-3.5 px-4 text-center">
                      {idx === 0 || idx === 1 ? (
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <ArrowUp className="w-3 h-3 mr-0.5" /> +{3 - idx}
                        </span>
                      ) : idx === 4 ? (
                        <span className="inline-flex items-center text-rose-500 font-bold text-[11px]">
                          <ArrowDown className="w-3 h-3 mr-0.5" /> -1
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 font-bold text-[11px]">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {item.streak > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                          <Flame className="w-3 h-3 mr-0.5 text-orange-500" />
                          {item.streak}x
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center space-x-1.5">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${accuracy}%` }} 
                          />
                        </div>
                        <span className="font-mono font-semibold">{accuracy}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      {avgSpeed}s
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
                        {item.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
