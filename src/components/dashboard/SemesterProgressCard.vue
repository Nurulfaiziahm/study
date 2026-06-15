<template>
  <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
    <h2 class="text-2xl font-bold">Progress Semester</h2>

    <p class="text-slate-500 mt-1">Perjalananmu menuju IPK target</p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div class="flex justify-center">
        <div
          class="w-44 h-44 rounded-full bg-[conic-gradient(#8b5cf6_0deg,#6366f1_220deg,#e5e7eb_220deg)] flex items-center justify-center"
        >
          <div
            class="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center"
          >
            <h2 class="text-5xl font-bold">86.8%</h2>

            <p class="text-slate-500">Menuju Target</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-center gap-8">
        <div class="flex justify-between">
          <span>IPK Saat Ini</span>
          <span class="font-bold text-blue-500"> 3.47 </span>
        </div>

        <div class="flex justify-between">
          <span>Target IPK</span>
          <span class="font-bold text-violet-500"> 4.00 </span>
        </div>

        <div class="flex justify-between">
          <span>Sisa Perjalanan</span>
          <span class="font-bold text-orange-500"> 0.53 </span>
        </div>
      </div>
    </div>
  </div>
</template>
