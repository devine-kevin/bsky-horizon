import { createSignal, createMemo, createResource, Show, For } from 'solid-js'
import { getProfile, getProfiles } from '../utils/api.js'
import JsonTree from './JsonTree'

import { Select } from '@thisbeyond/solid-select'
import '@thisbeyond/solid-select/style.css'

const fetchProfiles = async (dids: string) => {
  try {
    const data = await getProfiles(dids)
    return data
  } catch (error) {
    return { error: 'Failed to load data', message: error.message }
  }
}
const ItemList = (props) => {
  const [showDropdown, setShowDropdown] = createSignal(false)
  const [sortBy, setSortBy] = createSignal('handle')
  const [sortOrder, setSortOrder] = createSignal('ASC')

  const [profiles] = createResource(
    () => props.items.map((item) => item.subject.did),
    fetchProfiles
  )
  const getSortClass = (field) => {
    return sortBy() === field ? 'text-orange' : 'text-slate-100'
  }

  const sortedItems = createMemo(() => {
    const profileData = profiles()
    const orderMultiplier = sortOrder() === 'ASC' ? 1 : -1

    const sanitize = (str) =>
      str
        ?.normalize('NFKD')
        .replace(/[^\w\s]/g, '')
        .trim()
        .toLowerCase() || ''

    const sortFunctions = {
      createdAt: (a, b) =>
        (new Date(a.subject.createdAt) - new Date(b.subject.createdAt)) *
        orderMultiplier,

      displayName: (a, b) => {
        const nameA = sanitize(
          a.subject.displayName?.trim() || a.subject.handle
        )
        const nameB = sanitize(
          b.subject.displayName?.trim() || b.subject.handle
        )
        return nameA.localeCompare(nameB) * orderMultiplier
      },

      followersCount: (a, b) => {
        const followersA = profileData?.[a.subject.did]?.followersCount ?? 0
        const followersB = profileData?.[b.subject.did]?.followersCount ?? 0
        return (followersA - followersB) * orderMultiplier
      },

      followsCount: (a, b) => {
        const followsA = profileData?.[a.subject.did]?.followsCount ?? 0
        const followsB = profileData?.[b.subject.did]?.followsCount ?? 0
        return (followsA - followsB) * orderMultiplier
      },

      postsCount: (a, b) => {
        const postsA = profileData?.[a.subject.did]?.postsCount ?? 0
        const postsB = profileData?.[b.subject.did]?.postsCount ?? 0
        return (postsA - postsB) * orderMultiplier
      },

      handle: (a, b) =>
        a.subject.handle.localeCompare(b.subject.handle) * orderMultiplier,
    }

    return [...(props.items ?? [])].sort(
      sortFunctions[sortBy()] || sortFunctions.handle
    )
  })

  return (
    <div>
      <div class="flex justify-end">
        <Select
          class="sort-select w-full dark:bg-dark-100"
          options={[
            'handle',
            'displayName',
            'createdAt',
            'followersCount',
            'followsCount',
            'postsCount',
          ]}
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
            const profileData = () => profiles()?.[item.subject.did]

            return (
              <li
                key={item.subject.did}
                class="pt-2 pb-2 overflow-y-scroll overscroll-y-auto overscroll-x-contain no-scrollbar border-b last:border-none"
              >
                <div class="flex justify-between">
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
                    onClick={() => setExpanded(!expanded())}
                  >
                    [
                    <span class="hover:underline">
                      {expanded() ? 'Less' : 'More'}
                    </span>
                    ]
                  </button>
                </div>
                <strong>DID:</strong>
                {item.subject.did}
                <br />
                <strong>handle:</strong>
                <span class={getSortClass('handle')}>
                  {item.subject.handle}
                </span>
                <br />
                <strong>displayName:</strong>
                <span class={getSortClass('displayName')}>
                  {item.subject.displayName || item.subject.handle}
                </span>
                <br />
                <strong>createdAt:</strong>
                <span class={getSortClass('createdAt')}>
                  {item.subject.createdAt}
                </span>
                <Show when={profileData()}>
                  <div class="flex">
                    <div class="border-r border-gray-500 pr-1">
                      <strong>followers:</strong>
                      <span class={getSortClass('followersCount')}>
                        {profileData().followersCount}
                      </span>
                    </div>
                    <div class="pl-1 pr-1 border-r border-gray-500">
                      <strong>follows:</strong>
                      <span class={getSortClass('followsCount')}>
                        {profileData().followsCount}
                      </span>
                    </div>
                    <div class="pl-1">
                      <strong>posts:</strong>
                      <span class={getSortClass('postsCount')}>
                        {profileData().postsCount}
                      </span>
                    </div>
                  </div>
                </Show>
                <strong>description:</strong>
                <span>{item.subject.description}</span>
                <Show when={expanded()}>
                  <div class="mt-2 p-2 border rounded overflow-scroll">
                    <Show when={profiles.loading}>
                      <p class="text-gray-500">Loading...</p>
                    </Show>
                    <Show when={profileData()}>
                      <JsonTree
                        data={profileData()}
                        sortBy={sortBy()}
                      />
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
