<template>
<div>{{ store.test() }}
  <!-- <div v-for="(value, key) in foodSortList" :key="key">
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
  </div>   -->
</div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
// import { useStore, mapGetters } from "vuex";
import { useStore } from "@/vuex4";
import getters_foodSortModule from '@/store/foodSort/upgradeGetters'
import getters_foodModule from '@/store/food/upgradeGetters'

export default {
  name: '',
  components: {  },
  emits: [  ],
  props: {
      
  },
  setup(props, {attrs, slots, emit, expose}) {
    const store = useStore()
    onMounted(() => {
      // 获取美食数据
      // store.dispatch('foodSortModule/FindFoodSortList')
    }) 
    
    console.log('store: ', store)
    console.log('store.getters: ', store.getters['foodSortModule/getFoodSortList'])
    console.log('store.getters: ', getters_foodSortModule['foodSortModule/getFoodSortt']) // 可以自动推导出来
    console.log('store.getters: ', getters_foodModule['foodSortModule/foodModule/getFoodList'])
    
    return {
      // foodSortList,
      store
    }
  }
}
</script>

<style scoped>
.container {
  border: 1px solid red;
  display: flex;
}
</style>