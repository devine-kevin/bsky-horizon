import { render } from 'solid-js/web'
import App from './App'
import { AuthProvider } from './context/AuthContext'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found.')
}

render(
  () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
  root!
)
