import { ClockIcon, LockClosedIcon } from '@heroicons/react/solid'
import { sendMagicLink, updateUserPermissions, useUser } from '../data/auth';
import { useState } from 'react';
import Link from 'next/link';
import { ShowFor } from './Elements';

export default function Auth() {
  const [salary, setSalary] = useState();
  const [sessions, setSessions] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSalary = () => {
    if (salary < 40000) {
      return sessions * 10;
    } else {
      return sessions * 20;
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // @ts-ignore
    if (!event.target.email) return
    try {
      setHasSent(false)
      setIsLoading(true)
      // @ts-ignore
      const email = event.target.email.value
      await sendMagicLink(email)
      setHasSent(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const { isLoggedIn, signOut } = useUser()

  if (isLoggedIn) {
    return (
      <div className='text-center'>
        <span data-attr='auth-sign-out' className='text-adhdBlue bg-adhdDarkPurple hover:bg-adhdPurple p-2 px-3 rounded-lg cursor-pointer inline-block' onClick={() => signOut()}>
          Sign out
        </span>
      </div>
    )
  }

  return (
    <section className="flex items-center justify-center bg-white rounded-lg py-12 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-5">
        <header className='text-center space-y-2'>
          <h2 className="max-w-sm mx-auto text-2xl font-extrabold text-gray-900 leading-tight">
            Course Offerings
          </h2>
        </header>
        <div className="text-center">
          <Link href='/price' passHref><p className="underline text-blue-500 cursor-pointer">Calculate your course price</p></Link>
        </div>
      </div>
    </section>
  )
}
