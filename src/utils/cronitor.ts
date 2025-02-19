import * as Cronitor from '@cronitorio/cronitor-rum'
import { createEffect } from 'solid-js'
import { useLocation } from '@solidjs/router'

/**
 * SolidJS utility for initializing and tracking page views using Cronitor.
 *
 * @param clientKey - The client key for the Cronitor site.
 * @param config - The Cronitor tracker configuration object.
 * @returns The Cronitor instance.
 *
 * @example
 * ```tsx
 * import { useCronitor } from './utils/cronitor';
 *
 * function Component() {
 *   useCronitor(clientKey);
 *   return <div>Hello, world!</div>;
 * }
 * ```
 */
export function useCronitor(config: Cronitor.CronitorRUMConfig = {}) {
  const location = useLocation()
  const clientKey = import.meta.env.VITE_CRONITOR_RUM_ID

  if (!clientKey) {
    throw new Error('Missing Cronitor client key in Vite environment variables')
  }

  createEffect(() => {
    Cronitor.load(clientKey, config)
  })

  createEffect(() => {
    Cronitor.track('Pageview')
  }, [location.pathname, location.search])
}
