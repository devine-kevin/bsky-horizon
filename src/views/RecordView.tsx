import { createEffect, createSignal } from 'solid-js'
import { useParams } from '@solidjs/router'
import { getList, getStarterPack, normalizeUri } from '../utils/api.js'
import PageHeader from '../components/PageHeader'
import SideNav from '../components/SideNav'
import JsonTree from '../components/JsonTree'
import ListDetails from '../components/ListDetails'
import ItemList from '../components/ItemList'

async function getRecord(args) {
  const uri = await normalizeUri('at://' + args.join('/'))
  let data
  if (args.includes('app.bsky.graph.starterpack')) {
    data = await getStarterPack(uri)
    data.collection = 'app.bsky.graph.starterpack'
    data.handle = data.starterPack.creator.handle
  } else {
    data = await getList(uri)
    data.collection = 'app.bsky.graph.list'
    data.handle = data.list.creator.handle
  }
  return data
}

function RecordView() {
  const params = useParams()
  const [record, setRecord] = createSignal<string | null>(null)
  const [error, setError] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [moreListDetails, setMoreListDetails] = createSignal(false)

  createEffect(async () => {
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
      <div class="flex">
        <Show when={error()}>
          <div class="mt-1 p-2 text-red-500 text-center">{error()}</div>
        </Show>
        <Show when={record()}>
          <SideNav handle={record().handle} />
          <div class="p-2 overflow-scroll">
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
    </div>
  )
}

export default RecordView
