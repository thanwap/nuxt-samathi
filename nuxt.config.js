import colors from 'vuetify/es5/util/colors'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',
  srcDir: 'src',
  buildDir: 'functions/.nuxt',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - nuxt-samathi',
    title: 'nuxt-samathi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~layouts/global.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/api/api-plugin.js',
    '~/plugins/utils.js',
    {
      src: '~plugins/html2canvas.js',
      ssr: false,
    },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  firebase: {
    config: {
      apiKey: 'AIzaSyBim7qhvOBsGHbp4lGSbWHy87PK6TCNSug',
      authDomain: 'samathi-8.firebaseapp.com',
      databaseURL: 'https://samathi-8-default-rtdb.firebaseio.com',
      projectId: 'samathi-8',
      storageBucket: 'samathi-8.appspot.com',
      messagingSenderId: '261199648778',
      appId: '1:261199648778:web:01e851fad5ec7b756527f3',
    },
    services: {
      database: true,
      storage: true,
    },
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: { extractCSS: true },
}
