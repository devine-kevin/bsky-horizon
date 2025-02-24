import { createEffect, createSignal } from 'solid-js'
import { useParams } from '@solidjs/router'
import {
  getActorStarterPacks,
  getActorFeeds,
  getLists,
  getProfile,
  resolveHandle,
} from '../utils/api.js'
import PageHeader from '../components/PageHeader'
import SideNav from '../components/SideNav'
import JsonTree from '../components/JsonTree'

async function getRecord(args) {
  const handle = args[0]
  let did: string
  did = handle.replace('at://', '').startsWith('did:')
    ? handle
    : await resolveHandle(handle)

  try {
    const [profile, lists, starterPacks, feeds] = await Promise.all([
      getProfile(did),
      getLists(did),
      getActorStarterPacks(did),
      getActorFeeds(did),
    ])
    return { profile, starterPacks, lists, feeds }
  } catch (error) {
    console.error('Error fetching record data:', error)
    throw new Error('Failed to retrieve record data.')
  }
}

function ProfileView() {
  const params = useParams()
  const [record, setRecord] = createSignal<RecordType | null>(null)
  const [error, setError] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(false)

  const [isNavOpen, setIsNavOpen] = createSignal(true)
  const [expandPacks, setExpandPacks] = createSignal(false)
  const [expandLists, setExpandLists] = createSignal(false)
  const [expandFeeds, setExpandFeeds] = createSignal(false)

  createEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await getRecord([params.handle])
        console.log(data)
        setRecord(data ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    })()
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
        <div class="flex">
          <SideNav handle={params.handle} />
          <div class="w-full p-2 overflow-y-scroll overscroll-y-auto overscroll-x-contain no-scrollbar">
            <JsonTree data={record().profile} />
          </div>
        </div>
      </Show>
    </div>
  )
}

export default ProfileView
