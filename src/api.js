import axios from 'axios'
import { ref } from 'vue'

// If VITE_API_URL is set (Option B: separate subdomains), use it as an
// absolute base URL and send cookies cross-origin via withCredentials.
// If it's unset (Option A: Netlify proxy, or local dev via Vite proxy),
// use a relative "/api" path — same-origin, no withCredentials needed.
// VITE_API_URL (Option B) doesn’t fit your deployment. With Netlify and Northflank on their default domains, your Strapi cookie is cross-site, so it needs SameSite=None; Secure, and Safari and others may block it. The cookie then also allows cross-site POSTs to /auth/refresh and /auth/logout (low impact, but still CSRF). Option A, the Netlify proxy, avoids all of this, so I’d treat Option B as something to use only if you later get a shared parent domain.
const remoteBaseUrl = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: remoteBaseUrl || '/api',
  withCredentials: Boolean(remoteBaseUrl),
})

let accessToken = null // memory only, never localStorage
export const isLoggedIn = ref(false)
export const changeLogState = (state) => {
  isLoggedIn.value = state
}

export const setToken = (t) => {
  accessToken = t
  isLoggedIn.value = !!t
}
export const getToken = () => accessToken

const NO_AUTH_HEADER_ROUTES = ['/auth/local', '/auth/local/register', '/auth/refresh']

api.interceptors.request.use((cfg) => {
  const skipAuth = NO_AUTH_HEADER_ROUTES.some((route) => cfg.url?.startsWith(route))
  // checks if an element (routein paramater) of NO_AUTH.. is included in the start of cfg.url
  if (accessToken && !skipAuth) cfg.headers.Authorization = `Bearer ${accessToken}`
  return cfg
})

// On a 401, try refreshing the session once via the httpOnly cookie,
// then replay the original request. Avoids logging the user out just
// because the short-lived access token expired mid-session.
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

// Call once when the app starts, to silently restore a session from the
// refresh cookie (if any). Returns true/false so callers can decide what
// to show while that's pending.
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
//  UNE MEILLEURE VERSION - A VOIR SI JE FAIS 3 REQUETES SUR UNE MEME PAGE
// let refreshPromise = null

// export function restoreSession() {
//   if (!refreshPromise) {
//     refreshPromise = api
//       .post('/auth/refresh')
//       .then(({ data }) => {
//         setToken(data.jwt)
//         return true
//       })
//       .catch(() => {
//         setToken(null)
//         return false
//       })
//       .finally(() => {
//         refreshPromise = null
//       })
//   }
//   return refreshPromise
// }

export async function logout() {
  try {
    await api.post('/auth/logout')
  } finally {
    setToken(null)
  }
}
//  AUTRE MANIERE DE FAIRE
// // api.js
// export const publicApi = axios.create({ baseURL: remoteBaseUrl || "/api", withCredentials: Boolean(remoteBaseUrl) });
// export const api = axios.create({ baseURL: remoteBaseUrl || "/api", withCredentials: Boolean(remoteBaseUrl) });
// // interceptor only added to `api`, never to `publicApi`

// // then in your login/register components:
// import { publicApi } from '@/api'
// await publicApi.post('/auth/local', {...})
