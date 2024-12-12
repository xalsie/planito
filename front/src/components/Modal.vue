<template>
    <div
        class="relative flex flex-col items-center max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 dark:bg-gray-50 dark:text-gray-800">
        <!-- Bouton de fermeture -->
        <button class="absolute top-2 right-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"
                class="flex-shrink-0 w-6 h-6">
                <polygon
                    points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313">
                </polygon>
            </svg>
        </button>

        <!-- Icône -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            class="w-40 h-40 fill-current shrink-0 dark:text-blue-600">
            <path
                d="M68.328,383.063a31.654,31.654,0,0,1,.207-32.118l50.883-86.406,11.516,50.76,31.207-7.08L138.257,202.944,32.983,226.828l7.08,31.207,53.149-12.058L40.96,334.707a64,64,0,0,0,55.149,96.476h82.435l32-32H96.109A31.655,31.655,0,0,1,68.328,383.063Z">
            </path>
            <path
                d="M283.379,79.762l53.747,91.268-49.053-7.653-4.934,31.617L389.8,211.635l16.64-106.66-31.617-4.933-8.873,56.87L310.954,63.524a64,64,0,0,0-110.3,0l-39.939,67.82,10.407,45.39,57.106-96.972a32,32,0,0,1,55.148,0Z">
            </path>
            <path
                d="M470.65,334.707l-47.867-81.283-41.148-6.812,61.441,104.333A32,32,0,0,1,415.5,399.183H304.046l38.359-38.358L319.778,338.2l-76.332,76.332,76.332,76.333,22.627-22.628-37.052-37.051H415.5a64,64,0,0,0,55.149-96.476Z">
            </path>
        </svg>

        <!-- Titre -->
        <h2 class="text-2xl font-semibold leading-tight tracking-wide">{{ title }}</h2>

        <!-- Description -->
        <p class="flex-1 text-center dark:text-gray-600">{{ description }}</p>

        <!-- Champs dynamiques -->
        <div v-for="(placeholder, index) in placeholders" :key="index" class="w-full">
            <input v-model="inputs[index]" type="text"
                class="border-solid border-slate-400 border p-2 rounded-lg w-full" :placeholder="placeholder">
        </div>

        <!-- Bouton d'action -->
        <button type="button" class="px-8 py-3 font-semibold rounded-full dark:bg-blue-600 dark:text-gray-50"
            @click="onClick(inputs)">
            Créer la salle
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    placeholders: {
        type: Array,
        required: true,
    },
    onClick: {
        type: Function,
        required: true,
    },
});

// Crée un tableau pour stocker les valeurs des inputs
const inputs = ref([]);
</script>

<style scoped>
/* Styles personnalisés ici */
</style>