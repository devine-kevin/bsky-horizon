import { createSignal, createResource } from 'solid-js'
import { getList, resolveHandle } from '../utils/api.js'
import JsonTree from './JsonTree'
import ListDetails from './ListDetails'
import ItemList from './ItemList'

async function processInput(formData: FormData) {
  const input = formData.get('input')
  ;(document.getElementById('uriForm') as HTMLFormElement).reset()

  if (!input) {
    throw new Error('Input is required')
  }

  const uri = input
    .replace('at://', '')
    .replace('https://bsky.app/profile/', '')
    .replace('https://main.bsky.dev/profile/', '')
    .replace('/lists/', '/app.bsky.graph.list/')

  const uriParts = uri.split('/')
  const actor = uriParts[0]
  let did: string
  did = uri.startsWith('did:') ? actor : await resolveHandle(actor)
  return getList(['at://', did, '/', uriParts.slice(1).join('/')].join(''))
}

function Search() {
  const [result, setResult] = createSignal<string | null>(null)
  const [error, setError] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [moreListDetails, setMoreListDetails] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    if (formData.get('input').length === 0 && result() !== null) {
      return
    }
    setResult(null)
    setError(false)
    setLoading(true)
    try {
      const result = await processInput(formData)
      console.log('Form submitted, result:', result)
      setResult(result)
    } catch (error) {
      setError(error.message)
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
      <Show when={loading()}>
        <div class="text-gray-500">Searching...</div>
      </Show>
      <Show when={error()}>
        <div class="text-red-500">{error()}</div>
      </Show>
      <Show when={result() && result()?.items?.length}>
        <div class="mt-4 p-2">
          <ListDetails list={result().list} />
          <ItemList items={result().items} />
        </div>
      </Show>
    </>
  )
}

export default Search
