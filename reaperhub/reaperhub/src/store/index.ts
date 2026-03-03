import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { Profile, Script, Message } from '@/lib/supabase'

// ─── Auth Store ──────────────────────────────────────────────────────────────

interface AuthState {
  user: Profile | null
  session: { id: string; email?: string } | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (username: string, password: string) => Promise<{ error: string | null }>
  register: (username: string, password: string, email?: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>
  fetchProfile: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (username, password) => {
        set({ isLoading: true })
        try {
          // We use username as email prefix for supabase auth
          // Lookup the user email by username first
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single()

          if (profileError || !profile) {
            set({ isLoading: false })
            return { error: 'Username not found.' }
          }

          const email = `${username.toLowerCase()}@reaperhub.internal`
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })

          if (error) { set({ isLoading: false }); return { error: error.message } }

          set({ user: profile, session: { id: data.user.id }, isAuthenticated: true, isLoading: false })
          return { error: null }
        } catch (e) {
          set({ isLoading: false })
          return { error: 'Unexpected error.' }
        }
      },

      register: async (username, password, email) => {
        set({ isLoading: true })
        try {
          // Check username uniqueness
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single()

          if (existing) { set({ isLoading: false }); return { error: 'Username already taken.' } }

          // Collect public IP
          let ip = '0.0.0.0'
          try {
            const res = await fetch('https://api.ipify.org?format=json')
            const d = await res.json()
            ip = d.ip
          } catch { /* silent */ }

          // Create auth account (use username-derived email if none provided)
          const authEmail = email || `${username.toLowerCase()}@reaperhub.internal`
          const { data, error } = await supabase.auth.signUp({ email: authEmail, password })

          if (error) { set({ isLoading: false }); return { error: error.message } }

          // Insert profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user!.id,
              username,
              rank: 'Spectral',
              scripts_uploaded: 0,
              scripts_approved: 0,
              ip_address: ip,
              notifications_enabled: true,
            })
            .select()
            .single()

          if (profileError) { set({ isLoading: false }); return { error: profileError.message } }

          set({ user: profile, session: { id: data.user!.id }, isAuthenticated: true, isLoading: false })
          return { error: null }
        } catch (e) {
          set({ isLoading: false })
          return { error: 'Unexpected error.' }
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, isAuthenticated: false })
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return { error: 'Not authenticated' }
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()
        if (error) return { error: error.message }
        set({ user: data })
        return { error: null }
      },

      fetchProfile: async (userId) => {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
        if (data) set({ user: data })
      },
    }),
    {
      name: 'reaperhub-auth',
      partialize: (state) => ({ session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// ─── Scripts Store ───────────────────────────────────────────────────────────

interface ScriptState {
  scripts: Script[]
  isLoading: boolean
  fetchScripts: (filters?: { game?: string; tags?: string[]; is_premium?: boolean; search?: string }) => Promise<void>
  likeScript: (scriptId: string) => Promise<void>
  viewScript: (scriptId: string) => Promise<void>
  uploadScript: (data: Omit<Script, 'id' | 'created_at' | 'likes' | 'views' | 'is_approved'>) => Promise<{ error: string | null }>
}

export const useScriptStore = create<ScriptState>()((set, get) => ({
  scripts: [],
  isLoading: false,

  fetchScripts: async (filters) => {
    set({ isLoading: true })
    let query = supabase.from('scripts').select('*').eq('is_approved', true).order('created_at', { ascending: false })
    if (filters?.game) query = query.ilike('game', `%${filters.game}%`)
    if (filters?.is_premium !== undefined) query = query.eq('is_premium', filters.is_premium)
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`)
    const { data } = await query.limit(50)
    set({ scripts: data || [], isLoading: false })
  },

  likeScript: async (scriptId) => {
    // TODO: implement like toggle with user tracking
    const { scripts } = get()
    set({ scripts: scripts.map(s => s.id === scriptId ? { ...s, likes: s.likes + 1 } : s) })
  },

  viewScript: async (scriptId) => {
    await supabase.rpc('increment_views', { script_id: scriptId })
  },

  uploadScript: async (data) => {
    const { error } = await supabase.from('scripts').insert({ ...data, is_approved: false, likes: 0, views: 0 })
    if (error) return { error: error.message }
    return { error: null }
  },
}))

// ─── Mailbox Store ───────────────────────────────────────────────────────────

interface MailState {
  messages: Message[]
  isLoading: boolean
  fetchMessages: (userId: string) => Promise<void>
  sendMessage: (data: Omit<Message, 'id' | 'created_at' | 'is_read'>) => Promise<{ error: string | null }>
  markRead: (messageId: string) => Promise<void>
}

export const useMailStore = create<MailState>()((set, get) => ({
  messages: [],
  isLoading: false,

  fetchMessages: async (userId) => {
    set({ isLoading: true })
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
    set({ messages: data || [], isLoading: false })
  },

  sendMessage: async (data) => {
    const { error } = await supabase.from('messages').insert({ ...data, is_read: false })
    if (error) return { error: error.message }
    return { error: null }
  },

  markRead: async (messageId) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', messageId)
    const { messages } = get()
    set({ messages: messages.map(m => m.id === messageId ? { ...m, is_read: true } : m) })
  },
}))
