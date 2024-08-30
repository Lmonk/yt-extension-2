/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const rotateY = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-y-180': {
      transform: 'rotateY(180deg)',
    }
  })
})

const minWidth = plugin(function ({ addUtilities }) {
  addUtilities({
    '.min-w-18': {
      'min-width': '4.5rem',
    }
  })
})

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [rotateY, minWidth],
}