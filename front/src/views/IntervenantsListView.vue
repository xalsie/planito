<template>
    <Table title="Liste des intervenants" :columns="columns" :rows="rows" :onOpenModalDelete="openModalDelete"
        :onEdit="() => true" />
    <DeleteModal v-if="isModalDelete" :onConfirm="deleteIntervenant" :onCancel="() => isModalDelete = false" />

</template>

<script setup>
import Table from '../components/Table.vue';
import DeleteModal from '../components/DeleteModal.vue';
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user-store';
import router from '../router';


const isModalDelete = ref(false);
const selectedIntervenant = ref({});

const userStore = useUserStore();
const columns = [
    { label: 'Nom', key: 'lastname' },
    { label: 'Prénom', key: 'firstname' },
    { label: 'E-mail', key: 'email' },
    { label: 'Roles', key: 'roles' },
    { label: 'Classe(s)', key: 'classes' },
    { label: 'Module(s)', key: 'modules' },
];

const rows = ref([]);

const openModalDelete = (intervenant) => {
    isModalDelete.value = true;
    selectedIntervenant.value = intervenant;
};

const fetchIntervenantsBySchool = async () => {
    try {
        const schoolId = userStore.schoolId || localStorage.getItem("schoolId");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/intervenants/${schoolId}`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

const deleteIntervenant = async () => {
    try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}users/${selectedIntervenant.value.id}`, {
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
    rows.value = await fetchIntervenantsBySchool();
})
</script>