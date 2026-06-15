<template>
  <button class="w-full text-left px-4 py-3 rounded-xl hover:bg-violet-50">
    {{ text }}
  </button>
</template>

<script setup>
defineProps({
  text: String,
});
</script>
