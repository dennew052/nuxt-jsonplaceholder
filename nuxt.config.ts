// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  server: {
    port: parseInt(process.env.PORT || '3000', 10) // Используйте переменную окружения PORT
  }
})