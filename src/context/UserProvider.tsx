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

const retrieveSession = async () => {
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
  return session
}

let agent: OAuthUserAgent

try {
  const session = await retrieveSession()
  if (session) {
    agent = new OAuthUserAgent(session)
  }
} catch (err) {
  throw err
} finally {
  const lastSignedIn = localStorage.getItem('lastSignedIn')
}

export { agent }

export function UserProvider(props) {
  const login = async (data) => {
    try {
      const { identity, metadata } = await resolveFromIdentity(data.handle)
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

  const logout = async () => {
    try {
      const session = await getSession(did, { allowStale: true })
      const userAgent = new OAuthUserAgent(session)
      await userAgent.signOut()
    } catch (err) {
      deleteStoredSession(localStorage.getItem('lastSignedIn'))
    } finally {
      localStorage.removeItem('lastSignedIn')
    }
  }

  return (
    <UserContext.Provider value={{ login, logout }}>
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
