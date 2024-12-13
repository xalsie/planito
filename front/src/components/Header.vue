<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50"
    style="box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/home"
          class="text-2xl font-bold text-blue-600 brand-name hover:text-blue-700 transition-colors">
          Planito
        </router-link>
        <div class="hidden md:flex space-x-6">
          <router-link to="/login" v-if="$route.path !== '/login' && !$route.path.includes('/dashboard')"
            class="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-poppins font-medium">
            Connexion
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>