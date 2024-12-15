import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user-store"; // Assurez-vous du bon chemin vers le store

import DashboardIntervenantView from "../views/DashboardIntervenantView.vue";
import DashboardSchoolView from "../views/DashboardSchoolView.vue";
import IntervenantsListView from "../views/IntervenantsListView.vue";
import RoomsListView from "../views/RoomsListView.vue";
import ModulesListView from "../views/ModulesListView.vue";
import CalendarView from "../views/CalendarView.vue";
import CalendrierView from "../views/intervenant/CalendrierView.vue";
import ImportCalendrierView from "../views/intervenant/ImportCalendrierView.vue";
import DisponibiliteView from "../views/intervenant/DisponibiliteView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AvailabilitiesView from "../views/AvailabilitiesView.vue";
import GeneratePlanningView from "../views/GeneratePlanningView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard/intervenant",
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/dashboard/intervenant",
      name: "dashboard-intervenant",
      component: DashboardIntervenantView,
      children: [
        {
          path: "",
          name: "intervenant-calendrier",
          component: CalendrierView,
        },
        {
          path: "import",
          name: "intervenant-import",
          component: ImportCalendrierView,
        },
        {
          path: "disponibilite",
          name: "intervenant-disponibilite",
          component: DisponibiliteView,
        },
      ],
    },
    {
      path: "/dashboard/ecole",
      name: "dashboard-ecole",
      component: DashboardSchoolView,
      children: [
        {
          path: "",
          name: "calendar",
          component: CalendarView,
        },
        {
          path: "intervenants",
          name: "intervenants-list",
          component: IntervenantsListView,
        },
        {
          path: "salles",
          name: "rooms-list",
          component: RoomsListView,
        },
        {
          path: "modules",
          name: "modules-list",
          component: ModulesListView,
        },
        {
          path: "disponibilites",
          name: "availabilities",
          component: AvailabilitiesView,
        },
        {
          path: "planning",
          name: "generate-planning",
          component: GeneratePlanningView,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn || localStorage.getItem("isLoggedIn");
  const schoolId = userStore.schoolId || localStorage.getItem("schoolId");
  const user = userStore.user || localStorage.getItem("user");

  // Si l'utilisateur n'est pas connecté et tente d'accéder à une page protégée
  if (
    (to.path.startsWith("/dashboard/intervenant") ||
      to.path.startsWith("/dashboard/ecole")) &&
    !isLoggedIn
  ) {
    next("/login"); // Rediriger immédiatement vers la page de login
    return;
  }

  // Si l'utilisateur est connecté, vérifier son rôle
  if (isLoggedIn && to.path.startsWith("/dashboard/intervenant")) {
    try {
      // Si le token n'existe pas, rediriger vers le login
      if (!user) {
        next("/login");
        return;
      }
      next(); // Passer à la route souhaitée
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      next("/login"); // En cas d'erreur, rediriger vers le login
    }
  } else {
    next(); // Si l'utilisateur est déjà connecté ou si la page n'est pas protégée, laisser passer
  }
});

export default router;
