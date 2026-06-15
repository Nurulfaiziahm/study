<template>
  <DashboardLayout>
    <div class="max-w-4xl mx-auto py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-black mb-4">Focus Mode</h1>
        <p class="text-slate-500 text-lg">Minimize distractions and get some work done.</p>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div 
          class="w-full max-w-2xl bg-white rounded-[48px] p-12 shadow-2xl shadow-violet-100 border border-slate-100 relative overflow-hidden"
        >
          <!-- Progress Ring Background -->
          <div class="absolute inset-0 flex items-center justify-center opacity-5">
            <div 
              class="w-[500px] h-[500px] rounded-full border-[40px] border-violet-600"
              :style="{ clipPath: `inset(${100 - progress}% 0 0 0)` }"
            ></div>
          </div>

          <div class="relative z-10 text-center">
            <div class="inline-flex px-6 py-2 rounded-full bg-violet-50 text-violet-600 font-bold mb-8 uppercase tracking-widest text-sm">
              {{ focusStore.selectedMode.name }}
            </div>

            <div class="text-[120px] md:text-[160px] font-black tracking-tighter leading-none mb-12 text-slate-800">
              {{ formattedTime }}
            </div>

            <div class="mb-12">
              <h3 class="text-2xl font-bold text-slate-700 mb-6">
                {{ activeModuleTitle || 'Ready to focus?' }}
              </h3>

              <div v-if="!focusStore.isRunning" class="max-w-xs mx-auto">
                <select 
                  v-model="focusStore.activeModuleId"
                  class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-violet-300 text-center font-bold text-slate-600 appearance-none"
                >
                  <option :value="null">Select a module to study...</option>
                  <optgroup v-for="course in courseStore.courses" :key="course.id" :label="course.name">
                    <option v-for="module in course.modules" :key="module.id" :value="module.id">
                      {{ module.title }}
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div class="flex justify-center gap-4 mb-12">
              <button
                v-for="mode in focusStore.modes"
                :key="mode.id"
                @click="focusStore.selectMode(mode.id)"
                class="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
                :class="focusStore.selectedMode.id === mode.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
              >
                {{ mode.name }}
              </button>
            </div>

            <div class="flex justify-center gap-6">
              <button
                v-if="!focusStore.isRunning"
                @click="startTimer"
                class="px-12 py-5 rounded-[24px] bg-violet-600 text-white font-black text-xl shadow-xl shadow-violet-200 hover:scale-105 transition-transform"
              >
                Start Focus Session
              </button>

              <template v-else>
                <button
                  @click="togglePause"
                  class="px-10 py-5 rounded-[24px] bg-slate-100 text-slate-600 font-black text-xl hover:bg-slate-200 transition-all"
                >
                  {{ focusStore.isPaused ? 'Resume' : 'Pause' }}
                </button>
                
                <button
                  @click="focusStore.resetTimer"
                  class="px-10 py-5 rounded-[24px] bg-red-50 text-red-500 font-black text-xl hover:bg-red-100 transition-all border border-red-100"
                >
                  Quit Session
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useFocusStore } from "../stores/focus";
import { useCourseStore } from "../stores/course";
import { useSettingsStore } from "../stores/settings";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const focusStore = useFocusStore();
const courseStore = useCourseStore();
const settingsStore = useSettingsStore();

const timerInterval = ref(null);

const formattedTime = computed(() => {
  const mins = Math.floor(focusStore.remainingSeconds / 60);
  const secs = focusStore.remainingSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const progress = computed(() => {
  const total = focusStore.selectedMode.durationMinutes * 60;
  return ((total - focusStore.remainingSeconds) / total) * 100;
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
  focusStore.resetTimer();
  alert(`Focus session complete! You've earned ${focusStore.selectedMode.durationMinutes} minutes.`);
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
