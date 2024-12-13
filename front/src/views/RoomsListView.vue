<template>
    <div v-if="!isModalCreateOpen" class="flex gap-2 justify-end ">
        <p>Ajouter une salle</p>
        <PlusIcon class="size-6" @click="openModal" />
    </div>
    <div v-if="isModalCreateOpen" class="flex gap-2 justify-end ">
        <p>Retour à la liste</p>
        <ArrowLeftIcon class="size-6" @click="openModal" />
    </div>
    <div class="flex justify-center">
        <Modal v-if="isModalCreateOpen" title="Créer une salle" description="Créez des salles à votre guise"
            :placeholders="['Nom de la salle']" saveTitle="Enregistrer" :onClick="createRoom" />
    </div>
    <Table v-if="!isModalCreateOpen" title="Liste des salles" :columns="columns" :rows="rows"
        :onOpenModalDelete="openModalDelete" :onEdit="() => true" />

    <DeleteModal v-if="isModalDelete" :onConfirm="deleteRoom" :onCancel="() => isModalDelete = false" />



</template>

<script setup>
import Table from '../components/Table.vue';
import DeleteModal from '../components/DeleteModal.vue';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';
import Modal from '../components/Modal.vue';
import router from '../router';
import { useUserStore } from '../stores/user-store';

const userStore = useUserStore();
const schoolId = userStore.schoolId || localStorage.getItem("schoolId");


const isModalCreateOpen = ref(false);
const isModalDelete = ref(false);
const selectedRoom = ref({});


const rows = ref([]);

const openModal = () => {
    isModalCreateOpen.value = !isModalCreateOpen.value
}

const fetchRooms = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}rooms/school/${schoolId}`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        throw new Error(err)
    }
}

const createRoom = async (inputs) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}rooms`, {
            method: 'POST',
            body: JSON.stringify({ name: inputs[0], schoolId: schoolId }),
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
        throw new Error(err)
    }
}

const openModalDelete = (room) => {
    isModalDelete.value = true;
    selectedRoom.value = room;
};

const deleteRoom = async () => {
    try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}rooms/${selectedRoom.value.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        isModalDelete.value = false;
        router.go();
    } catch (err) {
        throw new Error(err);
    }
}

onMounted(async () => {
    rows.value = await fetchRooms();
})

const columns = [
    { label: 'Nom de la salle', key: 'name' },
];



</script>