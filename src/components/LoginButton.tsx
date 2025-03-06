import { createEffect, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useAuth } from '../context/AuthContext'

const LoginButton = () => {
  const authStore = useAuth()
  const { state } = authStore
  const navigate = useNavigate()
  let modalRef: HTMLDialogElement | undefined

  createEffect(() => {
    if (state.isModalOpen) {
      modalRef?.showModal()
    } else {
      modalRef?.close()
    }
  })

  const handleLogin = async () => {
    if (state.handle.trim()) {
      await authStore.login({ handle: state.handle })
    }
  }
  const handleLogout = async () => {
    await authStore.logout()
    navigate('/')
  }

  return (
    <>
      <button
        class="i-login p-2 hover:underline"
        onClick={authStore.openLoginModal}
      >
        {' '}
      </button>

      <dialog
        ref={(el) => (modalRef = el)}
        class="fixed left-0 top-0 h-screen w-screen p-0 my-0 bg-dark-800"
        onClose={authStore.closeLoginModal}
        onCancel={authStore.closeLoginModal}
      >
        <div class="flex h-1/2 items-center justify-center bg-transparent">
          <div class="flex h-fit items-center justify-center">
            <div class="w-fit border rounded-md border-dark-100 bg-dark-400 p-2 text-slate-100">
              {state.isLoggedIn ? (
                <>
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={authStore.closeLoginModal}
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
                    value={state.handle}
                    onInput={(e) => authStore.setHandle(e.currentTarget.value)}
                  />
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    class="bg-dark-400 rounded border border-dark-100 px-2 py-1 text-slate-300 hover:underline mr-1"
                    onClick={authStore.closeLoginModal}
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
