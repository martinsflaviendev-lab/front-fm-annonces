import '@fontsource-variable/nunito'
import '@fontsource-variable/nunito-sans'
import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import { api, restoreSession, logout as apiLogout, isLoggedIn } from './api'

const username = ref(null)

async function starting() {
  const restored = await restoreSession()

  if (restored) {
    try {
      const { data } = await api.get('/users/me')
      username.value = data.username
    } catch {
      username.value = null
    }
  }

  const app = createApp(App)
  app.use(router)

  const logout = async () => {
    await apiLogout()
    username.value = null
  }

  app.provide('GlobalStore', {
    username,
    logout,
    isLoggedIn,
  })

  app.mount('#app')
}

starting()
