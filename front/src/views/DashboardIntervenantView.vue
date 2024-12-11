<template>
  <div class="flex h-screen bg-gray-100">
    <SidebarIntervenant />
    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import SidebarIntervenant from '../components/SidebarIntervenant.vue'
</script> 