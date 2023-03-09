
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    mode: "jit",
    content: {
        files: [
                './components/**/*.{vue, js}',
                './layouts/**/*.vue',
                './pages/**/*.vue',
                './plugins/**/*.{js, ts}',
        ]
    },
  theme: {
    extend: {
      fontFamily: {
        dmSansRegular:['DM Sans Regular'],
        dmSansMedium:['DM Sans Medium'],
        dmSansBold:['DM Sans Bold'],
      },
      
    },
  },
  variants:{ extend: {}},
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ]
}
