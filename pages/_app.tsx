import type { AppProps } from 'next/app'
import '../styles/global.css'
import { usePostHog } from 'next-use-posthog'
import { UserContextProvider } from '../data/auth'
import { TimeProvider } from '../data/time'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import qs from 'query-string'

function MyApp({ Component, pageProps }: AppProps) {
  usePostHog(process.env.NEXT_PUBLIC_POSTHOG_API_KEY as string, {
    api_host: 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.opt_out_capturing()
      }
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = qs.parse(window.location.hash)
      if (hash.type === 'recovery') {
        router.push('/update-password')
      }
    }
  }, [router])

  return (
    <TimeProvider>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </TimeProvider>
  )
}

export default MyApp
