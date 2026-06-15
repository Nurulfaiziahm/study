<script setup>
import {
  House,
  Target,
  BookOpen,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  GraduationCap,
} from "lucide-vue-next";
import { useCourseStore } from "../../stores/course";
const courseStore = useCourseStore();
</script>

<template>
  <aside
    class="w-[240px] xl:w-[290px] min-h-screen bg-white/70 backdrop-blur-xl border-r border-slate-100 flex flex-col p-5"
  >
    <div class="flex items-center gap-3 mb-10">
      <div
        class="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center"
      >
        <GraduationCap class="text-white" :size="22" />
      </div>

      <div>
        <h1 class="font-bold text-3xl leading-none">Study</h1>

        <h1 class="font-bold text-3xl leading-none mt-1">Dashboard</h1>
      </div>
    </div>

    <div class="space-y-2">
      <router-link
        to="/"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <House :size="20" />
        Dashboard
      </router-link>

      <router-link
        to="/focus"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/focus' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <Target :size="20" />
        Study Focus
      </router-link>

      <router-link 
        to="/courses"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/courses' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <BookOpen :size="20" />
        Courses
      </router-link>
    </div>

    <div class="border-t border-slate-200 my-8"></div>

    <div class="space-y-2">
      <router-link
        to="/statistics"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/statistics' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <BarChart3 :size="20" />
        Statistics
      </router-link>

      <router-link 
        to="/calendar"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/calendar' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <Calendar :size="20" />
        Calendar
      </router-link>

      <router-link
        to="/notes"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/notes' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <FileText :size="20" />
        Notes
      </router-link>

      <router-link
        to="/settings"
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors"
        :class="$route.path === '/settings' ? 'bg-violet-50 text-violet-600 font-bold' : 'text-slate-500 hover:bg-slate-50'"
      >
        <Settings :size="20" />
        Settings
      </router-link>
    </div>

    <div class="mt-auto">
      <div class="bg-white rounded-3xl p-5 border border-slate-100">
        <h3 class="font-semibold text-violet-600">Current Progress</h3>

        <div class="mt-5">
          <p class="text-slate-500 text-sm">Mastered</p>

          <div class="text-4xl font-bold mt-1">{{ courseStore.completedModules }}</div>
        </div>

        <div class="mt-5">
          <p class="text-slate-500 text-sm">Total Modules</p>

          <div class="text-4xl font-bold text-violet-500 mt-1">{{ courseStore.totalModules }}</div>
        </div>

        <div class="mt-5">
          <div class="h-3 bg-slate-100 rounded-full">
            <div
              class="h-3 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
              :style="{ width: `${courseStore.masteryPercentage}%` }"
            />
          </div>

          <p class="mt-3 text-sm text-slate-500">{{ courseStore.masteryPercentage }}% towards target</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.menu-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1rem;
  transition: 0.2s;
}

.menu-btn:hover {
  background: #f8fafc;
}
</style>
