/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        sage: {
          50:  '#f0f7f0',
          100: '#ddeedd',
          200: '#bddcbd',
          300: '#93c393',
          400: '#63a363',
          500: '#3d7a3d',
          600: '#2d5e2d',
          700: '#244824',
          800: '#1e3a1e',
          900: '#182e18',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf7ef',
          200: '#f5eedb',
          300: '#ede0bc',
        },
      },
    },
  },
  plugins: [],
}
