import PageHeader from '../components/PageHeader'
import Search from '../components/Search'
import { agent } from '../context/UserProvider'

function Home() {
  return (
    <div
      id="main"
      class="w-full"
    >
      <PageHeader />
      <Search />
    </div>
  )
}

export default Home
