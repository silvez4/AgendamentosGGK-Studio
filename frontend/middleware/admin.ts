import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return

  const { isAuthReady, isAdmin, user } = useAuth()
  
  // Wait for auth to initialize
  if (!isAuthReady.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(isAuthReady, (ready) => {
        if (ready) {
          unwatch()
          resolve()
        }
      })
    })
  }

  // Redirect to login if trying to access admin restricted pages but not admin
  if (!isAdmin.value && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }

  // Se já ta logado como admin e tenta acessar login, joga pro dashboard
  if (isAdmin.value && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})
