<template>
    <div class="flex gap-2 justify-center">
        <Modal title="Génération du planning"
            description="Générer un planning pour une classe à partir d'une date de début"
            :placeholders="['Select', 'Date']" saveTitle="Enregistrer" :onClick="createPlanning" :classes="classes" />
    </div>
</template>

<script setup>
import Modal from '../components/Modal.vue';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user-store';
import { useToast } from "vue-toastification";

const toast = useToast();

const userStore = useUserStore();
const schoolId = userStore.schoolId || localStorage.getItem("schoolId");

const classes = ref([]);

const fetchClasses = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}classes/school/${schoolId}`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

const createPlanning = async (inputs) => {
    try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}ia`, {
            method: 'POST',
            body: JSON.stringify({ classId: inputs[0], startDate: inputs[1], schoolId: schoolId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        toast.success(`Votre planning a bien été généré`, {
            timeout: 2000
        });

    } catch (err) {
        console.log(err);
    }
}

onMounted(async () => {
    classes.value = await fetchClasses();
});


</script>