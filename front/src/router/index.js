import { createRouter, createWebHistory } from "vue-router";
import DashboardIntervenantView from "../views/DashboardIntervenantView.vue";
import DashboardSchoolView from "../views/DashboardSchoolView.vue";
import CalendrierView from "../views/intervenant/CalendrierView.vue";
import ImportCalendrierView from "../views/intervenant/ImportCalendrierView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/dashboard/intervenant"
        },
        {
            path: "/home",
            name: "home",
            component: HomeView
        },
        {
            path: "/login",
            name: "login",
            component: LoginView
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView
        },
        {
            path: "/dashboard/intervenant",
            component: DashboardIntervenantView,
            children: [
                {
                    path: "",
                    name: "intervenant-calendrier",
                    component: CalendrierView
                },
                {
                    path: "import",
                    name: "intervenant-import",
                    component: ImportCalendrierView
                },
            ],
        },
        {
            path: "/dashboard/ecole",
            name: "dashboard-ecole",
            component: DashboardSchoolView
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("user"))?.roles;

    if (to.path.startsWith("/dashboard/intervenant")) {
        if (!token) {
            next("/login");
            return;
        }

        if (roles && roles.includes("ROLE_INTERVENANT")) {
            next();
            return;
        }

        console.error("Erreur d'authentification:", error);
        next("/login");
    } else if (to.path.startsWith("/dashboard/ecole")) {
        if (!token) {
            next("/login");
            return;
        }

        if (roles && roles.includes("ROLE_SCHOOL")) {
            next();
            return;
        }

        console.error("Erreur d'authentification:", error);
        next("/login");
    } else {
        next();
    }
});

export default router;
