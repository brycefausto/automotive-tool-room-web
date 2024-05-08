'use client';
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import CreateItemForm from "./CreateItemForm";

export default function CreateItemPage() {
  const router = useRouter()
  
  return (
    <div>
      <div className="flex p-5">
        <Button className="justify-self-start" onClick={() => router.back()}>Back</Button>
        <div className="flex flex-auto">
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[500px]">
          <div className="mb-5">
            <span className="text-4xl font-bold">Create Item</span>
          </div>
          <CreateItemForm />
        </div>
      </div>
    </div>
  )
}