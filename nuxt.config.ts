// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  devServer: { port: 3002 },
  modules: ["@nuxtjs/tailwindcss", "nuxt-qrcode"],
  typescript: {
    typeCheck: false,
  },
  runtimeConfig: {
    public: {
      hostApi: process.env.HOST_API || "http://eudi-verifier",
    },
  },
  qrcode: {
    options: {
      variant: {
        inner: "circle",
        marker: "rounded",
        pixel: "rounded",
      },
      radius: 1,
      blackColor: "currentColor",
      whiteColor: "transparent",
    },
  },
  nitro: {
    port: 3002,
    host: "0.0.0.0",
    devProxy: {
      "/ui/": {
        target: "http://eudi-verifier-backend:8080/ui/",
        changeOrigin: true,
      },
      "/wallet/": {
        target: "http://eudi-verifier-backend:8080/wallet/",
        changeOrigin: true,
      },
    },
  },
});
