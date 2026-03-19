<template>
  <v-container class="max-w-3xl mx-auto space-y-6 pt-6">
    <v-card class="pa-6 rounded-xl mb-6 border-0" elevation="1">
      <div class="d-flex align-center justify-space-between">
        <div>
          <v-btn variant="text" size="small" to="/" class="mb-2 text-none font-weight-bold text-primary" prepend-icon="mdi-arrow-left">
            Voltar aos Serviços
          </v-btn>
          <h2 class="text-h5 font-weight-bold text-primary" style="font-family: serif;">Escolha o Horário</h2>
          <p class="text-secondary text-body-2 mt-1 font-weight-medium" v-if="servico">
            Serviço: <span class="font-weight-bold">{{ servico.nome }}</span> ({{ servico.duracaoMinutos }} min)
          </p>
        </div>
      </div>
    </v-card>

    <!-- Container Calendario e Slots -->
    <v-card class="rounded-xl overflow-hidden mb-16 border-0" elevation="1">
      <v-row no-gutters>
         <!-- Lado Esquerdo: Data -->
         <v-col cols="12" md="6" class="pa-6 border-e-md border-b border-b-md-0" style="background-color: #fafcfb;">
            <div class="text-caption font-weight-bold text-secondary text-uppercase mb-4">Selecione uma Data</div>
            <v-text-field 
              type="date" 
              v-model="dataEscolhida"
              :min="hoje"
              @change="buscarHorarios"
              variant="outlined"
              density="comfortable"
              bg-color="white"
              hide-details
              class="font-weight-bold text-primary"
              color="primary"
            ></v-text-field>
            
            <div class="mt-8">
              <v-card v-if="localUser" class="bg-brown-lighten-5 border-brown-lighten-4" variant="outlined" elevation="0">
                 <v-card-text>
                   <div class="text-caption text-secondary font-weight-bold mb-1">Marcando como:</div>
                   <div class="text-h6 font-weight-bold text-primary leading-tight">{{ localUser.nome }}</div>
                   <div class="text-body-2 text-secondary">{{ localUser.email }}</div>
                   <v-btn variant="text" size="x-small" color="primary" class="mt-2 text-none font-weight-bold px-0" @click="showModal = true">
                     Editar meus dados
                   </v-btn>
                 </v-card-text>
              </v-card>
              <v-card v-else class="bg-grey-lighten-4 border-transparent" variant="flat">
                 <v-card-text class="text-center text-body-2 text-medium-emphasis">
                   Será requisitado seus dados para finalizar o agendamento.
                 </v-card-text>
              </v-card>
            </div>
         </v-col>

         <!-- Lado Direito: Horários -->
         <v-col cols="12" md="6" class="pa-6 d-flex flex-column">
            <div class="text-caption font-weight-bold text-secondary text-uppercase mb-4">Horários Disponíveis</div>
            
            <div v-if="loadingSlots" class="flex-grow-1 d-flex align-center justify-center">
              <div class="text-secondary font-weight-medium">Buscando disponibilidade...</div>
            </div>
            
            <div v-else-if="!dataEscolhida" class="flex-grow-1 d-flex align-center justify-center text-center">
               <span class="text-secondary font-weight-medium">Escolha uma data ao lado <br> para ver os horários.</span>
            </div>

            <div v-else-if="slots.length === 0" class="flex-grow-1 d-flex flex-column align-center justify-center text-center">
               <v-icon size="48" color="secondary" class="mb-2 opacity-50">mdi-calendar-remove</v-icon>
               <h4 class="font-weight-bold text-primary">Sem horários</h4>
               <p class="text-secondary text-body-2 mt-1 px-4">Não há disponibilidade para esta data. Tente outro dia.</p>
            </div>

            <div v-else class="d-flex flex-wrap gap-2">
               <v-btn
                 v-for="time in slots" 
                 :key="time"
                 @click="selecionarHorario(time)"
                 :color="horaEscolhida === time ? 'primary' : undefined"
                 :variant="horaEscolhida === time ? 'elevated' : 'outlined'"
                 class="font-weight-bold"
                 min-width="100"
                 height="48"
               >
                 {{ time }}
               </v-btn>
            </div>
         </v-col>
      </v-row>
    </v-card>

    <!-- Fixed Bottom Bar for Confirmation -->
    <v-bottom-navigation v-if="horaEscolhida" bg-color="white" active class="elevation-4 pt-2 pb-2" height="auto" style="border-top: 1px solid #eee;">
       <v-container class="max-w-3xl py-0 d-flex align-center justify-space-between">
          <div>
            <div class="text-caption text-medium-emphasis font-weight-medium">Data escolhida:</div>
            <div class="text-h6 font-weight-bold text-grey-darken-4">{{ formatData(dataEscolhida) }} às {{ horaEscolhida }}</div>
          </div>
          <v-btn 
             color="success"
             size="x-large"
             class="text-none font-weight-bold rounded-lg px-6"
             :loading="loadingSubmit"
             @click="confirmarAgendamento"
          >
             Confirmar Agendamento
          </v-btn>
       </v-container>
    </v-bottom-navigation>

    <!-- Modal de Dados -->
    <v-dialog v-model="showModal" max-width="450" persistent>
      <v-card class="rounded-xl pa-2">
        <v-card-title class="text-h5 font-weight-bold mb-1">Seus Dados</v-card-title>
        <v-card-subtitle class="text-body-2 mb-4">Preencha rapidamente para salvar seu horário.</v-card-subtitle>
        
        <v-card-text>
          <v-form @submit.prevent="salvarDadosUser" id="user-form">
            <v-text-field v-model="formUser.nome" label="Nome Completo" variant="outlined" density="comfortable" required class="mb-2"></v-text-field>
            <v-text-field v-model="formUser.email" type="email" label="E-mail" variant="outlined" density="comfortable" required class="mb-2"></v-text-field>
            <v-text-field v-model="formUser.telefone" type="tel" label="Telefone / WhatsApp" variant="outlined" density="comfortable" required></v-text-field>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" class="text-none font-weight-bold" @click="showModal = false">Cancelar</v-btn>
          <v-btn color="primary" type="submit" form="user-form" variant="flat" class="rounded-lg px-6 font-weight-bold text-none">Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
    const fusoBr = '-03:00'
    const startIso = `${dataEscolhida.value}T${horaEscolhida.value}:00${fusoBr}`
    
    // Calcula fim
    const [h, m] = horaEscolhida.value.split(':').map(Number)
    const dt = new Date(1970, 0, 1, h, m)
    dt.setMinutes(dt.getMinutes() + (servico.value?.duracaoMinutos || 0))
    const endStr = dt.toTimeString().substring(0,5)
    const endIso = `${dataEscolhida.value}T${endStr}:00${fusoBr}`

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

    const wppMsg = encodeURIComponent(`Olá, realizei o agendamento de ${servico.value?.nome} no dia ${formatData(dataEscolhida.value)} às ${horaEscolhida.value}. Nome do cliente: ${localUser.value.nome}.`)
    const mailSubj = encodeURIComponent(`Confirmação de Agendamento - ${localUser.value.nome}`)

    const result = await Swal.fire({
      title: 'Reserva Registrada!',
      html: `
        <p class="mb-4">Seu horário para <b>${servico.value?.nome}</b> no dia <b>${formatData(dataEscolhida.value)}</b> às <b>${horaEscolhida.value}</b> foi alocado.</p>
        <p class="text-sm font-weight-bold" style="color: #666;">Enviamos uma notificação para o estúdio! Clique no botão abaixo para chamar no WhatsApp e garantir sua vaga.</p>
      `,
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '<i class="mdi mdi-whatsapp"></i> Chamar no WhatsApp',
      confirmButtonColor: '#25d366',
      cancelButtonText: 'Apenas Voltar',
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
    
    if (result.isConfirmed) {
      window.open(`https://wa.me/5574988050436?text=${wppMsg}`, '_blank')
    }
    
    navigateTo('/')

  } catch (e) {
    Swal.fire('Erro!', 'Não foi possível confirmar o agendamento. Tente outro horário.', 'error')
  } finally {
    loadingSubmit.value = false
  }
}
</script>
