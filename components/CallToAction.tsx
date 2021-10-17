import { ClockIcon, LockClosedIcon } from '@heroicons/react/solid'
import { sendMagicLink, updateUserPermissions, useUser } from '../data/auth';
import { useState } from 'react';
import { ShowFor } from './Elements';

export default function Auth() {
  const [hasSent, setHasSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
            Local Welcome
          </h2>
          <p className='text-gray-600'>Where people cares and welcomes. <br/> Give us a minute.</p>
        </header>
        <div>
          <a
            disabled={isLoading}
            data-attr='auth-sign-in'
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            href="https://brandonjackson.typeform.com/to/JFz8XJjf"
            target="_blank"
          >
          Register your interest
          </a>
        </div>
      </div>
    </section>
  )
}
