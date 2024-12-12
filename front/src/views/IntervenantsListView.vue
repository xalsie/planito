<template>
    <Table title="Liste des intervenants" :columns="columns" :rows="rows" />
</template>

<script setup>
import Table from '../components/Table.vue';
const columns = [
    { label: 'Nom', key: 'lastname' },
    { label: 'Prénom', key: 'firstname' },
    { label: 'E-mail', key: 'email' },
    { label: 'Roles', key: 'roles' },
    { label: 'Classe(s)', key: 'classes' },
    { label: 'Module(s)', key: 'modules' },
];


const rows = [
    {
        lastname: 'DIKIADI',
        firstname: 'Bass',
        email: 'binda@bass.fr',
        roles: 'ROLE_INTERVENANT',
        classes: '5AIW, 4AIW, 3AIW',
        modules: 'PHP, React, Symfony',
    },
    {
        lastname: 'DIKIADI',
        firstname: 'Bass',
        email: 'binda@bass.fr',
        roles: 'ROLE_INTERVENANT',
        classes: '5AIW, 4AIW, 3AIW',
        modules: 'PHP, React, Symfony',
    }, {
        lastname: 'DIKIADI',
        firstname: 'Bass',
        email: 'binda@bass.fr',
        roles: 'ROLE_INTERVENANT',
        classes: '5AIW, 4AIW, 3AIW',
        modules: 'PHP, React, Symfony',
    },
];
</script>