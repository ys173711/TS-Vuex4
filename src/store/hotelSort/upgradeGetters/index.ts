// 支持getters自动推导
import store from '../../index'

type UpgradeGetters = {
  'hotelSortModule/getHotelSortList': () => any,
}
function getters_hotelSortModule() {
  return store.getters as UpgradeGetters
}
export default getters_hotelSortModule()