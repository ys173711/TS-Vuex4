// import { createStore  } from 'vuex'
import { createStore  } from '../vuex4'
import {foodModule} from './food/foodModule'
import {foodSortModule} from './foodSort/foodSortModule'
import {hotelSortModule} from './hotelSort/hotelSortModule'
import type {RootState} from './rootState'

const test = {}
// 注意，store切割的设计方案很糟糕，高内聚低耦合的设计原则，所以模块不要分割。
const store = createStore<RootState>({
  modules: {
    foodModule,
    foodSortModule: foodSortModule,
    hotelSortModule,
    test
  }
})

export default store