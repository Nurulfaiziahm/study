<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
});
</script>

<template>
  <div class="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
    <div class="flex flex-col md:flex-row gap-4 items-center md:items-start">
      <slot />

      <div>
        <p class="text-slate-500">
          {{ title }}
        </p>

        <h2 class="text-3xl md:text-4xl xl:text-5xl font-bold">
          {{ value }}
        </h2>

        <p class="text-slate-400 mt-3">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>
