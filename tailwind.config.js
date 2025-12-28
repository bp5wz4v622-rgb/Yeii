/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fucsia: '#FF0090',
        cian: '#00DBFF',
        amarillo: '#FFEF00',
        crema: '#FDFCF0',
      }
    },
  },
  plugins: [],
}
