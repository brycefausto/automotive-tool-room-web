import React, { PropsWithChildren } from 'react'
import LoadingComponent from './LoadingComponent';
import { getErrorMessage } from '@/utils/serverFetch';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi2';

export interface LoaderProps extends PropsWithChildren {
  loading: boolean
  error?: any
}

export default function Loader({ loading, error, children }: LoaderProps) {
  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[300px] h-[500px]'>
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium text-2xl">Error: </span> <span className="text-2xl">{getErrorMessage(error)}</span>
        </Alert>
      </div>
    )
  }

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : children}
    </>
  );
}