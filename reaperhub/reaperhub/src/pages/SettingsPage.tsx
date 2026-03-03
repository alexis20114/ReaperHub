import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, LogOut, Save, Skull, Link as LinkIcon, Camera } from 'lucide-react'
import { useAuthStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const imgRef = useRef<HTMLInputElement>(null)

  const [username,     setUsername]     = useState(user?.username || '')
  const [bio,          setBio]          = useState(user?.bio || '')
  const [discordLink,  setDiscordLink]  = useState(user?.discord_link || '')
  const [notifications, setNotifications] = useState(user?.notifications_enabled ?? true)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'danger'>('profile')

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => setAvatarPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile({
      username, bio: bio || null, discord_link: discordLink || null,
      notifications_enabled: notifications,
      // TODO: upload avatar to Supabase Storage and store URL
    })
    setSaving(false)
    if (error) toast({ title: 'Save failed', description: error, variant: 'destructive' })
    else toast({ title: 'Profile updated!', variant: 'success' })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: Skull },
  ] as const

  return (
    <div className="min-h-screen pt-20 pb-20 px-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-10">
        <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">Your Soul</p>
        <h1 className="font-horror text-5xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>Settings</h1>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 p-1 rounded-lg border border-blood-200/20 bg-black/40 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-tech tracking-wide transition-all duration-200',
              activeTab === id
                ? 'bg-blood-200/20 text-blood-50 shadow-blood-sm'
                : 'text-text-dim hover:text-blood-50 hover:bg-blood-200/10'
            )}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-blood-200/40 cursor-pointer"
                style={{ boxShadow: '0 0 20px rgba(138,0,0,0.3)' }}
                onClick={() => imgRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blood-300 to-reaper-purpleMid flex items-center justify-center text-3xl font-horror text-blood-50">
                    {user?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <button
                onClick={() => imgRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blood-200 rounded-full flex items-center justify-center border-2 border-black"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
              <input ref={imgRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleAvatarChange(e.target.files[0])}
              />
            </div>
            <div>
              <p className="font-tech text-base text-blood-50 font-semibold">{user?.username}</p>
              <span className={cn('rank-badge border text-xs', `rank-${user?.rank?.replace(' ', '')}`)}>
                {user?.rank}
              </span>
              <p className="text-xs text-text-dim mt-1">Click avatar to change</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="blood-input" maxLength={30} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="blood-input resize-none" rows={3} placeholder="Tell the community about yourself..." maxLength={200} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Discord Link
            </label>
            <input value={discordLink} onChange={e => setDiscordLink(e.target.value)} className="blood-input" placeholder="https://discord.gg/..." />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="blood-btn w-full py-4 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </motion.div>
      )}

      {/* Preferences tab */}
      {activeTab === 'preferences' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card border-blood-200/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-tech text-sm text-blood-50 mb-0.5">Email Notifications</p>
                <p className="text-xs text-text-dim">Receive alerts for script approvals and messages</p>
              </div>
              <button
                onClick={() => setNotifications(v => !v)}
                className={cn('w-12 h-6 rounded-full transition-all duration-300 relative', notifications ? 'bg-blood-200' : 'bg-blood-200/20')}
              >
                <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300', notifications ? 'left-[26px]' : 'left-0.5')} />
              </button>
            </div>
          </div>

          <div className="glass-card border-blood-200/20 p-5 opacity-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-tech text-sm text-blood-50 mb-0.5">Theme</p>
                <p className="text-xs text-text-dim">Dark only (for the damned)</p>
              </div>
              <span className="text-xs font-tech text-blood-200 border border-blood-200/30 px-3 py-1 rounded-lg">DARK</span>
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="blood-btn w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Preferences
          </motion.button>
        </motion.div>
      )}

      {/* Danger tab */}
      {activeTab === 'danger' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card border-red-900/40 p-6">
            <h3 className="font-tech text-red-400 text-sm font-semibold mb-1">Logout</h3>
            <p className="text-xs text-text-dim mb-4">End your current session. Your data will be preserved.</p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all font-tech text-sm tracking-wide"
            >
              <LogOut className="w-4 h-4" /> Logout
            </motion.button>
          </div>

          <div className="glass-card border-red-900/20 p-6 opacity-60">
            <h3 className="font-tech text-red-800 text-sm font-semibold mb-1">Delete Account</h3>
            <p className="text-xs text-text-dim mb-4">Permanently delete your account. Contact staff to process this request.</p>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-900/30 text-red-900 font-tech text-sm cursor-not-allowed opacity-50">
              <Skull className="w-4 h-4" /> Contact Staff
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
