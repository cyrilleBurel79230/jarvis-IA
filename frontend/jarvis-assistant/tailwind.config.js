/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,ts}'], // Assure-toi que Tailwind scanne tes fichiers Angular
  theme: {
    extend: {
      colors: {
        primary: "#00f0ff",
        secondary: "#1e293b",
        accent: "#7e22ce",
        dark: "#0f172a",
        health: "#10b981"
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        roboto: ["Roboto", "sans-serif"]
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}