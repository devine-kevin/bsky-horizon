import { createSignal, Show, For } from 'solid-js'

type JsonTreeProps = {
  data: Record<string, any>
  depth?: number
}

const JsonTree = (props: JsonTreeProps) => {
  return (
    <ul
      class="list-none p-0 m-0 overflow-auto"
      style={{ 'padding-left': `${props.depth ?? 0}ch` }}
    >
      <For each={Object.entries(props.data)}>
        {([key, value]) => {
          const [expanded, setExpanded] = createSignal(false)
          const isObject = typeof value === 'object' && value !== null

          return (
            <li class="mb-1 text-nowrap">
              <Show when={isObject && value != ''}>
                <button
                  class="bg-inherit mr-1 text-sm align-top cursor-pointer"
                  onClick={() => setExpanded(!expanded())}
                >
                  {isObject ? (expanded() ? '▼' : '▶') : ''}
                </button>
              </Show>
              <strong>{key}:</strong>{' '}
              <Show when={!isObject}>{String(value)}</Show>
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
