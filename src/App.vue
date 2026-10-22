<template>
  <div id="app" class="min-h-screen text-black flex flex-col font-sans bg-gray-50">

    <!-- Header: COEA Logo, System Title, User Profile & Logout -->
    <header
        v-if="currentUser"
        class="bg-white border-b border-gray-300 p-4 px-6 flex justify-between items-center gap-4 shadow-sm"
    >
      <div
          class="flex items-center gap-3 min-w-0 cursor-pointer"
          @click="currentView = 'dashboard'"
      >
        <img
            src="/coealogo.png"
            alt="COEA Logo"
            class="w-12 h-12 object-contain shrink-0"
        />
        <h1 class="text-lg md:text-xl font-bold tracking-tight text-black">
          COEA Attendance Management System
        </h1>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <div class="hidden sm:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full border border-gray-300">
          <i class="fa-solid fa-user text-gray-700"></i>
          <span class="text-sm font-semibold text-gray-900">
            {{ currentUser.firstName }} {{ currentUser.lastName }}
          </span>
        </div>
        <button
            @click="logout"
            class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow transition duration-200 text-sm"
        >
          <i class="fa-solid fa-right-from-bracket mr-2"></i>Logout
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow p-6">

      <!-- VIEW 1: LOGIN / REGISTER -->
      <div v-if="currentView === 'login'" class="flex justify-center items-center h-[85vh]">
        <div class="bg-white border border-gray-300 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-extrabold text-black leading-tight">Attendance Management System</h2>
            <p class="text-gray-600 font-semibold text-sm mt-1">College of Engineering and Architecture</p>
          </div>

          <!-- Alert Messages -->
          <div v-if="authError" class="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-xs text-center font-bold">
            {{ authError }}
          </div>
          <div v-if="authSuccess" class="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-xs text-center font-bold">
            {{ authSuccess }}
          </div>

          <!-- LOGIN FORM -->
          <form v-if="!isRegistering" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                  v-model="loginUsername"
                  type="text"
                  required
                  placeholder="Enter username"
                  class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-black focus:outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div class="relative">
                <input
                    v-model="loginPassword"
                    :type="showLoginPassword ? 'text' : 'password'"
                    required
                    placeholder="Enter password"
                    class="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-gray-300 text-black focus:outline-none focus:border-black transition"
                />
                <button
                    type="button"
                    @click="showLoginPassword = !showLoginPassword"
                    class="absolute right-3 top-3.5 text-gray-600 hover:text-black focus:outline-none"
                >
                  <i :class="showLoginPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="flex space-x-3 pt-2">
              <button
                  type="submit"
                  class="flex-1 py-3 rounded-lg bg-black hover:bg-gray-800 text-white font-bold shadow transition duration-200"
              >
                Log In
              </button>
              <button
                  type="button"
                  @click="openRegister"
                  class="flex-1 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-black font-bold border border-gray-300 shadow transition duration-200"
              >
                Create Account
              </button>
            </div>
          </form>

          <!-- CREATE ACCOUNT FORM -->
          <form v-else @submit.prevent="handleRegister" class="space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                <input
                    v-model="regFirstName"
                    type="text"
                    required
                    placeholder="e.g. Juan"
                    class="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-black text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Middle Initial</label>
                <input
                    v-model="regMiddleInitial"
                    type="text"
                    maxlength="2"
                    placeholder="e.g. D."
                    class="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-black text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                  v-model="regLastName"
                  type="text"
                  required
                  placeholder="e.g. Dela Cruz"
                  class="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Username</label>
              <input
                  v-model="regUsername"
                  type="text"
                  required
                  placeholder="Create username"
                  class="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-black text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div class="relative">
                <input
                    v-model="regPassword"
                    :type="showRegPassword ? 'text' : 'password'"
                    required
                    placeholder="Create password"
                    class="w-full px-3 py-2 pr-10 rounded-lg bg-gray-50 border border-gray-300 text-black text-sm focus:outline-none focus:border-black"
                />
                <button
                    type="button"
                    @click="showRegPassword = !showRegPassword"
                    class="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                >
                  <i :class="showRegPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="flex space-x-3 pt-3">
              <button
                  type="button"
                  @click="isRegistering = false"
                  class="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black text-sm font-bold border border-gray-300"
              >
                Cancel / Back
              </button>
              <button
                  type="submit"
                  class="flex-1 py-2.5 rounded-lg bg-black hover:bg-gray-800 text-white text-sm font-bold shadow"
              >
                Submit Account
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- VIEW 2: DASHBOARD (Programs) -->
      <div v-else-if="currentView === 'dashboard'" class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h2 class="text-3xl font-extrabold text-black">Academic Programs</h2>
          <p class="text-gray-600 font-medium">College of Engineering and Architecture</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="program in programs"
              :key="program"
              @click="selectProgram(program)"
              class="bg-white border border-gray-300 hover:border-black p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition duration-200 flex flex-col justify-between group"
          >
            <div>
              <h3 class="text-lg font-bold text-black group-hover:text-gray-700 transition">{{ program }}</h3>
            </div>
            <div class="mt-6 flex justify-between items-center text-gray-700 font-semibold text-sm">
              <span>Select Program</span>
              <i class="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 3: PROGRAM VIEW (Year Levels) -->
      <div v-else-if="currentView === 'program'" class="max-w-4xl mx-auto">
        <button
            @click="currentView = 'dashboard'"
            class="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-lg text-black hover:bg-gray-100 flex items-center space-x-2 font-semibold shadow-sm transition"
        >
          <i class="fa-solid fa-arrow-left"></i><span>Back to Programs</span>
        </button>

        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-black">{{ selectedProgram }}</h2>
          <button
              @click="showYearModal = true"
              class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            <i class="fa-solid fa-plus mr-2"></i>Add Year Level
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
              v-for="year in currentYearLevels"
              :key="year"
              class="bg-white border border-gray-300 hover:border-black p-5 rounded-xl flex justify-between items-center transition shadow-sm group"
          >
            <span
                @click="selectYear(year)"
                class="text-lg font-semibold text-black cursor-pointer group-hover:text-gray-700 flex-grow"
            >
              {{ year }}
            </span>
            <div class="flex items-center space-x-3">
              <button
                  @click.stop="deleteYearLevel(year)"
                  class="text-gray-400 hover:text-red-600 p-2 transition"
                  title="Delete Year Level"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
              <i @click="selectYear(year)" class="fa-solid fa-chevron-right text-gray-400 cursor-pointer"></i>
            </div>
          </div>

          <div
              v-if="currentYearLevels.length === 0"
              class="col-span-2 text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200"
          >
            No year levels added yet. Click 'Add Year Level'.
          </div>
        </div>

        <!-- Add Year Modal -->
        <div v-if="showYearModal" class="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div class="bg-white border border-gray-300 p-6 rounded-xl w-full max-w-sm shadow-2xl">
            <h3 class="text-lg font-bold mb-4 text-black">Add Year Level</h3>
            <select
                v-model="newYearInput"
                class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-4 text-black focus:outline-none focus:border-black"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
            </select>
            <div class="flex justify-end space-x-3">
              <button
                  @click="showYearModal = false"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-black"
              >
                Cancel
              </button>
              <button
                  @click="addYearLevel"
                  class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 4: YEAR LEVEL VIEW (Courses) -->
      <div v-else-if="currentView === 'yearLevel'" class="max-w-5xl mx-auto">
        <button
            @click="currentView = 'program'"
            class="mb-6 bg-white border border-gray-300 px-4 py-2 rounded-lg text-black hover:bg-gray-100 flex items-center space-x-2 font-semibold shadow-sm transition"
        >
          <i class="fa-solid fa-arrow-left"></i><span>Back to Year Levels</span>
        </button>

        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-black">{{ selectedYearLevel }} Courses</h2>
            <p class="text-gray-500 text-sm">{{ selectedProgram }}</p>
          </div>
          <button
              @click="showCourseModal = true"
              class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            <i class="fa-solid fa-plus mr-2"></i>Add Course
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
              v-for="course in filteredCourses"
              :key="course.id"
              class="bg-white border border-gray-300 hover:border-black p-5 rounded-xl flex justify-between items-center transition shadow-sm group"
          >
            <div @click="selectCourse(course)" class="cursor-pointer flex-grow">
              <span class="text-gray-500 font-mono text-xs font-bold block mb-1">{{ course.code }}</span>
              <h3 class="text-lg font-semibold text-black group-hover:text-gray-700 transition">{{ course.name }}</h3>
            </div>
            <div class="flex items-center space-x-3">
              <button
                  @click.stop="deleteCourse(course.id)"
                  class="text-gray-400 hover:text-red-600 p-2 transition"
                  title="Delete Course"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
              <i @click="selectCourse(course)" class="fa-solid fa-chevron-right text-gray-400 cursor-pointer"></i>
            </div>
          </div>

          <div
              v-if="filteredCourses.length === 0"
              class="col-span-2 text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200"
          >
            No courses added for this year level yet. Click 'Add Course'.
          </div>
        </div>

        <!-- Add Course Modal -->
        <div v-if="showCourseModal" class="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div class="bg-white border border-gray-300 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 class="text-lg font-bold mb-4 text-black">Input Course Details</h3>
            <input
                v-model="newCourseCode"
                type="text"
                placeholder="Course ID / Code (e.g. CE 101)"
                class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-3 text-black focus:outline-none focus:border-black"
            />
            <input
                v-model="newCourseName"
                type="text"
                placeholder="Course Name (e.g. Structural Theory)"
                class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-4 text-black focus:outline-none focus:border-black"
            />
            <div class="flex justify-end space-x-3">
              <button
                  @click="showCourseModal = false"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-black"
              >
                Cancel
              </button>
              <button
                  @click="addCourse"
                  class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 5: ATTENDANCE & STUDENT MANAGEMENT -->
      <div v-else-if="currentView === 'attendance'" class="max-w-6xl mx-auto">
        <button
            @click="currentView = 'yearLevel'"
            class="mb-4 bg-white border border-gray-300 px-4 py-2 rounded-lg text-black hover:bg-gray-100 flex items-center space-x-2 font-semibold shadow-sm transition"
        >
          <i class="fa-solid fa-arrow-left"></i><span>Back to Courses</span>
        </button>

        <!-- Upper Box Summary -->
        <div class="bg-white border border-gray-300 p-6 rounded-2xl shadow-md mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <span class="text-black font-mono text-sm font-bold bg-gray-100 px-3 py-1 rounded-md border border-gray-300">
                Course Code: {{ selectedCourse?.code || '' }}
              </span>
              <h2 class="text-2xl font-bold mt-2 text-black">
                Course Name: {{ selectedCourse?.name || '' }}
              </h2>
            </div>
            <div class="flex items-center space-x-3 bg-gray-100 p-2 rounded-xl border border-gray-300">
              <label class="text-sm font-medium text-gray-700 pl-2">
                <i class="fa-solid fa-calendar-days mr-2 text-black"></i>Date:
              </label>
              <input
                  v-model="selectedDate"
                  type="date"
                  class="px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-black text-sm"
              />
            </div>
          </div>

          <!-- Upper Box Totals -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center">
              <span class="text-gray-500 text-[10px] block uppercase font-bold tracking-wider">Present</span>
              <span class="text-xl font-extrabold text-black mt-1 block">{{ totalPresentCount }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center">
              <span class="text-gray-500 text-[10px] block uppercase font-bold tracking-wider">Absents</span>
              <span class="text-xl font-extrabold text-black mt-1 block">{{ totalAbsentCount }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center">
              <span class="text-gray-500 text-[10px] block uppercase font-bold tracking-wider">Lates</span>
              <span class="text-xl font-extrabold text-black mt-1 block">{{ totalLateCount }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center">
              <span class="text-gray-500 text-[10px] block uppercase font-bold tracking-wider">Excuses</span>
              <span class="text-xl font-extrabold text-black mt-1 block">{{ totalExcuseCount }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center">
              <span class="text-gray-500 text-[10px] block uppercase font-bold tracking-wider">Dropped</span>
              <span class="text-xl font-extrabold text-black mt-1 block">{{ totalDroppedCount }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 text-center">
              <span class="text-gray-500 text-[10px] block uppercase font-bold tracking-wider">Tracker Date</span>
              <span class="text-xs font-bold text-black mt-2 block truncate">{{ selectedDate }}</span>
            </div>
          </div>

          <!-- Session Save & History Actions -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <button
                @click="saveCurrentSession"
                class="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-bold shadow transition text-sm flex items-center"
            >
              <i class="fa-solid fa-floppy-disk mr-2"></i>Save Session Attendance
            </button>
            <button
                @click="showHistoryModal = true"
                class="bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-lg font-semibold border border-gray-300 shadow-sm text-sm flex items-center transition"
            >
              <i class="fa-solid fa-clock-rotate-left mr-2"></i>View Class History Logs
            </button>
          </div>
        </div>

        <!-- Student Addition Header -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-black">Student Attendance Roster (Alphabetically Sorted)</h3>
          <button
              @click="showStudentModal = true"
              class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow text-sm transition"
          >
            <i class="fa-solid fa-user-plus mr-2"></i>Add Student
          </button>
        </div>

        <!-- Student Table -->
        <div class="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-gray-100 text-black text-xs uppercase tracking-wider border-b border-gray-300">
              <th class="p-4">Student ID</th>
              <th class="p-4">Last Name</th>
              <th class="p-4">First Name</th>
              <th class="p-4">Middle Name</th>
              <th class="p-4 text-center">Attendance Buttons</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="student in sortedCourseStudents"
                :key="student.id"
                class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="p-4 font-mono text-sm text-gray-700">{{ student.studentId }}</td>
              <td class="p-4 font-semibold text-black">{{ student.lastName }}</td>
              <td class="p-4 text-gray-800">{{ student.firstName }}</td>
              <td class="p-4 text-gray-600">{{ student.middleName }}</td>
              <td class="p-4 text-center">
                <div class="inline-flex space-x-1.5">
                  <button @click="markAttendance(student.studentId, 'Present')" :class="getBtnClass(student.studentId, 'Present')">Present</button>
                  <button @click="markAttendance(student.studentId, 'Late')" :class="getBtnClass(student.studentId, 'Late')">Late</button>
                  <button @click="markAttendance(student.studentId, 'Absent')" :class="getBtnClass(student.studentId, 'Absent')">Absent</button>
                  <button @click="markAttendance(student.studentId, 'Excuse')" :class="getBtnClass(student.studentId, 'Excuse')">Excuse</button>
                </div>
              </td>
              <td class="p-4 text-center space-x-2">
                <button
                    @click="viewStudentInfo(student)"
                    class="bg-white hover:bg-gray-100 text-black px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 shadow-sm transition"
                >
                  <i class="fa-solid fa-eye mr-1"></i>View
                </button>
                <button
                    @click="deleteStudent(student.id)"
                    class="bg-white hover:bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 shadow-sm transition"
                    title="Delete Student"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
            <tr v-if="sortedCourseStudents.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-500">
                No students added to this course yet. Click 'Add Student'.
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Student Modal -->
        <div v-if="showStudentModal" class="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div class="bg-white border border-gray-300 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 class="text-lg font-bold mb-4 text-black">Add Student Details</h3>
            <input v-model="newStudentId" type="text" placeholder="Student ID" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-3 text-black focus:outline-none focus:border-black" />
            <input v-model="newLastName" type="text" placeholder="Student Last Name" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-3 text-black focus:outline-none focus:border-black" />
            <input v-model="newFirstName" type="text" placeholder="Student First Name" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-3 text-black focus:outline-none focus:border-black" />
            <input v-model="newMiddleName" type="text" placeholder="Student Middle Name" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-4 text-black focus:outline-none focus:border-black" />
            <div class="flex justify-end space-x-3">
              <button @click="showStudentModal = false" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-black">Cancel</button>
              <button @click="addStudent" class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold">Add Student</button>
            </div>
          </div>
        </div>

        <!-- View Info Modal -->
        <div v-if="showInfoModal && selectedStudent" class="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div class="bg-white border border-gray-300 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 class="text-xl font-bold text-black mb-1">Student Personal Information</h3>
            <p class="text-xs text-gray-500 mb-4">Course attendance standing & rule calculations</p>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-300 space-y-2.5 mb-5 text-sm">
              <p>
                <span class="text-gray-500">Full Name:</span>
                <strong class="text-black">{{ selectedStudent.lastName }}, {{ selectedStudent.firstName }} {{ selectedStudent.middleName }}</strong>
              </p>
              <p>
                <span class="text-gray-500">Student ID:</span>
                <strong class="text-black font-mono">{{ selectedStudent.studentId }}</strong>
              </p>
              <hr class="border-gray-200 my-2">
              <p class="flex justify-between">
                <span>Number of Present:</span>
                <strong class="text-black">{{ getStudentStats(selectedStudent.studentId).present }}</strong>
              </p>
              <p class="flex justify-between">
                <span>Number of Absents:</span>
                <strong class="text-black">{{ getStudentStats(selectedStudent.studentId).absent }}</strong>
              </p>
              <p class="flex justify-between">
                <span>Number of Lates:</span>
                <strong class="text-black">{{ getStudentStats(selectedStudent.studentId).late }}</strong>
              </p>
              <p class="flex justify-between">
                <span>Number of Excuses:</span>
                <strong class="text-black">{{ getStudentStats(selectedStudent.studentId).excuse }}</strong>
              </p>

              <div class="mt-4 p-3 rounded-lg bg-gray-100 border border-gray-300 text-xs space-y-1.5">
                <p>
                  <strong>Computed Total Absences:</strong>
                  {{ getStudentStats(selectedStudent.studentId).computedAbsences }}
                  <span class="text-gray-500">(3 lates = 1 absent)</span>
                </p>
                <div
                    v-if="getStudentStats(selectedStudent.studentId).computedAbsences >= 3"
                    class="p-2 bg-black text-white rounded font-bold text-center mt-2"
                >
                  ⚠️ STATUS: DROPPED (Accumulated 3+ Absences)
                </div>
                <div
                    v-else
                    class="p-2 bg-gray-200 border border-gray-400 rounded text-black font-semibold text-center mt-2"
                >
                  ✅ STATUS: Enrolled / Active
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <button @click="showInfoModal = false" class="px-4 py-2 bg-black hover:bg-gray-800 rounded-lg font-semibold text-white transition">Close</button>
            </div>
          </div>
        </div>

        <!-- Session History Modal -->
        <div v-if="showHistoryModal" class="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50">
          <div class="bg-white border border-gray-300 p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col">
            <h3 class="text-xl font-bold text-black mb-2">Saved Class History Logs</h3>
            <p class="text-xs text-gray-500 mb-4">Review all final session records saved for this course.</p>

            <div class="overflow-y-auto flex-grow space-y-3 pr-1">
              <div v-for="sessionDate in courseSavedDates" :key="sessionDate" class="bg-gray-50 p-4 rounded-xl border border-gray-300 flex justify-between items-center">
                <div>
                  <span class="text-black font-bold text-sm block">
                    <i class="fa-solid fa-calendar-check mr-2 text-gray-700"></i>{{ sessionDate }}
                  </span>
                  <span class="text-xs text-gray-500">Status: Saved & Recorded</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                      @click="loadSessionDate(sessionDate)"
                      class="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    Load Date
                  </button>
                  <button
                      @click="deleteSession(sessionDate)"
                      class="bg-white hover:bg-gray-100 text-black px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 shadow-sm transition"
                      title="Delete Log"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div v-if="courseSavedDates.length === 0" class="text-center py-8 text-gray-500">
                No session logs saved yet for this course. Click 'Save Session Attendance'.
              </div>
            </div>

            <div class="flex justify-end mt-4 pt-3 border-t border-gray-200">
              <button
                  @click="showHistoryModal = false"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from './api'

interface UserAccount {
  id: number
  username: string
  firstName: string
  middleInitial: string
  lastName: string
}

interface Course {
  id: number
  code: string
  name: string
  program: string
  yearLevel: string
}

interface Student {
  id: number
  courseId: number
  studentId: string
  lastName: string
  firstName: string
  middleName: string
}

type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excuse'

interface AttendanceRecord {
  courseId: number
  studentId: string
  date: string
  status: AttendanceStatus
}

const fail = (e: unknown): void => {
  alert(e instanceof Error ? e.message : String(e))
}

// ---------- Auth state ----------
const storedUser = localStorage.getItem('currentUserAccount')
const currentUser = ref<UserAccount | null>(
    storedUser ? JSON.parse(storedUser) : null
)
const currentView = ref<string>(currentUser.value ? 'dashboard' : 'login')

const isRegistering = ref<boolean>(false)
const loginUsername = ref<string>('')
const loginPassword = ref<string>('')
const showLoginPassword = ref<boolean>(false)

const regFirstName = ref<string>('')
const regMiddleInitial = ref<string>('')
const regLastName = ref<string>('')
const regUsername = ref<string>('')
const regPassword = ref<string>('')
const showRegPassword = ref<boolean>(false)

const authError = ref<string>('')
const authSuccess = ref<string>('')

const programs: string[] = [
  'Bachelor of Science in Architecture',
  'Bachelor of Science in Civil Engineering',
  'Bachelor of Science in Electrical Engineering',
  'Bachelor of Science in Computer Engineering',
  'Bachelor of Science in Electronics Engineering',
  'Bachelor of Science in Agricultural and Biosystems Engineering',
  'Bachelor of Science in Chemical Engineering',
  'Bachelor of Science in Geodetic Engineering'
]

// ---------- Navigation / UI state ----------
const selectedProgram = ref<string>('')
const selectedYearLevel = ref<string>('')
const selectedCourse = ref<Course | null>(null)
const selectedDate = ref<string>(new Date().toISOString().split('T')[0] ?? '')

const showYearModal = ref<boolean>(false)
const showCourseModal = ref<boolean>(false)
const showStudentModal = ref<boolean>(false)
const showInfoModal = ref<boolean>(false)
const showHistoryModal = ref<boolean>(false)
const selectedStudent = ref<Student | null>(null)

const newYearInput = ref<string>('1st Year')
const newCourseCode = ref<string>('')
const newCourseName = ref<string>('')
const newStudentId = ref<string>('')
const newLastName = ref<string>('')
const newFirstName = ref<string>('')
const newMiddleName = ref<string>('')

// ---------- Data loaded from the backend ----------
const yearLevels = ref<Record<string, string[]>>({})
const courses = ref<Course[]>([])
const students = ref<Student[]>([])
const attendanceLogs = ref<Record<string, Record<string, AttendanceStatus>>>({})
const savedDates = ref<string[]>([])

// ================= AUTH =================
const openRegister = (): void => {
  isRegistering.value = true
  authError.value = ''
  authSuccess.value = ''
}

const handleRegister = async (): Promise<void> => {
  authError.value = ''
  authSuccess.value = ''

  const fName = regFirstName.value.trim()
  const mInit = regMiddleInitial.value.trim()
  const lName = regLastName.value.trim()
  const uname = regUsername.value.trim()
  const pword = regPassword.value.trim()

  if (!fName || !lName || !uname || !pword) {
    authError.value = 'Please complete all required fields.'
    return
  }

  try {
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: uname,
        password: pword,
        firstName: fName,
        middleInitial: mInit,
        lastName: lName
      })
    })

    authSuccess.value = 'Account created successfully! You can now log in.'
    isRegistering.value = false
    loginUsername.value = uname
    regFirstName.value = ''
    regMiddleInitial.value = ''
    regLastName.value = ''
    regUsername.value = ''
    regPassword.value = ''
  } catch (e) {
    authError.value = e instanceof Error ? e.message : 'Registration failed.'
  }
}

const handleLogin = async (): Promise<void> => {
  authError.value = ''
  authSuccess.value = ''

  const uname = loginUsername.value.trim()
  const pword = loginPassword.value.trim()

  if (!uname || !pword) {
    authError.value = 'Please enter username and password.'
    return
  }

  try {
    const user = await api<UserAccount>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: uname, password: pword })
    })

    currentUser.value = user
    localStorage.setItem('currentUserAccount', JSON.stringify(user))
    currentView.value = 'dashboard'
  } catch (e) {
    authError.value = e instanceof Error ? e.message : 'Login failed.'
  }
}

