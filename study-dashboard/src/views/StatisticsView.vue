<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Statistics</h1>
        <p class="text-slate-500">Analyze your study habits and progress</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      <div class="xl:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <h3 class="text-xl font-bold mb-6">Study Hours (Last 7 Days)</h3>
        <apexchart 
          type="area" 
          height="350" 
          :options="chartOptions" 
          :series="series"
        ></apexchart>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 class="text-lg font-bold mb-4">Focus Distribution</h3>
          <apexchart 
            type="donut" 
            height="300" 
            :options="donutOptions" 
            :series="donutSeries"
          ></apexchart>
        </div>

        <div class="bg-violet-600 rounded-[32px] p-8 text-white">
          <h3 class="font-bold mb-2">Total Study Time</h3>
          <div class="text-4xl font-black mb-2">{{ totalHours }}h</div>
          <p class="text-violet-100 text-sm">Across all recorded sessions</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard title="Sessions Completed" :value="settingsStore.studyHistory.length" subtitle="All time">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Zap :size="24" />
        </div>
      </StatCard>
      
      <StatCard title="Average Session" :value="avgSessionLength" subtitle="Minutes per session">
        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
          <Clock :size="24" />
        </div>
      </StatCard>

      <StatCard title="Peak Day" :value="peakDay" subtitle="Most active day">
        <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
          <TrendingUp :size="24" />
        </div>
      </StatCard>

      <StatCard title="Courses Tracked" :value="courseStore.courses.length" subtitle="Active curriculum">
        <div class="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
          <BookOpen :size="24" />
        </div>
      </StatCard>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed } from "vue";
import { Zap, Clock, TrendingUp, BookOpen } from "lucide-vue-next";
import { useSettingsStore } from "../stores/settings";
import { useCourseStore } from "../stores/course";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import StatCard from "../components/dashboard/StatCard.vue";

const settingsStore = useSettingsStore();
const courseStore = useCourseStore();

const series = computed(() => [{
  name: 'Hours',
  data: settingsStore.weeklyStudyHours
}]);

const chartOptions = {
  chart: {
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3, colors: ['#7c3aed'] },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100],
      colorStops: [
        { offset: 0, color: "#7c3aed", opacity: 0.4 },
        { offset: 100, color: "#7c3aed", opacity: 0 }
      ]
    }
  },
  xaxis: {
    categories: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString(undefined, { weekday: 'short' });
    }),
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  tooltip: { theme: 'light' }
};

const donutSeries = computed(() => {
  const counts = { mastered: 0, proficient: 0, needsReview: 0, notStarted: 0 };
  courseStore.courses.forEach(c => {
    c.modules.forEach(m => {
      if (counts[m.status] !== undefined) counts[m.status]++;
    });
  });
  return Object.values(counts);
});

const donutOptions = {
  labels: ['Mastered', 'Proficient', 'Needs Review', 'Not Started'],
  colors: ['#10b981', '#3b82f6', '#fb923c', '#cbd5e1'],
  dataLabels: { enabled: false },
  legend: { position: 'bottom' },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: () => courseStore.totalModules
          }
        }
      }
    }
  }
};

const totalHours = computed(() => {
  const mins = settingsStore.studyHistory.reduce((acc, s) => acc + s.durationMinutes, 0);
  return (mins / 60).toFixed(1);
});

const avgSessionLength = computed(() => {
  if (settingsStore.studyHistory.length === 0) return 0;
  const mins = settingsStore.studyHistory.reduce((acc, s) => acc + s.durationMinutes, 0);
  return Math.round(mins / settingsStore.studyHistory.length);
});

const peakDay = computed(() => {
  if (settingsStore.studyHistory.length === 0) return "N/A";
  const dayCounts = {};
  settingsStore.studyHistory.forEach(s => {
    const day = new Date(s.date).toLocaleDateString(undefined, { weekday: 'long' });
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  return Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b);
});
</script>
