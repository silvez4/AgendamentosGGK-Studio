<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
       <div>
         <NuxtLink to="/" class="text-blue-600 hover:underline text-sm font-medium mb-1 block">← Voltar aos Serviços</NuxtLink>
         <h2 class="text-2xl font-bold text-gray-800">Escolha o Horário</h2>
         <p class="text-gray-500 text-sm mt-1" v-if="servico">Serviço: <span class="font-semibold text-gray-700">{{ servico.nome }}</span> ({{ servico.duracaoMinutos }} min)</p>
       </div>
    </div>

    <!-- Container Calendario e Slots -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden min-h-[400px]">
       
       <!-- Lado Esquerdo: Data -->
       <div class="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
          <label class="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Selecione uma Data</label>
          <input 
            type="date" 
            v-model="dataEscolhida"
            :min="hoje"
            @change="buscarHorarios"
            class="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-lg text-gray-700"
          >
          
          <div class="mt-8">
            <div v-if="localUser" class="bg-blue-50 p-4 border border-blue-100 rounded-xl">
               <p class="text-sm text-blue-800 font-medium">Marcando como:</p>
               <p class="font-bold text-lg text-blue-900">{{ localUser.nome }}</p>
               <p class="text-sm text-blue-700">{{ localUser.email }}</p>
               <button @click="showModal = true" class="mt-2 text-xs font-semibold text-blue-600 hover:underline">Editar meus dados</button>
            </div>
            <div v-else class="bg-gray-100 p-4 rounded-xl border border-gray-200">
               <p class="text-sm text-gray-600 text-center">Será requisitado seus dados para finalizar o agendamento.</p>
            </div>
          </div>
       </div>

       <!-- Lado Direito: Horários -->
       <div class="w-full md:w-1/2 p-6 flex flex-col">
          <label class="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Horários Disponíveis</label>
          
          <div v-if="loadingSlots" class="flex-1 flex items-center justify-center">
            <span class="text-gray-400 font-medium animate-pulse">Buscando disponibilidade...</span>
          </div>
          
          <div v-else-if="!dataEscolhida" class="flex-1 flex items-center justify-center text-center">
             <span class="text-gray-400">Escolha uma data ao lado <br> para ver os horários.</span>
          </div>

          <div v-else-if="slots.length === 0" class="flex-1 flex flex-col items-center justify-center text-center space-y-2">
             <span class="text-4xl">📅</span>
             <h4 class="font-semibold text-gray-700">Sem horários</h4>
             <p class="text-gray-500 text-sm max-w-xs">Não há disponibilidade para esta data. Tente outro dia.</p>
          </div>

          <div v-else class="grid grid-cols-3 gap-3">
             <button 
               v-for="time in slots" 
               :key="time"
               @click="selecionarHorario(time)"
               class="py-3 px-2 rounded-xl text-center font-bold text-sm shadow-sm transition-all"
               :class="horaEscolhida === time ? 'bg-blue-600 text-white shadow-blue-500/40 ring-2 ring-offset-1 ring-blue-600' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'"
             >
               {{ time }}
             </button>
          </div>
       </div>
    </div>

    <!-- Fixed Bottom Bar for Confirmation -->
    <div v-if="horaEscolhida" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-center">
       <div class="max-w-3xl w-full flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">Data escolhida:</p>
            <p class="font-bold text-lg text-gray-900">{{ formatData(dataEscolhida) }} às {{ horaEscolhida }}</p>
          </div>
          <button 
             @click="confirmarAgendamento" 
             :disabled="loadingSubmit"
             class="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-500/30 transition-all text-lg disabled:opacity-50"
          >
             {{ loadingSubmit ? 'Finalizando...' : 'Confirmar Agendamento' }}
          </button>
       </div>
    </div>

    <!-- Modal de Dados -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        <h3 class="text-2xl font-bold mb-2 text-gray-800">Seus Dados</h3>
        <p class="text-gray-500 text-sm mb-6">Preencha rapidamente para salvar seu horário.</p>
        
        <form @submit.prevent="salvarDadosUser" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
            <input v-model="formUser.nome" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input v-model="formUser.email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Telefone / WhatsApp</label>
            <input v-model="formUser.telefone" type="tel" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
          <div class="flex justify-end space-x-3 mt-8">
            <button type="button" @click="showModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl">Cancelar</button>
            <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md">Continuar</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const route = useRoute()
