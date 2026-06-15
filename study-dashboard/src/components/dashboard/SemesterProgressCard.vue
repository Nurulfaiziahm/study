<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
    <h2 class="text-2xl font-bold">Overall Mastery</h2>

    <p class="text-slate-500 mt-1">Your journey towards mastering all modules</p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div class="flex justify-center">
        <div
          class="w-44 h-44 rounded-full flex items-center justify-center transition-all duration-500"
          :style="{
            background: `conic-gradient(#8b5cf6 0deg, #6366f1 ${courseStore.averageMastery * 3.6}deg, #e5e7eb ${courseStore.averageMastery * 3.6}deg)`
          }"
        >
          <div
            class="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center"
          >
            <h2 class="text-4xl font-bold">{{ courseStore.averageMastery }}%</h2>

            <p class="text-slate-500 text-sm">Mastery Score</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-center gap-8">
        <div class="flex justify-between">
          <span>Total Modules</span>
          <span class="font-bold text-blue-500"> {{ courseStore.totalModules }} </span>
        </div>

        <div class="flex justify-between">
          <span>Mastered</span>
          <span class="font-bold text-violet-500"> {{ courseStore.completedModules }} </span>
        </div>

        <div class="flex justify-between">
          <span>Remaining</span>
          <span class="font-bold text-orange-500"> {{ courseStore.remainingModules }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCourseStore } from "../../stores/course";
const courseStore = useCourseStore();
</script>
