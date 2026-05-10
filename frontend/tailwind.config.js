/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F4EDDD',
        ink: {
          DEFAULT: '#14110D',
          2: '#3A3530',
          muted: '#8a8377',
        },
        accent: '#E84A1F',
        sage: '#4D6B47',
        warm: '#F5C747',
        paper: '#FFFFFF',
        header: '#C49F6D',
        rule: 'rgba(20,17,13,0.10)',
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#7d6358',
          800: '#5c4941',
          900: '#453731',
          950: '#2c211d',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'elegant': '0 1px 3px rgba(44, 33, 29, 0.08), 0 1px 2px rgba(44, 33, 29, 0.05)',
        'floating': '0 20px 40px -8px rgba(44, 33, 29, 0.18), 0 8px 16px -4px rgba(44, 33, 29, 0.10)',
        'section': '0 1px 2px rgba(44, 33, 29, 0.06)',
        // Report Card grade depth shadows
        'grade-sage': '0 6px 0 #3a5236',
        'grade-warm': '0 6px 0 #c89e23',
        'grade-accent': '0 6px 0 #b53718',
        'grade-sm-sage': '0 3px 0 #3a5236',
        'grade-sm-amber': '0 3px 0 #9c7a1c',
        'grade-sm-accent': '0 3px 0 #b53718',
      },
      width: {
        '85': '21.25rem',
        '90': '22.5rem',
      }
    },
  },
  plugins: [],
}
