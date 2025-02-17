import { Router, Route } from '@solidjs/router'
import Home from './views/Home'
import RecordView from './views/RecordView'
import 'virtual:uno.css'
import './styles/tailwind-compat.css'
import './styles/index.css'
import './styles/icons.css'

function App() {
  return (
    <Router>
      <Route
        path="/"
        component={Home}
      />
      <Route
        path="/:at/:repo/:collection/:rkey"
        component={RecordView}
      />
    </Router>
  )
}

export default App
