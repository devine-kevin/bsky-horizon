import { createSignal, createMemo, createResource, Show, For } from 'solid-js'
import { getProfile } from '../utils/api.js'
import JsonTree from './JsonTree'

import { Select } from '@thisbeyond/solid-select'
import '@thisbeyond/solid-select/style.css'

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

  const sortedItems = createMemo(() => {
    return [...(props.items ?? [])].sort((a, b) => {
      const sanitize = (str) =>
        str
          ?.normalize('NFKD') // Normalize characters (e.g., remove diacritics)
          .replace(/[^\w\s]/g, '') // Remove special characters
          .trim()
          .toLowerCase() || ''
      if (sortBy() === 'createdAt') {
        return sortOrder() === 'ASC'
          ? a.subject.createdAt.localeCompare(b.subject.createdAt)
          : b.subject.createdAt.localeCompare(a.subject.createdAt)
      }
      if (sortBy() === 'displayName') {
        const nameA = sanitize(
          a.subject.displayName?.trim() || a.subject.handle
        )
        const nameB = sanitize(
          b.subject.displayName?.trim() || b.subject.handle
        )
        return sortOrder() === 'ASC'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA)
      }
      return sortOrder() === 'ASC'
        ? a.subject.handle.localeCompare(b.subject.handle)
        : b.subject.handle.localeCompare(a.subject.handle)
    })
  })

  return (
    <div>
      <div class="flex justify-end">
        <Select
          class="sort-select w-full dark:bg-dark-100"
          options={['handle', 'displayName', 'createdAt']}
          placeholder="handle"
          onChange={setSortBy}
        />
        <span class="i-options-vertical"></span>
        <button
          class={`${
            sortOrder() === 'ASC' ? 'i-sort-list-asc' : 'i-sort-list-desc'
          }`}
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
              setExpanded(!expanded())
              if (!dataLoaded()) {
                setDataLoaded(true)
                refetch()
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
                <strong>handle:</strong>
                <span
                  class={`${
                    sortBy() === 'handle' ? 'text-orange' : 'text-slate-100'
                  }`}
                >
                  {item.subject.handle}
                </span>
                <br />
                <strong>displayName:</strong>
                <span
                  class={`${
                    sortBy() === 'displayName'
                      ? 'text-orange'
                      : 'text-slate-100'
                  }`}
                >
                  {item.subject.displayName || item.subject.handle}
                </span>
                <br />
                <strong>createdAt:</strong>
                <span
                  class={`${
                    sortBy() === 'createdAt' ? 'text-orange' : 'text-slate-100'
                  }`}
                >
                  {item.subject.createdAt}
                </span>
                <br />
                <strong>description:</strong> {item.subject.description}
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
