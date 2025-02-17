import { createSignal, onMount } from 'solid-js'
import { useParams } from '@solidjs/router'
import { getList, getStarterPack } from '../utils/api.js'
import PageHeader from '../components/PageHeader'
import JsonTree from '../components/JsonTree'
import ListDetails from '../components/ListDetails'
import ItemList from '../components/ItemList'

async function getRecord(args) {
  console.log('args:', args)
  let data
  if (args.includes('app.bsky.graph.starterpack')) {
    data = await getStarterPack('at://' + args.join('/'))
    data.collection = 'app.bsky.graph.starterpack'
  } else {
    data = await getList('at://' + args.join('/'))
    data.collection = 'app.bsky.graph.list'
  }
  console.log('List result:', data)
  return data
}

function RecordView() {
  const params = useParams()
  const [record, setRecord] = createSignal<string | null>(null)
  const [error, setError] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [moreListDetails, setMoreListDetails] = createSignal(false)

  onMount(async () => {
    setLoading(true)
    try {
      const data = await getRecord([
        params.repo,
        params.collection,
        params.rkey,
      ])
      setRecord(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  })

  return (
    <div
      id="main"
      class="w-full"
    >
      <PageHeader />
      <Show when={loading()}>
        <div class="mt-4 p-2 text-gray-500 text-center">Searching...</div>
      </Show>
      <Show when={error()}>
        <div class="mt-4 p-2 text-red-500 text-center">{error()}</div>
      </Show>
      <Show when={record()}>
        <div class="mt-4 p-2">
          <Show when={record().collection === 'app.bsky.graph.starterpack'}>
            <JsonTree data={record().starterPack} />
          </Show>
          <Show when={record().collection === 'app.bsky.graph.list'}>
            <ListDetails list={record().list} />
          </Show>
          <Show when={record().items?.length}>
            <ItemList items={record().items} />
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default RecordView
