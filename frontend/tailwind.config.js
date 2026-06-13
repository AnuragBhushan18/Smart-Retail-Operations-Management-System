/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Remap default blue palette to premium Oceanic Teal for seamless page-wide styling
        blue: {
          50:  '#EDF4F5',
          100: '#DCEAEF',
          200: '#C0DBE2',
          300: '#93C4CF',
          400: '#5D9CB0',
          500: '#2A6F82', // Primary Teal accent
          600: '#1E5361', // Hover Teal accent
          700: '#1C404B',
          800: '#102B33',
          900: '#08171C',
        },
        primary:   { DEFAULT: '#2A6F82', 50:'#EDF4F5', 100:'#DCEAEF', 200:'#C0DBE2', 500:'#2A6F82', 600:'#1E5361', 700:'#1C404B' },
        secondary: { DEFAULT: '#3F9F83', 50:'#EBF6F3', 100:'#D4ECE5', 500:'#3F9F83', 600:'#2E7D66' },
        accent:    { DEFAULT: '#E28766', 50:'#FDF3F0', 100:'#FBE4DC', 500:'#D4704E', 600:'#AA5334' },
        brand:     { light:'#EAF2F4', mid:'#C8DBE0', DEFAULT:'#2A6F82', dark:'#1E5361' },
        // Remap surface and slate to warm Sand tones
        surface:   { DEFAULT:'#FAF8F5', card:'#FFFFFF', border:'#EAE3D9', hover:'#F3EFE9' },
        slate: {
          50:  '#FAF8F5', // App background (warm sand off-white)
          100: '#F4EFE6', // Hover / Secondary background
          200: '#EAE3D9', // Card / Table borders (warm clay border)
          300: '#D8CFC2',
          400: '#BCAFA0',
          500: '#988A7A', // Muted text
          600: '#7E7060',
          700: '#645749',
          800: '#3D352C', // Standard text
          900: '#1E1A16', // Deep title text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Soften shadows to match the warm organic style
        'card':  '0 1px 3px 0 rgba(61,53,44,0.04), 0 1px 2px -1px rgba(61,53,44,0.04)',
        'card-hover': '0 4px 16px 0 rgba(61,53,44,0.06), 0 2px 6px -2px rgba(61,53,44,0.05)',
        'dropdown': '0 10px 30px -5px rgba(61,53,44,0.08), 0 4px 12px -6px rgba(61,53,44,0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
