import { createRouter, createWebHistory } from 'vue-router'
import DashboardIntervenantView from '../views/DashboardIntervenantView.vue'
import DashboardSchoolView from '../views/DashboardSchoolView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/dashboard/intervenant'
        },
        {
            path: '/dashboard/intervenant',
            name: 'dashboard-intervenant',
            component: DashboardIntervenantView
        },
        {
            path: '/dashboard/ecole',
            name: 'dashboard-ecole',
            component: DashboardSchoolView
        }
    ]
})

export default router 