import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, Copy, Check, Crown, Skull, Gamepad2, Calendar } from 'lucide-react'
import { cn, formatNumber, formatDate } from '@/lib/utils'
import type { Script } from '@/lib/supabase'

interface ScriptCardProps {
  script: Script
  onLike?: (id: string) => void
  onCopy?: (id: string) => void
  onView?: (id: string) => void
  variant?: 'default' | 'featured'
}

export default function ScriptCard({ script, onLike, onCopy, onView, variant = 'default' }: ScriptCardProps) {
  const [copied, setCopied]   = useState(false)
  const [liked,  setLiked]    = useState(false)
  const [isHovered, setHover] = useState(false)

  const handleCopy = () => {
    // TODO: implement actual script copy
    onCopy?.(script.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLike = () => {
    onLike?.(script.id)
    setLiked(v => !v)
  }

  const isFeatured = variant === 'featured'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className={cn(
        'glass-card group relative flex flex-col overflow-hidden transition-all duration-300',
        isFeatured ? 'border-blood-200/40' : 'border-blood-200/20',
        isHovered && 'shadow-blood border-blood-200/50'
      )}
    >
      {/* Hover glow overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: 'radial-gradient(ellipse at top, rgba(138,0,0,0.12) 0%, transparent 70%)' }}
      />

      {/* Blood drip on hover */}
      {isHovered && (
        <>
          <div className="drip" style={{ left: '20%', animationDelay: '0s' }} />
          <div className="drip" style={{ left: '50%', animationDelay: '0.6s' }} />
          <div className="drip" style={{ left: '80%', animationDelay: '1.2s' }} />
        </>
      )}

      {/* Thumbnail */}
      <div className={cn('relative overflow-hidden bg-gradient-to-br from-blood-400 to-black', isFeatured ? 'h-44' : 'h-32')}>
        {script.image_url ? (
          <img
            src={script.image_url}
            alt={script.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Skull
              className="text-blood-200/30 group-hover:text-blood-200/50 transition-colors"
              style={{ width: isFeatured ? 48 : 36, height: isFeatured ? 48 : 36 }}
            />
          </div>
        )}

        {/* Tags overlay */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          <span className={cn('rank-badge text-xs border', script.is_premium ? 'tag-premium' : 'tag-free')}>
            {script.is_premium ? <><Crown className="w-3 h-3" /> Premium</> : 'Free'}
          </span>
          {script.tags.slice(0, 2).map(tag => (
            <span key={tag} className={cn('rank-badge text-xs border', `tag-${tag}`)}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className={cn(
          'font-tech font-semibold text-blood-50 leading-tight line-clamp-2 group-hover:text-white transition-colors',
          isFeatured ? 'text-base' : 'text-sm'
        )}>
          {script.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-text-dim">
          <Gamepad2 className="w-3 h-3 text-blood-200/60" />
          <span className="text-blood-100/70 font-medium">{script.game}</span>
        </div>

        {isFeatured && script.description && (
          <p className="text-xs text-text-dim line-clamp-2">{script.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-blood-200/10">
          <div className="flex items-center gap-3 text-xs text-text-dim">
            {/* Author */}
            <div className="flex items-center gap-1">
              <Skull className="w-3 h-3 text-blood-200/50" />
              <span className="text-blood-100/60">{script.author_username}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-dim">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 transition-colors hover:scale-110 active:scale-95',
                liked ? 'text-blood-50' : 'text-text-dim hover:text-blood-100'
              )}
            >
              <Heart className={cn('w-3 h-3', liked && 'fill-current')} />
              <span>{formatNumber(script.likes + (liked ? 1 : 0))}</span>
            </button>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(script.views)}
            </span>
          </div>
        </div>

        {/* Copy button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className={cn(
            'w-full mt-1 py-2 rounded-lg text-xs font-tech font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2',
            copied
              ? 'bg-green-900/30 border border-green-700/50 text-green-400'
              : 'bg-blood-200/10 border border-blood-200/30 text-blood-100/80 hover:bg-blood-200/20 hover:border-blood-200/60 hover:text-blood-50 hover:shadow-blood-sm'
          )}
        >
          {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Script</>}
        </motion.button>
      </div>
    </motion.div>
  )
}