const config = useRuntimeConfig()
const { localUser, initLocalUser, saveLocalUser } = useUser()

const hoje = new Date().toISOString().split('T')[0]
const dataEscolhida = ref('')
const horaEscolhida = ref('')
const slots = ref<string[]>([])
const loadingSlots = ref(false)
const loadingSubmit = ref(false)
const servico = ref<any>(null)

const showModal = ref(false)
const formUser = ref({ nome: '', email: '', telefone: '' })
let pedingConfirmation = false

onMounted(async () => {
  initLocalUser()
  if (localUser.value) {
    formUser.value = { ...localUser.value }
  }
  
  // Buscar config do serviço atual p mostrar cabecalho
  try {
    const list = await $fetch<any[]>(`${config.public.apiBase}/public/servicos`)
    servico.value = list.find(s => s.id === route.params.id)
  } catch(e) {}
})

const formatData = (iso: string) => {
  if (!iso) return ''
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

const buscarHorarios = async () => {
  horaEscolhida.value = ''
  if (!dataEscolhida.value) return
  
  loadingSlots.value = true
  slots.value = []
  
  try {
    const res = await $fetch<string[]>(`${config.public.apiBase}/public/agendamentos/disponibilidade`, {
      params: { servicoId: route.params.id, data: dataEscolhida.value }
    })
    slots.value = res
  } catch(e) {
    Swal.fire('Ooops', 'Falha ao buscar horários para a data.', 'error')
  } finally {
    loadingSlots.value = false
  }
}

const selecionarHorario = (time: string) => {
  horaEscolhida.value = time
}

const salvarDadosUser = () => {
  saveLocalUser(formUser.value)
  showModal.value = false
  if (pedingConfirmation) {
    pedingConfirmation = false
    efetuarAgendamento()
  }
}

const confirmarAgendamento = () => {
  if (!localUser.value) {
    pedingConfirmation = true
    showModal.value = true
    return
  }
  efetuarAgendamento()
}

const efetuarAgendamento = async () => {
  loadingSubmit.value = true
  
  try {
    const startIso = `${dataEscolhida.value}T${horaEscolhida.value}:00Z`
    
    // Calcula fim
    const [h, m] = horaEscolhida.value.split(':').map(Number)
    const dt = new Date(1970, 0, 1, h, m)
    dt.setMinutes(dt.getMinutes() + (servico.value?.duracaoMinutos || 0))
    const endStr = dt.toTimeString().substring(0,5)
    const endIso = `${dataEscolhida.value}T${endStr}:00Z`

    const payload = {
      servicoId: route.params.id,
      userId: localUser.value.email, // UID Mocked by Email
      horarioInicio: startIso,
      horarioFim: endIso,
      nomeCliente: localUser.value.nome,
      emailCliente: localUser.value.email,
      telefoneCliente: localUser.value.telefone
    }

    await $fetch(`${config.public.apiBase}/public/agendamentos`, {
      method: 'POST',
      body: payload
    })

    await Swal.fire({
      title: 'Agendamento Confirmado!',
      html: `Seu horário para <b>${servico.value?.nome}</b> foi marcado com sucesso para dia <b>${formatData(dataEscolhida.value)}</b> às <b>${horaEscolhida.value}</b>.`,
      icon: 'success',
      confirmButtonColor: '#2563eb'
    })
    
    navigateTo('/')

  } catch (e) {
    Swal.fire('Erro!', 'Não foi possível confirmar o agendamento. Tente outro horário.', 'error')
  } finally {
    loadingSubmit.value = false
  }
}
</script>
