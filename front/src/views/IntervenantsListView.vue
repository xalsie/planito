<template>
    <Table title="Liste des intervenants" :columns="columns" :rows="rows" />
</template>

<script setup>
import Table from '../components/Table.vue';
import { ref, onMounted } from 'vue';
const columns = [
    { label: 'Nom', key: 'lastname' },
    { label: 'Prénom', key: 'firstname' },
    { label: 'E-mail', key: 'email' },
    { label: 'Roles', key: 'roles' },
    { label: 'Classe(s)', key: 'classes' },
    { label: 'Module(s)', key: 'modules' },
];

const rows = ref([]);

const fetchIntervenantsBySchool = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/intervenants/e8eadf5f-40c5-4678-8b72-1f096ba2615f`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

onMounted(async () => {
    rows.value = await fetchIntervenantsBySchool();
})
</script>