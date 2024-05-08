export type ItemCategory = 'tool' | 'consumable'

export interface ItemSize {
  size: string
  stock: number;
}

export interface Item {
  _id: string
  name: string
  brand: string
  category: ItemCategory
  description: string
  image: string
  createdAt: string
  itemSizes: ItemSize[]
  stock: number
}
