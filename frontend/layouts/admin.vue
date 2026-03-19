<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" color="white" elevation="2">
      <v-list-item title="Admin Panel" class="py-4 text-primary font-weight-bold text-h6 border-b"></v-list-item>
      <v-list class="py-2" nav>
        <v-list-item to="/admin" prepend-icon="mdi-view-dashboard" title="Dashboard" rounded="lg" color="primary"></v-list-item>
        <v-list-item to="/admin/agenda" prepend-icon="mdi-calendar" title="Organizar Agenda" rounded="lg" color="primary"></v-list-item>
        <v-list-item to="/admin/servicos" prepend-icon="mdi-briefcase" title="Serviços" rounded="lg" color="primary"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-4 border-t">
          <v-btn @click="handleLogout" block color="error" variant="tonal" prepend-icon="mdi-logout">
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar elevation="1" color="white" class="px-2">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <span v-if="user" class="text-body-2 text-medium-emphasis mr-4">{{ user.email }}</span>
      <span v-else class="text-body-2 text-error font-weight-bold mr-4">Sessão Expirada</span>
    </v-app-bar>
    
    <v-main class="bg-grey-lighten-4" style="min-height: 100vh;">
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const drawer = ref(true)
const { user, signOut } = useAuth()

const handleLogout = async () => {
  try {
    await signOut()
    navigateTo('/admin/login')
  } catch (e) {
    console.error('Logout error:', e)
    // Forcar nav
    navigateTo('/admin/login')
  }
}
</script>
