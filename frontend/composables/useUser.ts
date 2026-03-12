export const useUser = () => {
  const localUser = useState<any>('local-user', () => null)

  const initLocalUser = () => {
    if (import.meta.server) return
    const stored = localStorage.getItem('agendamento_user')
    if (stored) {
      localUser.value = JSON.parse(stored)
    }
  }

  const saveLocalUser = (user: any) => {
    localUser.value = user
    if (import.meta.client) {
      localStorage.setItem('agendamento_user', JSON.stringify(user))
    }
  }

  const clearLocalUser = () => {
    localUser.value = null
    if (import.meta.client) {
      localStorage.removeItem('agendamento_user')
    }
  }

  return { localUser, initLocalUser, saveLocalUser, clearLocalUser }
}
