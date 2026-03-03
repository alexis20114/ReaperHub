import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image, Tag, FileCode, AlertCircle, CheckCircle, Skull } from 'lucide-react'
import { useScriptStore, useAuthStore } from '@/store'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toaster'

const GAMES = ['Blox Fruits', 'Arsenal', 'Da Hood', 'Brookhaven', 'Adopt Me', 'Jailbreak', 'Pet Simulator X', 'King Legacy', 'Royale High', 'Murder Mystery 2', 'Tower of Hell', 'Natural Disaster Survival', 'Other']
const ALL_TAGS = ['free', 'premium', 'op', 'gui', 'farm', 'pvp', 'utility', 'troll', 'fps', 'esp']

export default function UploadPage() {
  const { user } = useAuthStore()
  const { uploadScript } = useScriptStore()
  const { toast } = useToast()

  const [title,       setTitle]       = useState('')
  const [game,        setGame]        = useState('')
  const [description, setDescription] = useState('')
  const [tags,        setTags]        = useState<string[]>([])
  const [isPremium,   setIsPremium]   = useState(false)
  const [scriptText,  setScriptText]  = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging,  setIsDragging]  = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const fileRef  = useRef<HTMLInputElement>(null)
  const imgRef   = useRef<HTMLInputElement>(null)

  const toggleTag = (t: string) => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const handleImageChange = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (file.name.endsWith('.lua') || file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = ev => setScriptText(ev.target?.result as string)
      reader.readAsText(file)
    }
  }, [])

  const handleSubmit = async () => {
    if (!title.trim()) { toast({ title: 'Title required', variant: 'destructive' }); return }
    if (!game)         { toast({ title: 'Select a game', variant: 'destructive' }); return }
    if (!scriptText.trim()) { toast({ title: 'Script content required', variant: 'destructive' }); return }
    if (!user)         { toast({ title: 'Must be logged in', variant: 'destructive' }); return }

    setIsSubmitting(true)
    const { error } = await uploadScript({
      title, game, description, tags, is_premium: isPremium,
      script_content: scriptText,
      author_id: user.id,
      author_username: user.username,
      image_url: null,
    })
    setIsSubmitting(false)

    if (error) {
      toast({ title: 'Upload failed', description: error, variant: 'destructive' })
    } else {
      setSubmitted(true)
      toast({ title: 'Script submitted!', description: 'Pending staff review.', variant: 'success' })
    }
  }

  if (submitted) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card border-blood-200/30 p-12 max-w-md w-full text-center"
      >
        <motion.div animate={{ rotate: [0,10,-10,0] }} transition={{ repeat: Infinity, duration: 3 }} className="mb-6">
          <Skull className="w-16 h-16 text-blood-200 mx-auto" style={{ filter: 'drop-shadow(0 0 20px #8a0000)' }} />
        </motion.div>
        <h2 className="font-horror text-4xl text-blood-50 mb-3" style={{ textShadow: '0 0 15px rgba(138,0,0,0.6)' }}>Submitted!</h2>
        <p className="text-text-dim text-sm mb-6">Your script is pending staff review. You'll be notified once it's approved.</p>
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-6" />
        <button onClick={() => setSubmitted(false)} className="ghost-btn w-full">Upload Another</button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-20 px-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-10">
        <p className="text-blood-200/60 font-tech text-xs tracking-[0.3em] uppercase mb-2">Contribute</p>
        <h1 className="font-horror text-5xl text-blood-50" style={{ textShadow: '0 0 15px rgba(138,0,0,0.5)' }}>Upload Script</h1>
        <p className="text-text-dim text-sm mt-2">All scripts require staff approval before going public.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Script Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blox Fruits God Mode V3" className="blood-input" maxLength={80} />
          <p className="text-xs text-text-dim text-right">{title.length}/80</p>
        </div>

        {/* Game */}
        <div className="space-y-2">
          <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Target Game *</label>
          <select value={game} onChange={e => setGame(e.target.value)} className="blood-input">
            <option value="" style={{ background: '#0a0000' }}>Select a game...</option>
            {GAMES.map(g => <option key={g} value={g} style={{ background: '#0a0000' }}>{g}</option>)}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What does this script do? Features, warnings, instructions..."
            rows={3}
            className="blood-input resize-none"
            maxLength={500}
          />
          <p className="text-xs text-text-dim text-right">{description.length}/500</p>
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Thumbnail (optional)</label>
          <div
            onClick={() => imgRef.current?.click()}
            className={cn(
              'relative w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center overflow-hidden transition-all',
              imagePreview ? 'border-blood-200/60' : 'border-blood-200/30 hover:border-blood-200/60'
            )}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <X className="w-6 h-6 text-white" onClick={e => { e.stopPropagation(); setImagePreview(null) }} />
                </div>
                {/* Blood border effect */}
                <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_0_2px_rgba(138,0,0,0.6),0_0_20px_rgba(138,0,0,0.3)]" />
              </>
            ) : (
              <div className="text-center">
                <Image className="w-6 h-6 text-blood-200/30 mx-auto mb-1" />
                <span className="text-xs text-text-dim">Upload</span>
              </div>
            )}
          </div>
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageChange(e.target.files[0])} />
        </div>

        {/* Script drag-drop zone */}
        <div className="space-y-2">
          <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase">Script File (.lua / .txt) *</label>
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileRef.current?.click()}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
              isDragging
                ? 'border-blood-200 bg-blood-200/10 shadow-blood'
                : 'border-blood-200/30 hover:border-blood-200/60 hover:bg-blood-200/05'
            )}
          >
            <input ref={fileRef} type="file" accept=".lua,.txt" className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) { const r = new FileReader(); r.onload = ev => setScriptText(ev.target?.result as string); r.readAsText(file) }
              }}
            />
            <FileCode className={cn('w-8 h-8 mx-auto mb-3 transition-colors', isDragging ? 'text-blood-200' : 'text-blood-200/40')} />
            <p className="text-sm text-text-dim">
              {scriptText ? <span className="text-green-400">✓ Script loaded ({scriptText.length.toLocaleString()} chars)</span>
                          : <>Drop .lua / .txt file here or <span className="text-blood-100 underline">click to browse</span></>}
            </p>
          </div>

          {/* Or paste directly */}
          <div className="relative">
            <p className="text-xs text-text-dim mb-1 font-tech tracking-wider">or paste directly:</p>
            <textarea
              value={scriptText}
              onChange={e => setScriptText(e.target.value)}
              placeholder="-- Paste your Lua script here..."
              rows={8}
              spellCheck={false}
              className="blood-input resize-y font-mono text-xs"
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-tech text-blood-100/60 tracking-widest uppercase flex items-center gap-2"><Tag className="w-3 h-3" /> Tags</label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={cn(
                  'rank-badge border cursor-pointer transition-all',
                  `tag-${t}`,
                  tags.includes(t) ? 'scale-110' : 'opacity-40 hover:opacity-70'
                )}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        {/* Premium toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-blood-200/20 bg-blood-200/05">
          <div>
            <p className="text-sm font-tech text-blood-50">Premium Script</p>
            <p className="text-xs text-text-dim">Mark if this script requires a premium executor</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPremium(v => !v)}
            className={cn(
              'w-12 h-6 rounded-full transition-all duration-300 relative',
              isPremium ? 'bg-blood-200' : 'bg-blood-200/20'
            )}
          >
            <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300', isPremium ? 'left-[26px]' : 'left-0.5')} />
          </button>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-900/40 bg-yellow-900/10">
          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700/80 font-body leading-relaxed">
            Do NOT upload scripts containing malicious code (loadstring remote exploits, IP loggers, backdoors). Violations result in permanent ban and IP blacklist.
          </p>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn('blood-btn w-full py-4 text-base flex items-center justify-center gap-3', isSubmitting && 'opacity-50 cursor-not-allowed')}
        >
          {isSubmitting ? (
            <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Skull className="w-5 h-5" /></motion.div> Submitting...</>
          ) : (
            <><Upload className="w-5 h-5" /> Submit for Review</>
          )}
        </motion.button>

      </motion.div>
    </div>
  )
}
