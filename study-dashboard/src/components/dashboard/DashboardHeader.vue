<script setup>
import { Calendar, Bell } from "lucide-vue-next";

const today = new Date();

const formattedDate = today.toLocaleDateString("en-US", {
     weekday: "long",
     day: "numeric",
     month: "long",
     year: "numeric",
});
</script>

<template>
     <div class="flex justify-between items-start">
          <div>
               <h1 class="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
                    Welcome back!
               </h1>

               <p class="text-slate-500 mt-3 text-lg">Stay focused and reach your GPA target</p>
          </div>

          <div class="flex items-center gap-4">
               <div
                    class="bg-white rounded-2xl px-5 py-4 border border-slate-100 flex items-center gap-3">
                    <Calendar :size="18" class="text-violet-500" />

                    {{ formattedDate }}
               </div>

               <button
                    class="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                    <Bell :size="20" />
               </button>
          </div>
     </div>
</template>
