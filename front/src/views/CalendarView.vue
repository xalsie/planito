<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'


export default {
    components: {
        FullCalendar
    },
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                locale: frLocale,
                dateClick: this.handleDateClick,
                events: [
                    { title: 'Event 1', start: '2024-12-12T10:30:00', end: '2024-12-12T12:00:00' },
                    { title: 'Event 2', date: '2024-12-12' } // All-day event
                ]
            }
        }
    },
    methods: {
        handleDateClick: function (arg) {
            alert('date click! ' + arg.dateStr)
        }
    }
}
</script>
<template>
    <FullCalendar :options="calendarOptions" />
</template>