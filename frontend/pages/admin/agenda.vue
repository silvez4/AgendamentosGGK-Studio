<template>
  <v-card class="pa-6 rounded-xl" elevation="1" min-height="500">
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-3">Organizar Agenda</h2>
        <p class="text-medium-emphasis text-body-2 mt-1">Defina seus dias de trabalho, janelas de horários e dias de exceção.</p>
      </div>
      <v-btn color="primary" size="large" @click="saveConfig" :loading="loading" class="rounded-lg text-none font-weight-bold">
        Salvar Configuração
      </v-btn>
    </div>

    <!-- Dias da Semana -->
    <div class="mt-8 mb-4 border-b pb-2">
      <h3 class="text-h6 font-weight-bold text-grey-darken-2">Semana Padrão</h3>
    </div>
    
    <div class="mb-10">
      <v-card v-for="(dia, index) in diasSemana" :key="dia.diaSemana" class="mb-4 pa-4 bg-grey-lighten-4 rounded-lg" variant="flat" border>
        <v-row align="center">
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-checkbox v-model="dia.ativo" :label="getNomeDia(dia.diaSemana)" color="primary" hide-details class="font-weight-medium" density="compact"></v-checkbox>
          </v-col>
          
          <v-col cols="12" md="9" v-if="dia.ativo">
             <div v-for="(janela, jIndex) in dia.janelas" :key="jIndex" class="d-flex align-center mb-2 flex-wrap gap-2">
                <v-text-field v-model="janela.inicio" type="time" density="compact" variant="outlined" hide-details class="max-w-[150px] bg-white"></v-text-field>
                <span class="text-medium-emphasis mx-2">até</span>
                <v-text-field v-model="janela.fim" type="time" density="compact" variant="outlined" hide-details class="max-w-[150px] bg-white"></v-text-field>
                <v-btn icon="mdi-close" variant="text" color="error" size="small" @click="removerJanela(dia, jIndex)" class="ml-2"></v-btn>
             </div>
             <v-btn variant="text" color="primary" size="small" class="mt-2 text-none font-weight-bold" prepend-icon="mdi-plus" @click="addJanela(dia)">Adicionar Turno</v-btn>
          </v-col>
          <v-col cols="12" md="9" v-else>
             <div class="text-medium-emphasis font-italic text-body-2">Sem expediente.</div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- Exceções -->
    <div class="d-flex justify-space-between align-center border-b pb-2 mb-4">
       <h3 class="text-h6 font-weight-bold text-grey-darken-2">Exceções</h3>
       <v-btn color="grey-darken-1" variant="tonal" size="small" class="text-none font-weight-bold" prepend-icon="mdi-calendar-plus" @click="addExcecao">
         Nova Exceção
       </v-btn>
    </div>
    
    <div v-if="excecoes.length === 0" class="text-center py-8 border-dashed rounded-lg bg-grey-lighten-5 mb-8">
      <div class="text-medium-emphasis text-body-2">Nenhuma data de exceção cadastrada.</div>
    </div>

    <v-card v-for="(exc, eIndex) in excecoes" :key="eIndex" class="mb-4 pa-4 bg-orange-lighten-5 border-orange-lighten-3 rounded-lg" variant="outlined">
      <v-row>
        <v-col cols="12" md="4">
           <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-1">Data</div>
           <v-text-field v-model="exc.data" type="date" density="compact" variant="outlined" hide-details class="bg-white mb-3"></v-text-field>
           <v-checkbox v-model="exc.bloqueadoODiaTodo" label="Folga o dia todo" color="primary" hide-details density="compact"></v-checkbox>
        </v-col>

        <v-col cols="12" md="6" v-if="!exc.bloqueadoODiaTodo">
           <div class="text-caption font-weight-bold text-grey-darken-1 text-uppercase mb-2">Horários Específicos</div>
           <div v-for="(janela, jIndex) in exc.janelasDisponiveis" :key="jIndex" class="d-flex align-center mb-2 flex-wrap gap-2">
              <v-text-field v-model="janela.inicio" type="time" density="compact" variant="outlined" hide-details class="max-w-[150px] bg-white"></v-text-field>
              <span class="text-medium-emphasis mx-2">até</span>
              <v-text-field v-model="janela.fim" type="time" density="compact" variant="outlined" hide-details class="max-w-[150px] bg-white"></v-text-field>
              <v-btn icon="mdi-close" variant="text" color="error" size="small" @click="removerJanelaExc(exc, jIndex)" class="ml-2"></v-btn>
           </div>
           <v-btn variant="text" color="primary" size="small" class="mt-2 text-none font-weight-bold" prepend-icon="mdi-plus" @click="addJanelaExc(exc)">Adicionar Turno</v-btn>
        </v-col>
        
        <v-col cols="12" md="2" class="d-flex align-start justify-end">
           <v-btn color="error" variant="text" size="small" class="text-none font-weight-bold mt-sm-6" @click="removerExcecao(eIndex)">Remover</v-btn>
        </v-col>
      </v-row>
    </v-card>
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

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const loading = ref(false)

