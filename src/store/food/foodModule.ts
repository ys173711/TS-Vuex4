import { commonTyp } from './type'
import foodRec from './serverData'
import {state} from './state'
import type {FoodInfoList,FoodState} from './state'
import type {Module} from '../../vuex4'
import type {RootState} from '../rootState'

export const foodModule: Module<FoodInfoList, RootState> = {
  namespaced: true,
  state,
  getters: {
    getFoodList(state: FoodInfoList) {
      return state.foodInfoList
    }
  },
  mutations: {
    [commonTyp.FindFoodList](state: FoodInfoList, param: FoodState) {
      console.log('mutations-', commonTyp.FindFoodList, ' : ', param)
      state.foodInfoList = param
    }
  },
  actions: {
    [commonTyp.FindFoodList]({ commit,  }) {
      setTimeout(() => {
        commit(commonTyp.FindFoodList, foodRec)
      }, 5)
    }
  },
  
}