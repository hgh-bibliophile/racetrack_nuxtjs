module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  safelist: [
    'text-2xl',
    'text-3xl',
    {
      pattern: /(border|text)-(red|green|blue|gray)-(400|500|600|700|800)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
  // prefix: "tw-",
  important: true,
}
