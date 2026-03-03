import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Types ──────────────────────────────────────────────────────────────────

export type UserRank = 'Spectral' | 'Reaper' | 'Blood Lord' | 'Death Knight' | 'Lich King' | 'Staff' | 'Admin'

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  discord_link: string | null
  rank: UserRank
  scripts_uploaded: number
  scripts_approved: number
  ip_address: string | null
  created_at: string
  notifications_enabled: boolean
}

export interface Script {
  id: string
  title: string
  game: string
  description: string | null
  image_url: string | null
  script_content: string
  author_id: string
  author_username: string
  tags: string[]
  is_premium: boolean
  is_approved: boolean
  likes: number
  views: number
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  sender_username: string
  sender_rank: UserRank
  recipient_id: string
  subject: string
  body: string
  is_read: boolean
  created_at: string
}
