<template>
  <div class="space-y-12 pb-16">
    <!-- Hero Section -->
    <div class="relative bg-white overflow-hidden rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-16 flex items-center justify-between">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 z-0"></div>
      
      <div class="relative z-10 max-w-2xl text-left">
        <span class="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 tracking-wide shadow-sm">
          Fácil & Rápido
        </span>
        <h2 class="text-4xl sm:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
          Agende sua <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">consulta</span> hoje.
        </h2>
        <p class="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
          Escolha o serviço desejado, marque seu horário em poucos cliques e simplifique o seu dia com a nossa plataforma.
        </p>
      </div>

      <div class="hidden lg:block relative z-10 w-80 h-80 bg-gradient-to-tr from-blue-200 to-indigo-300 rounded-full blur-[80px] opacity-40 animate-pulse">
      </div>
    </div>
    
    <!-- Services Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-6 space-y-4 sm:space-y-0">
      <div>
        <h3 class="text-3xl font-extrabold text-gray-900 tracking-tight">Serviços Disponíveis</h3>
        <p class="text-gray-500 mt-2 font-medium">Selecione uma opção abaixo para continuar</p>
      </div>
      <div class="flex items-center space-x-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
        <div class="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
        <span class="text-blue-700 font-bold text-sm">{{ servicos.length }} Ativos</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div v-for="i in 3" :key="i" class="bg-white border border-gray-100 rounded-[2rem] p-8 h-56 animate-pulse shadow-sm">
          <div class="flex justify-between items-start mb-6">
            <div class="h-8 bg-gray-100 rounded-lg w-1/2"></div>
            <div class="h-10 w-10 bg-gray-100 rounded-full"></div>
          </div>
          <div class="h-4 bg-gray-100 rounded w-1/3 mb-8"></div>
          <div class="flex justify-between items-end">
            <div class="h-8 bg-gray-100 rounded w-1/4"></div>
            <div class="h-10 bg-gray-100 rounded-xl w-28"></div>
          </div>
       </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="servicos.length === 0" class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        <p class="text-xl font-bold text-gray-600">Nenhum serviço disponível.</p>
        <p class="text-gray-400 mt-2">Volte novamente mais tarde.</p>
    </div>

    <!-- Services Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div v-for="servico in servicos" :key="servico.id" 
            class="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-500 flex flex-col justify-between relative overflow-hidden transform hover:-translate-y-1">
          
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-[2] ease-out opacity-60"></div>
          
          <div class="relative z-10 mb-8 flex justify-between items-start">
             <div>
               <h3 class="font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">{{ servico.nome }}</h3>
               <div class="inline-flex items-center text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-xl text-sm border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                  <svg class="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ servico.duracaoMinutos }} minutos
               </div>
             </div>
          </div>

          <div class="relative z-10 flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
             <div class="flex flex-col">
               <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Valor</span>
               <span class="text-3xl font-black text-gray-800 drop-shadow-sm">{{ servico.moeda }} {{ servico.preco?.toFixed(2) }}</span>
             </div>
             
             <NuxtLink :to="`/agendar/${servico.id}`" 
                class="flex items-center justify-center bg-gray-900 group-hover:bg-blue-600 text-white w-14 h-14 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 active:scale-95">
                <svg class="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
             </NuxtLink>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const servicos = ref<any[]>([])
const loading = ref(true)

const fetchServicos = async () => {
  try {
    const res = await $fetch<any[]>('http://localhost:8080/api/public/servicos')
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
