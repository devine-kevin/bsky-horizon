import { createContext, useContext } from 'solid-js'
import { createAuthStore } from '../stores/AuthStore'

const AuthContext = createContext()

export function AuthProvider(props) {
  const store = createAuthStore()

  store.initAuth()

  return (
    <AuthContext.Provider value={store}>{props.children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
