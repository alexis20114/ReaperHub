import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/layout/Navbar'
import BloodParticles from '@/components/particles/BloodParticles'
import HomePage from '@/pages/HomePage'
import BrowsePage from '@/pages/BrowsePage'
import UploadPage from '@/pages/UploadPage'
import ContributorsPage from '@/pages/ContributorsPage'
import MailboxPage from '@/pages/MailboxPage'
import SettingsPage from '@/pages/SettingsPage'
import AuthPage from '@/pages/AuthPage'
import { useAuthStore } from '@/store'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />
}

export default function App() {
  const cursorRef  = useRef<HTMLDivElement>(null)
  const ringRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top  = `${mouseY}px`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => document.body.classList.add('cursor-hover')
    const onLeave = () => document.body.classList.remove('cursor-hover')

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[role=button]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <div id="reaper-cursor" ref={cursorRef} />
      <div id="reaper-cursor-ring" ref={ringRef} />

      {/* Global blood particles */}
      <BloodParticles />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/browse"       element={<BrowsePage />} />
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/auth"         element={<AuthPage />} />
            <Route path="/upload"       element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/mailbox"      element={<ProtectedRoute><MailboxPage /></ProtectedRoute>} />
            <Route path="/settings"     element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Toaster />
    </>
  )
}
