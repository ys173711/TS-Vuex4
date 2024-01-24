// 支持getters自动推导
import store from '../../index'

type UpgradeGetters = {
  'foodSortModule/foodModule/getFoodList': () => any,
}
function getters_foodModule() {
  return store.getters as UpgradeGetters
}
export default getters_foodModule()