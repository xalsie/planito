<template>
    <select name="classes" id="classes-select" v-model="selectedClass" @change="loadAvailabilities"
        class=" w-1/3 mb-5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        <option value="">-- Toutes les classes --</option>
        <option v-for="classe in classes" :key="classe.id" :value="classe.id">
            {{ classe.name }}
        </option>
    </select>
    <div class="bg-white p-4 rounded-lg shadow">
        <FullCalendar :options="calendarOptions">
            <template v-slot:eventContent="arg">
                <p class="text-center mb-2">DISPONIBILITÉS</p>

            </template>
        </FullCalendar>
    </div>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-xl font-bold mb-4">Ajouter une disponibilité</h2>
            <div class="mb-4">
                <label for="classes-select" class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                <select name="classes" id="classes-select" v-model="selectedClass"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">--Choissisez une classe--</option>
                    <option v-for="classe in classes" :key="classe.id" :value="classe.id">
                        {{ classe.name }}
                    </option>
                </select>
            </div>
            <div class="flex justify-end space-x-3">
                <button @click="isOpen = false" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Annuler
                </button>
                <button @click="saveAvailabilities" :disabled="!selectedClass"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { useUserStore } from '../stores/user-store';
import router from '../router'

const userStore = useUserStore();

const schoolId = userStore.schoolId || localStorage.getItem("schoolId");

const isOpen = ref(false)

const selectedAvailability = ref({})

const availabilities = ref({})

const formattedEvents = ref([]);

const classes = ref([])

const selectedClass = ref("")

const fetchAvailabilities = async () => {
    const classId = selectedClass.value;
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/availabilities/${classId}`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return response.json();
    } catch (err) {
        console.log(err);
    }
}

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

const saveAvailabilities = async () => {
    try {
        const body = { start: selectedAvailability.value.startStr, end: selectedAvailability.value.endStr, classId: selectedClass.value, type: "availability" }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/availability`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        router.go();
        isOpen.value = false;
    } catch (err) {
        console.log(err);
    }
}

const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    height: 600,
    allDaySlot: false,
    slotMinTime: "8:00:00",
    slotMaxTime: "20:00:00",
    buttonText: {
        today: "Aujourd'hui",
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour'
    },
    select: async (info) => {
        isOpen.value = true;
        selectedAvailability.value = info
    },
    views: {
        timeGrid: {
            dayMaxEventRows: 4,
            slotDuration: '01:00:00',
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }
        }
    }
})

const loadAvailabilities = async () => {
    try {
        availabilities.value = await fetchAvailabilities();
        formattedEvents.value = availabilities.value.map(event => ({
            start: event.start,
            end: event.end,
        }));
    } catch (error) {
    }
}

onMounted(async () => {
    classes.value = await fetchClasses();
    loadAvailabilities();
})

watch(formattedEvents, (newEvents) => {
    calendarOptions.value = {
        ...calendarOptions.value,
        events: newEvents,
    };
    console.log(calendarOptions)

});
</script>