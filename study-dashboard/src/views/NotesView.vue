<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Central Notes</h1>
        <p class="text-slate-500">Access and manage all your module notes in one place</p>
      </div>
    </div>

    <div v-if="modulesWithNotes.length === 0" class="bg-white rounded-[32px] p-12 border border-slate-100 text-center">
      <div class="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <FileText :size="40" />
      </div>
      <h3 class="text-xl font-bold mb-2">No notes found</h3>
      <p class="text-slate-500 mb-8 max-w-sm mx-auto">Start taking notes in the Courses or Calendar view to see them here.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="item in modulesWithNotes" 
        :key="item.module.id"
        class="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-slate-800">{{ item.module.title }}</h3>
            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">{{ item.course.name }}</p>
          </div>
          <button 
            @click="openNotes(item.course.id, item.module)"
            class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-100 transition-colors"
          >
            <ChevronRight :size="20" />
          </button>
        </div>

        <div class="space-y-4">
          <div 
            v-for="note in item.module.notes.slice(0, 2)" 
            :key="note.id"
            class="p-4 bg-slate-50 rounded-2xl border border-slate-100/50"
          >
            <p class="text-sm text-slate-600 line-clamp-3 mb-2">{{ note.content }}</p>
            <p class="text-[10px] uppercase font-black text-slate-400">
              {{ new Date(note.createdAt).toLocaleDateString() }}
            </p>
          </div>
          
          <div v-if="item.module.notes.length > 2" class="text-center">
            <button 
              @click="openNotes(item.course.id, item.module)"
              class="text-xs font-bold text-violet-600"
            >
              +{{ item.module.notes.length - 2 }} more notes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Modal (Reused) -->
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
          <div v-for="note in selectedModule.notes" :key="note.id" class="bg-slate-50 rounded-2xl p-6 relative group">
            <p class="text-slate-700 whitespace-pre-wrap mb-3">{{ note.content }}</p>
            <div class="flex justify-between items-center">
              <p class="text-[10px] uppercase font-black text-slate-400">
                {{ new Date(note.createdAt).toLocaleString() }}
              </p>
            </div>
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
import { FileText, ChevronRight, X } from "lucide-vue-next";
import { useCourseStore } from "../stores/course";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const courseStore = useCourseStore();

const modulesWithNotes = computed(() => {
  const result = [];
  courseStore.courses.forEach(course => {
    course.modules.forEach(module => {
      if (module.notes && module.notes.length > 0) {
        result.push({ course, module });
      }
    });
  });
  return result;
});

// Notes Modal Logic
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
</script>
