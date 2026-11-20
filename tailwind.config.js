/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rpm: {
          navy: {
            DEFAULT: '#064E86',
            50: '#F0F6FA',
            100: '#E1EDF5',
            200: '#BFDAEC',
            300: '#8EBFE0',
            400: '#539FD0',
            500: '#2E84BE',
            600: '#064E86',
            700: '#054273',
            800: '#04365D',
            900: '#032B4A',
            950: '#021B30',
          },
          red: {
            DEFAULT: '#ED1F24',
            50: '#FEEAEB',
            100: '#FDD5D7',
            200: '#FBACAF',
            300: '#F7777C',
            400: '#F24248',
            500: '#ED1F24',
            600: '#D51217',
            700: '#B30B10',
            800: '#940E12',
            900: '#7B1215',
            950: '#430507',
          },
          slate: {
            DEFAULT: '#0F172A',
            dark: '#1E293B',
            muted: '#64748B',
            border: '#E2E8F0',
            bg: '#F8FAFC'
          }
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

