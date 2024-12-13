<template>
    <FullCalendar :options="calendarOptions">
        <template v-slot:eventContent="arg">
            <p class="text-center mb-2">{{ arg.event.title }}</p>
            <p class="mx-2">Salle : <span class="font-bold">{{ arg.event.extendedProps.room }}</span></p>
            <p class="mx-2">Classe : <span class="font-bold">{{ arg.event.extendedProps.className }}</span></p>
            <p class="mx-2">Module : <span class="font-bold">{{ arg.event.extendedProps.module }}</span></p>
            <p class="mx-2">Intervenant : <span class="font-bold">{{ arg.event.extendedProps.user }}</span></p>

        </template>
    </FullCalendar>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import '../assets/styles/calendar.css';
import { onMounted, ref, watch } from 'vue';


const events = ref([]);
const formattedEvents = ref([]);

const fetchCoursesBySchool = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/school/95c39d6e-60a2-4309-9da9-9117e44d2fc4`);
        if (!response.ok) {
            throw new Error('Something went wrong, request failed!');
        }
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

// Options de calendrier (déclaration à l'extérieur pour la réactivité)
const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: false,
    selectable: false,
    selectMirror: false,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    height: 'auto',
    slotMinTime: "8:00:00",
    slotMaxTime: "20:00:00",
    allDaySlot: false,
    eventMinHeight: 'auto',
    buttonText: {
        today: "Aujourd'hui",
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
    },
    views: {
        timeGrid: {
            dayMaxEventRows: 4,
            slotDuration: '01:00:00',
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            },
        },
    },
});

// Fetch des données et mise à jour des événements
onMounted(async () => {
    try {
        events.value = await fetchCoursesBySchool();
        formattedEvents.value = events.value.map(event => ({
            title: event.title,
            start: event.start,
            end: event.end,
            extendedProps: {
                description: event.description,
                type: event.type,
                module: event.module.name,
                className: event.class.name,
                room: event.room.name,
                user: `${event.user.firstName} ${event.user.lastName}`,
            },
        }));
    } catch (error) {
        console.error('Erreur lors du chargement des événements :', error);
    }
});

watch(formattedEvents, (newEvents) => {
    calendarOptions.value = {
        ...calendarOptions.value,
        events: newEvents,
    };
});
</script>

<style>
.fc-timegrid-slot {
    height: 7em !important;
    /* Ajustez la hauteur à vos besoins */
}
</style>