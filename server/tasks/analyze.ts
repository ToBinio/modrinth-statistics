export default defineTask({
    meta: {
        name: "analyze",
        description: "Update all the statistics",
    },
    async run() {
        console.log("Running statistics update");

        console.time("finish update");
        await updateStatistics()
        console.timeEnd("finish update");

        return {result: "Success"};
    },
});