<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
    <h2 class="text-2xl font-bold">Understanding Level</h2>
    <p class="text-slate-500 mt-1">Module status distribution</p>

    <div class="flex flex-col md:flex-row items-center gap-8 mt-8">
      <div
        class="w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500"
        :style="{ background: conicGradient }"
      >
        <div class="w-28 h-28 rounded-full bg-white flex items-center justify-center">
          <div class="text-center">
            <p class="text-3xl font-bold text-slate-800">{{ courseStore.totalModules }}</p>
            <p class="text-xs text-slate-500 uppercase font-semibold tracking-wider">Modules</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 flex-1 w-full">
        <div v-for="status in statusList" :key="status.id" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="status.color"></div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500">{{ status.label }}</span>
            <span class="font-bold text-slate-800">{{ status.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCourseStore } from "../../stores/course";

const courseStore = useCourseStore();

const statusList = computed(() => [
  { id: 'notStarted', label: 'Not Started', count: courseStore.masteryDistribution.notStarted, color: 'bg-slate-300', hex: '#cbd5e1' },
  { id: 'needsReview', label: 'Needs Review', count: courseStore.masteryDistribution.needsReview, color: 'bg-orange-400', hex: '#fb923c' },
  { id: 'proficient', label: 'Proficient', count: courseStore.masteryDistribution.proficient, color: 'bg-blue-500', hex: '#3b82f6' },
  { id: 'mastered', label: 'Mastered', count: courseStore.masteryDistribution.mastered, color: 'bg-emerald-500', hex: '#10b981' }
]);

const conicGradient = computed(() => {
  if (courseStore.totalModules === 0) return '#f1f5f9';
  
  let currentPercentage = 0;
  const stops = statusList.value
    .filter(s => s.count > 0)
    .map(s => {
      const percentage = (s.count / courseStore.totalModules) * 100;
      const start = currentPercentage;
      currentPercentage += percentage;
      return `${s.hex} ${start * 3.6}deg ${currentPercentage * 3.6}deg`;
    });
    
  return `conic-gradient(${stops.join(', ')})`;
});
</script>
