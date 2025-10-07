<template>
    <Navbar />
  <div class="fixed inset-0 flex justify-end items-center pointer-events-none">
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-40 z-30 pointer-events-auto"
        @click="toggleDrawer"
      ></div>
    </transition>

    <!-- Drawer container -->
    <transition name="slide">
      <div
        v-if="isOpen"
        class="relative h-screen w-80 bg-base-200 shadow-xl pointer-events-auto flex z-40"
      >
        <!-- Drawer content -->
        <div class="flex-1 p-6">
          <h2 class="text-xl font-bold mb-4">Right Drawer</h2>
          <p>This is your drawer content!</p>
        </div>
      </div>
    </transition>

    <!-- Toggle button -->
    <button
      class="btn btn-primary fixed top-1/2 z-50 pointer-events-auto transition-all duration-300 rounded-r-none"
      :class="isOpen ? 'right-[20rem]' : 'right-0'"
      @click="toggleDrawer"
    >
        <div :class="isOpen ? 'duration-600 rotate-180' : 'duration-600'">
            ❮
        </div>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleDrawer = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
/* Smooth slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
