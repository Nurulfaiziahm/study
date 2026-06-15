# Study Dashboard Implementation Plan

## Background & Motivation
The objective is to implement a functional, local-first Study Dashboard based on the existing UI scaffolding. The application will track courses, modules, study sessions (Pomodoro), and notes, persisting all data to the browser's `localStorage` via VueUse for immediate usability, with a structure that allows future migration to a backend.

## Scope & Impact
This phase focuses on wiring up the state management and core business logic without needing a backend server. Key additions include a dynamic timer, hybrid calendar scheduling, note-taking, and dynamic dashboard metrics.

## Proposed Solution

### 1. Storage & State Management
- **Library:** Integrate `@vueuse/core` (`useLocalStorage`) directly within Pinia stores to automatically persist reactive state to `localStorage`.
- **Stores:** Split logic into modular stores:
  - `useCourseStore`: Manages courses, modules, and notes.
  - `useSettingsStore`: Manages user preferences (target hours) and study history.
  - `useFocusStore`: Manages the active Pomodoro/Timer session state.

### 2. Data Models (Pinia State)
*   **Settings:**
    *   `targetStudyHoursPerDay`: Number (User preference).
*   **Course:**
    *   `id`: String (UUID)
    *   `name`: String
    *   `examDate`: Date string (Drives the "Days to Exam" stat)
    *   `modules`: Array of Module Objects
*   **Module:**
    *   `id`: String (UUID)
    *   `title`: String
    *   `status`: String (enum: 'notStarted', 'needsReview', 'proficient', 'mastered')
    *   `scheduledDate`: Date string (Assigned auto or manual)
    *   `notes`: Array of Note Objects (`id`, `content`, `createdAt`)
*   **Timer State (`useFocusStore`):**
    *   `selectedMode`: String (e.g., "deep_work")
    *   `isRunning`: Boolean
    *   `isPaused`: Boolean
    *   `startTime`: Date string | null
    *   `endTime`: Date string | null
    *   `remainingSeconds`: Number
    *   `modes`: Array of Mode Objects (`id`, `name`, `durationMinutes`)
*   **Study Session (History Logs):**
    *   `id`: String
    *   `moduleId`: String
    *   `durationMinutes`: Number
    *   `date`: Date string

### 2.5 Derived State & Analytics (Pinia Getters)
To keep the dashboard updated without duplicating data, these values will be **dynamically computed** (Pinia getters) from the base state (Courses, Modules, Settings, and Study Sessions).

*   **Dashboard Metrics (`dashboard`):**
    *   `totalModules`: Count of all modules across all courses.
    *   `completedModules`: Count of modules where status is `mastered`.
    *   `remainingModules`: `totalModules - completedModules`.
    *   `masteryPercentage`: `(completedModules / totalModules) * 100`.
    *   `daysUntilExams`: Lowest positive difference between today and all course `examDate`s.
    *   `dailyModuleGoal`: `remainingModules / Math.max(1, daysUntilExams)`.
    *   `dailySessionGoal`: User setting (e.g., target sessions per day).
    *   `completedSessionsToday`: Count of `Study Session` logs matching today's date.
    *   `remainingSessionsToday`: `dailySessionGoal - completedSessionsToday`.

*   **Analytics Metrics (`analytics`):**
    *   `targetProgressPercentage`: `(completedSessionsToday / dailySessionGoal) * 100`.
    *   `targetGap`: `dailySessionGoal - completedSessionsToday`.
    *   `studyHoursThisWeek`: Sum of session `durationMinutes` in the last 7 days / 60.
    *   `studyHoursThisMonth`: Sum of session `durationMinutes` in the current month / 60.
    *   `averageMastery`: Weighted average of module statuses (e.g., mastered=100%, proficient=75%, needsReview=25%, notStarted=0%).
    *   `masteryDistribution`: Object grouping module counts by their exact `status`.
    *   `weeklyStudyHours`: Array of study hours per day for the last 7 days (for charting).
    *   `monthlyStudyHours`: Array of study hours per day for the last 30 days (for charting).

