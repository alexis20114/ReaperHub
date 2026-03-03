import { useCallback } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'
import { bloodParticlesConfig } from '@/lib/particles.config'

export default function BloodParticles() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Particles
        id="blood-particles"
        init={init}
        options={bloodParticlesConfig}
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  )
}
