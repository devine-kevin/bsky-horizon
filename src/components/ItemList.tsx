import {
  createSignal,
  createMemo,
  createResource,
  inCleanup,
  onMount,
  Show,
  For,
} from 'solid-js'
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
  const [showDropdown, setShowDropdown] = createSignal(false)
  const [sortBy, setSortBy] = createSignal('handle')
  const [sortOrder, setSortOrder] = createSignal('ASC')

  let dropdownRef

  onMount(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    onCleanup(() => document.removeEventListener('click', handleClickOutside))
  })
  const sortedItems = createMemo(() => {
    return [...(props.items ?? [])].sort((a, b) => {
      if (sortBy() === 'createdAt') {
        return sortOrder() === 'ASC'
          ? a.subject.createdAt.localeCompare(b.subject.createdAt)
          : b.subject.createdAt.localeCompare(a.subject.createdAt)
      }
      return sortOrder() === 'ASC'
        ? a.subject.handle.localeCompare(b.subject.handle)
        : b.subject.handle.localeCompare(a.subject.handle)
    })
  })

  return (
    <div>
      <div
        class="flex justify-end"
        ref={dropdownRef}
      >
        <button class="i-filter-list"></button>
        <button
          class="i-options-vertical"
          onClick={() => setShowDropdown(!showDropdown())}
        ></button>

        <Show when={showDropdown()}>
          <div class="absolute mt-6 transition-opacity">
            <select
              id="sort-select"
              class="p-2 w-full border rounded-lg border-gray-400 dark:bg-dark-100"
              value={sortBy()}
              onChange={(e) => {
                setSortBy(e.currentTarget.value)
                setShowDropdown(false)
              }}
            >
              <option value="handle">Handle</option>
              <option value="createdAt">Created At</option>
            </select>
          </div>
        </Show>

        <button
          class="i-sort-list"
          onClick={() => setSortOrder(sortOrder() === 'ASC' ? 'DESC' : 'ASC')}
        ></button>
      </div>

      <ul>
        <For each={sortedItems()}>
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
    </div>
  )
}

export default ItemList
