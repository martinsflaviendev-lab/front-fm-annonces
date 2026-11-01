<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { api, setToken, getToken } from '@/api'
import { ref, inject } from 'vue'
import CardAnimation from '@/components/CardAnimation.vue'

const router = useRouter()
const route = useRoute()

//-------------------------------------------------- STORE
const GlobalStore = inject('GlobalStore')

//-------------------------------------------------- INPUTS
const identifier = ref('')
const password = ref('')

//-------------------------------------------------- ERRORS
const isCorrect = ref(true)
const isError = ref(false)
const errorMessage = ref('')

//-------------------------------------------------- ASYNCS ALERTS
const isSubmitting = ref(false)

//-------------------------------------------------- RESQUEST
const handleSignin = async () => {
  isCorrect.value = true
  isError.value = false
  isSubmitting.value = true

  if (identifier.value && password.value) {
    try {
      console.log('handling login')
      // ------------------------------------ request
      const response = await api.post('/auth/local', {
        identifier: identifier.value,
        password: password.value,
      })

      // Stocking the username and token
      setToken(response.data.jwt)
      GlobalStore.username.value = response.data.user.username

      alert('connexion réussie !')

      // console.log(response)
      // console.log('the token to compare ====> ', getToken())

      router.push(route.query.redirect || { name: 'home' })
    } catch (error) {
      isError.value = true
      errorMessage.value = error.response?.data?.error?.message || 'Une erreur est survenue'
      // console.log(error.response?.data)
    }
  } else {
    isCorrect.value = false
    // console.log(`is Correct : ${isCorrect.value}`)
  }

  isSubmitting.value = false
}
</script>

<template>
  <main>
    <div class="loginContainer">
      <div class="loginForm">
        <h1>connectez-vous pour découvrir toutes nos fonctionnalités.</h1>
        <div class="formWrapper">
          <form @submit.prevent="handleSignin">
            <label for="identifier">Nom*</label>
            <div>
              <input
                type="text"
                name="identifier"
                id="identifier"
                placeholder="votre nom d'utilisateur"
                v-model="identifier"
              />
            </div>
            <div>
              <label for="password">Mot de passe* </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="votre mot de passe"
                v-model="password"
              />
            </div>

            <button>Se connecter</button>
            <div>
              <p>
                Pas encore inscrit ?
                <RouterLink :to="{ name: 'signup' }">Inscrivez vous</RouterLink>
              </p>
            </div>
          </form>
        </div>

        <p class="warning" v-if="isSubmitting">Connexion en cours</p>
        <p class="warning" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="warning" v-if="!isCorrect">Veuillez remplir tous les champs obligatoires</p>
      </div>
    </div>
    <CardAnimation />
  </main>
</template>

<style scoped src="@/assets/auth.css"></style>
