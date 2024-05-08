'use client';
import { Item } from "@/models/item";
import { PropsWithId } from "@/types";
import serverFetch from "@/utils/serverFetch";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import EditItemForm from "./EditItemForm";

export default function ItemEditPage({ id }: PropsWithId) {
  const router = useRouter()
  const [data, setData] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();
  
  useEffect(() => {
    (async () => {
      try {
        const {data} = await serverFetch<Item>(`/items/${id}`);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error)
      }

    })()
  }, [])

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