<script setup>
import { inject, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const GlobalStore = inject('GlobalStore')

const searchedWord = ref('')

const deconnectUser = () => {
  GlobalStore.logout()
}

const handleSearch = () => {
  const queries = { ...route.query }
  queries.search = searchedWord.value
  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <header>
    <div class="mainPart">
      <img src="../assets/images/titre_fm_annonces.svg" alt="" />
      <div class="secondPart">
        <RouterLink :to="{ name: 'publish' }"><button>+ Déposer une annonce</button></RouterLink>

        <form @submit.prevent="handleSearch" class="searchBar">
          <input
            type="text"
            name="search"
            id="search"
            v-model="searchedWord"
            placeholder="Rechercher"
          />
          <button class="searchcube" type="submit">🔎</button>
        </form>
      </div>

      <div class="profil" v-if="GlobalStore.isLoggedIn.value">
        <RouterLink :to="{ name: 'user' }">
          <h4>{{ GlobalStore.username.value }}</h4>
        </RouterLink>
        <button @click="deconnectUser">Se déconnecter</button>
      </div>
      <div class="profil" v-else>
        <h4>Non connecté</h4>
        <RouterLink :to="{ name: 'login' }">
          <button>Se connecter</button>
        </RouterLink>
      </div>
    </div>

    <nav>
      <RouterLink :to="{ name: 'home' }" class="navigator"><h2>Accueil</h2></RouterLink>

      <p>|</p>
      <RouterLink :to="{ name: 'publish' }" class="navigator"><h2>Publier</h2></RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'signup' }" class="navigator"><h2>S'inscrire</h2></RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'login' }" class="navigator"><h2>Se connecter</h2></RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'user' }"><h2>Mon profil</h2></RouterLink>
    </nav>
  </header>
</template>

<style scoped>
a {
  font-family: 'Nunito Sans Variable', sans-serif;
  font-weight: 400;
  font-style: normal;
  color: black;
  text-decoration: none;
}

.navigator.router-link-active {
  color: var(--main-bckg-color);
}

.mainPart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
}

.mainPart img {
  height: 40px;
}

.secondPart {
  display: flex;
  gap: 30px;
  transform: translateX(-30px);
}

.secondPart button {
  background-color: var(--main-bckg-color);
  width: 250px;
  height: 40px;
  border: 0px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 700;
  font-family: var(--second-font-family);
  color: white;
}
.secondPart button:hover {
  background-color: var(--hover-main-button-bckg-color);
}
nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

header {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: fixed;
  height: var(--header-height);
  top: 0;
  z-index: 100;
  left: 0px;
  top: 0px;
  width: 100%;
  box-shadow: 0px 3px 5px grey;
}

.profil {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.profil button {
  background-color: var(--main-bckg-color);
  border-radius: 40px;
  color: white;
  border: 0px;
  width: 120px;
  height: 25px;
  font-weight: 600;
}
.profil button:hover {
  background-color: var(--hover-main-button-bckg-color);
}

.searchBar {
  position: relative;
  width: 250px;
  border: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 30px;
}
.searchBar > button {
  position: absolute;
  right: 7px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: var(--main-bckg-color);
}
.searchBar > button:hover {
  background-color: var(--hover-main-button-bckg-color);
}
.searchBar input {
  border: none;
}
</style>
