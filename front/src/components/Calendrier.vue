<template>
  <div class="bg-white p-4 rounded-lg shadow">
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

  const handleSelect = (selectInfo) => {
    const title = prompt('Entrez un titre pour l\'événement:')
    if (title) {
      const calendarApi = selectInfo.view.calendar
      calendarApi.unselect()

      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  const handleEventClick = (clickInfo) => {
    if (confirm('Voulez-vous supprimer cet événement ?')) {
      clickInfo.event.remove()
    }
  }

  const handleEventChange = (changeInfo) => {
    // Ici vous pouvez ajouter la logique pour sauvegarder les changements
    console.log('Événement modifié:', changeInfo.event.toPlainObject())
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
    selectable: false,
    selectMirror: false,
    dayMaxEvents: true,
    weekends: true,
    events: [],
    height: 'auto',
    slotMinTime: "8:00:00",
    slotMaxTime: "21:00:00",
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
    }
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
      console.log('Événements chargés:', events.value);
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
  </script>

  <style>
  .fc-timegrid-slot {
    height: 3em !important;
  }
</style>
