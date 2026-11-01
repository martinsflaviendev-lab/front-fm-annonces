<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
  offer: { type: Object, required: true },
})

const toGoodDate = (date) => {
  return date
    .match(/([^T]+)/)[0]
    .split('-')
    .reverse()
    .join('/')
}

// console.log(props.offer)
</script>

<template>
  <RouterLink :to="{ name: 'offer', params: { id: props.offer.documentId } }" class="card">
    <div class="cardContainer">
      <div class="author">
        <img v-if="props.offer.owner?.avatar" :src="props.offer.owner.avatar.url" alt="" />
        <h3>{{ props.offer.owner.username }}</h3>
      </div>
      <img
        v-if="props.offer.pictures?.length"
        :src="props.offer.pictures[0].url"
        alt=""
        class="offerImage"
      />
      <h2>{{ props.offer.title }}</h2>
      <h4>{{ props.offer.price }} €</h4>
      <h5>{{ toGoodDate(props.offer.publishedAt) }}</h5>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  text-decoration: none;
  color: black;
}

h2 {
  font-family: 'Nunito Sans Variable', sans-serif;
  font-weight: 650;
  font-size: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
}

h4 {
  font-family: 'Nunito Sans Variable', sans-serif;
  font-weight: 650;
  font-size: 17px;
  margin-bottom: 10px;
}

h3 {
  font-weight: 600;
  font-size: 18px;
}
.cardContainer {
  height: 100%;
  min-height: 350px;
}

.author {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 10px;
}

.author > img {
  height: 35px;
  width: 35px;
  object-fit: cover;
  border-radius: 50%;
}

.offerImage {
  height: 70%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
}
</style>
