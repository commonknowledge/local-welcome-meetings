import { Logo } from './Branding';
import { useUser } from '../data/auth';
import { useRoom } from '../data/room';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';

export function Header () {
  const { room } = useRoom()
  const { isLoggedIn, signOut } = useUser()
  const router = useRouter()

  return (
    <header className='bg-adhdPurple p-3 sm:p-4 text-adhdBlue'>
      <div className={`flex flex-row justify-between items-center max-w-md mx-auto`}>
        <Link href='/' passHref>
          <span className='inline-block cursor-pointer'><Logo /></span>
        </Link>

        <div className='space-x-4 text-right'>
        <Link href='/courses' passHref>
          <span className='cursor-pointer opacity-80 bg-adhdDarkPurple rounded-lg p-2'>Our Courses</span>
        </Link>
        </div>
          
        <div className='space-x-4 text-right'>
          {room && <span className='font-semibold text-lg'>{room.name}</span>}
          {isLoggedIn && <span className='cursor-pointer opacity-80 bg-adhdDarkPurple rounded-lg p-2' onClick={signOut}>Sign out</span>}
          {!isLoggedIn && <span className='cursor-pointer opacity-80 bg-adhdDarkPurple rounded-lg p-2' onClick={() => router.push('/user')}>Sign in</span>}
        </div>
      </div>
    </header>
  )
}

export function Loading () {
  return <div className='flex flex-col justify-content items-center align-middle content-center text-center w-full absolute top-0 left-0 h-full'>
    <div className='text-lg font-semibold'>Loading...</div>
  </div>
}