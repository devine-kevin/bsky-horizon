import { createSignal } from 'solid-js'
import LoginButton from './LoginButton'
import { useCronitor } from '../utils/cronitor'

function PageHeader() {
  useCronitor()
  return (
    <div class="flex flex-col items-center gap-y-1 mb-2">
      <div class="flex items-center gap-x-2">
        <div class="i-horizon-logo">
          <a href="/">home</a>
        </div>
        <div>
          <a
            href="/"
            class="hover:underline"
          >
            bsky - horizon
          </a>
        </div>
        <div class="i-about">
          <a href="/about">about</a>
        </div>
        <div>
            <LoginButton />
        </div>
      </div>
    </div>
  )
}

export default PageHeader