const logout = (): void => {
  currentUser.value = null
  localStorage.removeItem('currentUserAccount')
  currentView.value = 'login'
  loginUsername.value = ''
  loginPassword.value = ''
}

// ================= PROGRAMS / YEAR LEVELS =================
const loadYearLevels = async (program: string): Promise<void> => {
  try {
    yearLevels.value[program] = await api<string[]>(
        `/year-levels?program=${encodeURIComponent(program)}`
    )
  } catch (e) {
    fail(e)
  }
}

const selectProgram = async (program: string): Promise<void> => {
  selectedProgram.value = program
  currentView.value = 'program'
  await loadYearLevels(program)
}

const currentYearLevels = computed<string[]>(() => {
  const prog = selectedProgram.value
  if (!prog) return []
  return yearLevels.value[prog] || []
})

const addYearLevel = async (): Promise<void> => {
  const prog = selectedProgram.value
  if (!prog) return

  try {
    await api('/year-levels', {
      method: 'POST',
      body: JSON.stringify({
        program: prog,
        yearLevel: newYearInput.value
      })
    })

    await loadYearLevels(prog)
    showYearModal.value = false
  } catch (e) {
    fail(e)
  }
}

const deleteYearLevel = async (yearToDelete: string): Promise<void> => {
  const prog = selectedProgram.value
  if (!prog) return
  if (!confirm(`Are you sure you want to delete ${yearToDelete}?`)) return

  try {
    await api(
        `/year-levels?program=${encodeURIComponent(prog)}&year_level=${encodeURIComponent(yearToDelete)}`,
        { method: 'DELETE' }
    )
    await loadYearLevels(prog)
  } catch (e) {
    fail(e)
  }
}

