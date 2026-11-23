import '@fontsource-variable/nunito'
import '@fontsource-variable/nunito-sans'
import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import { api, restoreSession, logout as apiLogout, isLoggedIn } from './api'

// ======================================== FONTAWESOME
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faBars,
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faGithub, faBars, faMagnifyingGlass, faEnvelope, faChevronLeft, faChevronRight, faUser)

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

  app.component('font-awesome-icon', FontAwesomeIcon)

  app.mount('#app')
}

starting()
