import FormLayout from '@/components/FormLayout'
import CreateDepartmentForm from '@/components/departments/CreateDepartmentForm'

export default function DepartmentCreatePage() {
  return (
    <FormLayout title="Create Department" backUrl="/departments">
      <CreateDepartmentForm />
    </FormLayout>
  )
}
