<script setup lang="ts">
const title = ref("Modrinth Statistics");

useHead({
	title: title,
});

useTracking();

const projectType = useFilterItem("projectType", "mod");
const stat = useFilterItem("stat", "count");

watch(
	[projectType, stat],
	() => {
		title.value = `Modrinth Statistics - ${firstLetterUpperCase(projectType.value)} ${firstLetterUpperCase(stat.value)}`;
	},
	{ immediate: true },
);

const versionGroup = useFilterItem("versionGroup", "major");

const time = useFilterItem("time", "current");

const aggregate = useFilterItem("aggregate", "yes");
const aggregateBool = computed(() => aggregate.value === "yes");

const exclusive = useFilterItem("exclusive", "yes");
const exclusiveBool = computed(() => exclusive.value === "yes");

const versionFrom = useFilterItem("versionFrom", undefined);
const versionTo = useFilterItem("versionTo", undefined);
const { to, from } = await useVersionRange(
	versionGroup,
	versionTo,
	versionFrom,
);

const gameVersions = await useGameVersions(versionGroup);
const defaultVersion = computed(() => gameVersions.value[0] as string);
const version = useFilterItem("version", defaultVersion);

const { isGlobalStats, isProjectStats, isRevenueStats } =
	useTypeCategory(projectType);

const isGroupData = computed(() => {
	return (
		time.value === "current" && !isGlobalStats.value && !isRevenueStats.value
	);
});

const max_days = computed(() => {
	if (isGroupData.value) return undefined;

	return time.value === "all" ? undefined : 30;
});

const { data, isFetching } = useStatData(isGlobalStats, isRevenueStats, time, {
	mode: versionGroup,
	exclusive: exclusiveBool,
	type: projectType,
	stat: stat,
	versionTo: versionTo,
	versionFrom: versionFrom,
	version: version,
	days: max_days,
	aggregate: aggregateBool,
});

const lazyIsGroupData = ref(isGroupData.value);
watch(isFetching, () => {
	if (!isFetching.value) lazyIsGroupData.value = isGroupData.value;
});

const explanation = computed(() => {
	return useExplanations(stat.value);
});

const sideBarOpen = ref(false);
</script>

<template>
    <div class="flex flex-1">
        <SideBar v-model:open="sideBarOpen">
            <div class="flex-1 flex flex-col gap-6 px-2 pt-8">
                <FilterItem
                    :should-display="true"
                    v-model="projectType"
                    :options="[
                        'mod',
                        'plugin',
                        'datapack',
                        'shader',
                        'resourcepack',
                        'modpack',
                        'projects',
                        'versions',
                        'authors',
                        'files',
                        'revenue',
                    ]"
                    title="Type"
                    explanation=""
                />

                <FilterItem
                    :should-display="isProjectStats"
                    v-model="stat"
                    :options="['count', 'downloads', 'versions']"
                    title="Stat"
                    explanation=""
                />
                <FilterItem
                    :should-display="isProjectStats"
                    v-model="versionGroup"
                    :options="['major', 'minor', 'all']"
                    title="Version Group"
                    explanation="What type of Minecraft versions should be displayed"
                />
                <FilterItem
                    :should-display="isProjectStats"
                    v-model="exclusive"
                    :options="['yes', 'no']"
                    title="Exclusive"
                    explanation="Only show Versions made for a single launcher"
                />
                <FilterItem
                    :should-display="isProjectStats"
                    v-model="time"
                    :options="['current', 'all', 'last 30 days']"
                    title="Time"
                    explanation=""
                />

                <FilterItem
                    :should-display="isProjectStats"
                    v-if="time == 'current'"
                    v-model="versionFrom"
                    :can-clear="true"
                    :options="from"
                    title="Version From"
                    explanation="Whats the first version that should be displayed"
                />
                <FilterItem
                    :should-display="isProjectStats"
                    v-if="time == 'current'"
                    v-model="versionTo"
                    :can-clear="true"
                    :options="to"
                    title="Version To"
                    explanation="Whats the last version that should be displayed"
                />

                <FilterItem
                    :should-display="isProjectStats"
                    v-if="time != 'current'"
                    v-model="version"
                    :options="gameVersions"
                    title="Version"
                    explanation=""
                />

                <FilterItem
                    :should-display="true"
                    v-if="
                        ((isProjectStats && time != 'current') ||
                            !isProjectStats) &&
                        projectType != 'revenue'
                    "
                    v-model="aggregate"
                    :options="['yes', 'no']"
                    title="Aggregate"
                    explanation=""
                />
            </div>
        </SideBar>

        <div
            class="relative flex ml-0 w-full transition-all md:ml-48"
            :class="{ '!ml-0': !sideBarOpen }"
        >
            <div
                :data-fetching="isFetching"
                class="w-full flex data-[fetching=true]:grayscale data-[fetching=true]:blur-[2px]"
            >
                <ChartBarChart
                    v-if="lazyIsGroupData"
                    :data="data"
                    :type="projectType as string"
                />
                <ChartLineChart
                    v-else
                    :data="data"
                    :type="projectType as string"
                />
            </div>
            <Explanation v-if="isProjectStats" :explanation="explanation" />

            <Icon
                v-if="isFetching"
                class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                name="eos-icons:bubble-loading"
                size="48"
            />
        </div>
    </div>
</template>
