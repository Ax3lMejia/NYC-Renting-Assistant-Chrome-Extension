/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        },
        accent: {
          light: '#e9d5ff',
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
        }
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(69, 55, 49, 0.1), 0 2px 4px -1px rgba(69, 55, 49, 0.06)',
        'floating': '0 20px 25px -5px rgba(69, 55, 49, 0.1), 0 10px 10px -5px rgba(69, 55, 49, 0.04)',
      },
      width: {
        '85': '21.25rem',
        '90': '22.5rem',
      }
    },
  },
  plugins: [],
}
