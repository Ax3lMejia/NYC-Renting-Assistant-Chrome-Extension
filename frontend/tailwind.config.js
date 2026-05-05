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
          950: '#2c211d',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          light: '#ccfbf1',
          DEFAULT: '#0d9488',
          dark: '#0f766e',
        }
      },
      boxShadow: {
        'elegant': '0 1px 3px rgba(44, 33, 29, 0.08), 0 1px 2px rgba(44, 33, 29, 0.05)',
        'floating': '0 20px 40px -8px rgba(44, 33, 29, 0.18), 0 8px 16px -4px rgba(44, 33, 29, 0.10)',
        'section': '0 1px 2px rgba(44, 33, 29, 0.06)',
      },
      width: {
        '85': '21.25rem',
        '90': '22.5rem',
      }
    },
  },
  plugins: [],
}
