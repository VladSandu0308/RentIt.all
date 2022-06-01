module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('/src/images/background.jpg')",
      }
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
