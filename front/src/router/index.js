import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/connexion',
            name: 'login',
            component: LoginView
        },
        {
            path: '/inscription',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView
        }
    ]
})

export default router 