// ================= COURSES =================
const loadCourses = async (): Promise<void> => {
  try {
    courses.value = await api<Course[]>(
        `/courses?program=${encodeURIComponent(selectedProgram.value)}&year_level=${encodeURIComponent(selectedYearLevel.value)}`
    )
  } catch (e) {
    fail(e)
  }
}

const selectYear = async (year: string): Promise<void> => {
  selectedYearLevel.value = year
  currentView.value = 'yearLevel'
  await loadCourses()
}

const filteredCourses = computed<Course[]>(() => courses.value)

const addCourse = async (): Promise<void> => {
  const code = newCourseCode.value.trim()
  const name = newCourseName.value.trim()

  if (!code || !name || !selectedProgram.value || !selectedYearLevel.value) return

  try {
    await api('/courses', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        program: selectedProgram.value,
        yearLevel: selectedYearLevel.value
      })
    })

    newCourseCode.value = ''
    newCourseName.value = ''
    showCourseModal.value = false
    await loadCourses()
  } catch (e) {
    fail(e)
  }
}

const deleteCourse = async (courseId: number): Promise<void> => {
  if (!confirm('Are you sure you want to delete this course?')) return

  try {
    await api(`/courses/${courseId}`, { method: 'DELETE' })
    await loadCourses()
  } catch (e) {
    fail(e)
  }
}

