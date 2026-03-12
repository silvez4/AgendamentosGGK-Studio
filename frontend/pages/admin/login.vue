<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-900">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-blue-600">Admin Login</h2>
        <p class="text-gray-500 mt-2 text-sm">Acesse o painel para gerenciar os agendamentos</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email Administrativo</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="admin@exemplo.com"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Senha</label>
          <input 
            v-model="password" 
            type="password" 
            required
            placeholder="••••••••"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
        >
           <span v-if="!loading">Entrar</span>
           <span v-else>Autenticando...</span>
        </button>
      </form>
    </div>
  </div>
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
