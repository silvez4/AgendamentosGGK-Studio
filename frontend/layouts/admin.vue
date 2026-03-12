<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-900">
    
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg hidden md:flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 class="text-xl font-bold text-blue-600">Admin Panel</h1>
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2">
        <NuxtLink to="/admin" class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-600 font-medium">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/agenda" class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-600 font-medium">
          Organizar Agenda
        </NuxtLink>
        <NuxtLink to="/admin/servicos" class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors" active-class="bg-blue-50 text-blue-600 font-medium">
          Serviços
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-gray-100">
        <button @click="handleLogout" class="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          Sair
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-white shadow-sm flex items-center px-6 justify-between md:justify-end">
        <!-- Mobile Menu Button Placeholder -->
        <button class="md:hidden text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500" v-if="user">{{ user.email }}</span>
        </div>
      </header>
      
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  navigateTo('/admin/login')
}
</script>
