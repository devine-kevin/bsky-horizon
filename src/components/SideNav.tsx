import { createResource, createSignal, onMount } from 'solid-js'
import {
  getActorStarterPacks,
  getActorFeeds,
  getLists,
  resolveHandle,
} from '../utils/api.js'
import { useAuth } from '../context/AuthContext'
import { XRPC } from '@atcute/client'

async function getUser(agent) {
  if (!agent) return {}
  try {
    let rpc = new XRPC({ handler: agent })
    const [profile, lists, starterPacks] = await Promise.all([
      rpc.get('app.bsky.actor.getProfile', { params: { actor: agent.sub } }),
      rpc.get('app.bsky.graph.getLists', { params: { actor: agent.sub } }),
      rpc.get('app.bsky.graph.getActorStarterPacks', {
        params: { actor: agent.sub },
      }),
    ])
    return {
      profile: profile.data,
      lists: lists.data.lists,
      starterPacks: starterPacks.data,
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

async function getNav(handle) {
  const did = await resolveHandle(handle)
  try {
    const [lists, starterPacks, feeds] = await Promise.all([
      getLists(did),
      getActorStarterPacks(did),
      false, //getActorFeeds(did),
    ])
    return { starterPacks, lists, feeds }
  } catch (error) {
    console.error('Error fetching nav data:', error)
    throw new Error('Failed to retrieve nav data.')
  }
}

const SideNav = (props) => {
  const authStore = useAuth()
  const { state } = authStore

  const [nav] = createResource(props.handle, getNav)
  const [user] = createResource(state.agent, getUser)

  const [isNavOpen, setIsNavOpen] = createSignal(false)
  const [expandPacks, setExpandPacks] = createSignal(false)
  const [expandLists, setExpandLists] = createSignal(false)
  const [expandFeeds, setExpandFeeds] = createSignal(false)
  const [expandUserLists, setExpandUserLists] = createSignal(false)

  return (
    <div class="flex">
      <div class="pl-1">
        <button
          class="h-screen bg-gray-700 rounded mr-1 text-xs align-top cursor-pointer hover:w-4"
          onClick={() => setIsNavOpen(!isNavOpen())}
        >
          {isNavOpen() ? '▼' : '▶'}
        </button>
      </div>
      <div
        class={`border border-gray-700 rounded h-screen transition-all duration-300 ease-in-out overflow-y-scroll overscroll-y-auto overscroll-x-contain no-scrollbar ${
          isNavOpen() ? 'w-sm text-xs pl-2 pr-2' : 'w-0 p-0'
        }`}
      >
        <Show when={isNavOpen()}>
          <div class="mb-2 mt-2">
            <div class="mb-2 text-md font-bold uppercase">Dashboard</div>
            <div class="text-orange font-bold">{props.handle}</div>
          </div>
          <Show when={nav.error}>
            <div class="mt-4 p-2 text-red-500 text-center">{nav.error}</div>
          </Show>
          <Show when={nav()}>
            <ul class="list-none p-0 m-0">
              {/* Starter Packs */}
              <Show when={nav().starterPacks}>
                <li>
                  <div class="flex">
                    <div>
                      <button
                        class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                        onClick={() => setExpandPacks(!expandPacks())}
                      >
                        {expandPacks() ? '▼' : '▶'}
                      </button>
                    </div>
                    <div>
                      <strong class="pr-1">Packs:</strong>
                      <Show when={expandPacks()}>
                        <ul class="m-y-1 list-none p-0 m-0">
                          <For each={nav().starterPacks}>
                            {(starterPack) => (
                              <li class="rounded hover:bg-slate-700 hover:outline hover:outline-slate-500">
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
                    </div>
                  </div>
                </li>
              </Show>
              {/* Lists */}
              <Show when={nav().lists}>
                <li>
                  <div class="flex">
                    <div>
                      <button
                        class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                        onClick={() => setExpandLists(!expandLists())}
                      >
                        {expandLists() ? '▼' : '▶'}
                      </button>
                    </div>
                    <div>
                      <strong class="pr-1">Lists:</strong>
                      <Show when={expandLists()}>
                        <ul class="m-y-1 list-none p-0 m-0">
                          <For each={nav().lists}>
                            {(list) => (
                              <li class="rounded hover:bg-slate-700 hover:outline hover:outline-slate-500">
                                <a
                                  href={`/${list.uri.replace('at://', 'at/')}`}
                                >
                                  {list.name}
                                </a>
                              </li>
                            )}
                          </For>
                        </ul>
                      </Show>
                    </div>
                  </div>
                </li>
              </Show>
              {/* Feeds */}
              <Show when={nav().feeds}>
                <li>
                  <div class="flex">
                    <div>
                      <button
                        class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                        onClick={() => setExpandFeeds(!expandFeeds())}
                      >
                        {expandFeeds() ? '▼' : '▶'}
                      </button>
                    </div>
                    <div>
                      <strong class="pr-1">Feeds:</strong>
                      <Show when={expandFeeds()}>
                        <ul class="mt-1 list-none p-0 m-0">
                          <For each={nav().feeds}>
                            {(feed) => (
                              <li class="rounded hover:bg-slate-700 hover:outline hover:outline-slate-500">
                                <a
                                  href={`/${feed.uri.replace('at://', 'at/')}`}
                                >
                                  {feed.displayName}
                                </a>
                              </li>
                            )}
                          </For>
                        </ul>
                      </Show>
                    </div>
                  </div>
                </li>
              </Show>
            </ul>
          </Show>
          <Show when={user()}>
            <div class="mb-2 mt-2">
              <div class="mb-2 text-md font-bold uppercase">Me</div>
              <div class="text-orange font-bold">{user().profile.handle}</div>
            </div>
            {/* Lists */}
            <ul class="list-none p-0 m-0">
              <Show when={user().lists}>
                <li>
                  <div class="flex">
                    <div>
                      <button
                        class="bg-inherit mr-1 text-xs align-top cursor-pointer"
                        onClick={() => setExpandUserLists(!expandUserLists())}
                      >
                        {expandUserLists() ? '▼' : '▶'}
                      </button>
                    </div>
                    <div>
                      <strong class="pr-1">Lists:</strong>
                      <Show when={expandUserLists()}>
                        <ul class="m-y-1 list-none p-0 m-0">
                          <For each={user().lists}>
                            {(list) => {
                              return (
                                <li class="rounded hover:bg-slate-700 hover:outline hover:outline-slate-500">
                                  <a
                                    href={`/${list.uri.replace(
                                      'at://',
                                      'at/'
                                    )}`}
                                  >
                                    {list.name}
                                  </a>
                                </li>
                              )
                            }}
                          </For>
                        </ul>
                      </Show>
                    </div>
                  </div>
                </li>
              </Show>
            </ul>
          </Show>
        </Show>
      </div>
    </div>
  )
}

export default SideNav
