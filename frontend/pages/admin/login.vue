<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8 rounded-xl" elevation="2">
          <div class="text-center mb-8">
            <h2 class="text-h4 font-weight-black text-primary mb-2">Admin Login</h2>
            <p class="text-body-2 text-medium-emphasis">Acesse o painel para gerenciar os agendamentos</p>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email Administrativo"
              placeholder="admin@exemplo.com"
              type="email"
              variant="outlined"
              color="primary"
              class="mb-4"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Senha"
              placeholder="••••••••"
              type="password"
              variant="outlined"
              color="primary"
              class="mb-6"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              size="x-large"
              block
              class="rounded-lg text-none font-weight-bold"
              :loading="loading"
              elevation="1"
            >
              Entrar
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import Swal from 'sweetalert2'

definePageMeta({
  layout: false,
  middleware: ['admin'] // vai ignorar se a pessoa estiver deslogada, ou redirecionar se já for admin
})

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const { $auth } = useNuxtApp()
    const auth = $auth as ReturnType<typeof getAuth>
    
    // Tenta autenticar
    await signInWithEmailAndPassword(auth, email.value, password.value)
    
    // Auth composable `onAuthStateChanged` vai triggar automaticamente
    // E no callback dele que checamos as permissoes de firestore.
    // Vamos esperar um tempo ate "isAdmin" atualizar la no middleware ou manualmente aqui
    
    await new Promise(r => setTimeout(r, 1000)) // esperar firestore getDoc
    const { isAdmin } = useAuth()
    
    if (isAdmin.value) {
      navigateTo('/admin')
    } else {
      loading.value = false
      const authObj = getAuth()
      await authObj.signOut() // Desloga a pessoa q é random e não é Admin
      
      Swal.fire({
        title: 'Acesso Negado!',
        text: 'Seu usuário não possui permissões administrativas. Entre em contato para ativar sua conta.',
        icon: 'error',
        confirmButtonColor: '#2563eb'
      })
    }
  } catch (error: any) {
    loading.value = false
    
    let mensagemErro = 'Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.'
    
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      mensagemErro = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
    } else if (error.code === 'auth/invalid-email') {
      mensagemErro = 'O formato do email fornecido é inválido.'
    } else if (error.code === 'auth/too-many-requests') {
      mensagemErro = 'Muitas tentativas falhas. Sua conta foi temporariamente bloqueada. Tente novamente mais tarde.'
    } else if (error.code === 'auth/network-request-failed') {
      mensagemErro = 'Falha na conexão com a internet. Verifique sua rede.'
    }

    Swal.fire({
      title: 'Erro no Login',
      text: mensagemErro,
      icon: 'error',
      confirmButtonColor: '#2563eb'
    })
  }
}
</script>
