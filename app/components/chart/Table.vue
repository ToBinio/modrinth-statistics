<script setup lang="ts">
const props = defineProps<{
	data: StatExport | undefined;
	explanation: string | undefined;
}>();

const groups = computed(() => {
	if (!props.data) return [];
	return props.data.data.map((item) => item.label);
});
</script>

<template>
    <table>
        <caption v-if="explanation" v-html="explanation"></caption>
        <thead>
            <tr>
                <th>Label</th>
                <th v-for="group in groups" :key="group">{{ group }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(label, index) in data?.labels" :key="label">
                <th scope="row">{{ label }}</th>
                <td v-for="group in data?.data" :key="group.label">
                    {{ group?.data[index] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>
