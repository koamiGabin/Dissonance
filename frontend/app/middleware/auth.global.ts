import { useStorage } from '@vueuse/core'
import { navigateTo } from '#app'


export default defineNuxtRouteMiddleware((to) => {
  // Skip check on the index page
  if (to.path === '/') return

  // Only run this logic on client side
  if (import.meta.client) {
    const nickname = useStorage('nickname', '')
    const lobby = useStorage('lobby', '')

    if (!nickname.value || !lobby.value) {
      return navigateTo('/index')
    }
  }
})
