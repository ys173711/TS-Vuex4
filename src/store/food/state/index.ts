
// 美食的类型
type Food = {
  foodid: number, shop: string, foodName: string, price: number
}
// 
interface FoodState {
  [key: string]: Food
}
//
interface FoodInfoList {
  foodInfoList: FoodState
}

const state: FoodInfoList = {
  foodInfoList: {
    0: {
      foodid: 1, shop: "暂无店铺",
      foodName: "暂无食品", price: 0
    },
    
  }
} 

export { state } 
export type {Food, FoodInfoList, FoodState}
