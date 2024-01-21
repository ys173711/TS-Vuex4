<template>
  <Food />
</template>

<script lang="ts">
import Food from "./Food.vue";

export default {
  name: "",
  components: {Food},
  emits: [],
  props: {},
  setup() {
    let foodSortList = {}

    return {
      foodSortList
    };
  },
};
</script>

<style scoped>
.title {
  padding: 20px;
}
</style>
