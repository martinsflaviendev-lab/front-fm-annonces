<script setup>
import { inject, ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const GlobalStore = inject('GlobalStore')

const isMenuToggled = ref(false)
const toggleMenu = () => {
  isMenuToggled.value = !isMenuToggled.value
}
const closeMenu = () => {
  isMenuToggled.value = false
}

watch(() => route.fullPath, closeMenu)

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
      <button class="burger-button" @click="toggleMenu()">M</button>
      <div class="logo-and-search">
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
      </div>

      <div class="profil-wide" v-if="GlobalStore.isLoggedIn.value">
        <RouterLink :to="{ name: 'user' }">
          <h4>{{ GlobalStore.username.value }}</h4>
        </RouterLink>
        <button @click="deconnectUser">Se déconnecter</button>
      </div>
      <div class="profil-wide" v-else>
        <h4>Non connecté</h4>
        <RouterLink :to="{ name: 'login' }">
          <button>Se connecter</button>
        </RouterLink>
      </div>
    </div>

    <nav :class="{ open: isMenuToggled }">
      <RouterLink :to="{ name: 'home' }" class="navigator"><h2>Accueil</h2></RouterLink>

      <p>|</p>
      <RouterLink :to="{ name: 'publish' }" class="navigator"><h2>Publier</h2></RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'signup' }" class="navigator"><h2>S'inscrire</h2></RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'login' }" class="navigator"><h2>Se connecter</h2></RouterLink>
      <p>|</p>
      <RouterLink :to="{ name: 'user' }" class="navigator"><h2>Mon profil</h2></RouterLink>
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

.burger-button {
  display: none;
}

.mainPart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
}

.mainPart > .logo-and-search {
  display: flex;
  gap: 30px;
}

.mainPart img {
  height: 40px;
}

.secondPart {
  display: flex;
  gap: 30px;
  /* transform: translateX(-30px); */
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

.profil-wide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.profil-wide button {
  background-color: var(--main-bckg-color);
  border-radius: 40px;
  color: white;
  border: 0px;
  width: 120px;
  height: 25px;
  font-weight: 600;
}
.profil-wide button:hover {
  background-color: var(--hover-main-button-bckg-color);
}

/* ====================================================== RESPONSIVE AND BURGER MENU */

@media (max-width: 768px) {
  header {
    max-width: 100vw;
  }

  nav {
    visibility: hidden;
    overflow: hidden;
    position: absolute;
    top: 100%;
    box-sizing: border-box;
    height: 30vh;
    width: 0%;
    padding-left: 0px;
    padding-top: 20px;
    flex-direction: column;
    border-left: none;
    border-right: none;
    align-items: flex-start;
    justify-content: left;
    gap: 20px;
    background-color: #ffffffff;
    box-shadow: 3px 5px 7px grey;
    transition:
      width 0.3s ease,
      padding-left 0.3s ease,
      visibility 0s linear 0.25s;
    /* z-index: 50; */
  }
  nav.open {
    visibility: visible;
    display: flex;
    width: 50%;
    padding-left: 20px;
    transition:
      width 0.3s ease,
      padding-left 0.3s ease,
      visibility 0s;
  }

  nav > p {
    display: none;
  }

  .mainPart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
  }
  .mainPart > .logo-and-search {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .burger-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin-left: 5px;
    border: 1px solid gray;
    border-radius: 4px;
    background-color: #ffffff00;
    z-index: 100;
  }

  .mainPart img {
    height: 30px;
    margin-bottom: 0px;
  }

  .secondPart {
    gap: 0px;
  }
  .secondPart button {
    display: none;
  }

  .searchBar {
    width: 150px;
    display: flex;
    height: 30px;
    border-radius: 30px;
  }
  .searchBar > button {
    position: absolute;
    right: 2%;
    display: flex;
    width: 20px;
    height: 20px;
  }
  .searchBar > input {
    width: 80%;
  }
}
</style>
