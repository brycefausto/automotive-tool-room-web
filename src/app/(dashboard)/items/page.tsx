import ItemList from '@/components/items/ItemList';
import { SearchParamsQuery } from '@/types';

export default async function Items({ searchParams }: SearchParamsQuery) {
  const category = searchParams.category
  const page = searchParams.page
  const q = searchParams.q

  return (
    <ItemList category={category} page={page} q={q} />
  )
}
