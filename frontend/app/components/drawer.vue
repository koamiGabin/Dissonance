<template>
  <div class="fixed inset-0 flex justify-end items-center pointer-events-none">
    <!-- Backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 z-30 pointer-events-auto"
        @click="toggleDrawer"
      ></div>
    </transition>

    <!-- Drawer container -->
    <transition name="slide">
      <div
        v-show="isOpen"
        class="relative h-screen w-120 bg-base-200 shadow-xl pointer-events-auto flex z-40"
      >
        <Chat />        
      </div>
    </transition>

    <!-- Toggle button -->
    <button
      class="btn btn-warning fixed top-1/2 z-50 pointer-events-auto transition-all duration-300 rounded-r-none p-4 font-mono"
      :class="isOpen ? 'right-[30rem]' : 'right-0'"
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
