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
      <button
        class="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-violet-50 text-violet-600"
      >
        <House :size="20" />
        Dashboard
      </button>

      <button class="menu-btn">
        <Target :size="20" />
        Fokus Belajar
      </button>

      <button class="menu-btn">
        <BookOpen :size="20" />
        Mata Kuliah
      </button>
    </div>

    <div class="border-t border-slate-200 my-8"></div>

    <div class="space-y-2">
      <button class="menu-btn">
        <BarChart3 :size="20" />
        Statistik
      </button>

      <button class="menu-btn">
        <Calendar :size="20" />
        Kalender
      </button>

      <button class="menu-btn">
        <FileText :size="20" />
        Catatan
      </button>

      <button class="menu-btn">
        <Settings :size="20" />
        Pengaturan
      </button>
    </div>

    <div class="mt-auto">
      <div class="bg-white rounded-3xl p-5 border border-slate-100">
        <h3 class="font-semibold text-violet-600">Semester 5</h3>

        <div class="mt-5">
          <p class="text-slate-500 text-sm">IPK Saat Ini</p>

          <div class="text-4xl font-bold mt-1">3.47</div>
        </div>

        <div class="mt-5">
          <p class="text-slate-500 text-sm">Target IPK</p>

          <div class="text-4xl font-bold text-violet-500 mt-1">4.00</div>
        </div>

        <div class="mt-5">
          <div class="h-3 bg-slate-100 rounded-full">
            <div
              class="h-3 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 w-[86%]"
            />
          </div>

          <p class="mt-3 text-sm text-slate-500">86.8% menuju target</p>
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
