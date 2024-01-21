
// 酒店分类的类型
type HotelSort = {
  id: number,
  type: string
}
// 
interface HotelSortState {
  [key: string]: HotelSort
}
//
interface HotelSortInfoList {
  hotelSortInfoList: HotelSortState
}

const state: HotelSortInfoList = {
  hotelSortInfoList: {
    0: { id: 0, type: '暂无酒店类型' },
    
  }
}

export { state } 
export type {HotelSort, HotelSortInfoList}
