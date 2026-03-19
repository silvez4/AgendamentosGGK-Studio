export default defineNuxtConfig({
  compatibilityDate: '2026-03-18',

  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module'
  ],

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'studioTheme',
        themes: {
          studioTheme: {
            dark: false,
            colors: {
              background: '#F2E8DF',
              surface: '#FFFFFF',
              primary: '#713b28',
              secondary: '#8d5642',
              accent: '#5a2e1d',
              error: '#B00020',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            }
          }
        }
      }
    }
  },

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api',
    }
  }
})