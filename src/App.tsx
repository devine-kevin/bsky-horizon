import { lazy } from 'solid-js';
import { Router, Route } from '@solidjs/router'
import Home from './views/Home'
import PageHeader from './components/PageHeader'
import 'virtual:uno.css'
import './styles/tailwind-compat.css'
import './styles/index.css'
import './styles/icons.css'

const About = lazy(() => import('./views/About'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const RecordView = lazy(() => import('./views/RecordView'));

function App() {
  return (
    <Router source="history">
      <Route
        path="/"
        component={Home}
      />
      <Route
        path="/about"
        component={About}
      />
      <Route
        path="/:at/:handle"
        component={ProfileView}
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
