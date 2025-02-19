import { Router, Route } from '@solidjs/router'
import Home from './views/Home'
import RecordView from './views/RecordView'
import 'virtual:uno.css'
import './styles/tailwind-compat.css'
import './styles/index.css'
import './styles/icons.css'

function App() {
  return (
    <Router source="history">
      <Route
        path="/"
        component={Home}
      />
      <Route
        path="/:at/:repo/:collection/:rkey"
        component={RecordView}
      />
      <Route
        path="*"
        component={NotFound}
      />
    </Router>
  )
}

function NotFound() {
  return (
    <div
      id="main"
      class="w-full"
    >
      <PageHeader />
      <div class="mt-4 p-2 text-red-500 text-center">404 - Page Not Found</div>
    </div>
  )
}

export default App
