import { createEffect, createSignal, onCleanup } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useUser } from '../context/UserProvider'

const LoginButton = () => {
  const { login, logout } = useUser()
  const navigate = useNavigate()
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
    navigate('/')
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
        class="fixed left-0 top-0 h-screen w-screen p-0 my-0 bg-dark-800"
        onClose={handleClose}
        onCancel={handleClose}
      >
        <div class="flex h-1/2 items-center justify-center bg-transparent">
          <div class="flex h-fit items-center justify-center">
            <div class="w-fit border rounded-md border-dark-100 bg-dark-400 p-2 text-slate-100">
              {isLoggedIn() ? (
                <>
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    class="bg-dark-100 rounded-lg border border-gray-400 px-2 py-1 mr-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Handle..."
                    value={handle()}
                    onInput={(e) => setHandle(e.currentTarget.value)}
                  />
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default LoginButton
