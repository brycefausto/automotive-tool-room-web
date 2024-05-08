import EditSectionPage from '@/components/sections/EditSectionPage'
import { ParamsWithId } from '@/types'

export default async function SectionEditPage({ params: { id } }: ParamsWithId) {
  return (
    <EditSectionPage id={id} />
  )
}
