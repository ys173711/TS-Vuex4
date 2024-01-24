import { foodModule } from '../food/foodModule'
import { commonTyp } from './type'
import foodSortRec from './serverData'
import {state} from './state'
import type {FoodSortInfoList} from './state'
import type {Module} from '../../vuex4'
import type {RootState} from '../rootState'

export const foodSortModule: Module<FoodSortInfoList, RootState> = {
  namespaced: true,
  state,
  getters: {
    getFoodSortList(state: any) {
      return state.foodSortInfoList
    },
    getFoodSortList_2(state: any) {
      return state.foodSortInfoList
    }
  },
  mutations: {
    [commonTyp.FindFoodSortList](state: any, param: any) {
      console.log("mutations:正在state.foodSortInfoList: ", state.foodSortInfoList)
      state.foodSortInfoList = param
    }
  },
  actions: {
    [commonTyp.FindFoodSortList]({ commit, state }: { commit: any, state: any }) {
      setTimeout(() => {
        console.log("actions:setTimeOut...", state.foodSortInfoList)
        commit(commonTyp.FindFoodSortList, foodSortRec)
      }, 5)
    }
  },
  modules: {
    foodModule
  }
}