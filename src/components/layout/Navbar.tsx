import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Skull, Upload, BookOpen, Users, Mail, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { useAuthStore, useMailStore } from '@/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/',             label: 'Home',         icon: Skull },
  { to: '/browse',       label: 'Scripts',      icon: BookOpen },
  { to: '/upload',       label: 'Upload',       icon: Upload },
  { to: '/contributors', label: 'Contributors', icon: Users },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const location    = useLocation()
  const navigate    = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { messages } = useMailStore()
  const unread = messages.filter(m => !m.is_read).length

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-blood-200/20 shadow-[0_0_30px_rgba(138,0,0,0.15)]'
          : 'bg-transparent'
      )}
    >
      {/* Top blood drip line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood-200/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Skull
                className="w-7 h-7 text-blood-200 group-hover:text-blood-50"
                style={{ filter: 'drop-shadow(0 0 8px #8a0000)' }}
              />
            </div>
            {/* Drip effect on logo */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blood-200 to-transparent"
              initial={{ height: 0 }}
              animate={{ height: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
          <span className="font-horror text-xl text-blood-200 group-hover:text-blood-50 transition-colors"
                style={{ textShadow: '0 0 12px rgba(138,0,0,0.7)' }}>
            ReaperHub
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium tracking-wide transition-all duration-200',
                  active
                    ? 'text-blood-50 bg-blood-200/15'
                    : 'text-text-dim hover:text-blood-50 hover:bg-blood-200/10'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-px bg-blood-200"
                    style={{ boxShadow: '0 0 6px #8a0000' }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Mailbox */}
              <Link to="/mailbox" className="relative p-2 rounded-lg text-text-dim hover:text-blood-50 hover:bg-blood-200/10 transition-all">
                <Mail className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blood-200 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {unread}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blood-200/30 hover:border-blood-200/60 hover:bg-blood-200/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blood-200 to-reaper-purpleMid flex items-center justify-center text-xs font-bold text-white">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-body text-blood-50 hidden sm:block">{user.username}</span>
                  <ChevronDown className={cn('w-3 h-3 text-text-dim transition-transform', userOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 glass-card py-1 border-blood-200/30"
                    >
                      <div className="px-3 py-2 border-b border-blood-200/20">
                        <p className="text-xs text-text-dim">Signed in as</p>
                        <p className="text-sm font-tech text-blood-50">{user.username}</p>
                        <p className="text-xs mt-0.5">
                          <span className={cn('rank-badge', `rank-${user.rank.replace(' ', '')}`)}>
                            {user.rank}
                          </span>
                        </p>
                      </div>
                      <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-text-dim hover:text-blood-50 hover:bg-blood-200/10 transition-all">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dim hover:text-red-400 hover:bg-red-900/10 transition-all">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link to="/auth" className="blood-btn text-xs py-2 px-5">
              Connect
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-text-dim hover:text-blood-50 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-black/95 border-b border-blood-200/20"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all',
                    location.pathname === to
                      ? 'text-blood-50 bg-blood-200/15 border border-blood-200/30'
                      : 'text-text-dim hover:text-blood-50 hover:bg-blood-200/10'
                  )}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
