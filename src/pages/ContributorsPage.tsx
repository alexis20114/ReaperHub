import { motion } from 'framer-motion'
import { Skull, Trophy, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRank } from '@/lib/supabase'

const CONTRIBUTORS = [
  { username: 'VoidReaper',    rank: 'Lich King' as UserRank,    scripts: 48, approved: 45, bio: 'Been scripting since 2019. Specializes in combat scripts.',       avatar: null },
  { username: 'BloodLord',     rank: 'Blood Lord' as UserRank,   scripts: 31, approved: 29, bio: 'Arsenal & Da Hood expert. All my scripts are 100% undetected.',   avatar: null },
  { username: 'DarkSovereign', rank: 'Death Knight' as UserRank, scripts: 22, approved: 20, bio: 'Farm script specialist. Passive income while you sleep.',          avatar: null },
  { username: 'CrimsonWraith', rank: 'Reaper' as UserRank,       scripts: 15, approved: 14, bio: 'New but deadly. King Legacy & Blox Fruits main.',                  avatar: null },
  { username: 'NecroKing',     rank: 'Blood Lord' as UserRank,   scripts: 27, approved: 25, bio: 'GUI designer first, scripter second. Premium UI only.',            avatar: null },
  { username: 'ShadowBlight',  rank: 'Reaper' as UserRank,       scripts: 12, approved: 10, bio: 'Adopt Me & casual game exploits. Friendly community member.',     avatar: null },
  { username: 'LichKnight',    rank: 'Death Knight' as UserRank, scripts: 19, approved: 18, bio: 'Old guard. Been here since day 1 of ReaperHub.',                  avatar: null },
  { username: 'AbyssalOne',    rank: 'Spectral' as UserRank,     scripts: 5,  approved: 3,  bio: 'Just started uploading. Watch out.',                               avatar: null },
]

const RANK_ICONS: Record<UserRank, string> = {
  'Spectral':    '👻',
  'Reaper':      '💀',
  'Blood Lord':  '🩸',
  'Death Knight':'⚔️',
  'Lich King':   '👑',
  'Staff':       '🛡️',
  'Admin':       '⚡',
}

export default function ContributorsPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 px-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-12 text-center">
        <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">The Chosen</p>
        <h1 className="font-horror text-5xl md:text-6xl text-blood-50 mb-3" style={{ textShadow: '0 0 20px rgba(138,0,0,0.6)' }}>
          Hall of Fame
        </h1>
        <p className="text-text-dim text-sm max-w-lg mx-auto">
          The bloodiest contributors in ReaperHub history. Top uploaders earn eternal ranks and recognition.
        </p>
      </motion.div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 mb-16">
        {[CONTRIBUTORS[1], CONTRIBUTORS[0], CONTRIBUTORS[2]].map((c, idx) => {
          const positions = [2, 1, 3]
          const heights   = ['h-28', 'h-36', 'h-24']
          const delays    = [0.2, 0, 0.4]
          const pos = positions[idx]

          return (
            <motion.div
              key={c.username}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delays[idx] }}
              className="flex flex-col items-center gap-3"
            >
              {pos === 1 && (
                <motion.div animate={{ y: [0,-6,0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Trophy className="w-8 h-8 text-yellow-500" style={{ filter: 'drop-shadow(0 0 8px #ffaa00)' }} />
                </motion.div>
              )}

              {/* Avatar */}
              <div className={cn(
                'relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2',
                pos === 1 ? 'border-yellow-500/60 shadow-[0_0_20px_rgba(255,170,0,0.3)]'
                  : pos === 2 ? 'border-gray-400/40' : 'border-orange-700/40'
              )}
                style={{ background: 'linear-gradient(135deg, #300000, #1a0000)' }}
              >
                {c.username[0]}
                <div className="absolute -bottom-1 -right-1 text-xs bg-black rounded-full w-6 h-6 flex items-center justify-center border border-blood-200/30">
                  {pos}
                </div>
              </div>

              <p className="font-tech text-sm text-blood-50 font-semibold">{c.username}</p>
              <span className={cn('rank-badge border', `rank-${c.rank.replace(' ', '')}`)}>
                {RANK_ICONS[c.rank]} {c.rank}
              </span>
              <p className="text-xs text-text-dim">{c.approved} scripts</p>

              {/* Podium block */}
              <div className={cn(
                'w-24 rounded-t-lg flex items-center justify-center',
                heights[idx],
                pos === 1 ? 'bg-gradient-to-t from-yellow-900/30 to-yellow-900/10 border border-yellow-700/30'
                  : pos === 2 ? 'bg-gradient-to-t from-gray-700/20 to-gray-700/10 border border-gray-600/20'
                  : 'bg-gradient-to-t from-orange-900/20 to-orange-900/10 border border-orange-800/20'
              )}>
                <span className="font-horror text-3xl text-blood-200/20">#{pos}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="section-divider mb-12" />

      {/* Full grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CONTRIBUTORS.map((c, i) => (
          <motion.div
            key={c.username}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="glass-card p-5 border-blood-200/20 hover:border-blood-200/40 transition-all duration-300 group"
          >
            {/* Drip on hover */}
            <div className="relative overflow-hidden rounded-xl mb-4">
              <div className="w-full aspect-square rounded-xl flex items-center justify-center text-5xl font-bold bg-gradient-to-br from-blood-300 to-blood-400 border border-blood-200/30 group-hover:border-blood-200/60 transition-all"
                style={{ boxShadow: '0 0 0 0 transparent', transition: 'box-shadow 0.3s' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blood-200 to-reaper-purpleMid text-2xl text-white font-horror"
                  style={{ boxShadow: '0 0 20px rgba(138,0,0,0.5)' }}
                >
                  {c.username[0]}
                </motion.div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <p className="font-tech text-sm font-semibold text-blood-50">{c.username}</p>
              <span className={cn('rank-badge border text-xs', `rank-${c.rank.replace(' ', '')}`)}>
                {RANK_ICONS[c.rank]}
              </span>
            </div>

            <span className={cn('rank-badge border text-xs mb-3 inline-block', `rank-${c.rank.replace(' ', '')}`)}>
              {c.rank}
            </span>

            <p className="text-xs text-text-dim leading-relaxed mb-3 line-clamp-2">{c.bio}</p>

            <div className="flex gap-4 text-xs text-text-dim border-t border-blood-200/10 pt-3">
              <span className="flex items-center gap-1">
                <Upload size={10} className="text-blood-200/50" />
                {c.scripts} uploaded
              </span>
              <span className="flex items-center gap-1">
                <Star size={10} className="text-green-600/70" />
                {c.approved} approved
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Need to import Upload for the icon in ContributorsPage
function Upload({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}
