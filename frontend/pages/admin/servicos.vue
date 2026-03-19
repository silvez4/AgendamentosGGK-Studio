<template>
  <v-card class="pa-6 rounded-xl" elevation="1" min-height="500">
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3">Serviços Oferecidos</h2>
        <p class="text-medium-emphasis text-body-2 mt-1">Gerencie os serviços, preços, duração e intervalos.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="openModal(null)" class="rounded-lg text-none font-weight-bold">
        Novo Serviço
      </v-btn>
    </div>

    <!-- Table -->
    <v-table>
      <thead>
        <tr>
          <th class="text-left font-weight-bold">Nome do Serviço</th>
          <th class="text-left font-weight-bold">Duração (min)</th>
          <th class="text-left font-weight-bold">Intervalo (min)</th>
          <th class="text-left font-weight-bold">Preço</th>
          <th class="text-right font-weight-bold">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center py-4">Carregando...</td>
        </tr>
        <tr v-else-if="servicos.length === 0">
          <td colspan="5" class="text-center py-4 text-medium-emphasis">Nenhum serviço cadastrado.</td>
        </tr>
        <tr v-for="servico in servicos" :key="servico.id" class="hover-bg-grey-lighten-4">
          <td class="font-weight-medium">{{ servico.nome }}</td>
          <td>{{ servico.duracaoMinutos }}</td>
          <td>{{ servico.intervaloMinutos || 0 }}</td>
          <td>{{ servico.moeda }} {{ servico.preco?.toFixed(2) }}</td>
          <td class="text-right">
            <v-btn variant="text" color="primary" size="small" class="mr-2 font-weight-bold text-none" @click="openModal(servico)">Editar</v-btn>
            <v-btn variant="text" color="error" size="small" class="font-weight-bold text-none" @click="deleteItem(servico.id)">Excluir</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Modal -->
    <v-dialog v-model="showModal" max-width="600" persistent>
      <v-card class="rounded-xl pa-2">
        <v-card-title class="text-h5 font-weight-bold mb-2">
          {{ form.id ? 'Editar Serviço' : 'Novo Serviço' }}
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="saveItem" id="servico-form">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="form.nome" label="Nome" variant="outlined" density="comfortable" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="form.preco" label="Preço" type="number" step="0.01" variant="outlined" density="comfortable" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="form.moeda" :items="['BRL', 'USD']" label="Moeda" variant="outlined" density="comfortable"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="form.duracaoMinutos" label="Duração (minutos)" type="number" variant="outlined" density="comfortable" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="form.intervaloMinutos" label="Intervalo Pós (minutos)" type="number" variant="outlined" density="comfortable"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" size="large" class="text-none" @click="showModal = false">Cancelar</v-btn>
          <v-btn color="primary" type="submit" form="servico-form" variant="flat" size="large" class="rounded-lg px-6 font-weight-bold text-none">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { getAuth } from 'firebase/auth'

const config = useRuntimeConfig()

const getAuthHeaders = async (): Promise<Record<string, string>> => {
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
