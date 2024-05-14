import DepartmentList from '@/components/departments/DepartmentList';

export default async function Departments({ searchParams: { q } }: { searchParams: { q?: string } }) {
  return (
    <DepartmentList searchParam={q} />
  )
}