// ================= STUDENTS / ATTENDANCE LOADING =================
const loadStudents = async (courseId: number): Promise<void> => {
  students.value = await api<Student[]>(`/students?course_id=${courseId}`)
}

const loadAttendance = async (courseId: number): Promise<void> => {
  const records = await api<AttendanceRecord[]>(`/attendance?course_id=${courseId}`)
  const logs: Record<string, Record<string, AttendanceStatus>> = {}

  for (const r of records) {
    const key = `${courseId}_${r.date}`
    if (!logs[key]) logs[key] = {}
    logs[key][r.studentId] = r.status
  }

  attendanceLogs.value = logs
}

const loadSessions = async (courseId: number): Promise<void> => {
  savedDates.value = await api<string[]>(`/sessions?course_id=${courseId}`)
}

const selectCourse = async (course: Course): Promise<void> => {
  selectedCourse.value = course
  currentView.value = 'attendance'

  try {
    await Promise.all([
      loadStudents(course.id),
      loadAttendance(course.id),
      loadSessions(course.id)
    ])
  } catch (e) {
    fail(e)
  }
}

const courseStudents = computed<Student[]>(() => students.value)

const sortedCourseStudents = computed<Student[]>(() => {
  return [...courseStudents.value].sort((a, b) =>
      a.lastName.localeCompare(b.lastName, undefined, { sensitivity: 'base' })
  )
})

