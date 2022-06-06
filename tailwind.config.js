module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A3CDC8',
        secondary: '#EDE6DB',
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
        '9': 'repeat(9, minmax(0, 1fr))',
      },
      gridRow: {
        'span-13': 'span 13 / span 13',
        'span-9': 'span 9 / span 9',
        'span-8': 'span 8 / span 8',
      },
      boxShadow: {
        '3xl': '0 7px 5px  rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'login': "url('/src/images/background.jpg')",
      },
      fontFamily: {
        'ultra': ['Ultra']
      }
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
