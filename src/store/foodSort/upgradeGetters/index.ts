// 支持getters自动推导
import store from '@/store'

type UpgradeGetters = {
  'foodSortModule/getFoodSortList': () => void,
  'foodSortModule/getFoodSortList_2': () => void
}
function getters_foodSortModule() {
  return store.getters as UpgradeGetters
}
export default getters_foodSortModule()