/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'guide': {
          'teal': "#3BD9CA",
          'gray': "#303449"
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

