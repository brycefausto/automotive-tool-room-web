import SectionList from '@/components/sections/SectionList';

export default async function Sections({ searchParams: { q } }: { searchParams: { q?: string } }) {
  return (
    <SectionList searchParam={q} />
  )
}
