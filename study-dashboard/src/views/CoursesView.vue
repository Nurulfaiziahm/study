<template>
  <DashboardLayout>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">Manage Courses</h1>
        <p class="text-slate-500">Add and organize your study materials</p>
      </div>
      
      <button 
        @click="openAddCourseModal()"
        class="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-violet-700 transition-colors"
      >
        <Plus :size="20" />
        Add New Course
      </button>
    </div>

    <div v-if="courseStore.courses.length === 0" class="bg-white rounded-[32px] p-12 border border-slate-100 text-center">
      <div class="w-20 h-20 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <BookOpen :size="40" />
      </div>
      <h3 class="text-xl font-bold mb-2">No courses yet</h3>
      <p class="text-slate-500 mb-8 max-w-sm mx-auto">Start by adding your first course to begin tracking your study progress.</p>
      <button 
        @click="openAddCourseModal()"
        class="bg-violet-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-colors"
      >
        Add First Course
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div 
        v-for="course in courseStore.courses" 
        :key="course.id"
        class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold">{{ course.name }}</h2>
            <p class="text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar :size="16" />
              Exam: {{ new Date(course.examDate).toLocaleDateString() }}
            </p>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="openEditCourseModal(course)"
              class="text-slate-400 hover:text-violet-600 p-2 transition-colors"
            >
              <Pencil :size="18" />
            </button>
            <button 
              @click="courseStore.deleteCourse(course.id)"
              class="text-slate-400 hover:text-red-500 p-2 transition-colors"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

        <div class="space-y-4 mb-8">
          <h3 class="font-bold text-slate-700 flex justify-between items-center">
            Modules
            <span class="text-sm font-normal text-slate-500">{{ course.modules.length }} total</span>
          </h3>
          
          <div v-if="course.modules.length === 0" class="bg-slate-50 rounded-2xl p-4 text-center text-slate-500 text-sm">
            No modules added yet.
          </div>
          
          <div v-else class="space-y-2">
            <div 
              v-for="module in course.modules" 
              :key="module.id"
              class="p-4 bg-slate-50 rounded-2xl border border-slate-100/50"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3 flex-1">
                  <div 
                    class="w-3 h-3 rounded-full flex-shrink-0" 
                    :class="{
                      'bg-slate-300': module.status === 'notStarted',
                      'bg-orange-400': module.status === 'needsReview',
                      'bg-blue-500': module.status === 'proficient',
                      'bg-emerald-500': module.status === 'mastered'
                    }"
                  ></div>
                  
                  <input 
                    v-if="editingModuleId === module.id"
                    v-model="editingModuleTitle"
                    @blur="handleUpdateModuleTitle(course.id, module.id)"
                    @keyup.enter="handleUpdateModuleTitle(course.id, module.id)"
                    class="font-bold text-slate-700 bg-white border border-violet-200 rounded px-2 py-0.5 outline-none w-full"
                    autoFocus
                  />
                  <span 
                    v-else 
                    @dblclick="startEditingModule(module)"
                    class="font-bold text-slate-700 cursor-text"
                  >{{ module.title }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <select 
                    :value="module.status"
                    @change="courseStore.updateModuleStatus(course.id, module.id, $event.target.value)"
                    class="bg-transparent text-sm font-semibold text-slate-600 outline-none"
                  >
                    <option value="notStarted">Not Started</option>
                    <option value="needsReview">Needs Review</option>
                    <option value="proficient">Proficient</option>
                    <option value="mastered">Mastered</option>
                  </select>
                  
                  <button 
                    @click="courseStore.deleteModule(course.id, module.id)"
                    class="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div class="flex justify-between items-center pt-3 border-t border-slate-200/50">
                <button 
                  @click="openNotes(course.id, module)"
                  class="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-violet-600 transition-colors"
                >
                  <FileText :size="14" />
                  {{ module.notes.length }} Notes
                </button>
                
                <span v-if="module.scheduledDate" class="text-[10px] uppercase font-black text-slate-400">
                  Scheduled: {{ new Date(module.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-auto pt-6 border-t border-slate-100 flex gap-4">
          <input 
            v-model="newModuleTitles[course.id]"
            @keyup.enter="handleAddModule(course.id)"
            type="text" 
            placeholder="New module title..."
            class="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 outline-none focus:border-violet-300"
          />
          <button 
            @click="handleAddModule(course.id)"
            class="bg-violet-100 text-violet-600 px-4 py-2 rounded-xl font-bold hover:bg-violet-200 transition-colors"
          >
            Add
          </button>
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

    <!-- Add/Edit Course Modal -->
    <div v-if="showCourseModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showCourseModal = false"></div>
      
      <div class="relative bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl">
        <h2 class="text-2xl font-bold mb-6">{{ editingCourseId ? 'Edit Course' : 'Add New Course' }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Course Name</label>
            <input 
              v-model="courseFormData.name"
              type="text" 
              placeholder="e.g. Human-Computer Interaction"
              class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-violet-300"
            />
          </div>
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Exam Date</label>
            <input 
              v-model="courseFormData.examDate"
              type="date" 
              class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-violet-300"
            />
          </div>
        </div>
        
        <div class="flex gap-4 mt-8">
          <button 
            @click="showCourseModal = false"
            class="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleSaveCourse"
            class="flex-1 bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-colors"
          >
            {{ editingCourseId ? 'Save Changes' : 'Create Course' }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Plus, BookOpen, Calendar, Trash2, FileText, X, Pencil } from "lucide-vue-next";
import { useCourseStore } from "../stores/course";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const courseStore = useCourseStore();

const showCourseModal = ref(false);
const editingCourseId = ref(null);
const courseFormData = reactive({
  name: "",
  examDate: ""
});

const openAddCourseModal = () => {
  editingCourseId.value = null;
  courseFormData.name = "";
  courseFormData.examDate = "";
  showCourseModal.value = true;
};

const openEditCourseModal = (course) => {
  editingCourseId.value = course.id;
  courseFormData.name = course.name;
  courseFormData.examDate = course.examDate;
  showCourseModal.value = true;
};

const handleSaveCourse = () => {
  if (courseFormData.name && courseFormData.examDate) {
    if (editingCourseId.value) {
      courseStore.updateCourse(editingCourseId.value, courseFormData.name, courseFormData.examDate);
    } else {
      courseStore.addCourse(courseFormData.name, courseFormData.examDate);
    }
    showCourseModal.value = false;
  }
};

const newModuleTitles = reactive({});

// Module editing
const editingModuleId = ref(null);
const editingModuleTitle = ref("");

const startEditingModule = (module) => {
  editingModuleId.value = module.id;
  editingModuleTitle.value = module.title;
};

const handleUpdateModuleTitle = (courseId, moduleId) => {
  if (editingModuleTitle.value.trim()) {
    courseStore.updateModuleTitle(courseId, moduleId, editingModuleTitle.value.trim());
  }
  editingModuleId.value = null;
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

const handleAddModule = (courseId) => {
  const title = newModuleTitles[courseId];
  if (title && title.trim()) {
    courseStore.addModule(courseId, title.trim());
    newModuleTitles[courseId] = "";
  }
};
</script>
