<template>
  <div class="space-y-6">
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Bem-vindo(a) ao Painel de Administração!</h2>
      <p class="text-gray-500">
        Utilize o menu lateral para gerenciar seus serviços oferecidos, valores e ajustar sua agenda de horários disponíveis.
      </p>
    </div>

    <!-- Dashboard Cards Placeholder -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center h-32">
          <span class="text-3xl font-bold text-blue-600">{{ agendamentos.length }}</span>
          <span class="text-gray-500 text-sm mt-1">Total de Agendamentos</span>
       </div>
    </div>

    <!-- Lista Agendamentos -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 mt-8 overflow-hidden">
       <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 class="font-bold text-lg text-gray-800">Próximos Agendamentos</h3>
          <button @click="fetchDados" class="text-blue-600 text-sm font-medium hover:underline">Atualizar</button>
       </div>
       <div class="overflow-x-auto">
         <table class="w-full text-left text-sm border-collapse">
            <thead>
               <tr class="text-gray-500 border-b">
                 <th class="p-4 font-semibold">Cliente</th>
                 <th class="p-4 font-semibold">Contato</th>
                 <th class="p-4 font-semibold">Início</th>
                 <th class="p-4 font-semibold">Status</th>
               </tr>
            </thead>
            <tbody>
               <tr v-if="loading" class="border-b"><td colspan="4" class="p-4 text-center">Carregando...</td></tr>
               <tr v-else-if="agendamentos.length === 0" class="border-b"><td colspan="4" class="p-4 text-center text-gray-500">Nenhum agendamento encontrado.</td></tr>
               <tr v-for="a in agendamentos" :key="a.id" class="border-b hover:bg-gray-50">
                 <td class="p-4 font-medium text-gray-800">{{ a.nomeCliente }}</td>
                 <td class="p-4 text-gray-600">{{ a.telefoneCliente }} <br><span class="text-xs text-gray-400">{{ a.emailCliente }}</span></td>
                 <td class="p-4 text-gray-900">{{ formatDateTime(a.horarioInicio) }}</td>
                 <td class="p-4"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{{ a.status }}</span></td>
               </tr>
            </tbody>
         </table>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const loading = ref(true)
const agendamentos = ref<any[]>([])

const fetchDados = async () => {
  loading.value = true
  try {
    const res = await $fetch<any[]>('http://localhost:8080/api/admin/agendamentos')
    agendamentos.value = res.sort((a,b) => new Date(a.horarioInicio).getTime() - new Date(b.horarioInicio).getTime())
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (iso: string) => {
  if (!iso) return ''
  // simple formatting for UI
  const d = new Date(iso)
  return d.toLocaleString('pt-BR')
}

onMounted(() => {
  fetchDados()
})
</script>
