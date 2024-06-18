import {Downloads} from "~/server/utils/types/downloads";
import {updateStatistics} from "~/server/utils/statistics";

export default defineEventHandler(async (event) => {
    await updateStatistics()
})
