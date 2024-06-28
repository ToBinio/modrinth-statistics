import {exportStats, StatExport} from "~/server/utils/api/stats";
import {ProjectTypes} from "~/server/utils/types/project";

export default defineEventHandler(async (event): Promise<StatExport> => {
    let query = getQuery(event);

    let mode = query.mode as string;
    let type = query.type as ProjectTypes;

    if (query.stat == "count") {
        return exportStats(mode, type, value => value.count)
    } else {
        return exportStats(mode, type, value => value.downloads)
    }
})