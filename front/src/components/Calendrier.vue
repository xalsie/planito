<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <!-- filtre -->
    <div class="flex justify-start items-center mb-4">
      <select class="px-4 py-2 mr-2 border border-gray-300 rounded-md" v-model="filteredEventsSchool">
        <option value="all" selected>Toutes les écoles</option>
        <option v-for="school in schools" :key="school.id" :value="school.id">{{ school.name }}</option>
      </select>
      <select class="px-4 py-2 mr-2 border border-gray-300 rounded-md" v-model="filteredEventsClass">
        <option value="all">Toutes les classes</option>
        <option v-for="classe in classes" :key="classe.id" :value="classe.id">{{ classe.name }}</option>
      </select>
      <select class="px-4 py-2 border border-gray-300 rounded-md" v-model="filteredEventsModule">
        <option value="all">Tous les modules</option>
        <option v-for="module in modules" :key="module.id" :value="module.id">{{ module.name }}</option>
      </select>
    </div>
    <FullCalendar :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <p class="text-center mb-2">{{ arg.event.title }}</p>
        <p class="mx-2">Salle : <span class="font-bold">{{ arg.event.extendedProps.room }}</span></p>
        <p class="mx-2">Classe : <span class="font-bold">{{ arg.event.extendedProps.className }}</span></p>
        <p class="mx-2">Module : <span class="font-bold">{{ arg.event.extendedProps.module }}</span></p>
      </template>
    </FullCalendar>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import frLocale from '@fullcalendar/core/locales/fr'
  import '../assets/styles/calendar.css'

  import { useUserStore } from "../stores/user-store"; // Assurez-vous du bon chemin vers le store

  const events = ref([])
  const formattedEvents = ref([])
  const userStore = useUserStore()

  const schools = ref([])
  const classes = ref([])
  const modules = ref([])

  const filteredEventsSchool = ref('all')
  const filteredEventsClass = ref('all')
  const filteredEventsModule = ref('all')

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
    selectable: false,
    selectMirror: false,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    height: 'auto',
    allDaySlot: false,
    eventMinHeight: 'auto',
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
  })

  const fetchEventByUser = async () => {
    try {
      const userLocal = userStore.user || JSON.parse(localStorage.getItem('user'))
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}events/user/${userLocal.id}`)
      if (!response.ok) {
        throw new Error('Something went wrong, request failed!');
      }
      return await response.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  onMounted(async () => {
    try {
      events.value = await fetchEventByUser();

      events.value.map(event => {
        if (event.class && !classes.value.find(classe => classe.id === event.class.id)) {
          classes.value.push(event.class)
        }
        if (event.module && !modules.value.find(module => module.id === event.module.id)) {
          modules.value.push(event.module)
        }
        if (event.class?.school && !schools.value.find(school => school.id === event.class.school.id)) {
          schools.value.push(event.class.school)
          console.log(event.class.school)
        }
      })

      formattedEvents.value = events.value.map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps: {
          description: event.description,
          type: event.type,
          module: event?.module?.name || 'Non défini',
          className: event?.class?.name || 'Non défini',
          room: event?.room?.name || 'Non défini',
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des événements :', error);
    }
  });

  watch(formattedEvents, (newEvents) => {
    calendarOptions.value = {
      ...calendarOptions.value,
      events: newEvents
    }
  });

  watch([filteredEventsSchool, filteredEventsClass, filteredEventsModule], ([school, classe, module]) => {
    formattedEvents.value = events.value
      .filter(event => school === 'all' || event?.class?.school.id === school)
      .filter(event => classe === 'all' || event?.class?.id === classe)
      .filter(event => module === 'all' || event?.module?.id === module)
      .map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps: {
          description: event.description,
          type: event.type,
          module: event?.module?.name || 'Non défini',
          className: event?.class?.name || 'Non défini',
          room: event?.room?.name || 'Non défini',
        },
      }));
  });
  </script>

<style>
  .fc-timegrid-slot {
    height: 3em !important;
  }
</style>
