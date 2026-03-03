import type { ISourceOptions } from '@tsparticles/engine'

export const bloodParticlesConfig: ISourceOptions = {
  id: 'blood-particles',
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: {
      value: 80,
      density: { enable: true, width: 1920, height: 1080 },
    },
    color: {
      value: ['#8a0000', '#4a0000', '#c0002a', '#3c003c', '#600000', '#aa0020'],
    },
    shape: {
      type: ['circle', 'triangle'],
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: {
        enable: true,
        speed: 0.8,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 5 },
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: { min: 0.3, max: 1.2 },
      direction: 'bottom',
      random: true,
      straight: false,
      outModes: {
        default: 'out',
        bottom: 'destroy',
        top: 'none',
      },
      gravity: {
        enable: true,
        acceleration: 0.3,
      },
      trail: {
        enable: true,
        length: 8,
        fill: { color: '#00000000' },
      },
    },
    life: {
      duration: { sync: false, value: 10 },
      count: 0,
    },
    wobble: {
      enable: true,
      distance: 8,
      speed: { min: -3, max: 3 },
    },
    tilt: {
      enable: true,
      direction: 'random',
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 20 },
    },
    roll: { enable: true, speed: 5 },
    rotate: {
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 5 },
    },
  },
  emitters: [
    {
      direction: 'bottom',
      rate: { delay: 0.2, quantity: 1 },
      position: { x: 0, y: 0 },
      size: { width: 100, height: 0 },
    },
  ],
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      onClick: {
        enable: true,
        mode: 'push',
      },
    },
    modes: {
      repulse: { distance: 80, duration: 0.4, speed: 0.5 },
      push: { quantity: 3 },
    },
  },
  detectRetina: true,
}
