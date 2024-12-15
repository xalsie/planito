import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import "./style.css";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);
const options = {
  // You can set your default options here
};

app.use(Toast, options);
app.use(pinia);
app.use(router);

app.mount("#app");
