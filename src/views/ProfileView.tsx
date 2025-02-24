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

  const [isNavOpen, setIsNavOpen] = createSignal(false)
  const [expandPacks, setExpandPacks] = createSignal(false)
  const [expandLists, setExpandLists] = createSignal(false)
  const [expandFeeds, setExpandFeeds] = createSignal(false)

  createEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await getRecord([params.handle])
        console.log(data)
        setRecord(data ?? null) // Ensure it's never undefined
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
          <button
            class="bg-gray-700 rounded mr-1 text-xs align-top cursor-pointer"
            onClick={() => setIsNavOpen(!isNavOpen())}
          >
            {isNavOpen() ? '▼' : '▶'}
          </button>
          <div
            class={`border border-gray-700 rounded h-screen transition-all duration-300 ease-in-out overflow-y-scroll overscroll-y-auto overscroll-x-contain no-scrollbar ${
              isNavOpen() ? 'w-sm text-xs pl-2 pr-2' : 'w-0 p-0'
            }`}
          >
            <Show when={isNavOpen()}>
              <div class="mb-2 mt-2">
                <div class="mb-2 text-md font-bold uppercase">Profile</div>
                <div class="text-orange font-bold">{params.handle}</div>
              </div>
              <ul class="list-none p-0 m-0">
                <li>
                  <button
                    class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                    onClick={() => setExpandPacks(!expandPacks())}
                  >
                    {expandPacks() ? '▼' : '▶'}
                  </button>
                  <strong class="pr-1">Packs:</strong>
                  <Show when={expandPacks()}>
                    <ul class="list-none p-0 m-0">
                      <For each={record().starterPacks}>
                        {(starterPack) => (
                          <li class="rounded p-1 hover:bg-slate-700 hover:outline hover:outline-slate-500">
                            <a
                              href={`/${starterPack.uri.replace(
                                'at://',
                                'at/'
                              )}`}
                            >
                              {starterPack.record.name}
                            </a>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </li>
                <li>
                  <button
                    class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                    onClick={() => setExpandLists(!expandLists())}
                  >
                    {expandLists() ? '▼' : '▶'}
                  </button>
                  <strong class="pr-1">Lists:</strong>
                  <Show when={expandLists()}>
                    <ul class="list-none p-0 m-0">
                      <For each={record().lists}>
                        {(list) => (
                          <li class="rounded p-1 hover:bg-slate-700 hover:outline hover:outline-slate-500">
                            <a href={`/${list.uri.replace('at://', 'at/')}`}>
                              {list.name}
                            </a>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </li>
                <li>
                  <button
                    class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                    onClick={() => setExpandFeeds(!expandFeeds())}
                  >
                    {expandFeeds() ? '▼' : '▶'}
                  </button>
                  <strong class="pr-1">Feeds:</strong>
                  <Show when={expandFeeds()}>
                    <ul class="list-none p-0 m-0">
                      <For each={record().feeds}>
                        {(feed) => (
                          <li class="rounded p-1 hover:bg-slate-700 hover:outline hover:outline-slate-500">
                            <a href={`/${feed.uri.replace('at://', 'at/')}`}>
                              {feed.displayName}
                            </a>
                          </li>
                        )}
                      </For>
                    </ul>
                  </Show>
                </li>
              </ul>
            </Show>
          </div>

          <div class="w-full p-2 overflow-y-scroll overscroll-y-auto overscroll-x-contain no-scrollbar">
            <JsonTree data={record().profile} />
          </div>
        </div>
      </Show>
    </div>
  )
}

export default ProfileView
