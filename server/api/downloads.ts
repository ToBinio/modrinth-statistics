import {getColorForLauncher} from "~/server/utils/color";

type result = {
    labels: string[]
    data: {
        name: string
        color: string,
        downloads: number[]
    }[]
}

export default defineEventHandler((event): result => {
        return {
            labels: ["1.16.5", "1.20.1", "1.21.0"],
            data: [
                {
                    name: "forge",
                    color: getColorForLauncher("forge"),
                    downloads: [5, 10, 100]
                },
                {
                    name: "neoforge",
                    color: getColorForLauncher("neoforge"),
                    downloads: [100, 10, 500]
                },
                {
                    name: "fabric",
                    color: getColorForLauncher("fabric"),
                    downloads: [50, 100, 2000]
                }
            ]
        }
    }
)