const diasSemana = ref([
  { diaSemana: 1, ativo: true, janelas: [{ inicio: '08:00', fim: '12:00' }, { inicio: '14:00', fim: '18:00' }] }, // Segunda
  { diaSemana: 2, ativo: true, janelas: [{ inicio: '08:00', fim: '12:00' }, { inicio: '14:00', fim: '18:00' }] }, // Terca
  { diaSemana: 3, ativo: true, janelas: [{ inicio: '08:00', fim: '12:00' }, { inicio: '14:00', fim: '18:00' }] }, // Quarta
  { diaSemana: 4, ativo: true, janelas: [{ inicio: '08:00', fim: '12:00' }, { inicio: '14:00', fim: '18:00' }] }, // Quinta
  { diaSemana: 5, ativo: true, janelas: [{ inicio: '08:00', fim: '12:00' }, { inicio: '14:00', fim: '18:00' }] }, // Sexta
  { diaSemana: 6, ativo: false, janelas: [] }, // Sabado
  { diaSemana: 7, ativo: false, janelas: [] }  // Domingo
])

const excecoes = ref<any[]>([])

const getNomeDia = (iso: number) => {
  const map = { 1: 'Segunda-feira', 2: 'Terça-feira', 3: 'Quarta-feira', 4: 'Quinta-feira', 5: 'Sexta-feira', 6: 'Sábado', 7: 'Domingo' }
  return (map as any)[iso]
}

const addJanela = (dia: any) => dia.janelas.push({ inicio: '08:00', fim: '12:00' })
const removerJanela = (dia: any, index: number) => dia.janelas.splice(index, 1)

const addExcecao = () => excecoes.value.push({ data: '', bloqueadoODiaTodo: true, janelasDisponiveis: [] })
const removerExcecao = (index: number) => excecoes.value.splice(index, 1)

const addJanelaExc = (exc: any) => exc.janelasDisponiveis.push({ inicio: '08:00', fim: '12:00' })
const removerJanelaExc = (exc: any, index: number) => exc.janelasDisponiveis.splice(index, 1)


const fetchData = async () => {
  try {
    const headers = await getAuthHeaders()
    const res = await $fetch<any>(`${config.public.apiBase}/admin/config-agenda`, { headers })
    if (res && res.diasSemana) diasSemana.value = res.diasSemana
    if (res && res.excecoes) excecoes.value = res.excecoes
  } catch (error: any) {
    if (error.response?.status !== 404) {
       console.error(error)
    }
  }
}

const saveConfig = async () => {
  loading.value = true
  try {
    const payload = {
      diasSemana: diasSemana.value,
      excecoes: excecoes.value
    }
    const headers = await getAuthHeaders()
    await $fetch(`${config.public.apiBase}/admin/config-agenda`, {
      method: 'POST',
      headers,
      body: payload
    })
    Swal.fire({ title: 'Salvo!', text: 'Agenda atualizada com scuesso.', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e) {
    Swal.fire({ title: 'Erro!', text: 'Falha ao salvar a agenda.', icon: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
