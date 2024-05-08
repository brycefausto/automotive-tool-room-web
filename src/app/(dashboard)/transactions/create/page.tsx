import FormLayout from "@/components/FormLayout"
import CreateTransactionForm from "@/components/transactions/CreateTransactionForm"

export default async function CreateTransactions() {
  return (
    <FormLayout title="Create Transaction" backUrl="/transactions">
      <CreateTransactionForm />
    </FormLayout>
  )
}
