import type {FoodSort} from '../state'

// 模拟后端数据表的美食分类数据
export let foodSortList = [
  { id: 1, type: '西餐' },
  { id: 2, type: '东北菜' },
  { id: 3, type: '云贵菜' }
]

// 扁平
function flatToRecord(data: Record<string, FoodSort> = {}) {
  foodSortList.map((item) => {
    data[item.id] = item
  })
  return data
}

export default flatToRecord()