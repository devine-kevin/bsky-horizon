import PageHeader from '../components/PageHeader'
import Search from '../components/Search'

function Home() {
  return (
    <div
      id="main"
      class="w-full"
    >
      <PageHeader />
      <div class="w-full flex justify-center">
        <div class="text-center w-full max-w-2xl mt-4 pt-2 pb-2 border-t-1 border-dashed border-slate-100">
          <div class="leading-relaxed">
            <div class="pt-2 pb-2 border-y-1 border-dashed ">
              <div class="border-b-1 border-dashed pb-2">
                <p class="text-md font-bold">CREDITS</p>
              </div>

              <div class="mt-2 text-left text-xs space-y-2">
                <div class="mb-6">
                  <p>
                    <span class="inline-block w-40">PROGRAMMER</span>
                    <a
                      href="https://bsky.app/profile/kvndvn.social"
                      class="underline text-blue-500"
                    >
                      kvndvn.social
                    </a>
                  </p>
                </div>

                <div>
                  <p>
                    <span class="inline-block w-40">SPECIAL THANKS</span>
                    <a
                      href="https://pdsls.dev"
                      class="underline text-blue-500"
                    >
                      PDSls.dev
                    </a>
                  </p>
                  <p class="ml-40">
                    (Navigate and manage atproto repositories and the records
                    they contain)
                  </p>

                  <p>
                    <span class="inline-block w-40"> </span>
                    <a
                      href="https://cred.blue"
                      class="underline text-blue-500"
                    >
                      cred.blue
                    </a>
                  </p>
                  <p class="ml-40">
                    (Provides an early version of its custom scoring algorithm
                    to generate a "credibility" score based on an identity’s
                    activity in the ecosystem)
                  </p>
                </div>
              </div>

              <div class="border-y-1 border-dashed mt-4 pt-2 pb-2">
                <p class="text-md font-bold">THANKS FOR PLAYING!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
