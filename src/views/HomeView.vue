<script setup>
// import axios from 'axios'
import { api } from '@/api'
import { onMounted, ref, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import OfferCard from '@/components/OfferCard.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { getErrorMessage } from '@/assets/utils/errors'

// ------------------------------------------------- STORE AND IMPORTS
const router = useRouter()

const props = defineProps({
  min: Number,
  max: Number,
  sort: Number,
  search: String,
  page: Number,
})
// ------------------------------------------------- ERRORS
const errorMessage = ref('')

// ------------------------------------------------- OFFERS
const offersList = ref([])

// ------------------------------------------------- INPUTS
// Filters refs
const minPrice = ref(0)
const maxPrice = ref(100000)
const sortingType = ref(0)
const numberOfPages = ref(1)

// const filterSearch = ref(GlobalStore.searched.value || '') ==> avec le watcher

// // watchers functions ==> pas la solution mais intéressant
// watch(
//   () => GlobalStore.searched.value,
//   (Value) => {
//     filterSearch.value = Value
//     console.log(`the value checked is ${filterSearch.value}`)
//   },
// )

// -------------------------------------------------- ONMOUNTED REQUEST OFFERS
onMounted(() => {
  watchEffect(async () => {
    // const sortingByPrice = (value) => {
    //   if (value === 1) {
    //     return '&sort[0]=price:asc'
    //   } else if (value === 2) {
    //     return '&sort[0]=price:desc'
    //   } else {
    //     return ''
    //   }
    // }

    const params = {
      'pagination[page]': props.page,
      'pagination[pageSize]': 10, // changer pour 15 un fois fini
      'filters[title][$containsi]': props.search,
      'filters[price][$lte]': props.max,
      'filters[price][$gte]': props.min,
    }

    const sortMap = {
      1: 'price:asc',
      2: 'price:desc',
    }

    if (sortMap[props.sort]) {
      params['sort[0]'] = sortMap[props.sort]
    }

    try {
      // const { data } = await axios.get(
      //   `https://site--strapileboncoin--2m8zk47gvydr.code.run/api/offers?populate[0]=pictures&populate[1]=owner.avatar.data&filters[title][$containsi]=${props.search}&filters[price][$lte]=${props.max}&filters[price][$gte]=${props.min}${sortingByPrice(props.sort)}`,
      // )

      const { data } = await api.get('/offers', { params })

      // console.log(data)
      // console.log(JSON.stringify(params))
      offersList.value = data.data
      numberOfPages.value = data.meta.pagination.pageCount
    } catch (err) {
      // console.log(err)
      errorMessage.value = getErrorMessage(err)
    }
  })
})

// --------------------------------------------------- FUNCTIONS
const handleFilters = () => {
  const queries = { ...props }

  //TODO il faudra implémenter une vérification et un delete des queries ici
  queries.min = minPrice.value
  queries.max = maxPrice.value
  queries.sort = sortingType.value
  queries.page = 1

  router.push({ name: 'home', query: queries })
}

const nextPage = () => {
  const queries = { ...props }
  queries.page = queries.page + 1
  router.push({ name: 'home', query: queries })
}

const previousPage = () => {
  const queries = { ...props }
  queries.page = queries.page - 1
  router.push({ name: 'home', query: queries })
}

const goToPage = (n) => {
  const queries = { ...props }
  queries.page = n
  router.push({ name: 'home', query: queries })
}
</script>

<template>
  <main>
    <div class="container">
      <!-- ==================================== FILTERS -->
      <form class="filterBar" @submit.prevent="handleFilters">
        <!-- ==================== Prix -->
        <div class="price">
          <h2>Prix</h2>
          <div>
            <div class="priceIn">
              <input
                type="number"
                min="0"
                pattern="[0-9]*"
                placeholder="Prix min"
                id="minprice"
                v-model="minPrice"
              />
              <div><p>€</p></div>
            </div>

            <div class="priceIn">
              <input
                type="number"
                min="0"
                pattern="[0-9]*"
                placeholder="Prix max"
                id="maxprice"
                v-model="maxPrice"
              />

              <div><p>€</p></div>
            </div>
          </div>
        </div>
        <!-- ==================== Tri -->
        <div class="sorting">
          <h2>Tri</h2>

          <div class="buttonsSort">
            <label for="ascending"
              ><input
                type="radio"
                name="sortingType"
                id="ascending"
                :value="1"
                v-model="sortingType"
              />prix croissant</label
            >

            <label for="descending">
              <input
                type="radio"
                name="sortingType"
                id="descending"
                :value="2"
                v-model="sortingType"
              />prix décroissant</label
            >

            <label for="noSort"
              ><input
                type="radio"
                name="sortingType"
                id="noSort"
                :value="0"
                v-model="sortingType"
              />pas de tri</label
            >
          </div>
        </div>

        <!-- ==================== Bouton -->
        <button>Rechercher</button>
      </form>

      <!--  ===================================== ANNONCE -->
      <div class="annonce">
        <p>Des millions de petites annonces et autant d'occasions de se faire plaisir</p>
      </div>

      <!--  ===================================== BANNIERE -->
      <div class="banner">
        <div>
          <h2>C'est le momment de vendre</h2>
          <RouterLink :to="{ name: 'publish' }">
            <button>+ Déposer une annonce</button>
          </RouterLink>
        </div>

        <img src="../assets/images/onde-corail-4Af4yJVc.svg" alt="" class="first" />
        <img src="../assets/images/second-flower.svg" alt="" class="second" />
      </div>

      <!-- ======================================= Loading animation -->
      <div class="loading" v-if="offersList.length === 0">
        <p>Chargement en cours</p>
        <LoadingAnimation />
      </div>

      <!--  ===================================== CARDS -->
      <div v-else class="offersContainer">
        <OfferCard v-for="offer in offersList" :key="offer.id" :offer="offer" />
      </div>

      <div v-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>

      <!--  ===================================== PAGE -->
      <div class="changePages">
        <button v-if="page > 1" @click="previousPage">Page précédente</button>
        <button
          class="pageNumber"
          v-for="n in numberOfPages"
          :key="n"
          @click="goToPage(n)"
          :class="{ selected: n === page }"
        >
          {{ n }}
        </button>
        <button v-if="page < numberOfPages" @click="nextPage">Page suivante</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  width: 95%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  max-width: 1800px;
  justify-content: center;
}

