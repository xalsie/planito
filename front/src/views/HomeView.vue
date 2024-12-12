<script setup>
</script>

<template>
  <main class="flex-grow">
    <section class="bg-white py-20">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-5xl font-bold text-blue-600 mb-6 primary-heading">
            Bienvenue sur Planito
          </h1>
          <p class="text-xl text-gray-600 mb-8 font-poppins">
            Facilitez la gestion de vos plannings scolaires avec Planito.
          </p>
          <router-link 
            to="/connexion" 
            class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors font-poppins"
          >
            COMMENCER
          </router-link>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-20">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-blue-600 mb-12 primary-heading">
          Nos Fonctionnalités
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white flex flex-col items-center justify-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
            <h3 class="text-xl font-bold text-gray-800 mb-4 primary-heading text-center">Optimisé par IA</h3>
            <p class="text-gray-600 font-poppins">
              Notre algorithme d'IA analyse et optimise vos emplois du temps pour une organisation parfaite.
            </p>
          </div>
          <div class="bg-white flex flex-col items-center justify-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
            <h3 class="text-xl font-bold text-gray-800 mb-4 primary-heading text-center">Interface Intuitive</h3>
            <p class="text-gray-600 font-poppins">
              Une expérience utilisateur fluide et simple pour une prise en main rapide et efficace.
            </p>
          </div>
          <div class="bg-white flex flex-col items-center justify-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
            <h3 class="text-xl font-bold text-gray-800 mb-4 primary-heading text-center">Vue Claire</h3>
            <p class="text-gray-600 font-poppins">
              Des plannings clairs et lisibles, accessibles en un coup d'œil pour tous les utilisateurs.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template> 