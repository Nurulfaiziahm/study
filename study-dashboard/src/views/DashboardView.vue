<template>
  <DashboardLayout>
    <DashboardHeader />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      <StatCard 
        title="Modules Left" 
        :value="courseStore.remainingModules" 
        :subtitle="`out of ${courseStore.totalModules} modules`"
      >
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 bg-violet-500 rounded-3xl flex items-center justify-center">
          <BookOpen :size="34" class="text-white" />
        </div>
      </StatCard>

      <StatCard 
        title="Days to Exam" 
        :value="courseStore.daysUntilExams" 
        :subtitle="nextExamDateFormatted"
      >
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 bg-blue-500 rounded-3xl flex items-center justify-center">
          <Calendar :size="34" class="text-white" />
        </div>
      </StatCard>

      <StatCard 
        title="Study Target" 
        :value="courseStore.dailyModuleGoal" 
        subtitle="modules per day"
      >
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 bg-orange-500 rounded-3xl flex items-center justify-center">
          <Target :size="34" class="text-white" />
        </div>
      </StatCard>

      <StatCard 
        title="Study Target" 
        :value="settingsStore.dailySessionGoal" 
        subtitle="sessions per day"
      >
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 bg-emerald-500 rounded-3xl flex items-center justify-center">
          <Flame :size="34" class="text-white" />
        </div>
      </StatCard>
    </div>

    <div class="grid xl:grid-cols-2 gap-6 mt-6">
      <SemesterProgressCard />
      <FocusCard />
    </div>

    <div class="grid xl:grid-cols-2 gap-6 mt-6">
      <UnderstandingChart />
      <DailyProgressCard />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { BookOpen, Calendar, Target, Flame } from "lucide-vue-next";
import { computed } from "vue";
import { useCourseStore } from "../stores/course";
import { useSettingsStore } from "../stores/settings";

import DashboardLayout from "../layouts/DashboardLayout.vue";
import DashboardHeader from "../components/dashboard/DashboardHeader.vue";

import StatCard from "../components/dashboard/StatCard.vue";
import SemesterProgressCard from "../components/dashboard/SemesterProgressCard.vue";
import FocusCard from "../components/dashboard/FocusCard.vue";
import UnderstandingChart from "../components/dashboard/UnderstandingChart.vue";
import DailyProgressCard from "../components/dashboard/DailyProgressCard.vue";

const courseStore = useCourseStore();
const settingsStore = useSettingsStore();

const nextExamDateFormatted = computed(() => {
  if (courseStore.courses.length === 0) return "No exams scheduled";
  
  const today = new Date();
  const sortedExams = [...courseStore.courses]
    .map(c => new Date(c.examDate))
    .filter(date => date >= today)
    .sort((a, b) => a - b);
    
  if (sortedExams.length === 0) return "No upcoming exams";
  
  return sortedExams[0].toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
});
</script>
