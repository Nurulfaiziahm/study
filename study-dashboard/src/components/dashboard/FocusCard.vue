<template>
  <div class="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm flex flex-col">
    <div
      class="flex-1 rounded-[28px] p-8 text-center text-white bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-700 relative overflow-hidden"
    >
      <!-- Decorative background elements -->
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

      <div class="relative z-10">
        <div
          class="inline-flex px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-6"
        >
          {{ focusStore.selectedMode.name }}
        </div>

        <div class="mb-8">
          <h2 class="text-6xl md:text-7xl font-black tracking-tighter">
            {{ formattedTime }}
          </h2>
        </div>

        <h3 class="text-xl font-bold opacity-90 mb-2">
          {{ activeModuleTitle || 'Ready to focus?' }}
        </h3>

        <!-- Module Selector -->
        <div v-if="!focusStore.isRunning" class="mb-6">
          <select 
            v-model="focusStore.activeModuleId"
            class="bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl px-4 py-2 outline-none border border-white/20 w-full max-w-xs mx-auto block appearance-none text-center"
          >
            <option :value="null" class="text-slate-800">Select a module to study...</option>
            <optgroup v-for="course in courseStore.courses" :key="course.id" :label="course.name" class="text-slate-800 font-bold">
              <option v-for="module in course.modules" :key="module.id" :value="module.id" class="text-slate-800 font-normal">
                {{ module.title }}
              </option>
            </optgroup>
          </select>
        </div>

        <div class="flex justify-center gap-2 mb-8">
          <button
            v-for="mode in focusStore.modes"
            :key="mode.id"
            @click="focusStore.selectMode(mode.id)"
            class="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            :class="focusStore.selectedMode.id === mode.id ? 'bg-white text-violet-600' : 'bg-white/10 hover:bg-white/20 text-white'"
          >
            {{ mode.name }}
          </button>
        </div>

        <div class="flex justify-center gap-4">
          <button
            v-if="!focusStore.isRunning"
            @click="startTimer"
            class="px-10 py-4 rounded-2xl bg-white text-violet-600 font-bold shadow-xl shadow-indigo-900/20 hover:scale-105 transition-transform"
          >
            Start Session
          </button>

          <template v-else>
            <button
              @click="togglePause"
              class="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold hover:bg-white/30 transition-all"
            >
              {{ focusStore.isPaused ? 'Resume' : 'Pause' }}
            </button>
            
            <button
              @click="focusStore.resetTimer"
              class="px-8 py-4 rounded-2xl bg-red-500/20 backdrop-blur-md text-white font-bold hover:bg-red-500/40 transition-all border border-white/20"
            >
              Quit
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useFocusStore } from "../../stores/focus";
import { useCourseStore } from "../../stores/course";
import { useSettingsStore } from "../../stores/settings";

const focusStore = useFocusStore();
const courseStore = useCourseStore();
const settingsStore = useSettingsStore();

const timerInterval = ref(null);

const formattedTime = computed(() => {
  const mins = Math.floor(focusStore.remainingSeconds / 60);
  const secs = focusStore.remainingSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const activeModuleTitle = computed(() => {
  if (!focusStore.activeModuleId) return null;
  for (const course of courseStore.courses) {
    const module = course.modules.find(m => m.id === focusStore.activeModuleId);
    if (module) return module.title;
  }
  return null;
});

const startTimer = () => {
  if (!focusStore.activeModuleId) {
    alert('Please select a module to study first.');
    return;
  }
  focusStore.startTimer(focusStore.activeModuleId);
};

const togglePause = () => {
  if (focusStore.isPaused) {
    focusStore.resumeTimer();
  } else {
    focusStore.pauseTimer();
  }
};

const handleSessionComplete = () => {
  settingsStore.logStudySession(
    focusStore.activeModuleId, 
    focusStore.selectedMode.durationMinutes
  );
  
  // Optional: Auto-update module status to "proficient" if it was "notStarted" or "needsReview"
  // This is a nice-to-have logic we could add later if desired.
  
  focusStore.resetTimer();
  alert(`Session complete! You've earned ${focusStore.selectedMode.durationMinutes} minutes of study time.`);
};

onMounted(() => {
  timerInterval.value = setInterval(() => {
    if (focusStore.isRunning && !focusStore.isPaused) {
      focusStore.tick();
      
      if (focusStore.remainingSeconds <= 0) {
        handleSessionComplete();
      }
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
});
</script>
