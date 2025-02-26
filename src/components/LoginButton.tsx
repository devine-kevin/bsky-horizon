import { createEffect, createSignal, onCleanup } from 'solid-js'
import { useUser } from '../context/UserProvider'

const LoginButton = () => {
  const { login, logout } = useUser()
  let modalRef: HTMLDialogElement | undefined
  const [isModalOpen, setIsModalOpen] = createSignal(false)
  const [handle, setHandle] = createSignal('')
  const [isLoggedIn, setIsLoggedIn] = createSignal(
    !!localStorage.getItem('lastSignedIn')
  )

  createEffect(() => {
    if (isModalOpen()) {
      modalRef?.showModal()
    } else {
      modalRef?.close()
    }
  })

  const handleClose = () => setIsModalOpen(false)

  const handleLogin = async () => {
    if (handle().trim()) {
      await login({ handle: handle() })
      setIsLoggedIn(true)
      setIsModalOpen(false)
    }
  }
  const handleLogout = async () => {
    await logout()
    setIsLoggedIn(false)
    setIsModalOpen(false)
  }

  return (
    <>
      <button
        class="i-login p-2 hover:underline"
        onClick={() => setIsModalOpen(true)}
      >
        {' '}
      </button>

      <dialog
        ref={(el) => (modalRef = el)}
        class="fixed left-0 top-0 h-screen w-screen bg-transparent"
        onClose={handleClose}
        onCancel={handleClose}
      >
        <div class="flex m-y-6 justify-center">
          <div class="w-fit border rounded-md border-slate-100 bg-dark-400 p-2 text-slate-100">
            {isLoggedIn() ? (
              <>
                <button
                  class="dark:bg-dark-400 p-2 hover:underline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  class="dark:bg-dark-400 p-2 hover:underline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
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
                  Login
                </button>
                <button
                  class="dark:bg-dark-400 p-2 hover:underline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}

export default LoginButton