.offersContainer {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 1fr;
  column-gap: 20px;
  row-gap: 50px;
  margin-top: 30px;
  margin-bottom: 40px;
}

.banner {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 20px;
  background-color: #ffe9de;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 80px;
  padding: 15px 20px;
}

.banner > .first {
  position: absolute;
  left: 0px;
  height: 100%;
  z-index: -1;
}
.banner > .second {
  position: absolute;
  right: 0px;
  height: 100%;
  z-index: -1;
}

/* ----------------------------------------------- FILTERS */
.filterBar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 30px 0px;
}
.filterBar h2 {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 5px;
}

.price,
.sorting {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* __________________________________Price */
.price > div {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.priceIn {
  display: flex;
  align-items: center;
  border: 1px solid grey;
  padding: 5px 10px;
  border-radius: 30px;
}
.priceIn div {
  border-left: 1px solid grey;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 5px;
}

input {
  height: 30px;
  max-width: 100px;
  border: none;
  /* color: grey; */
  /* border: 1px solid grey; */
}
input:hover {
  height: 30px;
  max-width: 100px;
  border: none;
  /* border: 1px solid grey; */
}

input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* __________________________________ Sorting */
.buttonsSort {
  display: flex;
  gap: 20px;
}
.buttonsSort label {
  display: flex;
  align-items: center;
}

form button {
  background-color: var(--main-bckg-color);
  width: 150px;
  height: 50px;
  transform: translateY(20px);
  border: 0px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: 700;
  font-family: var(--second-font-family);
  color: white;
}
form button:hover {
  background-color: var(--hover-main-button-bckg-color);
}

/* -------------------------------- annonce */
.annonce {
  margin: 20px auto;
  justify-content: center;
}

/* -------------------------------- banner */
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.banner h2 {
  font-weight: 650;
  font-size: 18px;
}
.banner button {
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

.banner button:hover {
  background-color: var(--hover-main-button-bckg-color);
}

/* --------------------------------loading  */

.loading {
  margin: auto;
}

/* -------------------------------- page button */

.changePages {
  display: flex;
  justify-content: center;
}
.changePages button {
  background-color: var(--secondary-color);
  width: 120px;
  height: 40px;
  transform: translateY(20px);
  border: 0px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--second-font-family);
  color: white;
}
.changePages button:hover {
  background-color: var(--secondary-color-hover);
}

.changePages .pageNumber {
  width: 40px;
  height: 40px;
  background-color: white;
  color: black;
}

.changePages .selected {
  background-color: var(--secondary-color);
  color: white;
}
/* @media (max-width: 1400px) {
  .container {
    width: 900px;
  }
}

@media (max-width: 1024px) {
  .containe {
    width: 800px;
  }
} */
</style>
