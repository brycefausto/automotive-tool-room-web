'use client';
import useDataFetch from "@/hooks/dataFetch";
import { Section } from "@/models/section";
import { PropsWithId } from "@/types";
import FormLayout from "../FormLayout";
import Loader from "../Loader";
import EditSectionForm from "./EditSectionForm";

export default function EditSectionPage({ id }: PropsWithId) {
  const { data, isLoading, error } = useDataFetch(`/sections/${id}`)

  return (
    <Loader loading={isLoading} error={error}>
      <FormLayout title="Edit Section">
        <EditSectionForm data={data as Section} />
      </FormLayout>
    </Loader>
  )
}