<template>
    <div v-if="!isOpen" class="flex gap-2 justify-end ">
        <p>Créer un module</p>
        <PlusIcon class="size-6" @click="openModal" />
    </div>
    <div v-if="isOpen" class="flex gap-2 justify-end ">
        <p>Retour à la liste</p>
        <ArrowLeftIcon class="size-6" @click="openModal" />
    </div>
    <div class="flex justify-center">
        <Modal v-if="isOpen" title="Créer un module de cours" description="Créez des modules de cours à votre guise"
            :placeholders="['Nom du module', 'Volume d\'heures', 'Nombre de CC', 'Volume d\'examens']"
            saveTitle="Enregistrer" :onClick="createRoom" />
    </div>
    <Table v-if="!isOpen" title="Liste des modules" :columns="columns" :rows="rows" />
</template>

<script setup>
import Table from '../components/Table.vue';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import Modal from '../components/Modal.vue';
import router from '../router';


let isOpen = ref(false);

const rows = ref([]);

const openModal = () => {
    isOpen.value = !isOpen.value
}

const fetchModules = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}modules`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

const createRoom = async (inputs) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}rooms`, {
            method: 'POST',
            body: JSON.stringify({ name: inputs[0] }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        router.go();
        openModal();
    } catch (err) {
        console.log(err);
    }
}

onMounted(async () => {
    rows.value = await fetchModules();
})

const columns = [
    { label: 'Nom du module', key: 'name' },
];



</script>