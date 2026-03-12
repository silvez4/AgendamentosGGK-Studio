<template>
  <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Serviços Oferecidos</h2>
        <p class="text-gray-500 text-sm">Gerencie os serviços, preços, duração e intervalos.</p>
      </div>
      <button @click="openModal(null)" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
        + Novo Serviço
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
            <th class="p-4 font-medium">Nome do Serviço</th>
            <th class="p-4 font-medium">Duração (min)</th>
            <th class="p-4 font-medium">Intervalo (min)</th>
            <th class="p-4 font-medium">Preço</th>
            <th class="p-4 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
           <tr v-if="loading" class="border-b border-gray-100"><td colspan="5" class="p-4 text-center">Carregando...</td></tr>
           <tr v-else-if="servicos.length === 0" class="border-b border-gray-100"><td colspan="5" class="p-4 text-center text-gray-500">Nenhum serviço cadastrado.</td></tr>
           <tr v-for="servico in servicos" :key="servico.id" class="border-b border-gray-100 hover:bg-gray-50">
             <td class="p-4">{{ servico.nome }}</td>
             <td class="p-4">{{ servico.duracaoMinutos }}</td>
             <td class="p-4">{{ servico.intervaloMinutos || 0 }}</td>
             <td class="p-4">{{ servico.moeda }} {{ servico.preco?.toFixed(2) }}</td>
             <td class="p-4 text-right space-x-2">
               <button @click="openModal(servico)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
               <button @click="deleteItem(servico.id)" class="text-red-500 hover:text-red-700 text-sm font-medium">Excluir</button>
             </td>
           </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal (Simplified here for demo logic) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <h3 class="text-xl font-bold mb-4">{{ form.id ? 'Editar Serviço' : 'Novo Serviço' }}</h3>
        
        <form @submit.prevent="saveItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input v-model="form.nome" type="text" required class="mt-1 block w-full px-3 py-2 border rounded-md">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Preço</label>
              <input v-model.number="form.preco" type="number" step="0.01" required class="mt-1 block w-full px-3 py-2 border rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Moeda</label>
              <select v-model="form.moeda" class="mt-1 block w-full px-3 py-2 border rounded-md">
                <option value="BRL">R$ (BRL)</option>
                <option value="USD">$ (USD)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Duração (minutos)</label>
              <input v-model.number="form.duracaoMinutos" type="number" required class="mt-1 block w-full px-3 py-2 border rounded-md">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Intervalo Pós (minutos)</label>
              <input v-model.number="form.intervaloMinutos" type="number" class="mt-1 block w-full px-3 py-2 border rounded-md">
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { getAuth } from 'firebase/auth'

const config = useRuntimeConfig()

const getAuthHeaders = async () => {
  const auth = getAuth()
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const loading = ref(false)
const servicos = ref<any[]>([])
const showModal = ref(false)

const form = ref({
  id: '',
  nome: '',
  preco: 0,
  moeda: 'BRL',
  duracaoMinutos: 60,
  intervaloMinutos: 0
})

const fetchServicos = async () => {
  loading.value = true
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch<any[]>(`${config.public.apiBase}/admin/servicos`, { headers })
    servicos.value = res
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openModal = (item: any) => {
  if (item) {
    form.value = { ...item }
  } else {
    form.value = { id: '', nome: '', preco: 0, moeda: 'BRL', duracaoMinutos: 60, intervaloMinutos: 0 }
  }
  showModal.value = true
}

const saveItem = async () => {
  showModal.value = false
  try {
    const headers = await getAuthHeaders()
    if (form.value.id) {
      await $fetch(`${config.public.apiBase}/admin/servicos/${form.value.id}`, {
        method: 'PUT',
        headers,
        body: form.value
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/servicos`, {
        method: 'POST',
        headers,
        body: form.value
      })
    }
    
    Swal.fire({ title: 'Sucesso!', icon: 'success', timer: 1500, showConfirmButton: false })
    fetchServicos()
  } catch (e) {
    Swal.fire({ title: 'Erro!', text: 'Falha ao salvar serviço.', icon: 'error' })
  }
}

const deleteItem = async (id: string) => {
  const confirm = await Swal.fire({
    title: 'Deletar serviço?',
    text: "Esta ação não pode ser desfeita.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir'
  })
  
  if (confirm.isConfirmed) {
    try {
      const headers = await getAuthHeaders()
      await $fetch(`${config.public.apiBase}/admin/servicos/${id}`, { method: 'DELETE', headers })
      Swal.fire({ title: 'Deletado!', icon: 'success', timer: 1500, showConfirmButton: false })
      fetchServicos()
    } catch (e) {
      Swal.fire({ title: 'Erro!', text: 'Falha ao deletar.', icon: 'error' })
    }
  }
}

onMounted(() => {
  fetchServicos()
})
</script>
