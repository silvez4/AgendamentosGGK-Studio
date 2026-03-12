<template>
  <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Organizar Agenda</h2>
        <p class="text-gray-500 text-sm">Defina seus dias de trabalho, janelas de horários e dias de exceção.</p>
      </div>
      <button @click="saveConfig" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition" :disabled="loading">
        {{ loading ? 'Salvando...' : 'Salvar Configuração' }}
      </button>
    </div>

    <div class="space-y-8">
      <!-- Dias da Semana -->
      <section>
        <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Semana Padrão</h3>
        <div class="space-y-6">
          <div v-for="(dia, index) in diasSemana" :key="dia.diaSemana" class="flex flex-col md:flex-row md:items-start gap-4 p-4 border rounded-lg bg-gray-50">
            <div class="w-48 flex items-center space-x-3">
              <input type="checkbox" v-model="dia.ativo" class="h-5 w-5 text-blue-600 rounded">
              <span class="font-medium" :class="dia.ativo ? 'text-gray-800' : 'text-gray-400'">{{ getNomeDia(dia.diaSemana) }}</span>
            </div>
            
            <div class="flex-1 space-y-3" v-if="dia.ativo">
               <div v-for="(janela, jIndex) in dia.janelas" :key="jIndex" class="flex items-center space-x-3">
                  <input type="time" v-model="janela.inicio" required class="px-3 py-1.5 border rounded-md shadow-sm w-32">
                  <span class="text-gray-500">até</span>
                  <input type="time" v-model="janela.fim" required class="px-3 py-1.5 border rounded-md shadow-sm w-32">
                  <button @click="removerJanela(dia, jIndex)" class="text-red-500 hover:text-red-700 p-1" title="Remover Horário">
                    ✕
                  </button>
               </div>
               <button @click="addJanela(dia)" class="text-sm text-blue-600 font-medium hover:text-blue-800">+ Adicionar Turno</button>
            </div>
            <div v-else class="flex-1 text-gray-400 italic text-sm py-2">Sem expediente.</div>
          </div>
        </div>
      </section>

      <!-- Exceções -->
      <section>
        <div class="flex justify-between items-center mb-4 border-b pb-2">
           <h3 class="text-lg font-semibold text-gray-700">Exceções (Feriados, Férias ou Horários Especiais)</h3>
           <button @click="addExcecao" class="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded font-medium hover:bg-gray-300">
             + Nova Exceção
           </button>
        </div>
        
        <div v-if="excecoes.length === 0" class="text-gray-500 text-sm text-center py-4 border rounded-lg border-dashed">
          Nenhuma data de exceção cadastrada.
        </div>

        <div class="space-y-4">
           <div v-for="(exc, eIndex) in excecoes" :key="eIndex" class="p-4 border border-orange-200 bg-orange-50 rounded-lg flex flex-col md:flex-row gap-4">
              <div class="w-48 space-y-2">
                 <label class="block text-xs font-semibold text-gray-600 uppercase">Data</label>
                 <input type="date" v-model="exc.data" required class="w-full px-3 py-1.5 border rounded-md shadow-sm">
                 <div class="flex items-center space-x-2 mt-2">
                   <input type="checkbox" v-model="exc.bloqueadoODiaTodo" :id="'block_'+eIndex">
                   <label :for="'block_'+eIndex" class="text-sm text-gray-700">Folga o dia todo</label>
                 </div>
              </div>

              <div class="flex-1" v-if="!exc.bloqueadoODiaTodo">
                 <label class="block text-xs font-semibold text-gray-600 uppercase mb-2">Horários Específicos para esse dia</label>
                 <div class="space-y-3">
                   <div v-for="(janela, jIndex) in exc.janelasDisponiveis" :key="jIndex" class="flex items-center space-x-3">
                      <input type="time" v-model="janela.inicio" required class="px-3 py-1.5 border rounded-md shadow-sm w-32">
                      <span class="text-gray-500">até</span>
                      <input type="time" v-model="janela.fim" required class="px-3 py-1.5 border rounded-md shadow-sm w-32">
                      <button @click="removerJanelaExc(exc, jIndex)" class="text-red-500 hover:text-red-700 p-1">✕</button>
                   </div>
                   <button @click="addJanelaExc(exc)" class="text-sm text-blue-600 font-medium hover:text-blue-800">+ Adicionar Turno</button>
                 </div>
              </div>
              <div class="flex items-start">
                 <button @click="removerExcecao(eIndex)" class="text-red-500 hover:text-red-700 font-medium text-sm mt-6">Remover Exceção</button>
              </div>
           </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

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
    const res = await $fetch<any>('http://localhost:8080/api/admin/config-agenda')
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
    await $fetch('http://localhost:8080/api/admin/config-agenda', {
      method: 'POST',
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
