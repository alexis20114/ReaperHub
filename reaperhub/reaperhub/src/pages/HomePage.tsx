import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Skull, Zap, Shield, Users, ChevronDown, ArrowRight, BookOpen, Upload, MessageSquare, TrendingUp, Star } from 'lucide-react'
import ScriptCard from '@/components/ui/ScriptCard'
import { useScriptStore } from '@/store'

// ── Fake data for homepage until Supabase is seeded ──────────────────────────
const MOCK_SCRIPTS = [
  { id: '1', title: 'Blox Fruits God Mode V3', game: 'Blox Fruits', description: 'Full auto-farm, god mode, teleport, devil fruit sniper', image_url: null, script_content: '', author_id: 'u1', author_username: 'VoidReaper', tags: ['op','farm','gui'], is_premium: false, is_approved: true, likes: 4821, views: 32100, created_at: '2024-12-01T00:00:00Z' },
  { id: '2', title: 'Arsenal Aimbot Pro 2025', game: 'Arsenal', description: 'Silent aim, ESP wallhack, infinite ammo', image_url: null, script_content: '', author_id: 'u2', author_username: 'BloodLord', tags: ['op','premium'], is_premium: true, is_approved: true, likes: 7204, views: 51020, created_at: '2024-11-28T00:00:00Z' },
  { id: '3', title: 'Pet Simulator X Auto Sell', game: 'Pet Simulator X', description: 'Full pet farm, auto hatch, auto sell loop', image_url: null, script_content: '', author_id: 'u3', author_username: 'DarkSovereign', tags: ['farm','gui'], is_premium: false, is_approved: true, likes: 2310, views: 18400, created_at: '2024-11-25T00:00:00Z' },
  { id: '4', title: 'Brookhaven Admin Panel', game: 'Brookhaven', description: 'Admin commands, trolling tools, speed hack', image_url: null, script_content: '', author_id: 'u4', author_username: 'LichKnight', tags: ['gui','op'], is_premium: false, is_approved: true, likes: 1850, views: 12300, created_at: '2024-11-20T00:00:00Z' },
  { id: '5', title: 'King Legacy Sea Beast Farm', game: 'King Legacy', description: 'Auto sea beast + chest auto-collect', image_url: null, script_content: '', author_id: 'u5', author_username: 'CrimsonWraith', tags: ['farm'], is_premium: false, is_approved: true, likes: 3400, views: 21000, created_at: '2024-11-18T00:00:00Z' },
  { id: '6', title: 'Da Hood God Script', game: 'Da Hood', description: 'Aimbot, silent aim, noclip, infinite money', image_url: null, script_content: '', author_id: 'u1', author_username: 'VoidReaper', tags: ['op','premium'], is_premium: true, is_approved: true, likes: 9102, views: 74300, created_at: '2024-11-15T00:00:00Z' },
]

const STATS = [
  { icon: BookOpen, value: '14,820', label: 'Scripts' },
  { icon: Users,    value: '89,440', label: 'Members' },
  { icon: Shield,   value: '0',      label: 'Bans Detected' },
  { icon: Zap,      value: '99.9%',  label: 'Uptime' },
]

const FEATURES = [
  { icon: Shield, title: 'Undetected & Safe',  text: 'Every script is scanned and tested. Our threat analyzer catches malicious injectors before they reach users.' },
  { icon: Zap,    title: 'Instant Copy',        text: 'One click to copy any script directly to clipboard. No ads, no redirect, no BS.' },
  { icon: Star,   title: 'Community Reviewed',  text: 'Likes, views and user ratings surface the best scripts. Bad ones get buried automatically.' },
  { icon: TrendingUp, title: 'Daily Updates',   text: 'Patched scripts get flagged within hours. Our team monitors every major Roblox update.' },
  { icon: Users,  title: 'Hall of Fame',         text: 'Top contributors earn Blood Lord and Lich King ranks — permanently on the leaderboard.' },
  { icon: Skull,  title: 'Staff Moderated',      text: 'Every uploaded script goes through manual staff review before it goes live.' },
]

