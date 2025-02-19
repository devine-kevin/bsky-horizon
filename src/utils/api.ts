const getList = async (uri: string) => {
  try {
    const uriParts = uri.replace('at://', '').split('/')
    const handle = uriParts[0]
    let did: string
    did = uri.replace('at://', '').startsWith('did:')
      ? handle
      : await resolveHandle(handle)
    const atUri = 'at://' + did + '/' + uriParts.slice(1).join('/')
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.graph.getList?limit=100&list=${atUri}`
    )
    if (!response.ok) {
      throw new Error('List not found')
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

const getStarterPack = async (uri: string) => {
  try {
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.graph.getStarterPack?starterPack=${uri}`
    )
    if (!response.ok) {
      throw new Error('List not found')
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

const getProfile = async (did: string) => {
  try {
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`
    )
    if (!response.ok) {
      throw new Error('Profile not found')
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

const getProfiles = async (actors: string[]) => {
  const MAX_ACTORS_PER_REQUEST = 25
  const batches = []

  for (let i = 0; i < actors.length; i += MAX_ACTORS_PER_REQUEST) {
    batches.push(actors.slice(i, i + MAX_ACTORS_PER_REQUEST))
  }

  const responses = await Promise.all(
    batches.map(async (batch) => {
      const url = new URL(
        'https://public.api.bsky.app/xrpc/app.bsky.actor.getProfiles'
      )
      batch.forEach((actor) => url.searchParams.append('actors[]', actor))
      try {
        const response = await fetch(url)
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        return response.json()
      } catch (error) {
        return null
      }
    })
  )
  const allProfilesArray = responses.map((res) => res.profiles).flat()
  const allProfiles = allProfilesArray.reduce((acc, profile) => {
    acc[profile.did] = profile
    return acc
  }, {})
  return allProfiles
}

const normalizeUri = async (uri: string) => {
  let authority: string
  let collection: string
  let rkey: string

  if (uri.includes('go.bsky.app')) {
    try {
      uri = await fetchRedirectedUri(uri)
    } catch (error) {
      throw error
    }
  }

  const atUri = uri
    .replace('at://', '')
    .replace('https://', '')
    .replace('bsky.app/', '')
    .replace('main.bsky.dev/', '')
    .replace('profile/', '')
    .replace('starter-pack', 'app.bsky.graph.getStarterPack')
    .replace('lists', 'app.bsky.graph.list')

  const uriParts = atUri.split('/')

  if (uriParts.includes('app.bsky.graph.list')) {
    authority = uriParts[0]
    collection = uriParts[1]
    rkey = uriParts[2]
  }
  if (uriParts.includes('app.bsky.graph.getStarterPack')) {
    authority = uriParts[1]
    collection = 'app.bsky.graph.starterpack'
    rkey = uriParts[2]
  }
  if (uriParts.includes('app.bsky.graph.starterpack')) {
    authority = uriParts[0]
    collection = uriParts[1]
    rkey = uriParts[2]
  }
  return `at://${authority}/${collection}/${rkey}`
}

const fetchRedirectedUri = async (uri: string) => {
  try {
    const response = await fetch(
      `https://kvndvn.social/api/goBsky?url=${uri}`,
      {
        method: 'GET',
        mode: 'cors',
      }
    )
    const data = await response.json()
    if (!data.location) {
      throw new Error('List location not found')
    }
    return data.location.replace('start', 'starter-pack')
  } catch (error) {
    throw new Error('Invalid URI: ' + uri)
  }
}

const resolveHandle = async (handle: string) => {
  if (handle.startsWith('did:')) {
    return handle
  }
  try {
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
    )
    if (!response.ok) {
      throw new Error('Handle not found')
    }
    const data = await response.json()
    return data.did
  } catch (error) {
    throw error
  }
}

export {
  getList,
  getProfile,
  getProfiles,
  getStarterPack,
  normalizeUri,
  resolveHandle,
}
