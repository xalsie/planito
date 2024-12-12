import { createRouter, createWebHistory } from "vue-router";
import DashboardIntervenantView from "../views/DashboardIntervenantView.vue";
import DashboardSchoolView from "../views/DashboardSchoolView.vue";
import IntervenantsListView from "../views/IntervenantsListView.vue";
import RoomsListView from "../views/RoomsListView.vue";
import ModulesListView from "../views/ModulesListView.vue";
import CalendarView from "../views/CalendarView.vue";

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
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.path.startsWith("/dashboard/intervenant")) {
    if (!token) {
      next("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Non autorisé");
      }

      const user = await response.json();
      if (user.role !== "ROLE_INTERVENANT") {
        next("/login");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      next();
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
