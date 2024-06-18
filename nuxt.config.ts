// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    routeRules: {
        "/downloads": {
            redirect: "/downloads/major"
        },
        // see - https://github.com/unjs/nitro/issues/889
        // "/downloads/all": {
        //     prerender: true
        // },
        // "/downloads/minor": {
        //     prerender: true
        // },
        // "/downloads/major": {
        //     prerender: true
        // }
    },
    nitro: {
        preset: "bun",
        storage: {
            statistics: {
                driver: 'fs',
                base: './.data/statistics'
            }
        },
        experimental: {
            tasks: true
        },
        scheduledTasks: {
            '0 0 * * *': ['analyze']
        }
    },
    modules: ["nuxt-icon"]
})