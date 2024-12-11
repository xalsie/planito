import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import "./style.css";
import App from "./App.vue";
import router from "./router";

<<<<<<< HEAD
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
=======
const app = createApp(App);
app.use(router);
>>>>>>> e4c84b5 (Ajout de vue routeur, Création d'une page d'accueil, et d'une page de connexion)
app.mount("#app");
