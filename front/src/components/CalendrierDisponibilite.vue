<template>
    <div>
        <div class="bg-white p-4 rounded-lg shadow">
            <FullCalendar :options="calendarOptions" @select="handleSelect" />
        </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-1/3">
            <h2 class="text-xl font-bold mb-4">Ajouter une indisponibilité</h2>
            <div class="mb-4">
                <label for='start' class="block text-sm font-medium text-gray-700 mb-1">Début</label>
                <input type="datetime" id="start" v-model="unavailability.start"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
                <label for='end' class="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                <input type="datetime" id="end" v-model="unavailability.end"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
                <label for='title' class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input type="text" id="title" v-model="unavailability.title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
                <label for='description' class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" id="description" v-model="unavailability.description"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-3">
                <button @click="isOpen = false" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Annuler
                </button>
                <button @click="saveUnavailability"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { useUserStore } from '../stores/user-store';
import router from '../router'
import '../assets/styles/calendar.css';

const userStore = useUserStore();

const currentEventType = ref('availability')
const isOpen = ref(false)
const unavailability = ref({})
const formattedEvents = ref([]);
const fullEvents = ref([]);

const logError = (error) => {
    console.log('ERROR:', error)
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
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    height: 'auto',
    allDaySlot: false,
    buttonText: {
        today: "Aujourd'hui",
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour'
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
    },
    select: async (info) => {
        setTimeout(() => {
            isOpen.value = true;
            unavailability.value = {
                title: '',
                description: '',
                start: info.startStr,
                end: info.endStr,
            }
        }, 250)
    },
    eventClick: (info) => {
        console.log('eventClick', info.event.extendedProps.id)
        if (info.event.extendedProps.type === 'unavailability' && confirm('Voulez-vous supprimer cette indisponibilité ?')) {
            info.event.remove()
            deleteEvent(info.event.extendedProps.id)
        }
    },
    eventContent: (arg) => {
        if (arg.event.title === '') {
            return {
                html: `<p class="text-center mb-2">Indisponible</p>`
            }
        }
        if (
            arg.event.extendedProps.room === 'Non défini' &&
            arg.event.extendedProps.className === 'Non défini' &&
            arg.event.extendedProps.module === 'Non défini'
        ) {
            return {
                html: `<p class="text-center mb-2">${arg.event.title}</p>
                <p class="mx-2">Description : <span class="font-bold">${arg.event.extendedProps.description}</span></p>`
            }
        }
        return {
            html: `<p class="text-center mb-2">${arg.event.title}</p>
            <p class="mx-2">Salle : <span class="font-bold">${arg.event.extendedProps.room}</span></p>
            <p class="mx-2">Classe : <span class="font-bold">${arg.event.extendedProps.className}</span></p>
            <p class="mx-2">Module : <span class="font-bold">${arg.event.extendedProps.module}</span></p>`
        }
    },
    eventDrop: (info) => {
        console.log('eventDrop', info)
        if (info.event.extendedProps.type === 'unavailability') {
            updateEvent(info.event.extendedProps.id, { start: info.event.startStr, end: info.event.endStr })
        }
    }
})

const handleSelect = (selectInfo) => {
    const title = currentEventType.value === 'availability' ? 'Disponible' : 'Indisponible'
    const eventColor = currentEventType.value === 'availability' ? '#22c55e' : '#ef4444'

    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect()

    calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: eventColor,
        borderColor: eventColor,
        type: currentEventType.value
    })
}

onMounted(async () => {
    fullEvents.value = await fetchEventByUser();
    formattedEvents.value = fullEvents.value.map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        editable: (event.type === 'unavailability' ? true : false),
        color: ((event) => {
            if (event.type === 'course') {
                return '#22c55e'
            } else if (event.type === 'unavailability') {
                return '#ef4444'
            } else if (event.type === 'availability') {
                return '#3b82f6'
            } else if (event.type === 'exam') {
                return '#f59e0b'
            } else if (event.type === 'holiday') {
                return '#22c55e'
            } else {
                return '#3b82f6'
            }
        })(event),
        extendedProps: {
            id: event.id,
            description: event.description,
            type: event.type,
            module: event?.module?.name || 'Non défini',
            className: event?.class?.name || 'Non défini',
            room: event?.room?.name || 'Non défini',
        },
    }));
})

watch(formattedEvents, (newEvents) => {
    calendarOptions.value = {
        ...calendarOptions.value,
        events: newEvents,
    };
});

const fetchEventByUser = async () => {
    try {
        const userLocal = userStore.user || JSON.parse(localStorage.getItem('user'))
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/user/${userLocal.id}`)
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return await response.json();
    } catch (error) {
        logError(error);
        return [];
    }
};

const saveUnavailability = async () => {
    try {
        const userLocal = userStore.user || JSON.parse(localStorage.getItem('user'))
        const body = { title: unavailability.value.title, description: unavailability.value.description, type: "unavailability", start: unavailability.value.start, end: unavailability.value.end, user_id: userLocal.id }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }

        const data = await response.json();
        formattedEvents.value.push({
            title: data.title,
            start: data.start,
            end: data.end,
            editable: true,
            color: '#ef4444',
            extendedProps: {
                id: data.id,
                description: data.description,
                type: data.type,
                module: data?.module?.name || 'Non défini',
                className: data?.class?.name || 'Non défini',
                room: data?.room?.name || 'Non défini',
            },
        });
        isOpen.value = false;
        // router.go();
    } catch (error) {
        logError(error);
    }
}

const deleteEvent = async (id) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
    } catch (error) {
        logError(error);
    }
}

const updateEvent = async (id, body) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
    } catch (error) {
        logError(error);
    }
}
</script>

<style>
.fc-timegrid-slot {
    height: 3em !important;
}
</style>
