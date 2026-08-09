/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0A',      // near-black background
        ash: '#141414',       // charcoal panels
        bone: '#F3F2ED',      // off-white
        steel: '#8A8D91',     // muted grey text
        line: '#2A2A2A',      // hairline borders on dark
        lineLight: '#DEDBD3', // hairline borders on light
        signal: '#3B5BFF',    // electric cobalt — used only for live/interactive state
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 -200px' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        scan: 'scan 6s linear infinite',
        fadeUp: 'fadeUp 0.6s ease forwards',
      },
    },
  },
  plugins: [],
}
