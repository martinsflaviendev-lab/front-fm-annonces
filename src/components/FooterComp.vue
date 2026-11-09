<script setup></script>

<template>
  <footer>
    <div class="wrapper">
      <h2>Made by Flavien Martins with Vue.js and Strapi 5</h2>
      <div class="container">
        <div>
          <a href="">Mon Github</a>
        </div>
        <div>
          <h3>Mon mail: martins.flavien.dev@gmail.com</h3>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  padding-top: 20px;
}

.wrapper {
  margin-top: 30px;
  height: 100px;
  background-color: #eeeef5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  margin-top: 20px;
  display: flex;
  gap: 40px;
}
.container > div {
  width: 300px;
}
h2 {
  font-family: 'Nunito Variable', sans-serif;
  font-weight: 600;
  font-size: 18px;
}

a,
h3 {
  font-family: 'Nunito Variable', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: black;
  text-decoration: none;
}
</style>
