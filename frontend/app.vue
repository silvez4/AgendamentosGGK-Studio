<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

onMounted(() => {
  const { initAuth } = useAuth()
  initAuth()
})
</script>
