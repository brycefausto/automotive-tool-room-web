'use client';
import useDataFetch from "@/hooks/dataFetch";
import { Item } from "@/models/item";
import { PropsWithId } from "@/types";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import EditItemForm from "./EditItemForm";

export default function ItemEditPage({ id }: PropsWithId) {
  const router = useRouter()
  const { data, isLoading, error } = useDataFetch(`/items/${id}`)

  return (
    <Loader loading={isLoading} error={error}>
      <div>
        <div className="flex p-5">
          <Button className="justify-self-start" onClick={() => router.back()}>Back</Button>
          <div className="flex flex-auto">
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[500px]">
            <div className="mb-5">
              <span className="text-4xl font-bold">Edit Item</span>
            </div>
            <EditItemForm data={data as Item} />
          </div>
        </div>
      </div>
    </Loader>
  )
}