// ================= STUDENT MANAGEMENT =================
const addStudent = async (): Promise<void> => {
  const course = selectedCourse.value
  if (!course) return

  const sId = newStudentId.value.trim()
  const lName = newLastName.value.trim()
  const fName = newFirstName.value.trim()

  if (!sId || !lName || !fName) return

  try {
    await api('/students', {
      method: 'POST',
      body: JSON.stringify({
        courseId: course.id,
        studentId: sId,
        lastName: lName,
        firstName: fName,
        middleName: newMiddleName.value.trim()
      })
    })

    newStudentId.value = ''
    newLastName.value = ''
    newFirstName.value = ''
    newMiddleName.value = ''
    showStudentModal.value = false

    await loadStudents(course.id)
  } catch (e) {
    fail(e)
  }
}

const deleteStudent = async (id: number): Promise<void> => {
  if (!confirm('Are you sure you want to remove this student?')) return

  const course = selectedCourse.value
  if (!course) return

  try {
    await api(`/students/${id}`, { method: 'DELETE' })
    await Promise.all([
      loadStudents(course.id),
      loadAttendance(course.id)
    ])
  } catch (e) {
    fail(e)
  }
}

// ================= ATTENDANCE =================
const markAttendance = async (
    studentId: string,
    status: AttendanceStatus
): Promise<void> => {
  const course = selectedCourse.value
  if (!course) return

  const key = `${course.id}_${selectedDate.value}`
  const previous = attendanceLogs.value[key]?.[studentId]

  // Update the screen immediately
  if (!attendanceLogs.value[key]) attendanceLogs.value[key] = {}
  attendanceLogs.value[key][studentId] = status

  try {
    await api('/attendance', {
      method: 'PUT',
      body: JSON.stringify({
        courseId: course.id,
        studentId,
        date: selectedDate.value,
        status
      })
    })
  } catch (e) {
    // Roll back if the server rejected it
    if (previous) {
      attendanceLogs.value[key][studentId] = previous
    } else {
      delete attendanceLogs.value[key][studentId]
    }
    fail(e)
  }
}

