import SubjectList from '@/components/subjects/SubjectList';

export default async function Subjects({ searchParams: { q } }: { searchParams: { q?: string } }) {
  return (
    <SubjectList searchParam={q} />
  )
}
