<template>
  <div class="container mx-auto px-6 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 font-poppins">
        Préférences des intervenants
      </h2>

      <form @submit.prevent="createPref" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="Intervenant" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Intervenant
            </label>
            <select id="Intervenant" v-model="selectedIntervenant"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins">
              <option value="">Choisissez un intervenant</option>
              <option v-for="intervenant in intervenants" :key="intervenant.id" :value="intervenant">
                {{ intervenant.firstname }} {{ intervenant.lastname }}
              </option>
            </select>
          </div>

          <div>
            <label for="modules" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">
              Module
            </label>
            <select id="modules" v-model="selectedModule"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins">
              <option value="">Choisissez un module</option>
              <option v-for="module in selectedIntervenant.modules" :key="module.id" :value="module">
                {{ module.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label for="pref" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Préférence
          </label>
          <textarea id="pref" v-model="preferences" rows="4"
            placeholder="Ex: Disponible tous les jeudis matin, pas le samedi"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"></textarea>
        </div>

        <div class="flex justify-end">
          <button type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors font-poppins">
            Enregistrer
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 font-poppins">
        Liste des préférences
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 font-poppins">
                Intervenant
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 font-poppins">
                Modules
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 font-poppins">
                Préférences
              </th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="intervenant in intervenants" :key="intervenant.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-700 font-poppins">
                {{ intervenant.firstname }} {{ intervenant.lastname }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <div v-for="module in intervenant.modules" :key="module.id" class="font-poppins">
                  {{ module.name }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 text-right">
                <div v-for="module in intervenant.modules" :key="module.id">
                  <span v-for="(preference, index) in module.preferences" :key="index" class="font-poppins">
                    {{ preference
                    }}, </span>
                  <button @click="deletePref(module.id)" class="text-red-500 hover:text-red-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import router from "../router";
import { useUserStore } from "../stores/user-store";

const userStore = useUserStore();
const schoolId = userStore.schoolId || localStorage.getItem("schoolId");
const intervenants = ref([]);
const selectedIntervenant = ref({});
const selectedModule = ref({});
const preferences = ref("");

watch(selectedIntervenant, () => {
  selectedModule.value = selectedIntervenant.value.modules;
});

const createPref = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}userModules`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedIntervenant.value.id,
          moduleId: selectedModule.value.moduleId,
          settings: preferences.value,
        }),
      }
    );
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

const deletePref = async (id) => {
  try {
    console.log(id);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}userModules/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: null,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong, request failed!");
    }
    router.go();
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  intervenants.value = await fetchGetData(`users/intervenants/${schoolId}`);
  console.log(intervenants.value, 'test');

  intervenants.value = intervenants.value.map((intervenant) => {
    intervenant.modules = intervenant.modules.map((module) => {
      if (!module.preferences) {
        module.preferences = [];
        return module;
      }
      module.preferences = module.preferences
        .split(",")
        .map((preference) => preference.trim());
      return module;
    });
    return intervenant;
  });
});
</script>