const getAttendanceForDate = (studentId: string): AttendanceStatus | null => {
  const course = selectedCourse.value
  if (!course) return null

  const key = `${course.id}_${selectedDate.value}`
  return attendanceLogs.value[key]?.[studentId] || null
}

const getBtnClass = (studentId: string, status: AttendanceStatus): string => {
  const current = getAttendanceForDate(studentId)
  const isActive = current === status
  const base = 'px-2.5 py-1 rounded-md font-semibold text-xs transition border text-center '

  if (isActive) {
    return base + 'bg-black text-white border-black shadow'
  }

  return base + 'bg-white text-black border-gray-300 hover:bg-gray-100'
}

const countByStatus = (status: AttendanceStatus): number => {
  const course = selectedCourse.value
  if (!course) return 0

  const key = `${course.id}_${selectedDate.value}`
  const logs = attendanceLogs.value[key] || {}

  return Object.values(logs).filter((s: string) => s === status).length
}

const totalPresentCount = computed<number>(() => countByStatus('Present'))
const totalAbsentCount = computed<number>(() => countByStatus('Absent'))
const totalLateCount = computed<number>(() => countByStatus('Late'))
const totalExcuseCount = computed<number>(() => countByStatus('Excuse'))

const getStudentStats = (studentId: string) => {
  let present = 0
  let absent = 0
  let late = 0
  let excuse = 0

  const course = selectedCourse.value
  if (!course) {
    return { present, absent, late, excuse, computedAbsences: 0 }
  }

  Object.keys(attendanceLogs.value).forEach((key: string) => {
    if (key.startsWith(`${course.id}_`)) {
      const status = attendanceLogs.value[key]?.[studentId]

      if (status === 'Present') present++
      if (status === 'Absent') absent++
      if (status === 'Late') late++
      if (status === 'Excuse') excuse++
    }
  })

  const computedAbsences = absent + Math.floor(late / 3)
  return { present, absent, late, excuse, computedAbsences }
}

