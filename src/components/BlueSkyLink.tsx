import { Component } from 'solid-js'
import BlueskyLogo from '../assets/bluesky-logo.svg'

type BlueskyLinkProps = {
  href: string
}

const BlueskyLink: Component<BlueskyLinkProps> = (props) => {
  const url =
    'https://bsky.app/' +
    props.aturi
      .replace('at://', 'profile/')
      .replace('app.bsky.graph.list', 'lists')

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center"
    >
      <img
        src={BlueskyLogo}
        alt="Bluesky Logo"
        class="w-4 h-4"
      />
    </a>
  )
}

export default BlueskyLink
