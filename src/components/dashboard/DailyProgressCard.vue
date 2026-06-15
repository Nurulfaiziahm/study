<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100">
    <h2 class="text-2xl font-bold">Progress Hari Ini</h2>

    <div class="mt-8 flex gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="flex-1 h-3 rounded-full bg-slate-200"
      />
    </div>

    <div class="mt-8 flex justify-end">
      <span class="text-3xl font-bold"> 0% </span>
    </div>
  </div>
</template>
