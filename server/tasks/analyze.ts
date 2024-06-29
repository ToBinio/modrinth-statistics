import consola from "consola";

export default defineTask({
    meta: {
        name: "analyze",
        description: "Update all the statistics",
    },
    async run() {
        consola.log("starting analyze");

        console.time("finish analyze");
        await updateStatistics()
        console.timeEnd("finish analyze");

        return {result: "Success"};
    },
});