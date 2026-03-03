import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Plus, X, Send, Skull, Inbox } from 'lucide-react'
import { useAuthStore, useMailStore } from '@/store'
import { cn, formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/toaster'

// Seed some demo messages into localStorage if mailbox is empty
const DEMO_MESSAGES = [
  {
    id: 'demo-1',
    sender_id: 'staff-1',
    sender_username: 'Staff_Mortis',
    sender_rank: 'Staff' as const,
    recipient_id: '',
    subject: 'Welcome to ReaperHub!',
    body: 'Welcome, Reaper. Your soul now belongs to the hub. Upload scripts, earn your rank, and bleed for the community. — Staff Team',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    sender_id: 'staff-2',
    sender_username: 'Admin_VoidLord',
    sender_rank: 'Admin' as const,
    recipient_id: '',
    subject: 'Script Review Policy Update',
    body: 'All scripts must now include a description. Scripts without descriptions will be rejected. Additionally, all loadstring() calls must be justified in comments.',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function MailboxPage() {
  const { user } = useAuthStore()
  const { messages, fetchMessages, sendMessage, markRead } = useMailStore()
  const { toast } = useToast()

  const [selected,    setSelected]    = useState<string | null>(null)
  const [composing,   setComposing]   = useState(false)
  const [toUsername,  setToUsername]  = useState('')
  const [subject,     setSubject]     = useState('')
  const [body,        setBody]        = useState('')
  const [sending,     setSending]     = useState(false)

  const allMessages = messages.length > 0 ? messages : DEMO_MESSAGES.map(m => ({ ...m, recipient_id: user?.id || '' }))

  useEffect(() => {
    if (user?.id) fetchMessages(user.id)
  }, [user?.id])

  const handleOpen = async (id: string) => {
    setSelected(id)
    const msg = allMessages.find(m => m.id === id)
    if (msg && !msg.is_read) await markRead(id)
  }

  const handleSend = async () => {
    if (!toUsername.trim() || !subject.trim() || !body.trim()) {
      toast({ title: 'Fill all fields', variant: 'destructive' }); return
    }
    if (!user) return
    setSending(true)

    // TODO: lookup recipient by username from profiles table
    const { error } = await sendMessage({
      sender_id: user.id,
      sender_username: user.username,
      sender_rank: user.rank,
      recipient_id: 'TODO_lookup',
      subject, body,
    })
    setSending(false)

    if (error) toast({ title: 'Failed to send', description: error, variant: 'destructive' })
    else {
      toast({ title: 'Message sent', variant: 'success' })
      setComposing(false); setToUsername(''); setSubject(''); setBody('')
    }
  }

  const selectedMsg = allMessages.find(m => m.id === selected)
  const unread = allMessages.filter(m => !m.is_read).length

  return (
    <div className="min-h-screen pt-20 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-8 flex items-end justify-between">
        <div>
          <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">Communications</p>
          <h1 className="font-horror text-5xl text-blood-50 flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>
            Mailbox
            {unread > 0 && <span className="text-sm font-tech bg-blood-200 text-white px-2 py-0.5 rounded-full">{unread}</span>}
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setComposing(true)}
          className="blood-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Message
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Inbox list */}
        <div className="md:col-span-1 glass-card border-blood-200/20 overflow-y-auto">
          <div className="p-3 border-b border-blood-200/20 flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blood-200/60" />
            <span className="text-xs font-tech text-blood-100/60 uppercase tracking-wider">Inbox</span>
          </div>
          {allMessages.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="w-10 h-10 text-blood-200/20 mx-auto mb-2" />
              <p className="text-xs text-text-dim">No messages yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-blood-200/10">
              {allMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleOpen(msg.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-blood-200/08 transition-all',
                    selected === msg.id && 'bg-blood-200/12 border-r-2 border-blood-200',
                    !msg.is_read && 'bg-blood-200/05'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-tech text-blood-50 font-semibold flex items-center gap-1">
                      {!msg.is_read && <span className="w-1.5 h-1.5 bg-blood-200 rounded-full shrink-0" />}
                      {msg.sender_username}
                    </span>
                    <span className={cn('rank-badge border text-xs', `rank-${msg.sender_rank}`)}>
                      {msg.sender_rank}
                    </span>
                  </div>
                  <p className={cn('text-xs mb-1', !msg.is_read ? 'text-blood-100' : 'text-text-dim')}>{msg.subject}</p>
                  <p className="text-xs text-text-dim/60 line-clamp-1">{msg.body}</p>
                  <p className="text-xs text-text-dim/40 mt-1">{formatDate(msg.created_at)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message view */}
        <div className="md:col-span-2 glass-card border-blood-200/20 overflow-y-auto">
          {selectedMsg ? (
            <motion.div key={selectedMsg.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-tech text-lg text-blood-50 font-semibold mb-1">{selectedMsg.subject}</h2>
                  <div className="flex items-center gap-2 text-xs text-text-dim">
                    <Skull className="w-3 h-3 text-blood-200/50" />
                    <span className="text-blood-100/60">{selectedMsg.sender_username}</span>
                    <span className={cn('rank-badge border', `rank-${selectedMsg.sender_rank}`)}>{selectedMsg.sender_rank}</span>
                    <span>·</span>
                    <span>{formatDate(selectedMsg.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blood-200/05 border border-blood-200/15">
                <p className="text-sm text-text-dim leading-relaxed whitespace-pre-wrap">{selectedMsg.body}</p>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-12 h-12 text-blood-200/20 mx-auto mb-3" />
                <p className="text-text-dim text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setComposing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border-blood-200/30 p-6 w-full max-w-lg shadow-blood-intense"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-tech text-lg text-blood-50">New Message</h2>
                <button onClick={() => setComposing(false)} className="text-text-dim hover:text-blood-50 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-tech text-blood-100/60 tracking-wider uppercase block mb-1">To (username)</label>
                  <input value={toUsername} onChange={e => setToUsername(e.target.value)} placeholder="Enter username..." className="blood-input" />
                </div>
                <div>
                  <label className="text-xs font-tech text-blood-100/60 tracking-wider uppercase block mb-1">Subject</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject..." className="blood-input" />
                </div>
                <div>
                  <label className="text-xs font-tech text-blood-100/60 tracking-wider uppercase block mb-1">Message</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Your message..." rows={5} className="blood-input resize-none" />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSend}
                  disabled={sending}
                  className="blood-btn w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
