<template>
  <section class="p-6 dark:bg-gray-100 dark:text-gray-900">
    <form
      novalidate=""
      action=""
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
            <input
              id="Intervenant"
              type="text"
              placeholder="Intervenant"
              class="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300"
            />
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
            <label for="pref" class="text-sm">Préférence à entrer</label>
            <textarea
              id="pref"
              placeholder="A aqua poney tous les jeudis"
              class="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300"
            ></textarea>
          </div>
          <div class="col-span-full">
            <div class="flex items-center space-x-2">
              <button
                type="button"
                class="px-4 py-2 border rounded-md dark:border-gray-800"
              >
                Enregistrer
              </button>
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
                <p>
                  {{ (intervenant.firstname, intervenant.lastname) }}
                </p>
              </td>
              <td class="px-3 py-2">
                <span>{{ intervenant.modules }}</span>
              </td>
              <td class="px-3 py-2">
                <p>{{ intervenant.preferences }}</p>
              </td>
              <td class="px-3 py-2"></td>
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

          <!-- <tr>
              <td class="px-3 py-2">
                <p>Dwight Adams</p>
              </td>
              <td class="px-3 py-2">
                <span>UI Designer</span>
              </td>
              <td class="px-3 py-2">
                <p>A aqua poney les lundis</p>
                <p>A aqua poney les mardis</p>
                <p>A aqua poney les mercredis</p>
                <p>A aqua poney les jeudis</p>
                <p>A aqua poney les vendredis</p>
              </td>
              <td></td>
              <td></td>
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
            <tr>
              <td class="px-3 text-2xl font-medium dark:text-gray-600"></td>
              <td class="px-3 py-2">
                <p>Richie Allen</p>
              </td>
              <td class="px-3 py-2">
                <span>Geothermal Technician</span>
              </td>
              <td class="px-3 py-2">
                <p>Enseignement en matinée plutôt qu’en après-midi.</p>
                <p>
                  Avoir du temps pour préparer les cours entre deux classes.
                </p>
                <p>
                  Ne pas enseigner deux matières différentes dans une même
                  journée.
                </p>
              </td>
              <td class="px-3 py-2"></td>
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
          </tbody> -->
          <tbody class="border-b dark:bg-gray-50 dark:border-gray-300">
            <tr>
              <td class="px-3 text-2xl font-medium dark:text-gray-600">B</td>
              <td class="px-3 py-2">
                <p>Alex Bridges</p>
              </td>
              <td class="px-3 py-2">
                <span>Administrative Services Manager</span>
              </td>
              <td class="px-3 py-2">
                <p>Un jour libre dans la semaine.</p>
                <p>Cours regroupés sur des jours consécutifs.</p>
                <p>Pas de cours lourds à des horaires tardifs.</p>
              </td>
              <td class="px-3 py-2"></td>
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
            <tr>
              <td class="px-3 text-2xl font-medium dark:text-gray-600"></td>
              <td class="px-3 py-2">
                <p>Lynette Brown</p>
              </td>
              <td class="px-3 py-2">
                <span>Camera Operator</span>
              </td>
              <td class="px-3 py-2">
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </td>
              <td class="px-3 py-2">
                <p></p>
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
          <tbody class="border-b dark:bg-gray-50 dark:border-gray-300">
            <tr>
              <td class="px-3 text-2xl font-medium dark:text-gray-600">C</td>
              <td class="px-3 py-2">
                <p>Mariah Claxton</p>
              </td>
              <td class="px-3 py-2">
                <span>Nuclear Technician</span>
              </td>
              <td class="px-3 py-2">
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </td>
              <td class="px-3 py-2"></td>
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
            <tr>
              <td class="px-3 text-2xl font-medium dark:text-gray-600"></td>
              <td class="px-3 py-2">
                <p>Hermila Craig</p>
              </td>
              <td class="px-3 py-2">
                <span>Production Engineer</span>
              </td>
              <td class="px-3 py-2">
                <p></p>
                <p></p>
                <p></p>
              </td>
              <td class="px-3 py-2"></td>
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
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user-store";

const userStore = useUserStore();
const schoolId = userStore.schoolId || localStorage.getItem("schoolId");
const intervenants = ref([]);

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
  console.log("intervenants:", intervenants);
});
</script>
