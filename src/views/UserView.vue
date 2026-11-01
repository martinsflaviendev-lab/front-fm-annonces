<script setup>
import { api, changeLogState } from '@/api'
import { getErrorMessage } from '@/assets/utils/errors'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// ------------------------------------------------ REFS/INFOS
const userOffers = ref({ data: null })
const userInfos = ref({ data: null })

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

const isDeletingAccount = ref(false)
const picture = ref(null)
const fileInput = ref(null)

// ------------------------------------------------ INFOS REQUEST
onMounted(async () => {
  try {
    const { data: userData } = await api.get('/users/me')
    // console.log(userData)
    userInfos.value = userData

    const { data: offersData } = await api.get('/offers/infos/mine')
    // console.log(offersData)
    userOffers.value = offersData
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})

// ------------------------------------------------ UPDATE AVATAR

const openFilePicker = () => fileInput.value.click()
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return alert('Veuillez ne mettre que des images')
  if (file.size > 5 * 1024 * 1024) return alert("L'image est trop volumineuse")

  picture.value = file
  await updateAvatar()
  router.go()
}

const updateAvatar = async () => {
  if (!picture.value) return alert('veuillez selectionner une image')
  try {
    const formData = new FormData()
    formData.append('files', picture.value)
    const { data } = await api.put('/users/me/avatar', formData)
    // console.log(data)
    if (data) {
      console.log('users info recupération succeded')
    }
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  }
}

// ------------------------------------------------ DELETE ONE OFFER
const deleteOneOffer = async (id) => {
  try {
    // console.log(id)
    const response = await api.delete(`offers/${id}`)
    // console.log(response)
    if (response) {
      alert("l'offre a été supprimée")
    }

    // location.reload()
    router.go()
  } catch (error) {
    // console.log(error)
    errorMessage.value = getErrorMessage(error)
  }
}
// ------------------------------------------------ DELETE USER
const deleteAccount = async () => {
  try {
    await api.delete('/users/me')
    changeLogState(false)
    router.push({ name: 'home' })
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  }
}
//-------------------------------------------------- DATE FORMATING
const toGoodDate = (date) => {
  return date
    .match(/([^T]+)/)[0]
    .split('-')
    .reverse()
    .join('/')
}
</script>

<template>
  <main>
    <div class="container">
      <div class="loading" v-if="isLoading">
        <p>Chargement en cours</p>
        <LoadingAnimation />
      </div>
      <div v-else-if="hasError">
        <p>erreur du chagement</p>
      </div>

      <div class="wrapper" v-else>
        <!-- ================================ USER INFOS -->
        <div class="userContainer">
          <h1>Mon profil</h1>
          <div v-if="userInfos">
            <h1>{{ userInfos.username }}</h1>
            <h2>{{ userInfos.email }}</h2>

            <div class="photo">
              <img v-if="userInfos.avatar" :src="userInfos.avatar.url" alt="" />
              <div class="buttons">
                <input type="file" ref="fileInput" accept="image/*" hidden @change="onFileChange" />
                <button class="neutral" @click="openFilePicker">Changer photo</button>

                <button @click="isDeletingAccount = true" class="warning">
                  Supprimer le compte
                </button>
                <p v-if="errorMessage" class="warning-text">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================ OFFERS INFOS -->
        <div class="offersContainer" v-if="userOffers.length > 0">
          <h1>Mes offres</h1>
          <div v-for="offer in userOffers" :key="offer.documentId">
            <div class="offerInfos">
              <h2>{{ offer.title }}</h2>
              <p>{{ offer.description }}</p>
            </div>

            <img v-if="offer.pictures?.length" :src="offer.pictures[0].url" alt="" />
            <p>modifié dernièrement le {{ toGoodDate(offer.updatedAt) }}</p>
            <button @click="deleteOneOffer(offer.documentId)" class="warning">
              Supprimer l'offre
            </button>
          </div>
        </div>

        <!-- ==================================== Deleting Account -->
        <div class="deletingAccount" v-if="isDeletingAccount">
          <div class="wrapperDeleting">
            <div>
              <h2>Voulez vous vraiment supprimer votre compte ?</h2>
            </div>
            <div class="delButtons">
              <button class="warning" @click="deleteAccount()">Supprimer</button>
              <button class="neutral" @click="isDeletingAccount = false">Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  padding-top: 30px;
  width: 80vw;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.warning-text {
  color: red;
}

h1 {
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 10px;
}

button {
  width: 150px;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 15px;
}
.neutral {
  background-color: var(--secondary-color);
}
.neutral:hover {
  background-color: var(--secondary-color-hover);
}
.warning {
  background-color: var(--warning-color);
}
.warning:hover {
  background-color: var(--warning-color-hover);
}

/* ======================================= USER */
.userContainer {
  padding: 20px;
  border-radius: 20px;
  box-shadow: 3px 5px 12px #aaaaaaaa;
}
.userContainer > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userContainer > div img {
  height: 130px;
  width: 130px;
  object-fit: cover;
  border-radius: 70px;
}
.photo {
  display: flex;
  gap: 20px;
}
.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  width: 150px;
}
/*  ====================================== OFFERS  */
.offersContainer {
  padding: 25px;
  border-radius: 20px;
  box-shadow: 3px 5px 12px #aaaaaaaa;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.offersContainer > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.offerInfos {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: hidden;
}
.offerInfos p {
  font-size: 12px;
  color: grey;
}
.offersContainer > div > img {
  height: 100px;
  width: 100px;
  object-fit: cover;
}

/* ===================================IS DELETING */
.deletingAccount {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  background-color: #ffffffbb;
  z-index: 1000;
  justify-content: center;
  align-items: center;
}
.deletingAccount h2 {
  font-size: 17px;
  font-weight: 600;
}
.wrapperDeleting {
  background-color: white;
  width: 500px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 50px;
  border-radius: 20px;
  box-shadow: 3px 8px 12px #aaaaaaaa;
}
.delButtons {
  display: flex;
  gap: 30px;
}
</style>
