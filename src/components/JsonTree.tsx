import { createSignal, Show, For } from 'solid-js'

type JsonTreeProps = {
  data: Record<string, any>
  depth?: number
}

const JsonTree = (props: JsonTreeProps) => {
  return (
    <ul
      class="list-none p-0 m-0"
      style={{ 'padding-left': `${props.depth ?? 0}ch` }}
    >
      <For each={Object.entries(props.data)}>
        {([key, value]) => {
          const [expanded, setExpanded] = createSignal(false)
          const isObject = typeof value === 'object' && value !== null
          const isAtUri =
            typeof value === 'string' &&
            value.startsWith('at://') &&
            value.includes('app.bsky.graph.list')

          return (
            <li class="mb-1 text-pretty">
              <Show when={isObject && value != ''}>
                <button
                  class="bg-inherit mr-1 text-sm align-top cursor-pointer"
                  onClick={() => setExpanded(!expanded())}
                >
                  {isObject ? (expanded() ? '▼' : '▶') : ''}
                </button>
              </Show>
              <strong class="pr-1">{key}:</strong>
              <Show when={!isObject}>
                <Show when={isAtUri}>
                  <a
                    class="text-blue-500"
                    href={`/${value.replace('at://', 'at/')}`}
                    rel="noopener noreferrer"
                  >
                    {value}
                  </a>
                </Show>
                <Show when={!isAtUri}>
                  <span
                    class={`${
                      props.sortBy === key ? 'text-orange' : 'text-slate-100'
                    }`}
                  >
                    {String(value)}
                  </span>
                </Show>
              </Show>
              <Show when={isObject && expanded()}>
                <JsonTree
                  data={value}
                  depth={(props.depth ?? 0) + 1}
                />
              </Show>
            </li>
          )
        }}
      </For>
    </ul>
  )
}

export default JsonTree
