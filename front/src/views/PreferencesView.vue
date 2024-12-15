<template>
  <section class="p-6 dark:bg-gray-100 dark:text-gray-900">
    <form
      novalidate=""
      action=""
      @submit.prevent="createPref"
      class="container flex flex-col mx-auto space-y-12"
    >
      <fieldset
        class="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50"
      >
        <div class="space-y-2 col-span-full lg:col-span-1">
          <p class="font-medium">Préférences</p>
          <p class="text-xs">Pour chaque intervenant</p>
        </div>
        <div class="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
          <div class="col-span-full sm:col-span-3">
            <label for="Intervenant" class="text-sm">Intervenant</label>
            <select
              id="Intervenant"
              v-model="selectedIntervenant"
              class="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-800 focus:dark:ring-violet-600 dark:border-gray-300"
            >
            <option value="">Choisissez un intervenant</option>
              <option
                v-for="intervenant in intervenants"
                :key="intervenant.id"
                :value="intervenant"
              >
                {{ intervenant.firstname }} {{ intervenant.lastname }}
            </option></select>
            <div
              data-lastpass-icon-root=""
              style="
                position: relative !important;
                height: 0px !important;
                width: 0px !important;
                float: left !important;
              "
            ></div>
          </div>
          <div class="col-span-full">
            <label for="modules" class="text-sm">Modules</label>
            <select
              id="modules"
              v-model="selectedModule"
              class="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-800 focus:dark:ring-violet-600 dark:border-gray-300"
            ><option value="">Choisissez un module</option>
              <option
                v-for="module in selectedIntervenant.modules"
                :key="module.id"
                :value="module"
              >
                {{ module.name }}
            </option></select>
          </div>
          <div class="col-span-full">
            <label for="pref" class="text-sm">Préférence à entrer</label>
            <textarea
              id="pref"
              placeholder="A aqua poney tous les jeudis, pas le samedi"
              v-model="preferences"
              class="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-800 focus:dark:ring-violet-600 dark:border-gray-300"
            ></textarea>
          </div>
          <div class="col-span-full">
            <div class="flex items-center space-x-2">
              <input
                type="submit"
                value="Créer"
                class="px-4 py-2 border rounded-md dark:border-gray-800 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-800 dark:hover:text-white"
              >
              </input>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  </section>
  <section>
    <div class="container p-2 mx-auto sm:p-4 dark:text-gray-800">
      <h2 class="mb-4 text-2xl font-semibold leading-tight">Intervenants</h2>
      <div class="overflow-x-auto">
        <table class="w-full p-6 text-xs text-left whitespace-nowrap">
          <colgroup>
            <col class="w-5" />
            <col />
            <col />
            <col />
            <col />
            <col class="w-5" />
          </colgroup>
          <thead>
            <tr class="dark:bg-gray-300">
              <th class="p-3">Name</th>
              <th class="p-3">Modules</th>
              <th class="p-3">Préférences</th>
              <th class="p-3"></th>
              <th class="p-3"></th>
              <th class="p-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="border-b dark:bg-gray-50 dark:border-gray-300">
            <tr v-for="intervenant in intervenants" :key="intervenant.id">
              <td class="px-3 py-2">
                <p>{{ intervenant.firstname }} {{ intervenant.lastname }}</p>
              </td>
              <td class="px-3 py-2">
                <p v-for="(module, index) in intervenant.modules" :key="index">{{ module.name }}</p>
              </td>
              <td class="px-3 py-2">
                <div v-for="module in intervenant.modules">
                <span v-for="(preference, index) in module.preferences" :key="index">{{ preference }}, </span>
                </div>
              </td>
              <td class="px-3 py-2"></td>
              <td class="px-3 py-2">
                <button
                  type="button"
                  title="Open details"
                  class="p-1 rounded-full dark:text-gray-400 hover:dark:bg-gray-300 focus:dark:bg-gray-300"
                >
                  <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                    <path
                      d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z"
                    ></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import router from "../router";
import { useUserStore } from "../stores/user-store";

const userStore = useUserStore();
const schoolId = userStore.schoolId || localStorage.getItem("schoolId");
console.log("schoolId:", schoolId);
const intervenants = ref([]);
const selectedIntervenant = ref({});
const selectedModule = ref({});
const preferences = ref("");

watch(selectedIntervenant, () => {
  selectedModule.value = selectedIntervenant.value.modules;
});

const createPref = async () => {
  try {
    console.log("selectedIntervenant:", typeof(selectedIntervenant.value.id), selectedIntervenant.value.id);
    console.log("selectedModule:", typeof(selectedModule.value.id), selectedModule.value.id);
    console.log("preferences:", typeof(preferences.value), preferences.value);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}userModules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedIntervenant.value.id,
        moduleId: selectedModule.value.id,
        settings: preferences.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong, request failed!");
    }
    router.go();  
  } catch (err) {
    console.log(err);
  }
};

const fetchGetData = async (endpoint) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`
    );
    if (!response.ok) {
      throw new Error("Something went wrong, request failed!");
    }
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  intervenants.value = await fetchGetData(`users/intervenants/${schoolId}`);

  intervenants.value = intervenants.value.map((intervenant) => {
    intervenant.modules = intervenant.modules.map((module) => {
      if (!module.preferences) {
        module.preferences = [];
        return module;
      }
        module.preferences = module.preferences
          .split(",")
          .map((preference) => preference.trim());
          console.log("avec contenu et virgule:", module.preferences);
          return module;
    });
    return intervenant;
  });
  console.log("intervenants:", intervenants);
});
</script>
