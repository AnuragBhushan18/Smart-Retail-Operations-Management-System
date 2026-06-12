/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#60A5FA', 50:'#EFF6FF', 100:'#DBEAFE', 200:'#BFDBFE', 500:'#3B82F6', 600:'#2563EB', 700:'#1D4ED8' },
        secondary: { DEFAULT: '#2DD4BF', 50:'#F0FDFA', 100:'#CCFBF1', 500:'#14B8A6', 600:'#0D9488' },
        accent:    { DEFAULT: '#34D399', 50:'#ECFDF5', 100:'#D1FAE5', 500:'#10B981', 600:'#059669' },
        brand:     { light:'#E0F2FE', mid:'#BAE6FD', DEFAULT:'#60A5FA', dark:'#2563EB' },
        surface:   { DEFAULT:'#F8FAFC', card:'#FFFFFF', border:'#E2E8F0', hover:'#F1F5F9' },
        slate:     { 50:'#F8FAFC', 100:'#F1F5F9', 200:'#E2E8F0', 300:'#CBD5E1', 400:'#94A3B8', 500:'#64748B', 600:'#475569', 700:'#334155', 800:'#1E293B', 900:'#0F172A' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.08)',
        'dropdown': '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
