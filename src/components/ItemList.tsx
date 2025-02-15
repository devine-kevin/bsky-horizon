import { createSignal, createResource, Show, For } from 'solid-js'
import { getProfile } from '../utils/api.js'
import JsonTree from './JsonTree'

const fetchMoreData = async (did: string) => {
  try {
    const data = await getProfile(did)
    return data
  } catch (error) {
    return { error: 'Failed to load data', message: error.message }
  }
}

const ItemList = (props) => {
  return (
    <ul>
      <For each={props.items}>
        {(item) => {
          const [expanded, setExpanded] = createSignal(false)
          const [dataLoaded, setDataLoaded] = createSignal(false)
          const [data, { refetch }] = createResource(
            () => (dataLoaded() ? item.subject.did : null),
            fetchMoreData
          )
          const handleExpand = (did: string) => {
            setExpanded(!expanded()) // Toggle expand/collapse
            if (!dataLoaded()) {
              setDataLoaded(true) // Mark as fetched
              refetch() // Fetch data only once
            }
          }
          return (
            <li
              key={item.subject.did}
              class="p-2 border-b last:border-none"
            >
              <span>
                -{' '}
                <a
                  href={`https://bsky.app/profile/${item.subject.handle}`}
                  class="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.subject.handle}
                </a>
              </span>
              <button
                class="ml-2 bg-inherit text-inherit cursor-pointer"
                onClick={() => handleExpand(item.subject.did)}
                disabled={data.loading}
              >
                [
                <span class="hover:underline">
                  {expanded() ? 'Less' : 'More'}
                </span>
                ]
              </button>
              <br />
              <strong>DID:</strong> {item.subject.did}
              <br />
              <strong>handle:</strong> {item.subject.handle}
              <br />
              <strong>displayName:</strong> {item.subject.displayName}
              <br />
              <strong>createdAt:</strong> {item.subject.createdAt}
              <Show when={expanded()}>
                <div class="mt-2 p-2 border rounded">
                  <Show when={data.loading}>
                    <p class="text-gray-500">Loading...</p>
                  </Show>
                  <Show when={data()}>
                    <JsonTree data={data()} />
                  </Show>
                </div>
              </Show>
            </li>
          )
        }}
      </For>
    </ul>
  )
}

export default ItemList
