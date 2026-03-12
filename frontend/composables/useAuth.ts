import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

export const useAuth = () => {
  const user = useState<User | null>('firebase-user', () => null)
  const isAdmin = useState<boolean>('firebase-isAdmin', () => false)
  const isAuthReady = useState<boolean>('firebase-auth-ready', () => false)

  const checkAdminPrivileges = async (uid: string, email: string) => {
    try {
      const { $db } = useNuxtApp()
      const db = $db as ReturnType<typeof getFirestore>
      
      // Checa pelo email se existe na colecao usuarios_admin (ou UID, no caso testamos pelo UID que pode ser criado de base no banco com email como ID, ou consultando a collection)
      // Como o requirement pede lista de emails, usaremos a chave do documento como o próprio email para fácil consulta O(1)
      const adminDoc = await getDoc(doc(db, 'usuarios_admin', email))
      return adminDoc.exists()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const initAuth = () => {
    if (import.meta.server) return
    const { $auth } = useNuxtApp()
    const auth = $auth as ReturnType<typeof getAuth>
    
    onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser
      if (currentUser && currentUser.email) {
        isAdmin.value = await checkAdminPrivileges(currentUser.uid, currentUser.email)
      } else {
        isAdmin.value = false
      }
      isAuthReady.value = true
    })
  }

  const signOut = async () => {
    const { $auth } = useNuxtApp()
    const auth = $auth as ReturnType<typeof getAuth>
    await firebaseSignOut(auth)
    user.value = null
    isAdmin.value = false
  }

  return {
    user,
    isAdmin,
    isAuthReady,
    initAuth,
    signOut
  }
}
