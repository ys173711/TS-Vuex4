<script setup lang="ts">
</script>

<template>
  <div class="nav">
    <router-link to="/foodSort">美食分类</router-link>
    <router-link to="/hotelSort">酒店分类</router-link>
    <router-link to="/about">关于</router-link>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.nav {
  width: 80vw;
}
.nav a {
  margin-right: 10px;
}
</style>
