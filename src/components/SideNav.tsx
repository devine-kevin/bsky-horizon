import { createEffect, createSignal } from 'solid-js'

const SideNav = (props) => {
  const [isNavOpen, setIsNavOpen] = createSignal(true)
  const [expandPacks, setExpandPacks] = createSignal(false)
  const [expandLists, setExpandLists] = createSignal(false)
  const [expandFeeds, setExpandFeeds] = createSignal(false)

  createEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await getRecord([props.handle])
        console.log(data)
        setRecord(data ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    })()
  })
}