const totalDroppedCount = computed<number>(() => {
  return courseStudents.value.filter(
      (s: Student) => getStudentStats(s.studentId).computedAbsences >= 3
  ).length
})

// ================= SESSIONS =================
const saveCurrentSession = async (): Promise<void> => {
  const course = selectedCourse.value
  if (!course) return

  try {
    await api('/sessions', {
      method: 'POST',
      body: JSON.stringify({
        courseId: course.id,
        date: selectedDate.value
      })
    })

    await loadSessions(course.id)
    alert(`Attendance session for ${selectedDate.value} successfully saved!`)
  } catch (e) {
    fail(e)
  }
}

const courseSavedDates = computed<string[]>(() =>
    [...savedDates.value].sort().reverse()
)

// Load a saved session date into the attendance view
const loadSessionDate = async (dateStr: string): Promise<void> => {
  const course = selectedCourse.value
  if (!course) return

  try {
    selectedDate.value = dateStr
    await loadAttendance(course.id)
    showHistoryModal.value = false
  } catch (e) {
    fail(e)
  }
}

const deleteSession = async (dateStr: string): Promise<void> => {
  const course = selectedCourse.value
  if (!course) return

  if (!confirm(`Delete the saved log for ${dateStr}?`)) return

  const alsoAttendance = confirm(
      `Also delete the attendance marked on ${dateStr}?\n\nOK = delete the attendance too\nCancel = keep the attendance, remove only the log`
  )

  try {
    await api(
        `/sessions?course_id=${course.id}&date=${dateStr}&delete_attendance=${alsoAttendance}`,
        { method: 'DELETE' }
    )

    await Promise.all([
      loadSessions(course.id),
      loadAttendance(course.id)
    ])
  } catch (e) {
    fail(e)
  }
}

const viewStudentInfo = (student: Student): void => {
  selectedStudent.value = student
  showInfoModal.value = true
}
</script>