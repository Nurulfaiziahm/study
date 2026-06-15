<template>
  <DashboardLayout>
    <DashboardHeader />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      <StatCard title="Modul Tersisa" value="69" subtitle="dari 96 modul">
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20">
          <BookOpen :size="34" class="text-white" />
        </div>
      </StatCard>

      <StatCard title="Hari ke Ujian" value="4" subtitle="20 Juni 2025">
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20">
          <Calendar :size="34" class="text-white" />
        </div>
      </StatCard>

      <StatCard title="Target Belajar" value="17" subtitle="modul per hari">
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20">
          <Target :size="34" class="text-white" />
        </div>
      </StatCard>

      <StatCard title="Streak Belajar" value="1" subtitle="hari berturut-turut">
        <div class="w-14 h-14 md:w-16 md:h-16 xl:w-20 xl:h-20">
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

import DashboardLayout from "../layouts/DashboardLayout.vue";
import DashboardHeader from "../components/dashboard/DashboardHeader.vue";

import StatCard from "../components/dashboard/StatCard.vue";
import SemesterProgressCard from "../components/dashboard/SemesterProgressCard.vue";
import FocusCard from "../components/dashboard/FocusCard.vue";
import UnderstandingChart from "../components/dashboard/UnderstandingChart.vue";
import DailyProgressCard from "../components/dashboard/DailyProgressCard.vue";
</script>
