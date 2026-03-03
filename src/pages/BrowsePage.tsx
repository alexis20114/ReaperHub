import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, SlidersHorizontal, Skull, X } from 'lucide-react'
import ScriptCard from '@/components/ui/ScriptCard'
import { useScriptStore } from '@/store'
import type { Script } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const MOCK_SCRIPTS: Script[] = [
  { id: '1', title: 'Blox Fruits God Mode V3', game: 'Blox Fruits', description: 'Full auto-farm, god mode, teleport, devil fruit sniper', image_url: null, script_content: '', author_id: 'u1', author_username: 'VoidReaper', tags: ['op','farm','gui'], is_premium: false, is_approved: true, likes: 4821, views: 32100, created_at: '2024-12-01T00:00:00Z' },
  { id: '2', title: 'Arsenal Aimbot Pro 2025', game: 'Arsenal', description: 'Silent aim, ESP wallhack, infinite ammo', image_url: null, script_content: '', author_id: 'u2', author_username: 'BloodLord', tags: ['op','premium'], is_premium: true, is_approved: true, likes: 7204, views: 51020, created_at: '2024-11-28T00:00:00Z' },
  { id: '3', title: 'Pet Simulator X Auto Sell', game: 'Pet Simulator X', description: 'Full pet farm, auto hatch, auto sell loop', image_url: null, script_content: '', author_id: 'u3', author_username: 'DarkSovereign', tags: ['farm','gui'], is_premium: false, is_approved: true, likes: 2310, views: 18400, created_at: '2024-11-25T00:00:00Z' },
  { id: '4', title: 'Brookhaven Admin Panel', game: 'Brookhaven', description: 'Admin commands, trolling tools, speed hack', image_url: null, script_content: '', author_id: 'u4', author_username: 'LichKnight', tags: ['gui','op'], is_premium: false, is_approved: true, likes: 1850, views: 12300, created_at: '2024-11-20T00:00:00Z' },
  { id: '5', title: 'King Legacy Sea Beast Farm', game: 'King Legacy', description: 'Auto sea beast + chest auto-collect', image_url: null, script_content: '', author_id: 'u5', author_username: 'CrimsonWraith', tags: ['farm'], is_premium: false, is_approved: true, likes: 3400, views: 21000, created_at: '2024-11-18T00:00:00Z' },
  { id: '6', title: 'Da Hood God Script', game: 'Da Hood', description: 'Aimbot, silent aim, noclip, infinite money', image_url: null, script_content: '', author_id: 'u1', author_username: 'VoidReaper', tags: ['op','premium'], is_premium: true, is_approved: true, likes: 9102, views: 74300, created_at: '2024-11-15T00:00:00Z' },
  { id: '7', title: 'Adopt Me Pet Dupe Glitch', game: 'Adopt Me', description: 'Legendary pet farm + dupe exploit (patched warning)', image_url: null, script_content: '', author_id: 'u6', author_username: 'ShadowBlight', tags: ['farm','op'], is_premium: false, is_approved: true, likes: 6510, views: 48200, created_at: '2024-11-10T00:00:00Z' },
  { id: '8', title: 'Murder Mystery 2 Sheriff Bot', game: 'Murder Mystery 2', description: 'Auto sheriff aim + player radar', image_url: null, script_content: '', author_id: 'u3', author_username: 'DarkSovereign', tags: ['op','gui'], is_premium: false, is_approved: true, likes: 1200, views: 9800, created_at: '2024-11-05T00:00:00Z' },
  { id: '9', title: 'Jailbreak Money Farm Pro', game: 'Jailbreak', description: 'Auto rob, casino hack, vehicle spawn', image_url: null, script_content: '', author_id: 'u7', author_username: 'NecroKing', tags: ['farm','gui'], is_premium: true, is_approved: true, likes: 5500, views: 40200, created_at: '2024-10-30T00:00:00Z' },
  { id: '10', title: 'Tower of Hell Skip All', game: 'Tower of Hell', description: 'Teleport to top + win instantly', image_url: null, script_content: '', author_id: 'u2', author_username: 'BloodLord', tags: ['op'], is_premium: false, is_approved: true, likes: 3100, views: 25000, created_at: '2024-10-25T00:00:00Z' },
  { id: '11', title: 'Royale High Diamond Farm', game: 'Royale High', description: 'Auto diamond collection + realm farm', image_url: null, script_content: '', author_id: 'u8', author_username: 'AbyssalOne', tags: ['farm'], is_premium: false, is_approved: true, likes: 1800, views: 13500, created_at: '2024-10-20T00:00:00Z' },
  { id: '12', title: 'Natural Disaster Survival Macro', game: 'Natural Disaster', description: 'Survive all disasters auto + fly hack', image_url: null, script_content: '', author_id: 'u5', author_username: 'CrimsonWraith', tags: ['op','gui'], is_premium: false, is_approved: true, likes: 900, views: 7200, created_at: '2024-10-15T00:00:00Z' },
]

