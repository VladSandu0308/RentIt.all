module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", './node_modules/tw-elements/dist/js/**/*.js', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A3CDC8',
        secondary: '#EDE6DB',
        textMain: '#233c3b',
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
        '9': 'repeat(9, minmax(0, 1fr))',
      },
      gridRow: {
        'span-13': 'span 13 / span 13',
        'span-9': 'span 9 / span 9',
        'span-8': 'span 8 / span 8',
        'span-7': 'span 7 / span 7',
      },
      boxShadow: {
        '3xl': '0 7px 5px  rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'login': "url('/src/images/background.jpg')",
      },
      fontFamily: {
        'ultra': ['Ultra']
      },
      height: {
        '128': '26rem',
        '256': '36rem',
        '164': '28rem'
      },
      width: {
        '128': '34rem',
        '256': '36rem',
        '300': '39rem',
        '512': '50rem',
      }
    },
  },
  plugins: [
    require('tw-elements/dist/plugin'),
    require('tailwind-scrollbar-hide'),
  ],
}
