module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "vue/html-self-closing": "off", // Fix v-for/template/key bug,
    "vue/valid-v-slot": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/max-attributes-per-line": "off",
    "no-console": "off"
  }
}