function AnimatedCounter({ target, duration = 1.8 }: { target: string; duration?: number }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const num = parseInt(target.replace(/[^0-9]/g, ''))
    if (isNaN(num)) { setDisplay(target); return }
    const suffix = target.replace(/[0-9,]/g, '')
    let start = 0
    const increment = num / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= num) { setDisplay(num.toLocaleString() + suffix); clearInterval(timer) }
      else setDisplay(Math.floor(start).toLocaleString() + suffix)
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span ref={ref}>{display}</span>
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOp  = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const scripts = useScriptStore(s => s.scripts)
  const displayScripts = scripts.length > 0 ? scripts.slice(0, 6) : MOCK_SCRIPTS

  return (
    <div className="flex flex-col">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #500000 0%, #200000 30%, #0a0000 60%, #000000 100%)' }}
      >
        {/* Scanlines */}
        <div className="scanlines absolute inset-0 pointer-events-none z-0" />

        {/* Animated radial pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(138,0,0,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">

          {/* Logo skull */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative inline-flex">
              <motion.div
                animate={{ boxShadow: ['0 0 30px #8a000066', '0 0 60px #c0002aaa', '0 0 30px #8a000066'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-blood-300 via-blood-200 to-reaper-purpleMid flex items-center justify-center border border-blood-200/50"
              >
                <Skull className="w-12 h-12 text-blood-50" style={{ filter: 'drop-shadow(0 0 12px #ff0000)' }} />
              </motion.div>

              {/* Drips from logo */}
              {[25, 50, 75].map((left, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-0.5 bg-gradient-to-b from-blood-200 to-transparent rounded-full"
                  style={{ left: `${left}%` }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: [0, 30, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, repeatDelay: 2 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-horror text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-4"
            style={{
              color: '#cc0000',
              textShadow: '0 0 20px #8a0000, 0 0 40px #8a000066, 0 0 80px #8a000033, 2px 4px 0 #200000',
              letterSpacing: '0.05em',
            }}
          >
            ReaperHub
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="font-tech text-lg sm:text-xl md:text-2xl text-blood-100/70 mb-3 tracking-wider"
          >
            The Bloodiest Roblox Script Hub
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-body text-base text-text-dim max-w-xl mb-10 leading-relaxed"
          >
            Thousands of free &amp; premium scripts — undetected, powerful, community-driven.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/browse">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="blood-btn flex items-center gap-2 text-sm px-8 py-4">
                <BookOpen className="w-4 h-4" /> Browse Scripts
              </motion.button>
            </Link>
            <Link to="/upload">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="ghost-btn flex items-center gap-2 text-sm px-8 py-4">
                <Upload className="w-4 h-4" /> Upload Now
              </motion.button>
            </Link>
            <a href="https://discord.gg/" target="_blank" rel="noreferrer">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-lg border border-reaper-purpleMid/50 text-reaper-purpleLight hover:border-reaper-purpleLight hover:bg-reaper-purpleMid/10 transition-all font-tech text-sm tracking-widest uppercase flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Join Discord
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-dim"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-xs font-body tracking-widest uppercase opacity-50">Scroll</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="relative border-y border-blood-200/20 bg-black/80 backdrop-blur-sm py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-1"
            >
              <Icon className="w-5 h-5 text-blood-200/60 mb-1" />
              <span className="font-tech text-2xl font-bold text-blood-50 glow-text">
                <AnimatedCounter target={value} />
              </span>
              <span className="text-xs text-text-dim font-body tracking-wider uppercase">{label}</span>
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blood-200/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blood-200/30 to-transparent" />
      </section>

      {/* ── FEATURED SCRIPTS ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">★ Hot Right Now</p>
            <h2 className="font-horror text-4xl md:text-5xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>
              Featured Scripts
            </h2>
          </div>
          <Link to="/browse" className="ghost-btn text-xs py-2 px-4 flex items-center gap-2 hidden sm:flex">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayScripts.slice(0, 3).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ScriptCard script={s} variant="featured" />
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── LATEST APPROVED ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">Recently Approved</p>
          <h2 className="font-horror text-4xl md:text-5xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>
            Latest Scripts
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayScripts.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ScriptCard script={s} />
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-divider mx-6" />

      {/* ── WHY REAPERHUB ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">Why Choose Death</p>
          <h2 className="font-horror text-4xl md:text-5xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>
            Built for the Bloodthirsty
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 border-blood-200/20 hover:border-blood-200/40 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blood-200/10 border border-blood-200/30 flex items-center justify-center mb-4 group-hover:shadow-blood-sm transition-all">
                <Icon className="w-5 h-5 text-blood-200" />
              </div>
              <h3 className="font-tech text-sm font-semibold text-blood-50 mb-2">{title}</h3>
              <p className="text-xs text-text-dim leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-blood-200/20 py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Skull className="w-5 h-5 text-blood-200/50" />
          <span className="font-horror text-2xl text-blood-200/50">ReaperHub</span>
        </div>
        <p className="text-xs text-text-dim/50 font-body">
          © {new Date().getFullYear()} ReaperHub. Not affiliated with Roblox Corporation.
        </p>
      </footer>
    </div>
  )
}
