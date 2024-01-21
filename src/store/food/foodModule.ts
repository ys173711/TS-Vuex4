import { commonTyp } from './type'
import foodRec from './serverData'
import {state} from './state'
import type {FoodInfoList} from './state'
import type {Module} from '../../vuex4'
import type {RootState} from '../rootState'

export const foodModule: Module<FoodInfoList, RootState> = {
  namespaced: true,
  state,
  getters: {
    getFoodList(state: any) {
      return state.foodInfoList
    }
  },
  mutations: {
    [commonTyp.FindFoodList](state: any, param: any) {
      state.foodInfoList = param
    }
  },
  actions: {
    [commonTyp.FindFoodList]({ commit,  }: { commit: any, state: any }) {
      setTimeout(() => {
        commit(commonTyp.FindFoodList, foodRec)
      }, 5)
    }
  },
  
}