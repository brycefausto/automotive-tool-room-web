'use client';
import useDataFetch from "@/hooks/dataFetch";
import { Department } from "@/models/department";
import { PropsWithId } from "@/types";
import FormLayout from "../FormLayout";
import Loader from "../Loader";
import EditDepartmentForm from "./EditDepartmentForm";

export default function EditDepartmentPage({ id }: PropsWithId) {
  const { data, isLoading, error } = useDataFetch(`/departments/${id}`)

  return (
    <Loader loading={isLoading} error={error}>
      <FormLayout title="Edit Department">
        <EditDepartmentForm data={data as Department} />
      </FormLayout>
    </Loader>
  )
}