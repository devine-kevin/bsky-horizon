import { createStore } from 'solid-js/store'
import {
  configureOAuth,
  createAuthorizationUrl,
  deleteStoredSession,
  finalizeAuthorization,
  getSession,
  OAuthUserAgent,
  resolveFromIdentity,
  type Session,
} from '@atcute/oauth-browser-client'
import { At } from '@atcute/client/lexicons'

configureOAuth({
  metadata: {
    client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  },
})

export function createAuthStore() {
  const [state, setState] = createStore({
    user: null,
    agent: OAuthUserAgent,
    isLoggedIn: false,
    isModalOpen: false,
    handle: '',
    error: null,
    isLoading: false,
  })

  async function initAuth() {
    const session = await retrieveSession()
    if (session) {
      try {
        setState({
          user: localStorage.getItem('lastSignedIn'),
          agent: new OAuthUserAgent(session),
          isLoggedIn: true,
        })
      } catch (e) {
        console.error('Failed to restore auth state', e)
        logout()
      }
    }
  }

  function openLoginModal() {
    setState('isModalOpen', true)
  }

  function closeLoginModal() {
    setState('isModalOpen', false)
  }

  function setHandle(newHandle) {
    setState('handle', newHandle)
  }

  async function login(credentials) {
    try {
      const { identity, metadata } = await resolveFromIdentity(
        credentials.handle
      )
      const authUrl = await createAuthorizationUrl({
        metadata: metadata,
        identity: identity,
        scope: import.meta.env.VITE_OAUTH_SCOPE,
      })

      await new Promise((resolve) => setTimeout(resolve, 250))
      location.assign(authUrl)

      await new Promise((_resolve, reject) => {
        const listener = () => {
          reject(new Error(`user aborted the login request`))
        }
        window.addEventListener('pageshow', listener, { once: true })
      })
    } catch (e) {
      throw e
    }
  }

  async function logout() {
    setState({
      user: null,
      isLoggedIn: false,
    })

    const did = localStorage.getItem('lastSignedIn')

    try {
      const session = await getSession(did, { allowStale: true })
      const userAgent = new OAuthUserAgent(session)
      await userAgent.signOut()
    } catch (err) {
      deleteStoredSession(did)
    } finally {
      localStorage.removeItem('lastSignedIn')
    }
  }

  async function retrieveSession() {
    const init = async (): Promise<Session | undefined> => {
      const params = new URLSearchParams(location.hash.slice(1))
      if (params.has('state') && (params.has('code') || params.has('error'))) {
        history.replaceState(null, '', location.pathname + location.search)
        const session = await finalizeAuthorization(params)
        const did = session.info.sub
        localStorage.setItem('lastSignedIn', did)
        return session
      } else {
        const lastSignedIn = localStorage.getItem('lastSignedIn')
        if (lastSignedIn) {
          try {
            return await getSession(lastSignedIn)
          } catch (err) {
            deleteStoredSession(lastSignedIn)
            localStorage.removeItem('lastSignedIn')
            throw err
          }
        }
      }
    }
    const session = await init().catch(() => {})
    return session
  }

  return {
    get state() {
      return state
    },
    initAuth,
    openLoginModal,
    closeLoginModal,
    setHandle,
    login,
    logout,
    retrieveSession,
  }
}
