<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <FullCalendar 
      :options="calendarOptions"
      @select="handleSelect"
      @eventClick="handleEventClick"
      @eventDrop="handleEventChange"
      @eventResize="handleEventChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import '../assets/styles/calendar.css'

const events = ref([])

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

const calendarOptions = {
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
  events: events.value,
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
  }
}
</script> 