### 3. Core Features Implementation
*   **Focus Study Mode (Dynamic Timer):**
    *   Build a component supporting multiple timer modes (e.g., Deep Work (50m), Pomodoro (25m), Quick Review (15m)).
    *   User selects a mode and a Course -> Module before starting.
    *   Timer supports pause/resume functionality.
    *   Upon completion, log time to `Study Sessions` history and update daily progress.
*   **Courses Management:**
    *   Create UI (modal or new page) to CRUD courses and define their exam dates.
    *   Create UI to manage modules within a course, including the ability to update a module's status (`notStarted`, `needsReview`, `proficient`, `mastered`).
*   **Calendar / Scheduling (Hybrid):**
    *   **Auto-suggest:** Write a utility function that evenly distributes incomplete modules across remaining days before the `examDate`, respecting the user's `targetStudyHoursPerDay`.
    *   **Manual Adjustment:** Create a calendar or list view where users can manually override a module's `scheduledDate`.
*   **Notes System:**
    *   A rich text or simple markdown area attached to each module. Viewable via a nested navigation (Courses -> Modules -> Notes).

---

## Step-by-Step Implementation Plan

### Phase 1: Setup and State Management Foundation
1.  **Install Dependencies:** Run `npm install @vueuse/core uuid` to add required libraries for local storage and ID generation.
2.  **Initialize Pinia Stores:** 
    *   Create `src/stores/course.js` to manage courses, modules, and notes using `useLocalStorage`.
    *   Create `src/stores/settings.js` to manage user preferences and study sessions history.
    *   Create `src/stores/focus.js` to manage the dynamic timer state.

### Phase 2: Derived State & Dashboard UI Wiring
1.  **Implement Pinia Getters:** In the respective stores, write the computed properties (getters) for all the metrics outlined in section 2.5 (e.g., `totalModules`, `daysUntilExams`, `studyHoursThisWeek`).
2.  **Update Dashboard Components:** Modify `DashboardView.vue` and its child components (`StatCard`, `SemesterProgressCard`, etc.) to consume the live getters from Pinia instead of static data.

### Phase 3: Course and Module Management
1.  **Course UI:** Create a view/component to add, edit, and delete Courses, including setting the `examDate`.
2.  **Module UI:** Create an interface inside the Course view to manage Modules, allowing users to add modules and update their `status` (`notStarted`, `needsReview`, etc.).

### Phase 4: Focus Mode (Timer) & Study Sessions
1.  **Timer Logic:** Implement the dynamic timer in `focus.js` and `FocusCard.vue`, supporting the different modes (Deep Work, Pomodoro, Quick Review) and play/pause functionality.
2.  **Session Logging:** Upon timer completion, dispatch an action to log the study session (saving `moduleId`, `durationMinutes`, and `date`) in the `settings.js` store, which will automatically update the dashboard metrics.

### Phase 5: Calendar Scheduling and Notes
1.  **Auto-Scheduling Algorithm:** Implement the logic to distribute remaining modules evenly before the exam date.
2.  **Calendar UI:** Build a simple calendar or list view for users to see and manually adjust scheduled modules.
3.  **Notes UI:** Add a text area component for taking notes on specific modules, saving them to the module's `notes` array in the store.

## Verification & Testing
- Verify that refreshing the page retains all state (courses, notes, settings) via LocalStorage.
- Ensure the "Days to Exam" dynamically updates based on the current date and the nearest course exam date.
- Test the auto-scheduling algorithm to ensure it doesn't assign modules past the exam date.
- Verify timer completion correctly logs time to the user's daily progress.

## Alternatives Considered
- **Custom LocalStorage Wrapper:** Considered building a custom API-like wrapper to simulate backend calls. Rejected in favor of VueUse + Pinia for faster iteration and seamless Vue reactivity, acknowledging a store refactor will be needed later when moving to a real DB.