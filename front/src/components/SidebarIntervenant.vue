<template>
  <aside class="w-64 bg-white shadow-lg">
    <div class="p-6 border-b border-gray-200">
      <div class="text-xl font-bold text-gray-800 font-poppins">
        {{ user.name }}
      </div>
      <div class="text-sm text-gray-600 font-poppins">
        {{ user.role }}
      </div>
    </div>

    <div class="divide-y divide-gray-200">
      <ul class="pt-4 pb-2 space-y-1">
        <li v-for="(item, index) in menuItems" :key="index">
          <router-link 
            :to="{ name: item.routeName }" 
            class="flex items-center p-3 space-x-3 rounded-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors font-poppins"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                 class="w-5 h-5 fill-current" 
                 v-html="item.icon">
            </svg>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="absolute bottom-0 w-64 p-6 border-t border-gray-200 bg-white">
      <button 
        @click="handleLogout"
        class="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors font-poppins"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-current">
          <path d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z"></path>
          <rect width="32" height="64" x="256" y="232"></rect>
        </svg>
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref({
  name: 'Monsieur prof man',
  role: 'Intervenant'
})

const menuItems = ref([
  {
    label: 'Calendrier',
    routeName: 'intervenant-calendrier',
    icon: '<path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/>'
  },
  {
    label: 'Import de Calendrier',
    routeName: 'intervenant-import',
    icon: '<path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"/>'
  },
  {
    label: 'Disponibilité',
    routeName: 'intervenant-disponibilite',
    icon: '<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/>'
  }
])

const handleLogout = () => {
  localStorage.removeItem('token') 
  localStorage.removeItem('user') 
  router.push('/home')
}
</script> 