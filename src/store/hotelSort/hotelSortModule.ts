import { commonTyp } from './type'
import hotelSortRec from './serverData'
import {state} from './state'
import type {HotelSortInfoList} from './state'
import type {Module} from '../../vuex4'
import type {RootState} from '../rootState'

export const hotelSortModule: Module<HotelSortInfoList, RootState> = {
  namespaced: true,
  state,
  getters: {
    getHotelSortList(state: any) {
      return state.hotelSortInfoList
    }
  },
  mutations: {
    [commonTyp.FindHotelSortList](state: any, param: any) {
      console.log("mutations:正在state.hotelSortInfoList: ", state.hotelSortInfoList)
      state.hotelSortInfoList = param
    }
  },
  actions: {
    [commonTyp.FindHotelSortList]({ commit, state }: { commit: any, state: any }) {
      setTimeout(() => {
        console.log("actions:setTimeOut...", state.hotelSortInfoList)
        commit(commonTyp.FindHotelSortList, hotelSortRec)
      }, 5)
    }
  },
  
}