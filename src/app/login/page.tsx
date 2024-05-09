import LoginForm from '@/components/users/LoginForm';
import './login.css';
import Image from 'next/image';

export default function Login() {
  return (
    <div className='grid grid-cols-2 h-screen'>
      <div className='login-image'>
      </div>
      <div className='p-5'>
        <div className='flex flex-row'>
          <Image src='/Automotive Logo.png' alt='' width={200} height={200} />
          <div className='flex ml-5 w-[522px] items-center'>
            <div className='font-bold text-2xl'>
              Automotive Tool Room Management
            </div>
          </div>
        </div>
        <h1 className='text-2xl font-bold'>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}