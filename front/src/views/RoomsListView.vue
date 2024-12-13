<template>
    <div v-if="!isOpen" class="flex gap-2 justify-end ">
        <p>Ajouter une salle</p>
        <PlusIcon class="size-6" @click="openModal" />
    </div>
    <div v-if="isOpen" class="flex gap-2 justify-end ">
        <p>Retour à la liste</p>
        <ArrowLeftIcon class="size-6" @click="openModal" />
    </div>
    <div class="flex justify-center">
        <Modal v-if="isOpen" title="Créer une salle" description="Créez des salles à votre guise"
            :placeholders="['Nom de la salle']" saveTitle="Enregistrer" :onClick="createRoom" />
    </div>
    <Table v-if="!isOpen" title="Liste des salles" :columns="columns" :rows="rows" />
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

const fetchRooms = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}rooms`);
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
            body: JSON.stringify({ name: inputs[0], schoolId: "99cbdd79-bf3f-42d3-8682-e018da3b6cc1" }), // SCHOOL ID EN DUR EN ATTENDANT
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
    rows.value = await fetchRooms();
})

const columns = [
    { label: 'Nom de la salle', key: 'name' },
];



</script>