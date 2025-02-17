import { createSignal, createResource } from 'solid-js'
import {
  getList,
  getStarterPack,
  normalizeUri,
  resolveHandle,
} from '../utils/api.js'
import JsonTree from './JsonTree'
import ListDetails from './ListDetails'
import ItemList from './ItemList'

async function processInput(formData: FormData) {
  const input = formData.get('input')
  ;(document.getElementById('uriForm') as HTMLFormElement).reset()
  if (!input) {
    throw new Error('Input is required')
  }
  const uri = normalizeUri(input)
  const uriParts = uri.split('/')
  let data
  if (uriParts.includes('app.bsky.graph.starterpack')) {
    data = await getStarterPack(uri)
    data.collection = 'app.bsky.graph.starterpack'
  } else {
    data = await getList(uri)
    data.collection = 'app.bsky.graph.list'
  }
  console.log('List result:', data)
  return data
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
        <div class="mt-4 p-2 text-gray-500 text-center">Searching...</div>
      </Show>
      <Show when={error()}>
        <div class="mt-4 p-2 text-red-500 text-center">{error()}</div>
      </Show>
      <Show when={result()}>
        <div class="mt-4 p-2">
          <Show when={result().collection === 'app.bsky.graph.starterpack'}>
            <JsonTree data={result().starterPack} />
          </Show>
          <Show when={result().collection === 'app.bsky.graph.list'}>
            <ListDetails list={result().list} />
          </Show>
          <Show when={result().items?.length}>
            <ItemList items={result().items} />
          </Show>
        </div>
      </Show>
    </>
  )
}

export default Search
