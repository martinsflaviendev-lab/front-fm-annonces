import axios from 'axios'
import { ref } from 'vue'

const remoteBaseUrl = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: remoteBaseUrl || '/api',
  withCredentials: Boolean(remoteBaseUrl),
})

let accessToken = null //Here, it's on the memory, not on the localStorage

// ---------------------------------------------------- EXPORTS (first part)
export const isLoggedIn = ref(false)
export const changeLogState = (state) => {
  isLoggedIn.value = state
}

export const setToken = (t) => {
  accessToken = t
  isLoggedIn.value = !!t
}
export const getToken = () => accessToken

// -------------------------------------------------------INTERCEPTORS

const NO_AUTH_HEADER_ROUTES = ['/auth/local', '/auth/local/register', '/auth/refresh']

api.interceptors.request.use((cfg) => {
  const skipAuth = NO_AUTH_HEADER_ROUTES.some((route) => cfg.url?.startsWith(route))
  if (accessToken && !skipAuth) cfg.headers.Authorization = `Bearer ${accessToken}`
  return cfg
})

// ------------------------------ error retry
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const isAuthRoute = original?.url?.startsWith('/auth/')
    if (err.response?.status === 401 && !original?._retried && !isAuthRoute) {
      original._retried = true
      const ok = await restoreSession()
      if (ok) {
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      }
    }
    return Promise.reject(err)
  },
)

// --------------------------------------------------- EXPORTS (session)

export async function restoreSession() {
  try {
    const { data } = await api.post('/auth/refresh')
    setToken(data.jwt)
    return true
  } catch {
    setToken(null)
    return false
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } finally {
    setToken(null)
  }
}
