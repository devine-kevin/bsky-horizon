const getList = async (uri: string) => {
  try {
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.graph.getList?limit=100&list=${uri}`
    )
    if (!response.ok) {
      throw new Error('List not found')
    }
    const data = await response.json()
    /*
    data.list.sort(
      (a, b) =>
        new Date(a.subject.createdAt).getTime() -
        new Date(b.subject.createdAt).getTime()
    )
    */
    return data
  } catch (error) {
    throw error
  }
}

const resolveHandle = async (handle: string) => {
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

export { getList, resolveHandle }
