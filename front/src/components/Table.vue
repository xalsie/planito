<template>
    <div class="container p-2 mx-auto dark:text-gray-800">
        <h2 class="mb-4 text-2xl font-semibold leading-tight">{{ title }}</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full text-xs">
                <thead class="dark:bg-gray-300">
                    <tr class="text-left">
                        <th v-for="column in columns" :key="column.key" class="p-3">
                            {{ column.label }}
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in rows" :key="index"
                        class="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                        <td v-for="column in columns" :key="column.key" class="p-3">
                            {{ row[column.key] }}
                        </td>
                        <td>
                            <PencilIcon class="size-4" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/24/solid'
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
        default: () => [],
    },
    rows: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>