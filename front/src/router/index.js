import { createRouter, createWebHistory } from "vue-router";
import DashboardIntervenantView from "../views/DashboardIntervenantView.vue";
import DashboardSchoolView from "../views/DashboardSchoolView.vue";
import IntervenantsListView from "../views/IntervenantsListView.vue";
import RoomsListView from "../views/RoomsListView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard/intervenant",
    },
    {
      path: "/dashboard/intervenant",
      name: "dashboard-intervenant",
      component: DashboardIntervenantView,
    },
    {
      path: "/dashboard/ecole",
      name: "dashboard-ecole",
      component: DashboardSchoolView,
      children: [
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
      ],
    },
  ],
});

export default router;
