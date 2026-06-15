<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-slate-500">Customize your study experience</p>
      </div>
    </div>

    <div class="max-w-2xl space-y-6">
      <!-- Study Goals -->
      <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
          <Target class="text-violet-600" :size="24" />
          Study Goals
        </h3>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Daily Session Goal</label>
            <div class="flex items-center gap-4">
              <input 
                v-model.number="settingsStore.dailySessionGoal"
                type="range" 
                min="1" 
                max="20" 
                class="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <span class="w-12 text-center font-bold text-lg text-violet-600">{{ settingsStore.dailySessionGoal }}</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">How many Pomodoro sessions you aim to complete each day.</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Target Study Hours Per Day</label>
            <div class="flex items-center gap-4">
              <input 
                v-model.number="settingsStore.targetStudyHoursPerDay"
                type="number" 
                step="0.5"
                class="w-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 outline-none focus:border-violet-300 font-bold"
              />
              <span class="text-slate-500 font-medium">hours</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
          <Database class="text-blue-600" :size="24" />
          Data Management
        </h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
            <div>
              <p class="font-bold text-slate-800">Export Study Data</p>
              <p class="text-xs text-slate-500">Download your courses and history as JSON</p>
            </div>
            <button 
              @click="exportData"
              class="bg-white text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Export
            </button>
          </div>

          <div class="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
            <div>
              <p class="font-bold text-red-600">Reset All Data</p>
              <p class="text-xs text-red-400">Permanently delete all courses, notes, and history</p>
            </div>
            <button 
              @click="confirmReset"
              class="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- App Info -->
      <div class="text-center py-8">
        <p class="text-slate-400 text-sm italic">Study Dashboard v1.0.0</p>
        <p class="text-slate-300 text-[10px] uppercase font-bold tracking-widest mt-1">Local-First Architecture</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { Target, Database } from "lucide-vue-next";
import { useSettingsStore } from "../stores/settings";
import { useCourseStore } from "../stores/course";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const settingsStore = useSettingsStore();
const courseStore = useCourseStore();

const exportData = () => {
  const data = {
    courses: courseStore.courses,
    history: settingsStore.studyHistory,
    settings: {
      dailySessionGoal: settingsStore.dailySessionGoal,
      targetStudyHoursPerDay: settingsStore.targetStudyHoursPerDay
    }
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const confirmReset = () => {
  if (confirm("Are you ABSOLUTELY sure? This will delete all your study progress, notes, and courses. This action cannot be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
};
</script>
