import { Router, Route } from '@solidjs/router'
import Search from './components/search'
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
        path="/search"
        component={Search}
      />
    </Router>
  )
}

function Home() {
  return (
    <div id="main">
      <div class="mb-2 flex gap-2 items-center">
        <div class="i-horizon-logo"></div>
        <div>bsky - horizon</div>
      </div>
      <div></div>
      <Search />
    </div>
  )
}

export default App
