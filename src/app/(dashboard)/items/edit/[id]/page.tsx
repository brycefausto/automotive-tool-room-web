import EditItemPage from '@/components/items/EditItemPage'
import { ParamsWithId } from '@/types'

export default async function ItemEditPage({ params: { id } }: ParamsWithId) {
  return (
    <EditItemPage id={id} />
  )
}
