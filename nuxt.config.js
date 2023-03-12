import webpack from 'webpack'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'racetrack_nuxtjs',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      // {
      //   src: "js/main.js",
      //   type: "module"
      // }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-flowbite.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    //'@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss,
    // '@nuxtjs/tailwindcss',
    //'@nuxt/postcss8',
    
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    'nuxt-socket-io',
    '@nuxtjs/vuetify'
  ],

  io: {
    // module options
    sockets: [{
      default: true,
      name: 'main',
      url: process.env.API_URL || 'http://127.0.0.1:5000/'
    }]
  },

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL || 'http://127.0.0.1:5000/'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        // global modules
        flowbite: 'flowbite'
      })
    ],
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {}
        }
      }
    }
  }
}
