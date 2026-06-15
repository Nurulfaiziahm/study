<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100">
    <h2 class="text-2xl font-bold">Today's Sessions</h2>
    <p class="text-slate-500 mt-1">Goal: {{ settingsStore.dailySessionGoal }} sessions per day</p>

    <div class="mt-8 flex gap-4">
      <div
        v-for="i in settingsStore.dailySessionGoal"
        :key="i"
        class="flex-1 h-3 rounded-full transition-colors duration-300"
        :class="i <= settingsStore.completedSessionsToday ? 'bg-emerald-500' : 'bg-slate-200'"
      />
    </div>

    <div class="mt-8 flex justify-between items-center">
      <span class="text-slate-500">
        {{ settingsStore.completedSessionsToday }} of {{ settingsStore.dailySessionGoal }} completed
      </span>
      <span class="text-3xl font-bold"> {{ settingsStore.targetProgressPercentage }}% </span>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from "../../stores/settings";
const settingsStore = useSettingsStore();
</script>
