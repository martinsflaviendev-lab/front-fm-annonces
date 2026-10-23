<script setup>
import { computed, onMounted, ref, inject } from 'vue'
import { api } from '@/api'
import { loadStripe } from '@stripe/stripe-js'

//  -----------------------------------------------STRIPE INIT
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const cardElement = ref(null)
const stripeLoadError = ref(false)
// ------------------------------------------------INFOS
const offerInfo = ref({ data: null })
const props = defineProps({
  id: { required: true },
})
const offer = computed(() => offerInfo.value?.data ?? null)

// ------------------------------------------------ INPUTS
const shipping = ref('normal')
const shippingCost = computed(() => {
  if (shipping.value === 'colissimo') {
    return 10
  } else {
    return 0
  }
})
const totalAmount = computed(() => {
  return shippingCost.value + (offer.value?.price ?? 10)
})

const firstname = ref(null)
const lastname = ref(null)
const telNumber = ref(null)
//  these 3 refs are here for a recap page that I didn't do yet. Maybe a collection commands tied to the users

// ------------------------------------ OFFER REQUEST/ STRIPE INIT
onMounted(async () => {
  // --------------------------- offer data request
  try {
    const { data } = await api.get(`/offers/${props.id}`)
    console.log(data)
    offerInfo.value = data
  } catch (err) {
    console.log(err)
  }
  //  -------------------------- Stripe promise
  try {
    const stripe = await stripePromise
    if (!stripe) throw new Error('Stripe failed to load')

    // --------------------------- stripe element mounting
    const elements = stripe.elements()
    cardElement.value = elements.create('card', {
      style: {
        base: {
          fontSize: '18px',
          fontFamily: 'Arial, Haettenschweiler',
          color: 'black',
          '::placeholder': {
            color: 'coral',
          },
          iconColor: 'aqua',
        },
        invalid: {
          color: 'red',
          iconColor: 'red',
        },
      },
    })

    cardElement.value.mount('#card-element')
  } catch (error) {
    console.log(error)
    stripeLoadError.value = true
  }
})

// ----------------------------------------------- PAYMENT REQUEST

const handlePayement = async () => {
  if (offer.value && firstname.value && lastname.value) {
    // ------------------------------ stripe part
    const stripe = await stripePromise
    const { token } = await stripe.createToken(cardElement.value)
    const stripeToken = token.id
    // ------------------------------ body part
    const body = {
      documentId: offer.value.documentId,
      token: stripeToken,
      shipping: shipping.value,
    }

    try {
      const response = await api.post('/offers/buy', body)

      console.log(response)
      if (response.status === 200 && response.data.status === 'succeeded') {
        alert('paiement accepté')
      } else {
        alert('une erreur a empêché le paiment')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<template>
  <main>
    <div class="wrapper">
      <!-- ===============================================PERSONNAL -->
      <div class="enveloppe">
        <div class="payContainer">
          <h1>Finalisez votre paiement</h1>
          <!-- =========== Infos personnelles -->
          <div class="infos">
            <h2>Informations personnelles</h2>
            <p>Une pièce d'identité vous sera demandée pour récupérer le colis;</p>
            <form>
              <div>
                <label for="firstname">Prénom</label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="firstname"
                  v-model="firstname"
                />
              </div>
              <div>
                <label for="lastname">Nom</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="lastname"
                  v-model="lastname"
                />
              </div>
              <div>
                <label for="tel">Téléphone</label>
                <input type="tel" name="tel" id="tel" v-model="telNumber" />
              </div>
            </form>
          </div>
          <p>
            Ceci est un specimen de paiement, aucun argent ne sera prélevé, vous pouvez utiliser un
            faux numéro de carte. Un test de paiement sera réalisé avec Stripe
          </p>
          <!-- ========== STRIPE CARD -->
          <div class="stripeCard">
            <h2>Coordonnées bancaires</h2>
            <div id="card-element"></div>
            <button vif="offer" @click="handlePayement">Payer</button>
          </div>
        </div>
        <!-- ============================================= DELIVERY -->
        <div class="deliveryContainer">
          <div class="delivery" v-if="offer">
            <div class="title">
              <img v-if="offer.pictures?.length" :src="offer.pictures[0].url" alt="" />
              <h2>{{ offer.title }}</h2>
              <h2 class="price">{{ offer.price }} €</h2>
            </div>

            <div>
              <div>
                <label
                  ><input type="radio" value="normal" v-model="shipping" />
                  <div>
                    <h3>Remise en main propre</h3>
                    <p>Payez et venez récupérer votre achat chez le vendeur</p>
                  </div>

                  <h2 class="price">Gratuit</h2>
                </label>
              </div>
              <div>
                <label
                  ><input type="radio" value="colissimo" v-model="shipping" />
                  <div>
                    <h3>Colissimo</h3>
                    <p>à votre domicile sous 3-4 jours ouvrés</p>
                  </div>

                  <h2 class="price">10€</h2>
                </label>
              </div>
            </div>
            <div class="title">
              <h3>Total:</h3>
              <h2 class="price">{{ totalAmount }}€</h2>
            </div>
          </div>
          <div v-if="stripeLoadError" class="warning">
            <p>
              Le formulaire de paiement n'a pas pu se charger. Veuillez vérifier que votre
              navigateur n'ampêche pas les scripts de stripe (protection anti-pistage) et recheargez
              la page.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* -------------------------------------------- DISPLAY */
.wrapper {
  padding: 20px;
}

h1 {
  font-size: 25px;
  font-weight: 600;
  margin-left: 20px;
}

.enveloppe {
  display: grid;
  height: 70vh;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  overflow: visible;
}

.infos,
.stripeCard,
.deliveryContainer {
  box-shadow: 1px 3px 12px #808080aa;
  border-radius: 18px;
  margin: 15px;
  padding: 20px;
}

/* -------------------------------------------- INFOS/PAIEMENT */
.payContainer {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.payContainer > p {
  margin: 20px 15px;
  font-size: 15px;
}

.infos {
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 20px;
  margin-bottom: 5px;
  font-weight: 600;
}

.infos > p {
  font-size: 15px;
}

.infos form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

form div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
}

input {
  height: 25px;
  border: 1px solid var(--secondary-color);
  border-radius: 6px;
}

.stripeCard {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stripeCard button {
  font-family: var(--second-font-family);
  border: none;
  border-radius: 30px;
  color: white;
  height: 50px;
  width: 50%;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  align-self: center;
  background-color: var(--main-bckg-color);
}

.stripeCard button:hover {
  background-color: var(--hover-main-button-bckg-color);
}

#card-element {
  display: flex;
  flex-direction: column;
  width: 500px;
}

/* ---------------------------------------------DELIVERY */

.deliveryContainer {
  height: fit-content;
}

.price {
  color: rgb(177, 86, 7);
}

.delivery img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}
.delivery .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.delivery label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0px;
  gap: 15px;
}

.delivery label > div {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  color: grey;
}

.delivery label > div > h3 {
  font-size: 16px;
  font-weight: 600;
  color: black;
}
</style>
