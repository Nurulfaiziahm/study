<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Study Calendar</h1>
        <p class="text-slate-500">Track and plan your upcoming modules</p>
      </div>
      
      <button 
        @click="courseStore.autoScheduleModules"
        class="bg-violet-100 text-violet-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-violet-200 transition-colors"
      >
        <Sparkles :size="20" />
        Auto-Schedule
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
      <!-- Unscheduled / Backlog -->
      <div class="xl:col-span-1 space-y-6">
        <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm h-full">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <ListTodo :size="20" />
            </span>
            Backlog
          </h3>
          
          <div v-if="unscheduledModules.length === 0" class="py-8 text-center text-slate-400">
            <p class="text-sm italic">All modules are scheduled! 🎉</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="item in unscheduledModules" 
              :key="item.module.id"
              class="p-4 bg-slate-50 rounded-2xl border border-slate-100/50"
            >
              <p class="font-bold text-slate-800 text-sm mb-1">{{ item.module.title }}</p>
              <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">{{ item.course.name }}</p>
              
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button 
                    @click="openNotes(item.course.id, item.module)"
                    class="text-[10px] font-bold text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1"
                  >
                    <FileText :size="12" />
                    Notes
                  </button>
                  <button 
                    @click="courseStore.updateModuleScheduledDate(item.course.id, item.module.id, formatDateForInput(new Date()))"
                    class="text-[10px] font-bold text-violet-500 hover:text-violet-700 transition-colors"
                  >
                    Today
                  </button>
                </div>
                <input 
                  type="date" 
                  @change="courseStore.updateModuleScheduledDate(item.course.id, item.module.id, $event.target.value)"
                  class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-violet-300 w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Schedule -->
      <div class="xl:col-span-2 space-y-6">
        <div v-for="day in scheduleDays" :key="day.date" class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
            <span class="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
              <span class="text-[10px] uppercase font-black text-slate-400 leading-none mb-0.5">{{ day.month }}</span>
              <span class="text-lg font-black text-slate-700 leading-none">{{ day.dayNum }}</span>
            </span>
            {{ day.isToday ? 'Today' : day.dayName }}
          </h3>

          <div v-if="day.modules.length === 0" class="py-4 text-slate-400 italic">
            No modules scheduled for this day.
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="item in day.modules" 
              :key="item.module.id"
              class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 gap-4"
            >
              <div class="flex items-center gap-4">
                <div 
                  class="w-4 h-4 rounded-full flex-shrink-0" 
                  :class="{
                    'bg-slate-300': item.module.status === 'notStarted',
                    'bg-orange-400': item.module.status === 'needsReview',
                    'bg-blue-500': item.module.status === 'proficient',
                    'bg-emerald-500': item.module.status === 'mastered'
                  }"
                ></div>
                <div>
                  <p class="font-bold text-slate-800">{{ item.module.title }}</p>
                  <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">{{ item.course.name }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3 self-end md:self-auto">
                <button 
                  @click="openNotes(item.course.id, item.module)"
                  class="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-violet-600 transition-colors mr-2"
                >
                  <FileText :size="14" />
                  {{ item.module.notes.length }}
                </button>
                <input 
                  type="date" 
                  :value="item.module.scheduledDate"
                  @change="courseStore.updateModuleScheduledDate(item.course.id, item.module.id, $event.target.value)"
                  class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-violet-300"
                />
                <button 
                  @click="courseStore.updateModuleScheduledDate(item.course.id, item.module.id, null)"
                  class="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove from schedule"
                >
                  <X :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Course Overview -->
      <div class="xl:col-span-1 space-y-6">
        <div class="bg-violet-600 rounded-[32px] p-8 text-white shadow-xl shadow-violet-200">
          <h3 class="text-xl font-bold mb-2">Study Tips</h3>
          <p class="text-violet-100 text-sm mb-6">Auto-scheduling distributes your remaining modules evenly until each exam date.</p>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check :size="14" />
              </div>
              <p class="text-sm">Consistent daily progress is better than cramming.</p>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check :size="14" />
              </div>
              <p class="text-sm">Review "Mastered" modules weekly to retain knowledge.</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 class="text-xl font-bold mb-6">Upcoming Exams</h3>
          <div class="space-y-6">
            <div v-for="course in sortedCourses" :key="course.id" class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                <CalendarIcon :size="20" class="text-slate-400" />
              </div>
              <div>
                <p class="font-bold text-slate-800">{{ course.name }}</p>
                <p class="text-sm text-slate-500">{{ formatDate(course.examDate) }}</p>
                <p class="text-xs font-bold mt-1" :class="getDaysLeftColor(course.examDate)">
                  {{ getDaysLeft(course.examDate) }} days left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showNotesModal = false"></div>
      
      <div class="relative bg-white rounded-[32px] w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div class="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ selectedModule.title }}</h2>
            <p class="text-slate-500">Module Notes</p>
          </div>
          <button @click="showNotesModal = false" class="text-slate-400 hover:text-slate-600">
            <X :size="24" />
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-8 space-y-6">
          <div v-if="selectedModule.notes.length === 0" class="text-center py-12">
            <p class="text-slate-400 italic">No notes for this module yet.</p>
          </div>
          
          <div v-for="note in selectedModule.notes" :key="note.id" class="bg-slate-50 rounded-2xl p-6">
            <p class="text-slate-700 whitespace-pre-wrap mb-3">{{ note.content }}</p>
            <p class="text-[10px] uppercase font-black text-slate-400">
              {{ new Date(note.createdAt).toLocaleString() }}
            </p>
          </div>
        </div>
        
        <div class="p-8 border-t border-slate-100 bg-slate-50">
          <textarea 
            v-model="newNoteContent"
            placeholder="Write a new note..."
            class="w-full bg-white border border-slate-200 rounded-2xl p-4 outline-none focus:border-violet-300 h-32 resize-none"
          ></textarea>
          <div class="flex justify-end mt-4">
            <button 
              @click="handleAddNote"
              class="bg-violet-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { Sparkles, Calendar as CalendarIcon, Check, ListTodo, X, FileText } from "lucide-vue-next";
