
<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 rounded-xl" elevation="1">
          <h2 class="text-h5 font-weight-bold mb-2">Bem-vindo(a) ao Painel de Administração!</h2>
          <p class="text-medium-emphasis">
            Utilize o menu lateral para gerenciar seus serviços oferecidos, valores e ajustar sua agenda de horários disponíveis.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dashboard Cards & Filters -->
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-xl h-100" elevation="1">
          <div class="text-subtitle-1 font-weight-bold mb-4">Filtrar por Data</div>
          <v-text-field
            v-model="filtroData"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            class="mt-2"
          ></v-text-field>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-xl text-center d-flex flex-column justify-center align-center h-100" elevation="1" color="primary">
          <div class="text-h2 font-weight-bold text-white">{{ agendamentosFiltrados.length }}</div>
          <div class="text-subtitle-1 text-white mt-1 opacity-80">Agendamentos no Dia</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
         <v-card class="pa-6 rounded-xl text-center d-flex flex-column justify-center align-center h-100" elevation="1">
          <div class="text-h3 font-weight-bold text-grey-darken-3">{{ agendamentos.length }}</div>
          <div class="text-subtitle-2 text-medium-emphasis mt-1">Total Geral</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lista Agendamentos -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="rounded-xl" elevation="1">
          <v-card-title class="d-flex justify-space-between align-center pa-4 bg-grey-lighten-4 border-b">
            <span class="font-weight-bold">Agendamentos</span>
            <v-btn color="primary" variant="text" size="small" @click="fetchDados" :loading="loading" prepend-icon="mdi-refresh">Atualizar</v-btn>
          </v-card-title>
          
          <v-table>
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Horário</th>
                <th class="text-left font-weight-bold">Cliente</th>
                <th class="text-left font-weight-bold">Contato</th>
                <th class="text-left font-weight-bold">Status</th>
                <th class="text-right font-weight-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-4">Carregando agendamentos...</td>
              </tr>
              <tr v-else-if="agendamentosFiltrados.length === 0">
                <td colspan="4" class="text-center py-4 text-medium-emphasis">Nenhum agendamento encontrado para esta data.</td>
              </tr>
              <tr v-for="a in agendamentosFiltrados" :key="a.id" class="hover-bg-grey-lighten-4">
                <td class="font-weight-bold text-primary">{{ formatTime(a.horarioInicio) }}</td>
                <td class="font-weight-medium">{{ a.nomeCliente }}</td>
                <td>
                  {{ a.telefoneCliente }}
                  <div class="text-caption text-medium-emphasis">{{ a.emailCliente }}</div>
                </td>
                <td>
                  <v-chip size="small" :color="a.status === 'CANCELADO' ? 'error' : 'success'" variant="tonal" class="font-weight-bold">{{ a.status }}</v-chip>
                </td>
                <td class="text-right">
                  <v-btn v-if="a.status !== 'CANCELADO'" color="error" variant="text" size="small" icon="mdi-cancel" @click="cancelarAgendamento(a.id)" title="Cancelar Agendamento"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth'

definePageMeta({
  layout: 'admin',
  middleware: ['admin']
})

const loading = ref(true)
const agendamentos = ref<any[]>([])
const filtroData = ref(new Date().toISOString().split('T')[0])

const fetchDados = async () => {
  loading.value = true
  try {
    const config = useRuntimeConfig()
    const auth = getAuth()
    
    let headers: Record<string, string> = {}
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken()
      headers = { Authorization: `Bearer ${token}` }
    }

    const res = await $fetch<any[]>(`${config.public.apiBase}/admin/agendamentos`, { headers })
    agendamentos.value = res.sort((a,b) => new Date(a.horarioInicio).getTime() - new Date(b.horarioInicio).getTime())
  } catch (error) {
    console.error('Erro ao buscar reservas:', error)
  } finally {
    loading.value = false
  }
}

const agendamentosFiltrados = computed(() => {
  if (!filtroData.value) return agendamentos.value
  return agendamentos.value.filter(a => {
     if (!a.horarioInicio) return false
     // Formatando para data local, evitando discrepâncias do Z
     const d = new Date(a.horarioInicio)
     const localIso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
     return localIso === filtroData.value
  })
})

const formatTime = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

import Swal from 'sweetalert2'

const cancelarAgendamento = async (id: string) => {
  const result = await Swal.fire({
    title: 'Cancelar Reserva?',
    text: 'Esta ação liberará imediatamente o horário no calendário e mudará o status para Cancelado. Deseja prosseguir?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#a1a1aa',
    confirmButtonText: 'Sim, cancelar!'
  })

  if (result.isConfirmed) {
    try {
      const config = useRuntimeConfig()
      const auth = getAuth()
      let headers: Record<string, string> = {}
      
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken()
        headers = { Authorization: `Bearer ${token}` }
      }

      await $fetch(`${config.public.apiBase}/admin/agendamentos/${id}/cancelar`, {
        method: 'PUT',
        headers
      })

      Swal.fire('Cancelado!', 'O agendamento foi desmarcado.', 'success')
      fetchDados() // Refresh table
    } catch (error) {
      console.error(error)
      Swal.fire('Erro', 'Houve uma falha ao comunicar com o servidor.', 'error')
    }
  }
}

onMounted(() => {
  fetchDados()
})
</script>
