import FormLayout from '@/components/FormLayout'
import CreateSubjectForm from '@/components/subjects/CreateSubjectForm'

export default function SubjectCreatePage() {
  return (
    <FormLayout title="Create Subject" backUrl="/subjects">
      <CreateSubjectForm />
    </FormLayout>
  )
}
