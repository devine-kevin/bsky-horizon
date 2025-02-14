import { createSignal } from 'solid-js'

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

async function processInput(formData: FormData) {
  const input = formData.get('input')
  ;(document.getElementById('uriForm') as HTMLFormElement).reset()

  if (!input) return new Error('Empty input')

  const uri = input
    .replace('at://', '')
    .replace('https://bsky.app/profile/', '')
    .replace('https://main.bsky.dev/profile/', '')
    .replace('/lists/', '/app.bsky.graph.list/')

  const uriParts = uri.split('/')
  const actor = uriParts[0]
  return uri.startsWith('did:') ? actor : await resolveHandle(actor)
}

function Search() {
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    try {
      const result = await processInput(formData)
      console.log('Form submitted, result:', result)
    } catch (error) {
      console.error('Error during submission:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        class="flex flex-col items-center gap-y-1"
        id="uriForm"
        method="post"
        onSubmit={handleSubmit}
      >
        <div class="flex items-center gap-x-2">
          <input
            type="text"
            id="input"
            name="input"
            class="dark:bg-dark-100 rounded-lg border border-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
            spellcheck={false}
            placeholder="List..."
          />
          <button
            type="submit"
            class="dark:bg-dark-700 dark:hover:bg-dark-800 rounded-lg border border-gray-400 bg-white px-2.5 py-1.5 text-sm font-bold hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            Go
          </button>
        </div>
      </form>
    </>
  )
}

/*
      <Show when={submission.error}>
        {(err) => <div class="mt-3">{err().message}</div>}
      </Show>
      */

export default Search
