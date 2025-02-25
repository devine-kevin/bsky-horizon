import { createContext, createSignal, onMount, useContext } from 'solid-js'
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

const UserContext = createContext()

configureOAuth({
  metadata: {
    client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  },
})

export function UserProvider(props) {
  const [user, setUser] = createSignal(null)
  let agent: OAuthUserAgent

  onMount(async () => {
    const lastSignedIn = localStorage.getItem('lastSignedIn')
    const userStore = localStorage.getItem('user')
    console.log('lastSignedIn', lastSignedIn)
    console.log('userStore', userStore)
    try {
      await retrieveSession()
    } catch (e) {
      console.error(e)
    }
  })

  const login = async (data) => {
    try {
      const { identity, metadata } = await resolveFromIdentity(data.handle)
      console.log(import.meta.env)
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
      console.error(e)
      throw e
    }
    setUser(data.handle)
    localStorage.setItem('user', JSON.stringify(handle))
  }

  const logout = () => {
    setUser(null)
    deleteStoredSession(lastSignedIn as At.DID)
    localStorage.removeItem('lastSignedIn')
    localStorage.removeItem('user')
  }

  const retrieveSession = async () => {
    const init = async (): Promise<Session | undefined> => {
      const params = new URLSearchParams(location.hash.slice(1))
      console.log(
        'params',
        params.get('state'),
        params.get('code'),
        params.get('error')
      )

      if (params.has('state') && (params.has('code') || params.has('error'))) {
        //history.replaceState(null, '', location.pathname + location.search)

        try {
          const session = await finalizeAuthorization(params)
          const did = session.info.sub
          console.log('did', did)
          localStorage.setItem('lastSignedIn', did)
          return session
        } catch (e) {
          console.error(e)
          throw e
        }
      } else {
        const lastSignedIn = localStorage.getItem('lastSignedIn')
        if (lastSignedIn) {
          try {
            return await getSession(lastSignedIn as At.DID)
          } catch (err) {
            deleteStoredSession(lastSignedIn as At.DID)
            localStorage.removeItem('lastSignedIn')
            throw err
          }
        }
      }
    }

    const session = await init().catch(() => {})
    console.log('session', session)
    if (session) {
      agent = new OAuthUserAgent(session)
    }
  }

  return (
    <UserContext.Provider value={{ agent, user, login, logout }}>
      {props.children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
