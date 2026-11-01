<script setup>
import { api } from '@/api'
import { getErrorMessage } from '@/assets/utils/errors'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// INPUTS REFS   __________________________________________✒️
const title = ref('')
const description = ref('')
const price = ref(0)
const pictures = ref([])

// REQUEST REFS  __________________________________________🔎
const isPublishing = ref(false)
const errorMessage = ref('')

//PICTURES HANDLING  ______________________________________📷
const handleFilesChange = (event) => {
  const newFiles = Array.from(event.target.files)

  newFiles.forEach((element) => {
    const alreadyExists = pictures.value.some(
      (picture) =>
        picture.name === element.name &&
        picture.size === element.size &&
        picture.lastModified === element.lastModified,
    )
    if (!alreadyExists) {
      pictures.value.push(element)
    }
  })
}

const removePicture = (index) => {
  pictures.value.splice(index, 1)
}

const getURL = (picture) => {
  return URL.createObjectURL(picture)
}

// REQUEST   _____________________________________________ 🔎
const handleSubmit = async () => {
  isPublishing.value = true
  errorMessage.value = ''

  if (
    title.value &&
    description.value &&
    price.value &&
    pictures.value.length &&
    pictures.value.length <= 10
  ) {
    // console.log('begining request')
    try {
      // ------------------------------------ REQUEST UPLOAD
      const formData = new FormData()
      pictures.value.forEach((file) => {
        formData.append('files', file)
      })
      // console.log('token before upload: ', getToken())

      const uploadResponse = await api.post('/upload', formData)
      // console.log(uploadResponse.data)

      const uploadedFileIds = uploadResponse.data.map((file) => file.id)

      // ------------------------------------ REQUEST POST
      const response = await api.post('/offers', {
        data: {
          title: title.value,
          price: price.value,
          pictures: uploadedFileIds,
          description: description.value,
        },
      })

      // console.log('response>>', response.data)
      alert('publication réussie')

      router.push({ name: 'offer', params: { id: response.data.data.documentId } })
    } catch (error) {
      // console.log(error)
      errorMessage.value = getErrorMessage(error)
    }
  } else {
    console.log('request failed')
  }
  isPublishing.value = false
}
</script>

<!-- ====================================================================== -->
<template>
  <main>
    <div class="animContainer" v-if="isPublishing">
      <p>Publication de l'annonce en cours</p>
      <div class="publishing"></div>
    </div>

    <div class="container">
      <!-- FORM -->
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="title">Titre de l'annonce</label>
          <input type="text" name="title" id="title" placeholder="title" v-model="title" />
        </div>
        <div>
          <label for="description">Description de l'annonce</label>
          <textarea
            name="description"
            id="description"
            cols="50"
            rows="10"
            placeholder="description"
            v-model="description"
          ></textarea>
          <p>
            Ce paragraphe reprend la place des précisions légales de leboncoin, les annonces seront
            publiées et visibles sur la page d'accueil, les précisions seront consultables sur la
            page de l'offre, le paiment n'ira pas jusqu'au bout: les offres publiées ne sont pas
            achetables et vous ne serez pas débité (ou crédité).
          </p>
        </div>
        <div>
          <label for="price">Votre prix de vente </label>
          <div class="input">
            <input type="number" name="price" id="price" v-model="price" pattern="[0-9]*" />
            <h2>€</h2>
          </div>
        </div>
        <div>
          <label for="pictures">Ajoutez vos photos</label>
          <label for="pictures" class="square"> Ajoutez jusqu'à 4 photos</label>
          <input
            type="file"
            name="pictures"
            id="pictures"
            multiple
            accept="image/*"
            @change="handleFilesChange"
          />
        </div>

        <!-- Previsualisation -->
        <div class="previsualisation" v-if="pictures.length">
          <div v-for="(file, index) in pictures" :key="file.name + file.lastModified">
            <img :src="getURL(file)" />
            <h4>{{ file.name }}</h4>
            <button @click="removePicture(index)">X</button>
          </div>
        </div>

        <button>Déposer l'annonce</button>
      </form>
    </div>
  </main>
</template>

<!-- ========================================================================== -->
<style scoped>
.container {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}

form {
  /* margin: 30px; */
  display: flex;
  flex-direction: column;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 4px 6px 12px #aaaaaa80;
}

form div {
  width: 80vw;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

label:hover,
input:hover {
  cursor: pointer;
}

label {
  font-size: 18px;
  font-weight: 600;
}

textarea {
  font-size: 15px;
}

form div > p {
  font-size: 12px;
  color: gray;
}

/* ------- for small inputs */
input[type='number'],
input [type='text'] {
  max-width: 200px;
}

/* ------- for input tyope number */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
}

/* ------------------------------  PICTURES PREVIEW */

#pictures {
  display: none;
}

.square {
  height: 120px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid var(--secondary-color);
  border-radius: 10px;
  color: var(--secondary-color);
  font-size: 15px;
  text-align: center;
  padding: 5px;
  box-sizing: border-box;
}
.square:hover {
  color: var(--secondary-color-hover);
  border-color: var(--secondary-color-hover);
}

.previsualisation > div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 15px;
}

.previsualisation button {
  background-color: var(--warning-color);
  border: none;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: white;
  font-weight: 900;
}
.previsualisation button:hover {
  background-color: var(--warning-color-hover);
  cursor: pointer;
}

/* ---------------------------------- ANIMATION*/
.animContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.publishing {
  /* margin: auto; */
  border: 10px solid grey;
  border-radius: 50%;
  border-top: 10px solid coral;
  width: 40px;
  height: 40px;
  animation: spinner 2s linear infinite;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ------------------------------------ BUTTON */
form > button {
  align-self: flex-end;
  width: 200px;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: white;
  background-color: var(--main-bckg-color);
  font-size: 18px;
  font-weight: 600;
}

form > button:hover {
  background-color: var(--hover-main-button-bckg-color);
}
</style>
