<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api'
import { useRoute, useRouter } from 'vue-router'

//-------------------------------------------------- ROUTING
const route = useRoute()
const router = useRouter()

//-------------------------------------------------- INFOS
const offerInfo = ref({ data: null })

const props = defineProps({
  id: { required: true },
})
const current = ref(0)
const pictures = computed(() => offerInfo.value?.data?.pictures ?? [])
const next = () => (current.value = (current.value + 1) % pictures.value.length)
const prev = () =>
  (current.value = (current.value - 1 + pictures.value.length) % pictures.value.length)

//-------------------------------------------------- REQUEST
onMounted(async () => {
  try {
    const { data } = await api.get(`/offers/${props.id}`)
    console.log(data)
    offerInfo.value = data
  } catch (err) {
    console.log(err)
  }
})

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
      <!-- ======================================== OFFER -->
      <div v-if="offerInfo.data" class="offerContainer">
        <div class="imageContainer">
          <div class="track" :style="{ transform: `translateX(-${current * 100}%)` }">
            <img
              v-for="(picture, index) in pictures"
              :key="picture.id"
              :src="picture.url"
              :alt="`Photo ${index + 1} de l'annonce`"
            />
          </div>

          <template v-if="pictures.length > 1">
            <button class="arrow left" @click="prev" aria-label="Photo précédente">‹</button>
            <button class="arrow right" @click="next" aria-label="Photo suivante">›</button>

            <div class="dots">
              <button
                v-for="(picture, index) in pictures"
                :key="picture.id"
                class="dot"
                :class="{ active: index === current }"
                @click="current = index"
                :aria-label="`Aller à la photo ${index + 1}`"
              />
            </div>
          </template>
        </div>

        <div class="bloc">
          <h3>{{ offerInfo.data.title }}</h3>
          <h5>{{ offerInfo.data.price }} €</h5>
          <h4>modifiée le {{ toGoodDate(offerInfo.data.publishedAt) }}</h4>
        </div>

        <div class="description bloc">
          <h3>Description</h3>
          <p>{{ offerInfo.data.description }}</p>
        </div>

        <p>Agon-coutainville (50230)</p>
      </div>
      <div v-else class="loading">
        <p>Chargement</p>
      </div>

      <!-- ======================================== OWNER -->
      <div v-if="offerInfo.data" class="ownerContainer">
        <div>
          <div class="owner">
            <img v-if="offerInfo.data.owner.avatar" :src="offerInfo.data.owner.avatar.url" alt="" />
            <h2>{{ offerInfo.data.owner.username }}</h2>
          </div>
          <span v-if="offerInfo.data.owner.confirmed === true">Pièce d'identité vérifiée</span>
          <p>Répond en général en moins d'1 heure</p>
        </div>
        <!-- ======================= BUY -->
        <div class="buttons">
          <button @click="router.push({ name: 'buy', params: { id: props.id } })" class="one">
            Acheter
          </button>
          <button class="two">Message</button>
        </div>
      </div>
      <div v-else class="loading">
        <p>Chargement</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  /* max-width: 1200px; */
  display: flex;
  justify-content: space-around;
  margin: 40px auto;
}

/* --------------------------------------------OFFER */
.offerContainer {
  flex: 2;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}
.imageContainer {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: var(--neutral-color);
  border-radius: 20px;
  overflow: hidden;
}

.track {
  display: flex;
  height: 100%;
  transition: transform 0.4s ease;
}

.track img {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  cursor: pointer;
}
.left {
  left: 12px;
}
.right {
  right: 12px;
}

.dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.dot {
  width: 10px;
  height: 10px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}
.dot.active {
  background: white;
}

.bloc {
  margin: 20px 0px;
}

h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}
h4 {
  font-size: 13px;
}
h5 {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 18px;
}

/* ----------------------------------------------OWNER */
.ownerContainer {
  height: fit-content;
  margin: 0px 30px;
  flex: 1;
  box-shadow: 1px 4px 12px #50506050;
  border-radius: 20px;
  padding: 30px;
}

.owner {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.owner > img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}

.owner h2 {
  font-family: var(--second-font-family);
  font-size: 20px;
  font-weight: 700;
}

.ownerContainer p {
  background-color: #ffe9de;
  color: #89380f;
  font-weight: 500;
  padding: 4px;
  border-radius: 3px;
  width: fit-content;
}

.buttons {
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  font-family: var(--second-font-family);
  border: none;
  border-radius: 30px;
  color: white;
  height: 50px;
  margin-bottom: 20px;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
}

.one {
  background-color: var(--main-bckg-color);
}
.one:hover {
  background-color: var(--hover-main-button-bckg-color);
}

.two {
  background-color: var(--secondary-color);
}
.two:hover {
  background-color: var(--secondary-color-hover);
}
</style>
