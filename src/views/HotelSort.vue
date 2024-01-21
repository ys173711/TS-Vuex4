<template>
  <div>
  <div v-for="(value, key) in hotelSortList" :key="key">
    <div class="container">
      <div style="flex: 1;">{{ key }}</div>
      <div style="flex: 5;">
        <div style="display: flex;" v-for="(item, index) in value" :key="index">
          <div style="flex: 1;">{{ index }}</div>
          <div style="flex: 1;">
            <router-link to="">
              {{ item }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>  
</div>
</template>

<script lang="ts">
import { computed, onMounted,  } from "vue";
import { useStore } from "vuex";

export default {
  name: "",
  components: {},
  emits: [],
  props: {},
  setup() {
    const store = useStore()
    onMounted(() => {
      store.dispatch('hotelSortModule/FindHotelSortList')
    })
    const hotelSortList = computed(() => {
      return store.getters['hotelSortModule/getHotelSortList']
    })

    return {
      hotelSortList
    };
  },
};
</script>

<style scoped>
.title {
  padding: 20px;
}
.container {
  border: 1px solid red;
  display: flex;
}
</style>
