// import { createStore  } from 'vuex'
import { createStore  } from '../vuex4'
import {foodSortModule} from './foodSort/foodSortModule'
import {hotelSortModule} from './hotelSort/hotelSortModule'
import type {RootState} from './rootState'

// 注意，store切割的设计方案很糟糕，依据高内聚低耦合的设计原则，所以模块不要分割。
const store = createStore<RootState>({
  state: {
    navList: [
      '测试数据1',
      '测试数据2',
      'ok',
    ]
  },
  modules: {
    foodSortModule: foodSortModule,
    hotelSortModule,
  }
  /* state: {
    navList: [
      '单模块state测试数据1',
      '单模块state测试数据2',
      'ok',
    ]
  },
  getters: {
    getNavList(state) {
      return state.navList
    }
  },
  mutations: {
    changeNavList(state, param) {
      state.navList = param
    }
  },
  actions: {
    changeNavList({ commit }, param) {
      setTimeout(() => {
        let navList = param?param:[1, 2, 3, 4, 5, 6, 7, 8, 9]
        commit('changeNavList', navList)
        
      }, 5);
    }
  
  }, */
})

export default store