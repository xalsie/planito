<template>
  <aside class="w-64 bg-white shadow-lg">
    <div class="p-6 border-b border-gray-200">
      <div class="text-xl font-bold text-gray-800 font-poppins">
        {{ user.firstName }} {{ user.lastName }}
      </div>
      <div class="text-sm text-gray-600 font-poppins">
        {{ user.role }}
      </div>
    </div>

    <!-- <div class="p-4 border-b border-gray-200">
      <div class="space-y-4">
        <div v-show="schools.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">École</label>
          <select v-model="selectedSchool"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Toutes les Écoles</option>
            <option v-for="school in schools" :key="school.id" :value="school.id">
              {{ school.name }}
            </option>
          </select>
        </div>

        <div v-show="classes.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
          <select v-model="selectedClass"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Toutes les Classes</option>
            <option v-for="clas in classes" :key="clas.id" :value="clas.id">
              {{ clas.name }}
            </option>
          </select>
        </div>

        <div v-show="modules.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select v-model="selectedModule"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tous les modules</option>
            <option v-for="module in modules" :key="module.id" :value="module.id">
              {{ module.name }}
            </option>
          </select>
        </div>
      </div>
    </div> -->

    <div class="divide-y divide-gray-200">
      <ul class="pt-4 pb-2 space-y-1">
        <li v-for="(item, index) in menuItems" :key="index">
          <router-link v-if="item.type === 'link'" :to="{ name: item.routeName }"
            class="flex items-center p-3 space-x-3 rounded-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors font-poppins">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-current"
              v-html="item.icon"></svg>
            <span>{{ item.label }}</span>
          </router-link>
          <button v-else @click="openImportModal"
            class="flex items-center p-3 space-x-3 rounded-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors font-poppins w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-current"
              v-html="item.icon"></svg>
            <span>{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h2 class="text-xl font-bold mb-4">Import de Calendrier</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Lien du calendrier</label>
          <input v-model="calendarUrl" type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez l'URL du calendrier" />
        </div>
        <div class="flex justify-end space-x-3">
          <button @click="closeImportModal" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Annuler
          </button>
          <button @click="handleImportURL"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Importer
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 w-64 p-6 border-t border-gray-200 bg-white">
      <button @click="handleLogout"
        class="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors font-poppins">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-current">
          <path
            d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z">
          </path>
          <rect width="32" height="64" x="256" y="232"></rect>
        </svg>
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user-store'

const router = useRouter()
const userStore = useUserStore()

// Données utilisateur
const localUser = userStore.user || JSON.parse(localStorage.getItem('user'))
const user = ref({
  firstName: localUser?.firstName || 'John',
  lastName: localUser?.lastName || 'Doe',
  role: localUser?.user?.roles
    .map(role => role.replace('ROLE_', ''))
    .map(role => role.charAt(0) + role.slice(1).toLowerCase())
    .join(' - ') || 'Intervenant'
})

// Données pour les sélecteurs
// const schools = ref([])
// const classes = ref([])
// const modules = ref([])

// const selectedSchool = ref('')
// const selectedClass = ref('')
// const selectedModule = ref('')

// Filtres pour les sélecteurs
// const filteredClasses = computed(() => {
//   console.log(selectedSchool.value)
//   selectedSchool.value
//     ? classes.value.filter(c => c.schoolId === selectedSchool.value)
//     : classes.value
// })

// const filteredModules = computed(() =>
//   selectedClass.value
//     ? modules.value.filter(m => m.classId === selectedClass.value)
//     : []
// )

// async function fetchSchool() {
//   const token = localStorage.getItem('token')
//   const userId = localUser.id

//   try {
//     const schoolsRes = await fetch(`http://localhost:3000/users/${userId}/schools`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })

//     if (!schoolsRes.ok) {
//       throw new Error('Erreur lors du chargement des écoles')
//     }

//     schools.value = await schoolsRes.json()
//   } catch (error) {
//     console.error('Erreur:', error)
//   }
// }

// async function fetchClasses() {
//   const token = localStorage.getItem('token')
//   const userId = localUser.id

//   try {
//     const classesRes = await fetch(`http://localhost:3000/users/${userId}/classes/${selectedSchool.value? selectedSchool.value : ""}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })

//     if (!classesRes.ok) {
//       throw new Error('Erreur lors du chargement des classes')
//     }

//     classes.value = await classesRes.json()

//     const classe = [...classes.value]

//     classe.forEach(async (moduleClass) => {
//       moduleClass.moduleClasses.forEach(async (moduleClass) => {
//         modules.value.push(moduleClass.module)
//       })
//     })
//   } catch (error) {
//     console.error('Erreur:', error)
//   }
// }

// async function fetchEvent() {
// }

// watch(selectedSchool, () => {
//   console.log(selectedSchool.value)
// })

// watch(selectedClass, () => {
//   console.log(selectedClass.value)
// })

// watch(selectedModule, () => {
//   console.log(selectedModule.value)
// })

onMounted(() => {
})

const showImportModal = ref(false)
const calendarUrl = ref('')

const menuItems = ref([
  {
    label: 'Calendrier',
    routeName: 'intervenant-calendrier',
    type: 'link',
    icon: '<path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/>'
  },
  {
    label: 'Mes indisponibilités',
    routeName: 'intervenant-disponibilite',
    type: 'link',
    icon: '<path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/>'
  },
  {
    label: 'Import de Calendrier',
    type: 'button',
    icon: '<path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"/>'
  }
])

const openImportModal = () => {
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
  calendarUrl.value = ''
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const handleValidation = () => {
  // if (selectedSchool.value && selectedClass.value && selectedModule.value) {
  //   // Vous pouvez ajouter ici la logique pour gérer la validation
  //   console.log('Sélections validées:', {
  //     école: selectedSchool.value,
  //     classe: selectedClass.value,
  //     module: selectedModule.value
  //   })
  // }
};

const handleImportURL = async () => {
  if (calendarUrl.value) {
    console.log("URL du calendrier:", calendarUrl.value);
    console.log("Intervenant:", localUser.id);
    if (
      calendarUrl.value.includes("http") &&
      calendarUrl.value.includes(".ics")
    ) {
      console.log("URL valide");
      await fetch("http://localhost:3000/events/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localUser.id,
          url: calendarUrl.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Réponse:", data);
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
      console.log("fetch done");
      closeImportModal();
    } else {
      console.log("URL invalide");
    }
  }
};
</script>
