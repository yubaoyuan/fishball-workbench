/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#FEF3EF',
          100: '#FDE2D7',
          200: '#FBC3AE',
          300: '#F89D7A',
          400: '#F37047',
          500: '#E85D3C',
          600: '#D44524',
          700: '#B0341C',
          800: '#8F2C1B',
          900: '#75281C',
        },
        warm: {
          50: '#FDF8F3',
          100: '#FAF0E4',
          200: '#F5E0C8',
          300: '#EDC9A1',
          400: '#E3AE76',
          500: '#D99352',
          600: '#CB7B42',
          700: '#A96038',
          800: '#884E34',
          900: '#6F412D',
        },
        success: {
          50: '#F0F7F0',
          100: '#DDEBDD',
          200: '#BDD7BE',
          300: '#92BC94',
          400: '#6A9C6D',
          500: '#5B8C5A',
          600: '#457046',
          700: '#39593A',
          800: '#304831',
          900: '#293C2A',
        },
        warning: {
          50: '#FEF8EC',
          100: '#FCECC9',
          200: '#F9D88D',
          300: '#F5BE51',
          400: '#F2AB29',
          500: '#E9931E',
          600: '#CE7218',
          700: '#AB5216',
          800: '#8A4119',
          900: '#713718',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
