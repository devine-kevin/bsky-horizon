import { createSignal, Show } from 'solid-js'
import JsonTree from './JsonTree'

const ListDetails = (props) => {
  const [expanded, setExpanded] = createSignal(false)

  return (
    <div class="border-b mb-2 pb-2">
      <div class="flex justify-between">
        <div>
          <strong>{props.list.name}</strong>
        </div>
        <button
          class="ml-2 bg-inherit text-inherit cursor-pointer"
          onClick={() => setExpanded(!expanded())}
        >
          [<span class="hover:underline">{expanded() ? 'Less' : 'More'}</span>]
        </button>
      </div>
      <Show when={expanded()}>
        <div class="mt-2 p-2 border rounded overflow-scroll">
          <JsonTree data={props.list} />
        </div>
      </Show>
    </div>
  )
}

export default ListDetails
