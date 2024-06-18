export default defineNitroPlugin(async () => {
    await runTask("analyze")
})