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
        <Modal v-if="isOpen" />
    </div>
    <Table v-if="!isOpen" title="Liste des salles" :columns="columns" :rows="rows" />
</template>

<script setup>
import Table from '../components/Table.vue';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

let isOpen = ref(false);

const openModal = () => {
    isOpen.value = !isOpen.value
}

const columns = [
    { label: 'Nom de la salle', key: 'name' },
];


const rows = [
    {
        name: 'B12',
    },
    {
        name: 'B01',
    }, {
        name: 'A06',
    }, {
        name: 'B01',
    }, {
        name: 'C13',
    },
];
</script>