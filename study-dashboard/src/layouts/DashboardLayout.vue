<template>
  <div
    class="min-h-screen bg-[linear-gradient(135deg,#f8f8ff_0%,#f4f7ff_50%,#fff8f6_100%)]"
  >
    <div class="flex flex-col xl:flex-row">
      <Sidebar />

      <main class="flex-1 px-4 md:px-6 xl:px-10 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "../components/sidebar/Sidebar.vue";
</script>
