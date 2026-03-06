/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'permira-navy': '#0D1F3C',
        'permira-orange': '#F5620F',
        'permira-dark': '#0A0E1A',
        'permira-card': '#111827',
        'permira-card-hover': '#1A2332',
        'permira-border': '#1F2937',
        'permira-text': '#F9FAFB',
        'permira-text-secondary': '#9CA3AF',
        'permira-success': '#10B981',
        'permira-danger': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
