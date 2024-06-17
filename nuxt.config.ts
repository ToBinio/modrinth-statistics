// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    routeRules: {
        "/numberPerLauncher": {
            prerender: true
        }
    }
})
