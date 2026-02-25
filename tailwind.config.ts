import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'iconic-yellow': '#F2E900',
        'cyan': '#02D7F2',
        'electric-blue': '#007AFF',
        'hot-red': '#FF1111',
        'deep-black': '#0A0A0F',
        'neon-cyan': '#25E1ED',
        'hot-magenta': '#ED1E79',
      },
      fontFamily: {
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'share-tech-mono': ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
