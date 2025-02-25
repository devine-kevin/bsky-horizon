import PageHeader from '../components/PageHeader'
import Search from '../components/Search'
import { useUser } from '../context/UserProvider'

function Home() {
  const { user } = useUser()
  console.log('user', user())
  return (
    <div
      id="main"
      class="w-full"
    >
      <PageHeader />
      <div class="w-full text-center">
        {user() ? (
          <div>
            <h1>Welcome, {user()}</h1>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <Search />
    </div>
  )
}

export default Home
