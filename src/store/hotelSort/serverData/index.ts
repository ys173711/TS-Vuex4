import type {HotelSort} from '../state'

// 模拟后端数据表的酒店分类数据
export let hotelSortList = [
  { id: 1, type: "经济型酒店" },
  { id: 2, type: "舒适三星酒店" },
  { id: 3, type: "高档四星酒店" },
  { id: 4, type: "豪华五星酒店" },
  { id: 5, type: "公寓" }
]

// 扁平
function flatToRecord(data: Record<string, HotelSort> = {}) {
  hotelSortList.map((item) => {
    data[item.id] = item
  })
  return data
}

export default flatToRecord()