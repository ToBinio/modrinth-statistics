import {updateStatistics} from "~/server/utils/statistics";

export default defineEventHandler(async (event) => {
    await runTask("analyze")
})
