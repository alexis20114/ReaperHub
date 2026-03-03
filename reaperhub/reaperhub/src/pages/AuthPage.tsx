import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Skull, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const [mode,     setMode]     = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [email,    setEmail]    = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const { login, register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError(null)
    if (!username.trim() || !password.trim()) { setError('Username and password are required.'); return }

    if (mode === 'register') {
      if (password !== confirm) { setError('Passwords do not match.'); return }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
      const { error: err } = await register(username, password, email || undefined)
      if (err) { setError(err); return }
    } else {
      const { error: err } = await login(username, password)
      if (err) { setError(err); return }
    }

    navigate('/')
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">

      {/* Pulsing red backdrop */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse at center, #40000066 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card border-blood-200/30 p-8 w-full max-w-md shadow-blood-intense relative"
      >
        {/* Drip decorations */}
        {[15, 40, 65, 85].map((left, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-0.5 bg-gradient-to-b from-blood-200 to-transparent rounded-b-full"
            style={{ left: `${left}%` }}
            animate={{ height: [0, 20 + i * 5, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, repeatDelay: 1.5 }}
          />
        ))}

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ filter: ['drop-shadow(0 0 8px #8a0000)', 'drop-shadow(0 0 20px #c0002a)', 'drop-shadow(0 0 8px #8a0000)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Skull className="w-12 h-12 text-blood-200 mx-auto" />
          </motion.div>
          <h1 className="font-horror text-4xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.6)' }}>ReaperHub</h1>
          <p className="text-xs text-text-dim mt-1 font-body">The Bloodiest Roblox Script Hub</p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-blood-200/30 mb-7 p-1 gap-1">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              className={cn(
                'flex-1 py-2.5 text-sm font-tech tracking-wider uppercase rounded-md transition-all duration-200',
                mode === m ? 'bg-blood-200/20 text-blood-50' : 'text-text-dim hover:text-blood-50'
              )}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <div className="space-y-4" onKeyDown={handleKey}>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_reaper_name"
              className="blood-input"
              autoComplete="username"
            />
          </div>

          {/* Email (register only) */}
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Email (optional)</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="reaper@example.com"
                  type="email"
                  className="blood-input"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="blood-input pr-10"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-blood-50 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Confirm Password</label>
                <input
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="blood-input"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* IP notice */}
          {mode === 'register' && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blood-200/05 border border-blood-200/20">
              <AlertCircle className="w-4 h-4 text-blood-200/50 shrink-0 mt-0.5" />
              <p className="text-xs text-text-dim leading-relaxed">
                Your public IP address is automatically collected upon registration. This helps staff detect multi-account abuse. By registering, you agree to our terms.
              </p>
            </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/40"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="blood-btn w-full py-4 text-base flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                <Skull className="w-5 h-5" />
              </motion.div> Loading...</>
            ) : mode === 'login' ? 'Enter the Hub' : 'Join the Reaping'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
