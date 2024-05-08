import FormLayout from '@/components/FormLayout'
import RegisterForm from '@/components/users/RegisterForm'

export default function UserCreatePage() {
  return (
    <FormLayout title='Register User' backUrl='/users'>
      <RegisterForm />
    </FormLayout>
  )
}
