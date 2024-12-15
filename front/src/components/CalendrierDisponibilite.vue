<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow">
      <FullCalendar 
        :options="calendarOptions"
        @select="handleSelect"
      />
    </div>
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

const currentEventType = ref('availability')

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
  eventClick: (info) => {
    if (confirm('Voulez-vous supprimer cet événement ?')) {
      info.event.remove()
    }
  }
}
</script> 