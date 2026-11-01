<script setup>
// import axios from 'axios'
import { api, setToken } from '@/api'
import { inject, ref } from 'vue'
import CardAnimation from '@/components/CardAnimation.vue'

//-------------------------------------------------- STORE
const GlobalStore = inject('GlobalStore')

//-------------------------------------------------- INPUTS
const email = ref('')
const username = ref('')
const password = ref('')

//-------------------------------------------------- ERRORS
const isCorrect = ref(true)
const isError = ref(false)
const errorMessage = ref('')

//-------------------------------------------------- ASYNCS ALERTS
const isSubmitting = ref(false)

//-------------------------------------------------- RESQUEST
const handleSignin = async () => {
  isError.value = false
  isSubmitting.value = true
  isCorrect.value = true

  if (email.value && username.value && password.value) {
    try {
      // console.log('handling sign up')

      // --------------------------------------- request
      const response = await api.post('/auth/local/register', {
        email: email.value,
        username: username.value,
        password: password.value,
      })

      // Stocking the username and token
      setToken(response.data.jwt)
      GlobalStore.username.value = response.data.user.username

      alert('enregistrement réussi !')

      // ---------------------------------------- debug/test
      // console.log(response)
      // console.log('token set: ', getToken())
    } catch (error) {
      isError.value = true
      errorMessage.value = error.response?.data?.error?.message || 'Une erreur est survenue'
    }
  } else {
    isCorrect.value = false
    console.log(`is Correct : ${isCorrect.value}`)
  }

  isSubmitting.value = false
}
</script>

<template>
  <main>
    <div class="loginContainer">
      <div class="loginForm">
        <h1>Inscrivez-vous pour découvrir toutes les fonctionalités</h1>

        <div class="formWrapper">
          <form @submit.prevent="handleSignin">
            <div>
              <label for="email">E-maill*</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="votre e-mail"
                v-model="email"
              />
            </div>
            <div>
              <label for="username">Nom*</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="votre nom d'utilisateur"
                v-model="username"
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

            <button>S'enregistrer</button>
          </form>
        </div>

        <p class="warning" v-if="isSubmitting">Enregistrement en cours</p>
        <p class="warning" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="warning" v-if="!isCorrect">Veuillz remplir tous les champs obligatoires</p>
      </div>
    </div>
    <CardAnimation />
  </main>
</template>

<style scoped src="@/assets/auth.css"></style>