import { useCourseStore } from "../stores/course";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const courseStore = useCourseStore();

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Notes state
const showNotesModal = ref(false);
const selectedModule = ref(null);
const selectedCourseId = ref(null);
const newNoteContent = ref("");

const openNotes = (courseId, module) => {
  selectedCourseId.value = courseId;
  selectedModule.value = module;
  showNotesModal.value = true;
};

const handleAddNote = () => {
  if (newNoteContent.value.trim() && selectedCourseId.value && selectedModule.value) {
    courseStore.addNote(selectedCourseId.value, selectedModule.value.id, newNoteContent.value.trim());
    newNoteContent.value = "";
  }
};

const unscheduledModules = computed(() => {
  const modules = [];
  courseStore.courses.forEach(course => {
    course.modules.forEach(module => {
      if (!module.scheduledDate && module.status !== 'mastered') {
        modules.push({ course, module });
      }
    });
  });
  return modules;
});

const scheduleDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate next 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = getLocalDateString(date);
    
    const dayModules = [];
    courseStore.courses.forEach(course => {
      course.modules.forEach(module => {
        if (module.scheduledDate === dateStr) {
          dayModules.push({ course, module });
        }
      });
    });

    days.push({
      date: dateStr,
      dayNum: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      dayName: date.toLocaleString('default', { weekday: 'long' }),
      isToday: i === 0,
      modules: dayModules
    });
  }
  return days;
});

const sortedCourses = computed(() => {
  return [...courseStore.courses].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const getDaysLeft = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(dateStr);
  const diffTime = examDate - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

const getDaysLeftColor = (dateStr) => {
  const days = getDaysLeft(dateStr);
  if (days <= 3) return 'text-red-500';
  if (days <= 7) return 'text-orange-500';
  return 'text-emerald-500';
};
</script>
