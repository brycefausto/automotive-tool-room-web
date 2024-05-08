'use client';
import useDataFetch from "@/hooks/dataFetch";
import { Subject } from "@/models/subject";
import { PropsWithId } from "@/types";
import FormLayout from "../FormLayout";
import Loader from "../Loader";
import EditSubjectForm from "./EditSubjectForm";

export default function EditSubjectPage({ id }: PropsWithId) {
  const { data, isLoading, error } = useDataFetch(`/subjects/${id}`)

  return (
    <Loader loading={isLoading} error={error}>
      <FormLayout title="Edit Subject">
        <EditSubjectForm data={data as Subject} />
      </FormLayout>
    </Loader>
  )
}