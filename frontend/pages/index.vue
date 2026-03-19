<template>
  <v-container class="pb-16 max-w-7xl mx-auto" fluid>
    <!-- Hero Section -->
    <v-card class="mb-12 rounded-xl bg-transparent" elevation="0">
      <div class="py-12 px-6 px-sm-16 d-flex align-center border-b border-opacity-25 pb-16">
        <v-row>
          <v-col cols="12" md="8" lg="7">
            <h2 class="text-h3 text-sm-h2 font-weight-black mb-6 text-primary">
              Revitalize seu corpo e mente.
            </h2>
            <p class="text-h6 font-weight-regular text-secondary mb-0">
              Escolha seu serviço de bem-estar e agende seu momento de cuidado com o Studio Ana Bruno em poucos cliques.
            </p>
          </v-col>
        </v-row>
      </div>
    </v-card>
    
    <!-- Services Header -->
    <v-row class="mb-6 align-end border-b pb-4" no-gutters>
      <v-col cols="12" sm="8">
        <h3 class="text-h4 font-weight-bold">Serviços Disponíveis</h3>
        <p class="text-medium-emphasis mt-2">Selecione uma opção abaixo para continuar</p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right mt-4 mt-sm-0">
        <v-chip color="info" variant="flat" size="large" class="font-weight-bold px-4">
          <v-icon start color="white" class="mr-2">mdi-circle-medium</v-icon>
          {{ servicos.length }} Ativos
        </v-chip>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
       <v-col v-for="i in 3" :key="i" cols="12" md="6" lg="4">
         <v-skeleton-loader type="card, article" class="border rounded-xl"></v-skeleton-loader>
       </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-else-if="servicos.length === 0" variant="outlined" class="py-16 rounded-xl border-dashed bg-grey-lighten-4 text-center">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-clipboard-text-off-outline</v-icon>
        <div class="text-h6 font-weight-bold text-grey-darken-1">Nenhum serviço disponível.</div>
        <div class="text-medium-emphasis mt-2">Volte novamente mais tarde.</div>
    </v-card>

    <!-- Services Grid -->
    <v-row v-else>
       <v-col v-for="servico in servicos" :key="servico.id" cols="12" md="6" lg="4">
         <v-hover v-slot="{ isHovering, props }">
           <v-card v-bind="props" :elevation="isHovering ? 8 : 1" class="h-100 rounded-xl transition-swing d-flex flex-column pa-6" border>
              <div class="d-flex justify-space-between align-start mb-6">
                 <div>
                   <h3 class="text-h5 font-weight-bold mb-3" :class="isHovering ? 'text-primary' : 'text-grey-darken-4'">{{ servico.nome }}</h3>
                   <v-chip size="small" variant="outlined" color="grey-darken-1" class="font-weight-medium">
                      <v-icon start size="small">mdi-clock-outline</v-icon>
                      {{ servico.duracaoMinutos }} minutos
                   </v-chip>
                 </div>
              </div>

              <v-spacer></v-spacer>
              <v-divider class="mb-4 mt-2"></v-divider>

              <div class="d-flex align-end justify-space-between">
                 <div class="d-flex flex-column">
                   <span class="text-caption font-weight-bold text-medium-emphasis text-uppercase tracking-widest mb-1">Valor</span>
                   <span class="text-h4 font-weight-black text-grey-darken-3">{{ servico.moeda }} {{ servico.preco?.toFixed(2) }}</span>
                 </div>
                 
                 <v-btn :to="`/agendar/${servico.id}`" :color="isHovering ? 'primary' : 'black'" icon="mdi-arrow-right" size="x-large" elevation="2" class="rounded-lg transition-swing"></v-btn>
              </div>
           </v-card>
         </v-hover>
       </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const servicos = ref<any[]>([])
const loading = ref(true)

const fetchServicos = async () => {
  try {
    const res = await $fetch<any[]>(`${config.public.apiBase}/public/servicos`)
    servicos.value = res
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServicos()
})
</script>
