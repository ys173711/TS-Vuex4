
// 美食分类的类型
type FoodSort = {
  id: number,
  type: string
}
// 
interface FoodSortState {
  [key: string]: FoodSort
}
//
interface FoodSortInfoList {
  foodSortInfoList: FoodSortState
}

const state: FoodSortInfoList = {
  foodSortInfoList: {
    0: { id: 0, type: '暂无美食类型' },
    
  }
}

export { state } 
export type {FoodSort, FoodSortInfoList}
