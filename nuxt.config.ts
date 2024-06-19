// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    app: {
        head: {
            link: [
                {rel: "icon", type: "image/svg+xml", href: "/favicon.svg"}
            ]
        }
    },
    runtimeConfig: {
        public: {
            posthogPublicKey: 'phc_vD7xT8ICrEYHimKUBG3SJUeMqSKrvq0v9rQsQGW4cI9',
            posthogHost: 'https://eu.i.posthog.com'
        }
    },
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
        // preset: "bun",
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