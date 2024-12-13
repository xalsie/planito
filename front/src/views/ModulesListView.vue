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
            saveTitle="Enregistrer" :onClick="createModule" />
    </div>
    <Table v-if="!isModalCreateOpen" title="Liste des modules" :columns="columns" :rows="rows"
        :onOpenModalDelete="openModalDelete" :onEdit="() => true" />
    <DeleteModal v-if="isModalDelete" :onConfirm="deleteModule" :onCancel="() => isModalDelete = false" />

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

let isOpen = ref(false);

const isModalDelete = ref(false);
const selectedModule = ref({});

const rows = ref([]);

const openModal = () => {
    isOpen.value = !isOpen.value
}

const fetchModules = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}modules/school/${schoolId}`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

const createModule = async (inputs) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}modules`, {
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

const openModalDelete = (module) => {
    isModalDelete.value = true;
    selectedModule.value = module;
};

const deleteModule = async () => {
    try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}modules/${selectedModule.value.id}`, {
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
    rows.value = await fetchModules();
})

const columns = [
    { label: 'Nom du module', key: 'name' },
];



</script>