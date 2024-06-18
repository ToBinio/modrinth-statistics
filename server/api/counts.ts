import {exportStats, StatExport} from "~/server/utils/api/stats";

export default defineEventHandler(async (event): Promise<StatExport> => {
    return exportStats(event, value => value.count)
})

