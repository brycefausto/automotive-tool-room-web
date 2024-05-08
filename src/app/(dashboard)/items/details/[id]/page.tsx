import ItemDetailsPage from '@/components/items/ItemDetailsPage'
import { ParamsWithId } from '@/types'

export default async function DetailsPage({ params: { id } }: ParamsWithId) {
  return (
    <ItemDetailsPage id={id} />
  )
}
