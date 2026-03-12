<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

onMounted(() => {
  const { initAuth } = useAuth()
  initAuth()
})
</script>
