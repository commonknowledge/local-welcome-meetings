import { ClockIcon, LockClosedIcon } from '@heroicons/react/solid'
import { sendMagicLink, updateUserPermissions, useUser } from '../data/auth';
import { useState } from 'react';
import { ShowFor } from './Elements';

export default function Auth() {
  const [salary, setSalary] = useState();
  const [sessions, setSessions] = useState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="flex items-center justify-center bg-white rounded-lg py-12 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-5">
        <header className='text-center space-y-2'>
          <h2 className="max-w-sm mx-auto text-2xl font-extrabold text-gray-900 leading-tight">
            Calculate Price
          </h2>
        </header>
        <form className="space-y-4">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-salary" className="sr-only">
                Your salary (per annum)
              </label>
              <input
                id="user-salary"
                name="salary"
                type="number"
                autoComplete="number"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your salary (per annum)"
                value={salary}
                onChange={e => setSalary(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="number-of-sessions" className="sr-only">
                Number of sessions
              </label>
              <input
                id="number-of-sessions"
                name="sessions"
                type="number"
                autoComplete="number"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Number of sessions"
                min="4"
                value={sessions}
                onChange={e => setSessions(e.target.value)}
              />
            </div>
            { sessions && sessions < 4 && <small className="text-red-500">Minimum 4 sessions required</small>}
          </div>

          <div>
            <button
              disabled={isLoading || sessions < 4 || !sessions}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Total cost £{sessions ? salary > 40000 ? (sessions * 10) : (sessions * 20) : 0}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
