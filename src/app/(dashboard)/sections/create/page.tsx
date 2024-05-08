import FormLayout from '@/components/FormLayout'
import CreateSectionForm from '@/components/sections/CreateSectionForm'

export default function SectionCreatePage() {
  return (
    <FormLayout title="Create Section" backUrl="/sections">
      <CreateSectionForm />
    </FormLayout>
  )
}
