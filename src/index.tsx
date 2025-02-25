import { render } from 'solid-js/web'
import App from './App'
import { UserProvider } from './context/UserProvider'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found.')
}

render(
  () => (
    <UserProvider>
      <App />
    </UserProvider>
  ),
  root!
)