const GAMES = ['All Games', 'Blox Fruits', 'Arsenal', 'Da Hood', 'Brookhaven', 'Adopt Me', 'Jailbreak', 'Pet Simulator X', 'King Legacy', 'Royale High', 'Murder Mystery 2', 'Tower of Hell']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'views', label: 'Most Viewed' },
]

export default function BrowsePage() {
  const [search,   setSearch]   = useState('')
  const [game,     setGame]     = useState('All Games')
  const [type,     setType]     = useState<'all' | 'free' | 'premium'>('all')
  const [sort,     setSort]     = useState('newest')
  const [tag,      setTag]      = useState('')
  const [page,     setPage]     = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const PER_PAGE = 9

  const storeScripts = useScriptStore(s => s.scripts)
  const all = storeScripts.length > 0 ? storeScripts : MOCK_SCRIPTS

  const filtered = all.filter(s => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.game.toLowerCase().includes(search.toLowerCase())) return false
    if (game !== 'All Games' && s.game !== game) return false
    if (type === 'free' && s.is_premium) return false
    if (type === 'premium' && !s.is_premium) return false
    if (tag && !s.tags.includes(tag)) return false
    return true
  }).sort((a, b) => {
    if (sort === 'likes')   return b.likes - a.likes
    if (sort === 'views')   return b.views - a.views
    if (sort === 'popular') return (b.likes + b.views) - (a.likes + a.views)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore   = paginated.length < filtered.length

  return (
    <div className="min-h-screen pt-20 px-6 max-w-7xl mx-auto pb-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 mt-4"
      >
        <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">The Arsenal</p>
        <h1 className="font-horror text-5xl md:text-6xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>
          Browse Scripts
        </h1>
        <p className="text-text-dim text-sm mt-2">{filtered.length} scripts found</p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8 space-y-4">

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blood-200/50" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search scripts or games..."
            className="blood-input pl-11 pr-12"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-blood-50">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">

          {/* Game select */}
          <select
            value={game}
            onChange={e => { setGame(e.target.value); setPage(1) }}
            className="blood-input w-auto text-xs pr-8"
          >
            {GAMES.map(g => <option key={g} value={g} style={{ background: '#0a0000' }}>{g}</option>)}
          </select>

          {/* Type toggles */}
          <div className="flex rounded-lg overflow-hidden border border-blood-200/30">
            {(['all','free','premium'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setType(t); setPage(1) }}
                className={cn(
                  'px-4 py-2 text-xs font-tech tracking-wider uppercase transition-all',
                  type === t ? 'bg-blood-200/20 text-blood-50' : 'text-text-dim hover:text-blood-50 hover:bg-blood-200/10'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="blood-input w-auto text-xs pr-8"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#0a0000' }}>{o.label}</option>)}
          </select>

          {/* Tag filter */}
          <div className="flex gap-2 flex-wrap">
            {['op','farm','gui','premium'].map(t => (
              <button
                key={t}
                onClick={() => { setTag(tag === t ? '' : t); setPage(1) }}
                className={cn(
                  'rank-badge border cursor-pointer transition-all',
                  `tag-${t}`,
                  tag === t ? 'scale-110 shadow-blood-sm' : 'opacity-60 hover:opacity-100'
                )}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-32">
          <Skull className="w-16 h-16 text-blood-200/20 mx-auto mb-4" />
          <p className="text-text-dim font-body">No scripts found. Try adjusting filters.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {paginated.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <ScriptCard script={s} variant="featured" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPage(p => p + 1)}
            className="ghost-btn px-10 py-4"
          >
            Load More ({filtered.length - paginated.length} remaining)
          </motion.button>
        </div>
      )}
    </div>
  )
}
