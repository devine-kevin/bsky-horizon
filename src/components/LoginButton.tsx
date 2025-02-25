import { createSignal } from 'solid-js'
import { useUser } from '../context/UserProvider'

const LoginButton = () => {
  const { agent, user, login } = useUser()
  const [isOpen, setIsOpen] = createSignal(false)
  const [handle, setHandle] = createSignal('')

  const handleLogin = async () => {
    if (handle().trim()) {
      await login({ handle: handle() })
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        class="i-login p-2 hover:underline"
        onClick={() => setIsOpen(true)}
      ></button>

      {isOpen() && (
        <dialog class="backdrop-brightness-60 fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-transparent">
          <div class="dark:bg-dark-400 top-10% absolute rounded-md border border-slate-900 bg-slate-100 p-4 text-slate-900 dark:border-slate-100 dark:text-slate-100">
            <h2>Login</h2>
            <input
              type="text"
              class="dark:bg-dark-100 rounded-lg border border-gray-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Handle..."
              value={handle()}
              onInput={(e) => setHandle(e.currentTarget.value)}
            />
            <button
              class="dark:bg-dark-400 p-2 hover:underline"
              onClick={handleLogin}
            >
              Submit
            </button>
            <button
              class="dark:bg-dark-400 p-2 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}

export default LoginButton
